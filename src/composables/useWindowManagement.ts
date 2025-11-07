import { ref, type Ref } from 'vue'
import type {
  WindowState,
  ChartWindowState,
  EventsWindowState,
  SNSWindowState,
  NewsWindowState,
  CommunityWindowState,
  Point,
  Size
} from '@/types'
import { DEFAULT_WINDOW_SIZES } from '@/constants'
import type { SocialPlatform } from '@/data/social'

export function useWindowManagement(navHeight: Ref<number>) {
  const windows = ref<WindowState[]>([])
  let zCounter = 5

  const createWindowPosition = (): Point => {
    const offset = windows.value.length
    const baseX = 36 + (offset % 4) * 48
    const baseY = navHeight.value + 24 + offset * 30
    return { x: baseX, y: baseY }
  }

  const bringToFront = (key: string) => {
    zCounter += 1
    windows.value = windows.value.map((window) =>
      window.key === key ? { ...window, z: zCounter } : window
    )
  }

  const updateWindowState = (
    key: string,
    updater: (window: WindowState) => WindowState
  ) => {
    windows.value = windows.value.map((window) =>
      window.key === key ? updater(window) : window
    )
  }

  const handleMove = (key: string, detail: Point) => {
    windows.value = windows.value.map((window) =>
      window.key === key ? { ...window, position: { x: detail.x, y: detail.y } } : window
    )
  }

  const handleResize = (key: string, detail: Size) => {
    windows.value = windows.value.map((window) =>
      window.key === key
        ? { ...window, size: { width: detail.width, height: detail.height } }
        : window
    )
  }

  const closeWindow = (key: string) => {
    windows.value = windows.value.filter((window) => window.key !== key)
  }

  const openChart = (instrumentId: string) => {
    const key = `chart:${instrumentId}`
    const existing = windows.value.find((window) => window.key === key)
    if (existing) {
      bringToFront(key)
      return
    }

    const position = createWindowPosition()
    const nextWindow: ChartWindowState = {
      key,
      type: 'chart',
      instrumentId,
      position,
      size: DEFAULT_WINDOW_SIZES.chart,
      z: ++zCounter
    }

    windows.value = [...windows.value, nextWindow]
  }

  const openEventsWindow = () => {
    const key = 'events:schedule'
    const existing = windows.value.find((window) => window.key === key)
    if (existing) {
      bringToFront(key)
      return
    }

    const position = createWindowPosition()
    const nextWindow: EventsWindowState = {
      key,
      type: 'events',
      position,
      size: DEFAULT_WINDOW_SIZES.events,
      z: ++zCounter,
      view: 'list',
      selectedIndex: null
    }

    windows.value = [...windows.value, nextWindow]
  }

  const openSNSWindow = (
    platformId: SocialPlatform['id'] | 'all',
    allPlatformIds: string[]
  ) => {
    const key = 'sns'
    const existing = windows.value.find(
      (window) => window.key === key && window.type === 'sns'
    ) as SNSWindowState | undefined

    if (!existing) {
      const position = createWindowPosition()
      const selectedPlatforms: string[] =
        platformId === 'all' ? [...allPlatformIds] : [platformId]
      const nextWindow: SNSWindowState = {
        key,
        type: 'sns',
        platforms: selectedPlatforms,
        position,
        size: DEFAULT_WINDOW_SIZES.sns,
        z: ++zCounter,
        view: 'list',
        selectedIndex: null
      }
      windows.value = [...windows.value, nextWindow]
      return
    }

    let nextPlatforms: string[]

    if (platformId === 'all') {
      nextPlatforms = [...allPlatformIds]
    } else {
      const hasPlatform = existing.platforms.includes(platformId)
      nextPlatforms = hasPlatform
        ? existing.platforms.filter((id) => id !== platformId)
        : [...existing.platforms, platformId]
    }

    const uniquePlatforms = allPlatformIds.filter((id) => nextPlatforms.includes(id))

    if (uniquePlatforms.length === 0) {
      windows.value = windows.value.filter((window) => window.key !== key)
      return
    }

    updateWindowState(key, (window) => {
      if (window.type !== 'sns') return window
      return {
        ...window,
        platforms: uniquePlatforms,
        view: 'list',
        selectedIndex: null
      }
    })
    bringToFront(key)
  }

  const openNewsWindow = (sourceId: string, allNewsSourceIds: string[]) => {
    const key = 'news'
    const existing = windows.value.find(
      (window) => window.key === key && window.type === 'news'
    ) as NewsWindowState | undefined

    if (!existing) {
      const position = createWindowPosition()
      const selectedSources = sourceId === 'all' ? [...allNewsSourceIds] : [sourceId]
      const nextWindow: NewsWindowState = {
        key,
        type: 'news',
        sources: selectedSources,
        position,
        size: DEFAULT_WINDOW_SIZES.news,
        z: ++zCounter,
        view: 'list',
        selectedIndex: null
      }
      windows.value = [...windows.value, nextWindow]
      return
    }

    let nextSources: string[]

    if (sourceId === 'all') {
      nextSources = [...allNewsSourceIds]
    } else {
      const hasSource = existing.sources.includes(sourceId)
      nextSources = hasSource
        ? existing.sources.filter((id) => id !== sourceId)
        : [...existing.sources, sourceId]
    }

    const uniqueSources = allNewsSourceIds.filter((id) => nextSources.includes(id))

    if (uniqueSources.length === 0) {
      windows.value = windows.value.filter((window) => window.key !== key)
      return
    }

    updateWindowState(key, (window) => {
      if (window.type !== 'news') return window
      return {
        ...window,
        sources: uniqueSources,
        view: 'list',
        selectedIndex: null
      }
    })
    bringToFront(key)
  }

  const setNewsWindowSource = (key: string, sourceId: string | null, allNewsSourceIds: string[]) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'news') return window
      const nextSources = sourceId ? [sourceId] : [...allNewsSourceIds]
      return { ...window, sources: nextSources, view: 'list', selectedIndex: null }
    })
    bringToFront(key)
  }

  const openCommunityWindow = (boardSlug: string | 'all' = 'all') => {
    const key = 'community'
    const normalized = boardSlug === 'all' ? null : boardSlug
    const existing = windows.value.find(
      (window) => window.key === key && window.type === 'community'
    ) as CommunityWindowState | undefined

    if (!existing) {
      const position = createWindowPosition()
      const nextWindow: CommunityWindowState = {
        key,
        type: 'community',
        position,
        size: DEFAULT_WINDOW_SIZES.community,
        z: ++zCounter,
        selectedBoard: normalized,
        view: 'list',
        selectedIndex: null
      }
      windows.value = [...windows.value, nextWindow]
      return
    }

    updateWindowState(key, (window) => {
      if (window.type !== 'community') return window
      return {
        ...window,
        selectedBoard: normalized,
        view: 'list',
        selectedIndex: null
      }
    })
    bringToFront(key)
  }

  // Window detail handlers
  const openEventDetail = (key: string, index: number) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'events') return window
      return { ...window, view: 'detail', selectedIndex: index }
    })
  }

  const closeEventDetail = (key: string) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'events') return window
      return { ...window, view: 'list', selectedIndex: null }
    })
  }

  const openSNSDetail = (key: string, index: number) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'sns') return window
      return { ...window, view: 'detail', selectedIndex: index }
    })
  }

  const closeSNSDetail = (key: string) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'sns') return window
      return { ...window, view: 'list', selectedIndex: null }
    })
  }

  const openNewsDetail = (key: string, index: number) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'news') return window
      return { ...window, view: 'detail', selectedIndex: index }
    })
  }

  const closeNewsDetail = (key: string) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'news') return window
      return { ...window, view: 'list', selectedIndex: null }
    })
  }

  const openCommunityDetail = (key: string, index: number) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'community') return window
      return { ...window, view: 'detail', selectedIndex: index }
    })
  }

  const closeCommunityDetail = (key: string) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'community') return window
      return { ...window, view: 'list', selectedIndex: null }
    })
  }

  const setCommunityFilter = (key: string, boardSlug: string | null) => {
    updateWindowState(key, (window) => {
      if (window.type !== 'community') return window
      return { ...window, selectedBoard: boardSlug, view: 'list', selectedIndex: null }
    })
  }

  return {
    windows,
    bringToFront,
    updateWindowState,
    handleMove,
    handleResize,
    closeWindow,
    openChart,
    openEventsWindow,
    openSNSWindow,
    openNewsWindow,
    setNewsWindowSource,
    openCommunityWindow,
    openEventDetail,
    closeEventDetail,
    openSNSDetail,
    closeSNSDetail,
    openNewsDetail,
    closeNewsDetail,
    openCommunityDetail,
    closeCommunityDetail,
    setCommunityFilter
  }
}

