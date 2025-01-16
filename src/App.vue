<script setup lang="ts">
import { Header } from '@/components';
import { useAutoSaveState, useStore } from '@/composables';
import { Repl } from '@vue/repl';
import Monaco from '@vue/repl/monaco-editor';
import { ref, useTemplateRef, watchEffect } from 'vue';

const loading = ref(true);
const replRef = useTemplateRef<InstanceType<typeof Repl>>('repl');

/** 自动保存 */
const { autoSave } = useAutoSaveState();

/** @vue/repl */
const store = useStore({
  serializedState: location.hash.slice(1),
  initialized: () => {
    loading.value = false;
  },
});
function refreshPreview() {
  replRef.value?.reload();
}

// persist state
watchEffect(() =>
  history.replaceState(
    {},
    '',
    `${location.origin}${location.pathname}#${store.serialize()}`,
  ),
);

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
globalThis.store = store;
</script>

<template>
  <div v-if="!loading" class="antialiased">
    <Header :store="store" @refresh="refreshPreview" />
    <Repl
      ref="repl"
      v-model="autoSave"
      :editor="Monaco"
      :store="store"
      :show-compile-output="true"
      :auto-resize="true"
      :clear-console="false"
      @keydown.ctrl.s.prevent
      @keydown.meta.s.prevent
    />
  </div>
  <a-spin v-else tip="Loading..." size="large">
    <div class="h-100vh" />
  </a-spin>
</template>

<style>
body {
  --at-apply: m-none text-13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(100vh - var(--nav-height)) !important;
}
</style>
