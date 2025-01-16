import type { ReplStore } from '@vue/repl';
import type { Initial } from '../types';
import { genCompilerSfcLink, type Versions } from '@/utils/dependency';

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

  setVueVersion(versions.vue).then(() => {
    initial.initialized?.();
  });

  return {
    versions,
  };
}
