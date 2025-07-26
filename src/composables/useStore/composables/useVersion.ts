import type { ReplStore } from '@vue/repl';
import type { Initial, UserOptions } from '../types';
import type { VersionKey, Versions } from '@/utils/dependency';
import { genCompilerSfcLink } from '@/utils/dependency';

export function useVersion({
  userOptions,
  initial,
  store,
  versions,
} = {} as {
  userOptions: UserOptions;
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
        userOptions.vueVersion = version;
        await setVueVersion(version);
        break;
      case 'antDesignVue':
        userOptions.antdvVersion = version;
        versions.antDesignVue = version;
        break;
      case 'typescript':
        userOptions.tsVersion = version;
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
