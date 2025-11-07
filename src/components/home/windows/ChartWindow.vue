<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { Instrument } from '@/data/instruments'

const MIN_WIDTH = 220
const MIN_HEIGHT = 160
const EDGE_PADDING = 0

let tradingViewScriptPromise: Promise<void> | null = null

const loadTradingViewScript = () => {
  if (typeof window === 'undefined') return Promise.resolve()
  if ((window as typeof window & { TradingView?: unknown }).TradingView) {
    return Promise.resolve()
  }

  if (!tradingViewScriptPromise) {
    tradingViewScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('TradingView script failed to load'))
      document.head.appendChild(script)
    })
  }

  return tradingViewScriptPromise
}

const props = withDefaults(
  defineProps<{
    instrument: Instrument
    position?: { x: number; y: number }
    size?: { width: number; height: number }
    zIndex?: number
    lockedTop?: number
  }>(),
  {
    position: () => ({ x: 24, y: 120 }),
    size: () => ({ width: 360, height: 240 }),
    zIndex: 1,
    lockedTop: 72
  }
)

const emit = defineEmits<{
  (event: 'move', payload: { x: number; y: number }): void
  (event: 'resize', payload: { width: number; height: number }): void
  (event: 'focus'): void
  (event: 'close'): void
}>()

const containerId = `tv-widget-${Math.random().toString(36).slice(2, 10)}`
const containerElement = ref<HTMLDivElement | null>(null)

type TradingViewWidget = {
  remove?: () => void
  resize?: (width?: number, height?: number) => void
  onChartReady?: (callback: () => void) => void
}

let widget: TradingViewWidget | null = null
const widgetSymbolLoaded = ref<string | null>(null)
const loadingWidget = ref(false)
const loadError = ref<string | null>(null)

const viewport = reactive({ width: 0, height: 0 })

const updateViewport = () => {
  if (typeof window === 'undefined') return
  viewport.width = window.innerWidth
  viewport.height = window.innerHeight
}

const clampWithinViewport = (x: number, y: number) => {
  if (!viewport.width || !viewport.height) return { x, y }
  const maxX = Math.max(EDGE_PADDING, viewport.width - props.size.width - EDGE_PADDING)
  const maxY = Math.max(props.lockedTop, viewport.height - props.size.height - EDGE_PADDING)
  return {
    x: Math.min(Math.max(EDGE_PADDING, x), maxX),
    y: Math.min(Math.max(props.lockedTop, y), maxY)
  }
}

const dragStart = reactive({ x: 0, y: 0 })
const origin = reactive({ x: 0, y: 0 })
const dragging = ref(false)

const handleDragStart = (event: PointerEvent) => {
  event.preventDefault()
  dragging.value = true
  origin.x = props.position.x
  origin.y = props.position.y
  dragStart.x = event.clientX
  dragStart.y = event.clientY
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  emit('focus')
}

// 터치 이벤트 핸들러
const handleTouchStart = (event: TouchEvent) => {
  event.preventDefault()
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    const pointerEvent = new PointerEvent('pointerdown', {
      clientX: touch.clientX,
      clientY: touch.clientY,
      pointerId: touch.identifier,
      pointerType: 'touch'
    })
    handleDragStart(pointerEvent)
  }
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  if (event.touches.length === 1 && dragging.value) {
    const touch = event.touches[0]
    const pointerEvent = new PointerEvent('pointermove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
      pointerId: touch.identifier,
      pointerType: 'touch'
    })
    handleDragMove(pointerEvent)
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  event.preventDefault()
  if (dragging.value) {
    const pointerEvent = new PointerEvent('pointerup', {
      pointerId: event.changedTouches[0]?.identifier || 0,
      pointerType: 'touch'
    })
    handleDragEnd(pointerEvent)
  }
}

const handleDragMove = (event: PointerEvent) => {
  if (!dragging.value) return
  const nextX = origin.x + (event.clientX - dragStart.x)
  const nextY = origin.y + (event.clientY - dragStart.y)
  const clamped = clampWithinViewport(nextX, nextY)
  emit('move', clamped)
}

const handleDragEnd = (event: PointerEvent) => {
  if (!dragging.value) return
  dragging.value = false
  ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
}

const resizing = ref(false)
const resizeStart = reactive({ x: 0, y: 0 })
const resizeOrigin = reactive({ width: 0, height: 0 })

const handleResizeStart = (event: PointerEvent) => {
  event.preventDefault()
  resizing.value = true
  resizeOrigin.width = props.size.width
  resizeOrigin.height = props.size.height
  resizeStart.x = event.clientX
  resizeStart.y = event.clientY
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  emit('focus')
}

const handleResizeMove = (event: PointerEvent) => {
  if (!resizing.value) return
  let nextWidth = Math.max(MIN_WIDTH, resizeOrigin.width + (event.clientX - resizeStart.x))
  let nextHeight = Math.max(MIN_HEIGHT, resizeOrigin.height + (event.clientY - resizeStart.y))

  if (viewport.width) {
    const maxWidth = Math.max(MIN_WIDTH, viewport.width - props.position.x - EDGE_PADDING)
    nextWidth = Math.min(nextWidth, maxWidth)
  }
  if (viewport.height) {
    const maxHeight = Math.max(MIN_HEIGHT, viewport.height - props.position.y - EDGE_PADDING)
    nextHeight = Math.min(nextHeight, maxHeight)
  }

  emit('resize', { width: nextWidth, height: nextHeight })
}

const handleResizeEnd = (event: PointerEvent) => {
  if (!resizing.value) return
  resizing.value = false
  ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
}

const handleClose = () => {
  emit('close')
}

const ensureWidget = async () => {
  if (typeof window === 'undefined' || !containerElement.value) return

  if (!props.instrument.tradingViewSymbol) {
    if (widget?.remove) widget.remove()
    widget = null
    widgetSymbolLoaded.value = null
    loadError.value = '트레이딩뷰 심볼이 설정되지 않았습니다.'
    return
  }

  if (loadingWidget.value) return
  if (widgetSymbolLoaded.value === props.instrument.tradingViewSymbol) return

  loadingWidget.value = true
  loadError.value = null

  try {
    // 기존 위젯 안전하게 제거
    if (widget?.remove) {
      try {
        widget.remove()
        console.log('Previous TradingView widget removed')
      } catch (error) {
        console.warn('Error removing previous widget:', error)
      }
      widget = null
    }

    // 컨테이너 정리
    if (containerElement.value) {
      try {
        containerElement.value.innerHTML = ''
        console.log('Container cleared for new widget')
      } catch (error) {
        console.warn('Error clearing container:', error)
      }
    }

    await loadTradingViewScript()

    const tvGlobal = (window as typeof window & {
      TradingView?: {
        widget?: new (options: Record<string, unknown>) => TradingViewWidget
      }
    }).TradingView

    if (!tvGlobal?.widget) {
      throw new Error('TradingView widget factory missing')
    }

    widget = new tvGlobal.widget({
      container_id: containerId,
      symbol: props.instrument.tradingViewSymbol,
      interval: props.instrument.tradingViewInterval ?? '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'kr',
      autosize: true,
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      withdateranges: true
    })

    widgetSymbolLoaded.value = props.instrument.tradingViewSymbol
    if (widget?.onChartReady) {
      widget.onChartReady(() => {
        loadingWidget.value = false
        loadError.value = null
      })
    } else {
      loadingWidget.value = false
    }
  } catch (error) {
    console.error('Failed to initialise TradingView widget', error)
    loadError.value = '트레이딩뷰 차트를 불러오지 못했습니다.'
    loadingWidget.value = false
  }
}

onMounted(() => {
  updateViewport()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateViewport)
  }
  ensureWidget()
})

onBeforeUnmount(() => {
  console.log('ChartWindow onBeforeUnmount called for instrument:', props.instrument?.name)

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateViewport)
  }

  // TradingView 위젯 안전하게 정리
  if (widget?.remove) {
    try {
      widget.remove()
      console.log('TradingView widget removed successfully')
    } catch (error) {
      console.warn('Error removing TradingView widget:', error)
    }
  }

  // 컨테이너 정리
  if (containerElement.value) {
    try {
      containerElement.value.innerHTML = ''
      console.log('Container element cleared')
    } catch (error) {
      console.warn('Error clearing container element:', error)
    }
  }

  // 상태 초기화
  widget = null
  widgetSymbolLoaded.value = null
  loadingWidget.value = false
  loadError.value = null
})

// Position clamping watch
watch(
  () => props.position,
  () => {
    try {
      const clamped = clampWithinViewport(props.position.x, props.position.y)
      if (clamped.x !== props.position.x || clamped.y !== props.position.y) {
        emit('move', clamped)
      }
    } catch (error) {
      console.warn('Error in position clamping:', error)
    }
  },
  { deep: true }
)

// Widget initialization watch
watch(
  () => [containerElement.value, props.instrument],
  () => {
    if (typeof window !== 'undefined' && containerElement.value && !loadingWidget.value) {
      try {
        void ensureWidget()
      } catch (error) {
        console.warn('Error in ensureWidget reactive statement:', error)
      }
    }
  },
  { deep: true }
)

// Widget resize watch
watch(
  () => props.size,
  () => {
    if (widget?.resize && !loadingWidget.value) {
      try {
        widget.resize(props.size.width, props.size.height)
      } catch (error) {
        console.warn('Error resizing widget:', error)
      }
    }
  },
  { deep: true }
)
</script>

<template>
  <section
    class="window"
    :style="{
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      zIndex: zIndex
    }"
    @pointermove="handleDragMove"
    @pointerup="handleDragEnd"
    @pointerleave="handleDragEnd"
    @pointerdown="emit('focus')"
  >
    <header
      class="window__header"
      @pointerdown="handleDragStart"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="window__info">
        <strong>{{ instrument.name }}</strong>
        <span>{{ instrument.symbol }}</span>
      </div>
      <button
        class="window__close"
        @click.stop="handleClose"
        aria-label="Close chart"
      >
        ✕
      </button>
    </header>

    <div class="window__body">
      <div class="chart-container" :id="containerId" ref="containerElement"></div>
      <div v-if="loadingWidget" class="chart-overlay">
        <span>차트를 불러오는 중...</span>
      </div>
      <div v-else-if="loadError" class="chart-overlay error">
        <span>{{ loadError }}</span>
      </div>
    </div>

    <div
      class="window__resize-handle"
      @pointerdown="handleResizeStart"
      @pointermove="handleResizeMove"
      @pointerup="handleResizeEnd"
      @pointerleave="handleResizeEnd"
    >
      <span></span>
    </div>
  </section>
</template>

<style scoped>
.window {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background: var(--c-bg-800);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-strong);
  box-shadow: 0 8px 24px var(--c-overlay-strong);
  color: var(--c-text-primary);
  overflow: hidden;
  cursor: default;
}

.window__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  gap: 12px;
  background: var(--c-bg-900);
  border-bottom: 1px solid var(--c-border-strong);
  cursor: grab;
  user-select: none;
}

.window__header:active {
  cursor: grabbing;
}

.window__info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.window__info strong {
  font-size: 0.95rem;
  font-weight: 600;
}

.window__info span {
  font-size: 0.7rem;
  color: var(--c-text-muted);
}

.window__close {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-size: 0.9rem;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.window__close:hover {
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.window__body {
  flex: 1;
  position: relative;
  padding: 0;
}

.chart-container {
  position: absolute;
  inset: 0;
}

.chart-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--c-bg-900);
  color: var(--c-text-primary);
  font-size: 0.85rem;
  text-align: center;
  padding: 0 12px;
}

.chart-overlay span {
  max-width: 280px;
  line-height: 1.4;
}

.chart-overlay.error {
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.window__resize-handle {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 18px;
  height: 18px;
  cursor: nwse-resize;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.window__resize-handle span {
  width: 100%;
  height: 100%;
  border-right: 2px solid var(--c-border-hover);
  border-bottom: 2px solid var(--c-border-hover);
  border-radius: 0 0 4px 0;
}

/* 반응형 디자인 */
/* Large Desktop: 1440px+ */
@media (min-width: 1440px) {
  .window {
    min-width: 360px;
    min-height: 240px;
  }

  .window__header {
    padding: 12px 16px;
  }

  .window__info strong {
    font-size: 1rem;
  }

  .window__info span {
    font-size: 0.75rem;
  }
}

/* Desktop: 1200px - 1439px */
@media (max-width: 1439px) and (min-width: 1200px) {
  .window {
    min-width: 340px;
    min-height: 220px;
  }
}

/* Tablet Landscape: 1024px - 1199px */
@media (max-width: 1199px) and (min-width: 1024px) {
  .window {
    min-width: 320px;
    min-height: 200px;
  }

  .window__header {
    padding: 10px 14px;
  }

  .window__info strong {
    font-size: 0.9rem;
  }
}

/* Tablet Portrait: 768px - 1023px */
@media (max-width: 1023px) and (min-width: 768px) {
  .window {
    min-width: 300px;
    min-height: 180px;
  }

  .window__header {
    padding: 8px 12px;
  }

  .window__info strong {
    font-size: 0.85rem;
  }

  .window__info span {
    font-size: 0.65rem;
  }

  .window__close {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
}

/* Mobile Landscape: 640px - 767px */
@media (max-width: 767px) and (min-width: 640px) {
  .window {
    min-width: 280px;
    min-height: 160px;
  }

  .window__header {
    padding: 8px 10px;
  }

  .window__info strong {
    font-size: 0.8rem;
  }

  .window__info span {
    font-size: 0.6rem;
  }

  .window__close {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }

  .chart-overlay {
    font-size: 0.8rem;
    padding: 0 8px;
  }

  .window__resize-handle {
    width: 24px;
    height: 24px;
    right: 4px;
    bottom: 4px;
  }
}

/* Mobile Portrait: 480px - 639px */
@media (max-width: 639px) and (min-width: 480px) {
  .window {
    min-width: 260px;
    min-height: 140px;
  }

  .window__header {
    padding: 6px 8px;
  }

  .window__info strong {
    font-size: 0.75rem;
  }

  .window__info span {
    font-size: 0.55rem;
  }

  .window__close {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }

  .chart-overlay {
    font-size: 0.75rem;
    padding: 0 6px;
  }

  .chart-overlay span {
    max-width: 200px;
  }

  .window__resize-handle {
    width: 28px;
    height: 28px;
    right: 2px;
    bottom: 2px;
  }
}

/* Small Mobile: 320px - 479px */
@media (max-width: 479px) {
  .window {
    min-width: 240px;
    min-height: 120px;
  }

  .window__header {
    padding: 4px 6px;
  }

  .window__info strong {
    font-size: 0.7rem;
  }

  .window__info span {
    font-size: 0.5rem;
  }

  .window__close {
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
  }

  .chart-overlay {
    font-size: 0.7rem;
    padding: 0 4px;
  }

  .chart-overlay span {
    max-width: 180px;
  }

  .window__resize-handle {
    width: 32px;
    height: 32px;
    right: 1px;
    bottom: 1px;
  }
}

/* 터치 디바이스 최적화 */
@media (hover: none) and (pointer: coarse) {
  .window__close {
    min-width: 44px;
    min-height: 44px;
  }

  .window__resize-handle {
    min-width: 44px;
    min-height: 44px;
  }

  .window__header {
    cursor: default;
  }

  .window__header:active {
    cursor: default;
  }
}

/* 고해상도 디스플레이 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .window__info strong {
    font-weight: 700;
  }
}

/* 다크 모드 최적화 */
@media (prefers-color-scheme: dark) {
  .window {
    box-shadow: 0 8px 32px var(--c-overlay-strong);
  }
}

/* 모바일에서 창 크기 제한 */
@media (max-width: 768px) {
  .window {
    max-width: calc(100vw - 16px);
    max-height: calc(100vh - 100px);
  }
}

/* 매우 작은 화면에서 전체 화면 모드 */
@media (max-width: 480px) {
  .window {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    transform: none !important;
    border-radius: 0;
    z-index: 9999 !important;
  }

  .window__resize-handle {
    display: none;
  }
}
</style>
