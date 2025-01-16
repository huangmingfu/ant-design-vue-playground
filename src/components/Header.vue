<script setup lang="ts">
import { SyncOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const appVersion = ref('1.0.0');
const replVersion = ref('1.0.0');
const languageToolsVersion = ref('1.0.0');
const store = ref({ pr: null });
const versions = ref({});
const nightly = ref(false);

function setVersion(key, event) {
  // 处理版本设置逻辑
}

function toggleNightly() {
  // 处理 nightly 切换逻辑
}

function refreshView() {
  // 处理刷新逻辑
}

function copyLink() {
  // 处理复制链接逻辑
}

function toggleDark() {
  // 处理暗黑模式切换逻辑
}
</script>

<template>
  <a-space wrap>
    <a-button type="primary">
      Primary Button
    </a-button>
    <a-button>Default Button</a-button>
    <a-button type="dashed">
      Dashed Button
    </a-button>
    <a-button type="text">
      Text Button
    </a-button>
    <a-button type="link">
      Link Button
    </a-button>
  </a-space>
  <nav>
    <div :style="{ lineHeight: 'var(--nav-height)' }" class="m-0 flex items-center font-medium">
      <img
        class="relative top--2px mr-2 h-6"
        alt="logo"
        src="../assets/logo.svg"
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
          :model-value="v.active"
          size="small"
          style="width: 144px"
          @update:model-value="setVersion(key, $event)"
        >
          <template v-if="key === 'elementPlus'" #header>
            <div class="flex items-center">
              <a-checkbox v-model:checked="nightly" @change="toggleNightly">
                nightly
              </a-checkbox>
              <a-tooltip
                placement="top"
                title="A release of the development branch that is published every night."
              >
                <div
                  class="i-ri-question-line hover:color-primary ml-1 h-4 w-4 cursor-pointer"
                />
              </a-tooltip>
            </div>
          </template>
          <a-select-option v-for="ver of v.published" :key="ver" :value="ver">
            {{ ver }}
          </a-select-option>
        </a-select>
      </div>

      <div class="flex gap-4 text-lg">
        <button class="hover:color-primary i-ri-refresh-line" @click="refreshView" />
        <SyncOutlined />
        <button class="hover:color-primary i-ri-share-line" @click="copyLink" />
        <a
          href="https://github.com/element-plus/element-plus-playground"
          target="_blank"
          class="hover:color-primary flex"
        >
          <button title="View on GitHub" class="i-ri-github-fill" />
        </a>

        <a-popover trigger="click" :width="300">
          <Settings />
          <template #reference>
            <button class="hover:color-primary i-ri:settings-line" />
          </template>
        </a-popover>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 样式可以根据需要进行调整 */
</style>
