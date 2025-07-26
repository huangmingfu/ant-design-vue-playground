<script setup lang="ts">
import { Repl } from '@vue/repl';
import Monaco from '@vue/repl/monaco-editor';
import { message } from 'ant-design-vue';
import { ref, useTemplateRef, watchEffect } from 'vue';
import { Header } from '@/components';
import { useAutoSaveState, useStore } from '@/composables';

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
  message.success('刷新成功!');
}

// persist state
watchEffect(() => {
  // eslint-disable-next-line ts/no-unused-expressions
  store.typescriptVersion;
  history.replaceState(
    {},
    '',
    `${location.origin}${location.pathname}#${store.serialize()}`,
  );
},
);
</script>

<template>
  <a-spin :spinning="loading" tip="Loading..." size="large">
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
  </a-spin>
</template>

<style>
body {
  --at-apply: m-none text-13px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(100vh - var(--nav-height)) !important;
}
</style>
