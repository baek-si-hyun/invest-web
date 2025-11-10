export type Section = 'chart' | 'events' | 'sns' | 'news' | 'community'

export type Mode = 'general' | 'pro'

export type Point = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type WindowView = 'list' | 'detail'

export type ChartWindowState = {
  key: string
  type: 'chart'
  instrumentId: string
  position: Point
  size: Size
  z: number
}

export type EventsWindowState = {
  key: string
  type: 'events'
  position: Point
  size: Size
  z: number
  view: WindowView
  selectedIndex: number | null
}

export type SNSWindowState = {
  key: string
  type: 'sns'
  platforms: string[]
  position: Point
  size: Size
  z: number
  view: WindowView
  selectedIndex: number | null
}

export type NewsWindowState = {
  key: string
  type: 'news'
  sources: string[]
  position: Point
  size: Size
  z: number
  view: WindowView
  selectedIndex: number | null
}

export type CommunityWindowState = {
  key: string
  type: 'community'
  selectedBoard: string | null
  position: Point
  size: Size
  z: number
  view: WindowView
  selectedIndex: number | null
}

export type WindowState =
  | ChartWindowState
  | EventsWindowState
  | SNSWindowState
  | NewsWindowState
  | CommunityWindowState

// Re-export types from workspace.ts for backward compatibility
export type { WorkspaceWindowKind, WindowEntry, WorkspaceWindow } from './workspace'

