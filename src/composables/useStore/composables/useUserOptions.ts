import type { ReplStore } from '@vue/repl';
import type { SerializeState, UserOptions } from '../types';
import { utoa } from '@/utils/encode';
import { IS_DEV } from '../constants';

export function useUserOptions(store: ReplStore) {
  const userOptions: UserOptions = {};
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
