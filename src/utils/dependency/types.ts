export interface Dependency {
  pkg: string;
  version: string;
  path: string;
}

export type VersionKey = 'vue' | 'typescript' | 'antDesignVue';
export type Versions = Record<VersionKey, string>;

export type Cdn = 'unpkg' | 'jsdelivr' | 'jsdelivr-fastly';
