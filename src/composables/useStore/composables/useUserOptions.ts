import type { ReplStore } from '@vue/repl';
import type { SerializeState, UserOptions } from '../types';
import { utoa } from '@/utils/encode';
import { IS_DEV } from '../constants';

export function useUserOptions(store: ReplStore, saved?: SerializeState) {
  const userOptions: UserOptions = {
    vueVersion: saved?._o?.vueVersion,
    tsVersion: saved?._o?.tsVersion,
    antdvVersion: saved?._o?.antdvVersion,
  };
  const hideFile = !IS_DEV && !userOptions.showHidden;

  function serialize() {
    const state: SerializeState = { ...store.getFiles() };
    state._o = userOptions;
    return utoa(JSON.stringify(state));
  }

  return {
    userOptions,
    hideFile,
    serialize,
  };
}
