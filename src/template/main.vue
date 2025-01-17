<script setup>
import { setupAntDesignVue } from './ant-design-vue.js';
import App from './App.vue';
import { version as antdVersion } from 'ant-design-vue'
import { version as vueVersion } from 'vue'

setupAntDesignVue();
</script>

<template>
  <App />
  <p style="position: fixed; bottom: 0; margin: 16px;">
    Ant Design Vue：<span style="color: #1890FF;">{{ antdVersion }}</span>
    <br/>
    Vue：<span style="color: #1890FF;">{{ vueVersion }}</span>
  </p>
</template>
