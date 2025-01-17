import type { ImportMap } from '@vue/repl';
import type { Dependency, VersionKey, Versions } from './types';

export * from './types';

// 可以改为公司的 cdn 路径，公共的加载比较慢
export function genCdnLink(pkg: string, version: string, path: string) {
  // 慢的话手动替换一下
  // TODO: 改为界面 select 选择，类似于element plus playground
  // return `https://cdn.jsdelivr.net/npm/${pkg}@${version}${path}`;
  return `https://unpkg.com/${pkg}@${version}${path}`;
  return `https://fastly.jsdelivr.net/npm/${pkg}${version}${path}`;
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
    // TODO: 由于引入 antdv 的图标，会全部导入进来，导致加载很慢，暂时注释
    // '@ant-design/icons-vue': {
    //   pkg: '@ant-design/icons-vue',
    //   version: 'latest',
    //   path: '/es/index.js',
    // },
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

export function getPkgVersionsOptions() {
  // 由于不需要这么多的版本选择，所以直接写死（可根据公司相关项目进行调整）
  const pkgVersions: Record<VersionKey, { label: string; value: string }[]> = {
    antDesignVue: [
      { label: '3.3.0-beta.4（admin_vue）', value: '3.3.0-beta.4' },
      { label: '4.2.0（组件库）', value: '4.2.0' },
      { label: 'latest', value: 'latest' },
    ],
    vue: [
      { label: '3.3.13（admin_vue）', value: '3.3.13' },
      { label: '3.4.0（组件库）', value: '3.4.0' },
      { label: 'latest', value: 'latest' },
    ],
    typescript: [
      { label: '5.0.2（admin_vue）', value: '5.0.2' },
      { label: '5.1.0（组件库）', value: '5.1.0' },
      { label: 'latest', value: 'latest' },
    ],
  };
  return Object.fromEntries(
    Object.entries(pkgVersions).map(([key, options]) => [
      key,
      options,
    ]),
  );
}
