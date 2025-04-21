import type { ImportMap } from '@vue/repl';
import type { MaybeRef, Ref } from 'vue';
import type { Cdn, Dependency, Versions } from './types';
import { devDepsProxy } from '@/proxy';
import { useFetch, useLocalStorage } from '@vueuse/core';
import { gte } from 'semver';
import { computed, unref } from 'vue';

export * from './types';

export const cdn = useLocalStorage<Cdn>('setting-cdn', 'jsdelivr');

export function genCdnLink(
  pkg: string,
  version: string,
  path: string,
) {
  // 开发不使用公共 cdn，提升 deps 加载速度
  if (import.meta.env.VITE_NODE_ENV === 'development')
    return devDepsProxy[pkg];

  if (pkg === '@ant-design/icons-vue')
    return path;

  switch (cdn.value) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}@${version}${path}`;
    case 'jsdelivr-fastly':
      return `https://fastly.jsdelivr.net/npm/${pkg}@${version}${path}`;
    case 'unpkg':
      return `https://unpkg.com/${pkg}@${version}${path}`;
  }
}

export function genCompilerSfcLink(version: string) {
  return genCdnLink(
    '@vue/compiler-sfc',
    version,
    '/dist/compiler-sfc.esm-browser.js',
  );
}

export function genImportMap(versions: Versions): ImportMap {
  const deps: Record<string, Dependency> = {
    'vue': {
      pkg: '@vue/runtime-dom',
      version: versions.vue,
      path: '/dist/runtime-dom.esm-browser.prod.js',
    },
    '@vue/shared': {
      pkg: '@vue/shared',
      version: versions.vue,
      path: '/dist/shared.esm-bundler.js',
    },
    'ant-design-vue': {
      pkg: 'ant-design-vue',
      version: versions.antDesignVue,
      path: '/dist/antd.esm.min.js',
      // 不能从 antd.js 或 antd.min.js 引入，会报错误：The requested module 'ant-design-vue' does not provide an export named 'default'
      // path: '/dist/antd.min.js',
    },
    // TODO: 暂时未找到 cdn 引入 @ant-design/icons-vue 图标库的 es 模块的方法
    // 相关 issues：https://github.com/ant-design/ant-design-icons/issues/680
    // '@ant-design/icons-vue': {
    //   pkg: '@ant-design/icons-vue',
    //   version: 'latest',
    //   path: '/es/index.js',
    // },
    // 临时解决方案：https://github.com/behappyok/ant-design-icons-vue-umd
    '@ant-design/icons-vue': {
      pkg: '@ant-design/icons-vue',
      version: 'latest',
      path: './ant-design-icons-vue.es.js',
    },
  };

  return {
    imports: Object.fromEntries(
      Object.entries(deps).map(([key, dep]) => [
        key,
        genCdnLink(dep.pkg, dep.version, dep.path),
      ]),
    ),
  };
}

export function genAntdvStyleLink(version: string) {
  return genCdnLink(
    'ant-design-vue',
    version,
    Number(version[0]) > 3 ? '/dist/reset.css' : '/dist/antd.css',
  );
}

export function getVersions(pkg: MaybeRef<string>) {
  const url = computed(
    () => `https://data.jsdelivr.com/v1/package/npm/${unref(pkg)}`,
  );
  return useFetch(url, {
    initialData: [],
    afterFetch: (ctx) => {
      ctx.data = ctx.data.versions;
      return ctx;
    },
    refetch: true,
  }).json<string[]>().data as Ref<string[]>;
}

export function getSupportedVueVersions() {
  const versions = getVersions('vue');
  return computed(() =>
    versions.value.filter(version => !/alpha|rc|beta/.test(version) && gte(version, '3.0.0')),
  );
}

export function getSupportedTSVersions() {
  const versions = getVersions('typescript');
  return computed(() =>
    versions.value.filter(
      version => !/alpha|rc|beta|dev/.test(version) && !version.includes('insiders') && gte(version, '3.2.0'),
    ),
  );
}

export function getSupportedAntdVersions() {
  const versions = getVersions('ant-design-vue');
  return computed(() => {
    // 3.3.0 之前的 antdv 版本无 antd.esm.js 的产物，即无 ES 模块版本，需要过滤
    return versions.value.filter(version => version === '3.3.0-beta.4' || (!/alpha|rc|beta/.test(version) && gte(version, '4.0.0')));
  });
}
