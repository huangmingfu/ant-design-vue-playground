import { tryOnScopeDispose } from '@vueuse/core';
import { ref, watch } from 'vue';

export function useAutoSaveState() {
  const AUTO_SAVE_KEY = 'auto-save-state';
  const autoSave = ref(getAutoSaveState());

  function getAutoSaveState() {
    return JSON.parse(localStorage.getItem(AUTO_SAVE_KEY) || 'true');
  }

  function setAutoSaveState(value: boolean) {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(value));
  }

  const stopWatch = watch(autoSave, setAutoSaveState);

  tryOnScopeDispose(stopWatch);

  return {
    autoSave,
  };
}
