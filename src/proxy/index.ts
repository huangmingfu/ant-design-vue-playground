// 仅用于在开发模式下调试
export const devDepsProxy = {
  'ant-design-vue': `${location.origin}/src/proxy/antdv-dev-proxy`,
  '@ant-design/icons-vue': `${location.origin}/src/proxy/antdv-icons-dev-proxy`,
  '@vue/runtime-dom': `${location.origin}/src/proxy/vue-dev-proxy`,
  '@vue/compiler-sfc': `${location.origin}/src/proxy/vue-sfc-dev-proxy`,
  '@vue/shared': `${location.origin}/src/proxy/vue-shared-dev-proxy`,
} as Record<string, string>;
