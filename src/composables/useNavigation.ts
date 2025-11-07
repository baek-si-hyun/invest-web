import { ref } from 'vue'
import type { Section, Mode } from '@/types'
import { HOVER_HIDE_DELAY } from '@/constants'

export function useNavigation() {
  const mode = ref<Mode>('pro')
  const hoveredSection = ref<Section | null>(null)
  const activeSection = ref<Section | null>('chart')
  const generalSection = ref<Section>('chart')
  let hoverTimer: number | null = null

  const setMode = (nextMode: Mode) => {
    if (mode.value === nextMode) return
    mode.value = nextMode
    cancelHoverHide()
    hoveredSection.value = null
    if (nextMode === 'general') {
      generalSection.value = generalSection.value ?? 'chart'
    } else {
      activeSection.value = activeSection.value ?? 'chart'
    }
  }

  const handleLogoClick = () => {
    setMode('general')
    generalSection.value = 'chart'
    cancelHoverHide()
    hoveredSection.value = null
  }

  const cancelHoverHide = () => {
    if (hoverTimer !== null) {
      window.clearTimeout(hoverTimer)
      hoverTimer = null
    }
  }

  const scheduleHoverHide = () => {
    cancelHoverHide()
    hoverTimer = window.setTimeout(() => {
      hoveredSection.value = null
    }, HOVER_HIDE_DELAY)
  }

  const showMenuModal = (section: Section) => {
    if (mode.value !== 'pro') return
    cancelHoverHide()
    hoveredSection.value = section
    activeSection.value = section
  }

  const handleMenuClick = (section: Section) => {
    if (mode.value !== 'pro') return
    showMenuModal(section)
  }

  const handleNavClick = (section: Section) => {
    if (mode.value === 'pro') {
      handleMenuClick(section)
      return
    }

    generalSection.value = section
    cancelHoverHide()
    hoveredSection.value = null
  }

  const handleNavPointerEnter = (section: Section) => {
    if (mode.value !== 'pro') return
    showMenuModal(section)
  }

  return {
    mode,
    hoveredSection,
    activeSection,
    generalSection,
    setMode,
    handleLogoClick,
    cancelHoverHide,
    scheduleHoverHide,
    showMenuModal,
    handleMenuClick,
    handleNavClick,
    handleNavPointerEnter
  }
}


