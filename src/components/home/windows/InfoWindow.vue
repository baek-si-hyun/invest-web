<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue'

type Point = { x: number; y: number }
type Size = { width: number; height: number }

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string | null
    position?: Point
    size?: Size
    zIndex?: number
    lockedTop?: number
    minWidth?: number
    minHeight?: number
    bodyPadding?: number
  }>(),
  {
    subtitle: null,
    position: () => ({ x: 24, y: 120 }),
    size: () => ({ width: 360, height: 260 }),
    zIndex: 1,
    lockedTop: 72,
    minWidth: 240,
    minHeight: 180,
    bodyPadding: 18
  }
)

const emit = defineEmits<{
  (event: 'move', payload: Point): void
  (event: 'resize', payload: Size): void
  (event: 'focus'): void
  (event: 'close'): void
}>()

const positionState = reactive<Point>({ ...props.position })
const sizeState = reactive<Size>({ ...props.size })
const viewport = reactive<{ width: number; height: number }>({ width: 0, height: 0 })

const isBrowser = typeof window !== 'undefined'

const updateViewport = () => {
  if (!isBrowser) return
  viewport.width = window.innerWidth
  viewport.height = window.innerHeight
}

const clampWithinViewport = (x: number, y: number) => {
  if (!viewport.width || !viewport.height) return { x, y }
  const maxX = Math.max(0, viewport.width - sizeState.width)
  const maxY = Math.max(props.lockedTop, viewport.height - sizeState.height)
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(props.lockedTop, y), maxY)
  }
}

const clampPosition = (andEmit = false) => {
  const clamped = clampWithinViewport(positionState.x, positionState.y)
  if (clamped.x !== positionState.x || clamped.y !== positionState.y) {
    positionState.x = clamped.x
    positionState.y = clamped.y
    if (andEmit) emit('move', { ...clamped })
  }
}

let dragging = false
let dragStart = { x: 0, y: 0 }
let origin = { x: 0, y: 0 }

const handleDragStart = (event: PointerEvent) => {
  event.preventDefault()
  dragging = true
  origin = { ...positionState }
  dragStart = { x: event.clientX, y: event.clientY }
  ;(event.target as HTMLElement | undefined)?.setPointerCapture(event.pointerId)
  emit('focus')
}

const handleTouchStart = (event: TouchEvent) => {
  event.preventDefault()
  if (event.touches.length !== 1) return
  const touch = event.touches[0]
  if (!touch) return
  const pointerEvent = new PointerEvent('pointerdown', {
    clientX: touch.clientX,
    clientY: touch.clientY,
    pointerId: touch.identifier,
    pointerType: 'touch'
  })
  handleDragStart(pointerEvent)
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  if (!dragging || event.touches.length !== 1) return
  const touch = event.touches[0]
  if (!touch) return
  const pointerEvent = new PointerEvent('pointermove', {
    clientX: touch.clientX,
    clientY: touch.clientY,
    pointerId: touch.identifier,
    pointerType: 'touch'
  })
  handleDragMove(pointerEvent)
}

const handleTouchEnd = (event: TouchEvent) => {
  event.preventDefault()
  if (!dragging) return
  const changed = event.changedTouches[0]
  const pointerEvent = new PointerEvent('pointerup', {
    pointerId: changed?.identifier ?? 0,
    pointerType: 'touch'
  })
  handleDragEnd(pointerEvent)
}

const handleDragMove = (event: PointerEvent) => {
  if (!dragging) return
  const nextX = origin.x + (event.clientX - dragStart.x)
  const nextY = origin.y + (event.clientY - dragStart.y)
  const clamped = clampWithinViewport(nextX, nextY)
  positionState.x = clamped.x
  positionState.y = clamped.y
  emit('move', { ...clamped })
}

const handleDragEnd = (event: PointerEvent) => {
  if (!dragging) return
  dragging = false
  ;(event.target as HTMLElement | undefined)?.releasePointerCapture(event.pointerId)
}

let resizing = false
let resizeStart = { x: 0, y: 0 }
let resizeOrigin = { width: 0, height: 0 }

const handleResizeStart = (event: PointerEvent) => {
  event.preventDefault()
  resizing = true
  resizeOrigin = { ...sizeState }
  resizeStart = { x: event.clientX, y: event.clientY }
  ;(event.target as HTMLElement | undefined)?.setPointerCapture(event.pointerId)
  emit('focus')
}

const handleResizeMove = (event: PointerEvent) => {
  if (!resizing) return
  const deltaX = event.clientX - resizeStart.x
  const deltaY = event.clientY - resizeStart.y

  let nextWidth = Math.max(props.minWidth, resizeOrigin.width + deltaX)
  let nextHeight = Math.max(props.minHeight, resizeOrigin.height + deltaY)

  if (viewport.width) {
    const maxWidth = Math.max(props.minWidth, viewport.width - positionState.x)
    nextWidth = Math.min(nextWidth, maxWidth)
  }

  if (viewport.height) {
    const maxHeight = Math.max(props.minHeight, viewport.height - positionState.y)
    nextHeight = Math.min(nextHeight, maxHeight)
  }

  sizeState.width = nextWidth
  sizeState.height = nextHeight
  emit('resize', { width: nextWidth, height: nextHeight })
}

const handleResizeEnd = (event: PointerEvent) => {
  if (!resizing) return
  resizing = false
  ;(event.target as HTMLElement | undefined)?.releasePointerCapture(event.pointerId)
  clampPosition()
}

const handleClose = () => {
  emit('close')
}

const windowStyle = computed(() => ({
  transform: `translate3d(${positionState.x}px, ${positionState.y}px, 0)`,
  width: `${sizeState.width}px`,
  height: `${sizeState.height}px`,
  zIndex: props.zIndex
}))

onMounted(() => {
  updateViewport()
  clampPosition()
  if (isBrowser) window.addEventListener('resize', updateViewport)
})

onBeforeUnmount(() => {
  if (isBrowser) window.removeEventListener('resize', updateViewport)
})

watch(
  () => props.position,
  (next) => {
    positionState.x = next.x
    positionState.y = next.y
    clampPosition()
  },
  { deep: true }
)

watch(
  () => props.size,
  (next) => {
    sizeState.width = next.width
    sizeState.height = next.height
    clampPosition()
  },
  { deep: true }
)

watch(
  () => [viewport.width, viewport.height],
  () => clampPosition(true)
)
</script>

<template>
  <section
    class="window"
    :style="windowStyle"
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
        <strong>{{ title }}</strong>
        <span v-if="subtitle">{{ subtitle }}</span>
      </div>
      <button class="window__close" type="button" @click.stop="handleClose" aria-label="close window">
        ✕
      </button>
    </header>

    <div class="window__body" :style="{ padding: `${bodyPadding}px` }">
      <slot />
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
}

.window__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: var(--c-bg-900);
  border-bottom: 1px solid var(--c-border-strong);
  gap: 12px;
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
  gap: 4px;
}

.window__info strong {
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--c-text-primary);
}

.window__info span {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.window__close {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-size: 0.95rem;
  width: 26px;
  height: 26px;
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
  overflow: auto;
  background: var(--c-bg-900);
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

@media (min-width: 1440px) {
  .window {
    min-width: 360px;
    min-height: 260px;
  }

  .window__header {
    padding: 14px 20px;
  }

  .window__info strong {
    font-size: 1.05rem;
  }

  .window__info span {
    font-size: 0.8rem;
  }
}

@media (max-width: 1439px) and (min-width: 1200px) {
  .window {
    min-width: 340px;
    min-height: 240px;
  }
}

@media (max-width: 1199px) and (min-width: 1024px) {
  .window {
    min-width: 320px;
    min-height: 220px;
  }

  .window__header {
    padding: 12px 16px;
  }

  .window__info strong {
    font-size: 0.95rem;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .window {
    min-width: 300px;
    min-height: 200px;
  }

  .window__header {
    padding: 10px 14px;
  }

  .window__info strong {
    font-size: 0.9rem;
  }

  .window__info span {
    font-size: 0.7rem;
  }

  .window__close {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .window {
    min-width: 280px;
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
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }

  .window__resize-handle {
    right: 6px;
    bottom: 6px;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .window {
    min-width: 260px;
    min-height: 160px;
  }

  .window__header {
    padding: 6px 10px;
  }

  .window__info strong {
    font-size: 0.8rem;
  }

  .window__info span {
    font-size: 0.6rem;
  }

  .window__close {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }

  .window__resize-handle {
    right: 2px;
    bottom: 2px;
  }
}

@media (max-width: 479px) {
  .window {
    min-width: 240px;
    min-height: 140px;
  }

  .window__header {
    padding: 4px 8px;
  }

  .window__info strong {
    font-size: 0.75rem;
  }

  .window__info span {
    font-size: 0.55rem;
  }

  .window__close {
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
  }

  .window__resize-handle {
    width: 32px;
    height: 32px;
    right: 1px;
    bottom: 1px;
  }
}

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

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .window__info strong {
    font-weight: 700;
  }
}

@media (prefers-color-scheme: dark) {
  .window {
    box-shadow: 0 8px 32px var(--c-overlay-strong);
  }
}

@media (max-width: 768px) {
  .window {
    max-width: calc(100vw - 16px);
    max-height: calc(100vh - 100px);
  }
}

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
