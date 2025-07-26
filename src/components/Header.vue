<script setup lang="ts">
import type { SelectValue } from 'ant-design-vue/es/select';
import type { Ref } from 'vue';
import type { Store } from '@/composables';
import type { VersionKey } from '@/utils/dependency';
import { GithubFilled, ReloadOutlined, SettingOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { reactive } from 'vue';
import { cdn, getSupportedAntdVersions, getSupportedTSVersions, getSupportedVueVersions } from '@/utils/dependency';
import { copy } from '@/utils/tools';

const { store } = defineProps<{
  store: Store;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const cdnOptions = [
  {
    label: 'jsDelivr',
    value: 'jsdelivr',
  },
  {
    label: 'jsDelivr Fastly',
    value: 'jsdelivr-fastly',
  },
  {
    label: 'unpkg',
    value: 'unpkg',
  },
];

const versions = reactive<Record<VersionKey, { text: string; active: string; published: Ref<string[]> }>>({
  antDesignVue: {
    text: 'Ant Design Vue',
    published: getSupportedAntdVersions(),
    active: store.versions.antDesignVue,
  },
  vue: {
    text: 'Vue',
    published: getSupportedVueVersions(),
    active: store.versions.vue,
  },
  typescript: {
    text: 'TypeScript',
    published: getSupportedTSVersions(),
    active: store.versions.typescript,
  },
});

async function setVersion(key: VersionKey, v: SelectValue) {
  versions[key].active = `loading...`;
  await store.setVersion(key, v as string);
  versions[key].active = v as string;
}

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
          style="min-width: 180px"
          @update:value="setVersion(key, $event)"
        >
          <a-select-option v-for="ver of v.published" :key="ver" :value="ver">
            {{ ver }}
          </a-select-option>
        </a-select>
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
        <a-popover trigger="click" placement="bottomRight">
          <SettingOutlined />
          <template #content>
            <a-form>
              <a-form-item label="CDN">
                <a-select v-model:value="cdn" :options="cdnOptions" style="width: 200px" />
              </a-form-item>
            </a-form>
          </template>
        </a-popover>
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
