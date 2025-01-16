<script setup lang="ts">
import type { Store } from '@/composables';
import type { VersionKey } from '@/utils/dependency';
import { getPkgVersionsOptions } from '@/utils/dependency';
import { copy } from '@/utils/tools';
import { GithubFilled, ReloadOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { reactive } from 'vue';

const { store } = defineProps<{
  store: Store;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const options = getPkgVersionsOptions();

const versions = reactive<Record<VersionKey, { text: string; active: string }>>({
  antDesignVue: {
    text: 'Ant Design Vue',
    active: store.versions.antDesignVue,
  },
  vue: {
    text: 'Vue',
    active: store.versions.vue,
  },
  typescript: {
    text: 'TypeScript',
    active: store.versions.typescript,
  },
});

function copyLink() {
  copy(location.href, '可共享URL已被复制到剪贴板。');
}

function refreshView() {
  emit('refresh');
}
</script>

<template>
  <nav>
    <div :style="{ lineHeight: 'var(--nav-height)' }" class="m-0 flex items-center font-medium">
      <img
        class="relative top--2px mr-2 h-6"
        alt="logo"
        src="/logo.svg"
      >
      <div class="flex items-center gap-1 lt-sm-hidden">
        <div class="text-xl">
          Ant Design Vue Playground
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div
        v-for="(v, key) of versions"
        :key="key"
        class="flex items-center gap-2 lt-lg-hidden"
      >
        <span>{{ v.text }}:</span>
        <a-select
          v-model:value="v.active"
          size="small"
          :options="options[key]"
        />
      </div>
      <div class="flex gap-4 text-lg">
        <ReloadOutlined @click="refreshView" />
        <ShareAltOutlined @click="copyLink" />
        <a
          href="https://github.com/huangmingfu/ant-design-vue-playground"
          target="_blank"
          class="hover:color-primary flex"
        >
          <GithubFilled />
        </a>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  --bg: #fff;
  --bg-light: #fff;
  --border: #ddd;

  --at-apply: 'box-border flex justify-between px-4 z-999 relative';

  height: var(--nav-height);
  background-color: var(--bg);
}
</style>
