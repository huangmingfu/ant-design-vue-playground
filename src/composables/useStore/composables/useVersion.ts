import type { ReplStore } from '@vue/repl';
import type { Initial } from '../types';
import { genCompilerSfcLink, type VersionKey, type Versions } from '@/utils/dependency';

export function useVersion({
  initial,
  store,
  versions,
} = {} as {
  initial: Initial;
  store: ReplStore;
  versions: Versions;
}) {
  async function setVueVersion(version: string) {
    store.compiler = await import(
      /* @vite-ignore */ genCompilerSfcLink(version)
    );
    versions.vue = version;
  };

  async function setVersion(key: VersionKey, version: string) {
    switch (key) {
      case 'vue':
        await setVueVersion(version);
        break;
      case 'antDesignVue':
        versions.antDesignVue = version;
        break;
      case 'typescript':
        store.typescriptVersion = version;
        break;
    }
  }

  setVueVersion(versions.vue).then(() => {
    initial.initialized?.();
  });

  return {
    setVersion,
  };
}
