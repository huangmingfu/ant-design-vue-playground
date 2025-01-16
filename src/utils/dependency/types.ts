export interface Dependency {
  pkg: string;
  version: string;
  path: string;
}

export type VersionKey = 'vue' | 'typescript' | 'antDesignVue';
export type Versions = Record<VersionKey, string>;
