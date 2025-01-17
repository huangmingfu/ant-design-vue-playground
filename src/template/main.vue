<script setup>
import { setupAntDesignVue } from './ant-design-vue.js';
import App from './App.vue';
import { version as antdVersion } from 'ant-design-vue'
import { version as vueVersion } from 'vue'

setupAntDesignVue();
</script>

<template>
  <div style="margin: 10px;">
    <App />
    <!-- 固定展示版本号 -->
    <p style="position: fixed; bottom: 0;">
      Ant Design Vue：<span style="color: #1890FF;">{{ antdVersion }}</span>
      <br/>
      Vue：<span style="color: #1890FF;">{{ vueVersion }}</span>
    </p>
  </div>
</template>
