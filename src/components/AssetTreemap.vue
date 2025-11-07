<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import type { AssetMapCategory, AssetMapToken, AssetMapTree } from '@/data/asset-map'

const props = withDefaults(
  defineProps<{
    data: AssetMapTree
    height?: number
    maxZoom?: number
  }>(),
  {
    height: 560,
    maxZoom: 3
  }
)

const containerRef = ref<HTMLDivElement | null>(null)
const initError = ref<string | null>(null)
let chart: EChartsType | null = null
let resizeObserver: ResizeObserver | null = null
let resizeHandler: (() => void) | null = null
let lastDataKey: string | null = null
let lastTreeId: string | null = null
let roamActive = false
let roamIdleTimer: ReturnType<typeof setTimeout> | null = null
let pendingDataUpdate = false
let initialZoom: number | null = null

const TREEMAP_SERIES_ID = 'asset-treemap'

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

type TreemapState = {
  nodePath: string[]
  rootRect: Rect | null
  zoom: number | null
}

let treemapState: TreemapState | null = null
let finishedListener: (() => void) | null = null

const visualMin = -12
const visualMax = 12

const buildSeriesData = (tree: AssetMapTree) =>
  (tree.children ?? []).map((category: AssetMapCategory) => {
    const tokens = category.children ?? []
    const normalized = tokens.map((token) => ({
      token,
      cap: Math.max(token.marketCap, 0.0001)
    }))
    const totalNormalized = normalized.reduce((sum, item) => sum + item.cap, 0)
    const change = weightedChange(tokens)

    return {
      name: category.name,
      id: category.id,
      value: [totalNormalized || 0.001, change],
      change,
      upperLabel: {
        backgroundColor: getColor(change),
        color: 'white',
        textShadowBlur: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        padding: [0, 6, 0, 6],
        fontSize: 9,
        fontWeight: 500
      },
      children: normalized.map(({ token, cap }) => ({
        name: token.symbol,
        symbol: token.symbol,
        fullName: token.name,
        id: token.id,
        value: [cap, token.change24h],
        change: token.change24h,
        itemStyle: { color: getColor(token.change24h) }
      }))
    }
  })

const weightedChange = (tokens: AssetMapToken[] = []) => {
  const total = tokens.reduce((sum, token) => sum + Math.max(token.marketCap, 0), 0)
  if (total === 0) return 0
  return (
    tokens.reduce(
      (sum, token) => sum + Math.max(token.marketCap, 0) * token.change24h,
      0
    ) / total
  )
}

const getColor = (change: number) => {
  if (change >= 5) return '#2FCA59'
  if (change >= 3) return '#2D984C'
  if (change >= 1) return '#33714B'
  if (change > -1) return '#3E4251'
  if (change > -3) return '#86414B'
  if (change > -5) return '#B83D42'
  return '#BD3F44'
}

const getTreemapSeriesModel = () => {
  if (!chart) return null
  const model = (chart as any)?.getModel?.()
  if (!model) return null
  const seriesList: any[] = (model as any).getSeriesByType?.('treemap') ?? []
  if (!Array.isArray(seriesList) || seriesList.length === 0) {
    return null
  }
  return (
    seriesList.find((series: any) => series && series.id === TREEMAP_SERIES_ID) ??
    seriesList[0] ??
    null
  )
}

const captureTreemapState = (): TreemapState | null => {
  const seriesModel: any = getTreemapSeriesModel()
  if (!seriesModel) return null

  const dataTree = seriesModel.getData?.()?.tree
  if (!dataTree) return null

  const rootNode = dataTree.root
  const layout = rootNode?.getLayout?.()
  const layoutInfo = seriesModel.layoutInfo

  let zoom: number | null = null
  if (
    layout &&
    layoutInfo &&
    typeof layoutInfo.width === 'number' &&
    layoutInfo.width !== 0 &&
    typeof layoutInfo.height === 'number' &&
    layoutInfo.height !== 0
  ) {
    const ratios: number[] = []
    if (typeof layout.width === 'number') {
      ratios.push(layout.width / layoutInfo.width)
    }
    if (typeof layout.height === 'number') {
      ratios.push(layout.height / layoutInfo.height)
    }
    if (ratios.length) {
      const sum = ratios.reduce((acc, value) => acc + value, 0)
      const avg = sum / ratios.length
      if (Number.isFinite(avg)) {
        zoom = avg
      }
    }
  }

  const viewRoot = seriesModel.getViewRoot?.()
  const nodePath =
    viewRoot
      ?.getAncestors?.(true)
      ?.map((node: any) =>
        typeof node?.getId === 'function' ? node.getId() : undefined
      )
      ?.filter((id: unknown): id is string => typeof id === 'string') ?? []

  const rootRect =
    layout && typeof layout.width === 'number' && typeof layout.height === 'number'
      ? {
          x: typeof layout.x === 'number' ? layout.x : 0,
          y: typeof layout.y === 'number' ? layout.y : 0,
          width: layout.width,
          height: layout.height
        }
      : null

  return {
    nodePath,
    rootRect,
    zoom
  }
}

const restoreTreemapState = (state: TreemapState | null) => {
  if (!chart || !state) return

  const targetNodeId =
    state.nodePath?.length > 1 ? state.nodePath[state.nodePath.length - 1] : null
  if (targetNodeId) {
    try {
      chart.dispatchAction({
        type: 'treemapRootToNode',
        seriesId: TREEMAP_SERIES_ID,
        targetNodeId
      } as any)
    } catch {
      // ignore restore errors
    }
  }
}

const disposeChart = () => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (chart && finishedListener) {
    chart.off('finished', finishedListener)
    finishedListener = null
  }
  treemapState = null

  if (chart) {
    try {
      ;(chart as any).off?.('treemapRoam')
    } catch {
      // ignore detach errors
    }
    if (finishedListener) {
      chart.off('finished', finishedListener)
      finishedListener = null
    }
    chart.dispose()
    chart = null
  }
  lastDataKey = null
  roamActive = false
  pendingDataUpdate = false
  if (roamIdleTimer) {
    clearTimeout(roamIdleTimer)
    roamIdleTimer = null
  }
  initialZoom = null
}

const initChart = () => {
  if (typeof window === 'undefined' || !containerRef.value) return

  initError.value = null
  disposeChart()

  try {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : undefined
    chart = echarts.init(containerRef.value, theme)
  } catch (error) {
    console.error('Failed to initialise treemap', error)
    initError.value = '트리맵을 초기화하지 못했습니다. 새로고침 해주세요.'
    return
  }

  updateChart()

  if (chart) {
    finishedListener = () => {
      treemapState = captureTreemapState()
      if (
        initialZoom == null &&
        treemapState?.zoom != null &&
        Number.isFinite(treemapState.zoom)
      ) {
        initialZoom = treemapState.zoom
      }
    }
    chart.on('finished', finishedListener)
    treemapState = captureTreemapState()
    if (initialZoom == null && treemapState?.zoom != null && Number.isFinite(treemapState.zoom)) {
      initialZoom = treemapState.zoom
    }

    ;(chart as any).on?.('treemapRoam', () => {
      roamActive = true
      if (roamIdleTimer) {
        clearTimeout(roamIdleTimer)
        roamIdleTimer = null
      }

      try {
        const seriesModel: any = getTreemapSeriesModel()
        const dataTree = seriesModel?.getData?.()?.tree
        const rootNode = dataTree?.root
        const layout = rootNode?.getLayout?.()
        const layoutInfo = seriesModel?.layoutInfo
        if (
          layout &&
          layoutInfo &&
          typeof layout.width === 'number' &&
          typeof layout.height === 'number' &&
          typeof layoutInfo.width === 'number' &&
          typeof layoutInfo.height === 'number' &&
          layoutInfo.width > 0 &&
          layoutInfo.height > 0
        ) {
          const zx = layout.width / layoutInfo.width
          const zy = layout.height / layoutInfo.height
          const curZoom =
            Number.isFinite(zx) && Number.isFinite(zy) ? (zx + zy) / 2 : null
          if (curZoom != null && Number.isFinite(curZoom)) {
            const minZ =
              initialZoom != null && Number.isFinite(initialZoom) ? initialZoom : curZoom
            const maxZ = Math.max(minZ, Number.isFinite(props.maxZoom) ? props.maxZoom : 3)
            let targetZ: number | null = null
            if (curZoom < minZ - 1e-6) targetZ = minZ
            else if (curZoom > maxZ + 1e-6) targetZ = maxZ

            if (targetZ != null) {
              const cx = (layout.x ?? 0) + layout.width / 2
              const cy = (layout.y ?? 0) + layout.height / 2
              const width = layoutInfo.width * targetZ
              const height = layoutInfo.height * targetZ
              let x = cx - width / 2
              let y = cy - height / 2
              const lx = layoutInfo.x ?? 0
              const ly = layoutInfo.y ?? 0
              const lxr = lx + layoutInfo.width
              const lyr = ly + layoutInfo.height
              if (x < lx) x = lx
              if (y < ly) y = ly
              if (x + width > lxr) x = lxr - width
              if (y + height > lyr) y = lyr - height
              ;(chart as any).dispatchAction?.({
                type: 'treemapRender',
                seriesId: TREEMAP_SERIES_ID,
                rootRect: { x, y, width, height }
              })
            }
          }
        }
      } catch {
        // ignore roam errors
      }
      roamIdleTimer = setTimeout(() => {
        roamActive = false
        if (pendingDataUpdate) {
          pendingDataUpdate = false
          updateChart()
        }
      }, 200)
    })
  }

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      if (chart) {
        chart.resize({ width, height })
      }
    }
  })
  resizeObserver.observe(containerRef.value)

  resizeHandler = () => {
    if (chart && containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      chart.resize({ width: rect.width, height: rect.height })
    }
  }
  window.addEventListener('resize', resizeHandler)

  setTimeout(() => {
    if (chart && containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      chart.resize({ width: rect.width, height: rect.height })
    }
  }, 0)
}

const updateChart = () => {
  if (!chart) return

  const currentTreeId = props.data?.id ?? null
  const switchingTree = currentTreeId !== lastTreeId

  if (switchingTree) {
    initialZoom = null
  }

  const stateToRestore = switchingTree ? null : captureTreemapState() ?? treemapState
  const seriesData = buildSeriesData(props.data)
  const newDataKey = JSON.stringify(seriesData)
  if (lastDataKey === newDataKey) {
    return
  }
  if (roamActive) {
    pendingDataUpdate = true
    return
  }

  const treemapSeriesOption: Record<string, unknown> = {
    id: TREEMAP_SERIES_ID,
    type: 'treemap',
    roam: true,
    nodeClick: false,
    sort: null,
    animationDurationUpdate: 0,
    animationEasingUpdate: 'quarticOut',
    childrenVisibleMin: 0,
    breadcrumb: { show: false },
    clipPath: false,
    leafDepth: 2,
    visualDimension: 1,
    visualMin,
    visualMax,
    visibleMin: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    label: {
      show: true,
      position: 'inside',
      align: 'center',
      verticalAlign: 'middle',
      formatter: labelFormatter,
      fontSize: 12,
      fontWeight: 600,
      color: 'white',
      textShadowBlur: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      minFontSize: 8,
      maxFontSize: 32,
      overflow: 'truncate'
    },
    upperLabel: {
      show: true,
      height: 20,
      formatter: (params: any) => {
        const name = params?.data?.name
        return name && name !== 'undefined' ? name : ''
      },
      color: 'white',
      fontSize: 9,
      fontWeight: 500,
      textShadowBlur: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      padding: [0, 6, 0, 6],
      backgroundColor: 'var(--c-bg-700)'
    },
    levels: [
      {
        itemStyle: {
          gapWidth: 4,
          borderWidth: 0,
          borderRadius: 0,
          borderColor: 'transparent'
        },
        upperLabel: {
          show: false
        }
      },
      {
        itemStyle: {
          gapWidth: 2,
          borderWidth: 0,
          borderRadius: 0,
          borderColor: 'transparent'
        }
      }
    ],
    emphasis: {
      itemStyle: {
        borderColor: 'var(--c-border-soft)',
        borderWidth: 2,
        borderRadius: 0,
        shadowBlur: 12,
        shadowColor: 'var(--c-overlay-soft)'
      }
    },
    data: seriesData
  }

  chart.setOption(
    {
      tooltip: {
        trigger: 'item',
        formatter: (info: any) => formatTooltip(info.data),
        borderRadius: 12,
        padding: 12,
        backgroundColor: 'var(--c-bg-800)',
        textStyle: {
          color: 'white',
          fontSize: 12
        }
      },
      series: [treemapSeriesOption]
    },
    {
      notMerge: false,
      lazyUpdate: false
    }
  )
  lastDataKey = newDataKey
  lastTreeId = currentTreeId

  restoreTreemapState(stateToRestore)
  if (switchingTree) {
    treemapState = captureTreemapState()
  } else if (stateToRestore) {
    treemapState = stateToRestore
  }
}

const formatTooltip = (node: any) => {
  if (!node) return ''
  const [, change] = Array.isArray(node.value) ? node.value : [node.value, node.change ?? 0]

  if (node.children?.length) {
    return `
        <div style="font-weight:700;margin-bottom:4px;">
          ${node.name}
        </div>
        <div style="font-size:12px;opacity:0.85;">변동률 · ${formatChange(change ?? 0)}</div>
      `
  }

  return `
      <div style="font-weight:700;margin-bottom:4px;">
        ${node.fullName ?? node.name}${node.symbol ? ` (${node.symbol})` : ''}
      </div>
      <div style="font-size:12px;opacity:0.85;">변동률 · ${formatChange(change ?? 0)}</div>
    `
}

const labelFormatter = (params: any) => {
  const node = params.data ?? {}
  const [, change] = Array.isArray(node.value) ? node.value : [node.value, node.change]
  const symbol = (node.symbol ?? params.name ?? '').toUpperCase()
  return `${symbol}\n${formatChange(change ?? 0)}`
}

const formatChange = (change: number) => {
  if (!Number.isFinite(change)) return '0.0%'
  const rounded = Number(change.toFixed(1))
  const sign = rounded > 0 ? '+' : ''
  return `${sign}${rounded.toFixed(1)}%`
}

onMounted(async () => {
  await nextTick()
  initChart()
})

onBeforeUnmount(() => {
  disposeChart()
})

watch(
  () => props.data,
  () => {
    if (chart && props.data) {
      updateChart()
      setTimeout(() => {
        if (chart && containerRef.value) {
          const rect = containerRef.value.getBoundingClientRect()
          chart.resize({ width: rect.width, height: rect.height })
        }
      }, 0)
    }
  },
  { deep: true }
)

watch(
  () => props.maxZoom,
  () => {
    if (chart) {
      updateChart()
    }
  }
)
</script>

<template>
  <div
    ref="containerRef"
    class="treemap"
    :style="{ height: '100%', minHeight: `${height}px` }"
    aria-label="자산군 트리맵 시각화"
  >
    <div v-if="initError" class="fallback">
      <p>{{ initError }}</p>
    </div>
  </div>
</template>

<style scoped>
.treemap {
  width: 100%;
  height: 100%;
  min-height: 320px;
  overflow: hidden;
  background: var(--c-bg-800);
  position: relative;
  display: block;
  box-sizing: border-box;
}

.fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--c-text-muted);
  font-size: 0.9rem;
}

.treemap :deep(.echarts) {
  text-align: center !important;
}

.treemap :deep(.echarts text) {
  text-anchor: middle !important;
  dominant-baseline: middle !important;
  text-align: center !important;
  transform: translate(-50%, -50%) !important;
  fill: white !important;
  color: white !important;
}

.treemap :deep(.echarts .ec-label) {
  text-anchor: middle !important;
  dominant-baseline: middle !important;
  text-align: center !important;
  transform: translate(-50%, -50%) !important;
  fill: white !important;
  color: white !important;
}

.treemap :deep(.echarts .ec-treemap-label) {
  text-anchor: middle !important;
  dominant-baseline: middle !important;
  text-align: center !important;
  transform: translate(-50%, -50%) !important;
  fill: white !important;
  color: white !important;
}

.treemap :deep(.echarts tspan) {
  text-anchor: middle !important;
  dominant-baseline: middle !important;
  fill: white !important;
  color: white !important;
}

.treemap :deep(svg text) {
  text-anchor: middle !important;
  dominant-baseline: middle !important;
  transform: translate(-50%, -50%) !important;
  fill: white !important;
  color: white !important;
}
</style>
