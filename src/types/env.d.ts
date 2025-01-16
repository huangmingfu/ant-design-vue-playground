/// <reference types="vite/client" />
/// <reference types="ant-design-vue/typings/global.d.ts" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_OUT_DIR: string;
  readonly VITE_APP_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
