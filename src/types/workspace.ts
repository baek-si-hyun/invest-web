export type Mode = 'general' | 'pro';

export type WorkspaceWindowKind = 'events' | 'sns' | 'news' | 'community';

export type WindowEntry = {
  id: string;
  title: string;
  meta: string;
  description: string;
  data?: unknown;
};

export type WindowView = 'list' | 'detail';

export type WorkspaceWindow = {
  key: string;
  kind: WorkspaceWindowKind;
  title: string;
  subtitle: string;
  entries: WindowEntry[];
  view: WindowView;
  selectedIndex: number | null;
  position: { x: number; y: number };
  size: { width: number; height: number };
  z: number;
  openedAt: number;
};
