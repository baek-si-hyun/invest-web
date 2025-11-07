/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@fullcalendar/core';
declare module '@fullcalendar/daygrid';
declare module '@fullcalendar/interaction';
declare module '@fullcalendar/core/locales/ko';
