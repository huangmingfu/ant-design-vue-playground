import type { ImportMap } from '@vue/repl';
import type { Initial, SerializeState } from './types';
import type { Versions } from '@/utils/dependency';
import { compileFile, mergeImportMap, useStore as useReplStore } from '@vue/repl';
import { computed, reactive, toRefs, watch, watchEffect } from 'vue';
import mainCode from '@/template/main.vue?raw';
import { genImportMap } from '@/utils/dependency';
import { useUserOptions } from './composables/useUserOptions';
import { useVersion } from './composables/useVersion';
import { ANTDV_FILE, APP_FILE, IMPORT_MAP, MAIN_FILE } from './constants';
import { deserialize, generateAntDesignVueCode, initFiles } from './utils';

export function useStore(initial: Initial) {
  const saved: SerializeState | undefined = initial.serializedState
    ? deserialize(initial.serializedState)
    : undefined;

  const versions = reactive<Versions>({
    vue: saved?._o?.vueVersion ?? 'latest',
    antDesignVue: saved?._o?.antdvVersion ?? 'latest',
    typescript: saved?._o?.tsVersion ?? 'latest',
  });

  const builtinImportMap = computed<ImportMap>(() => genImportMap(versions));

  const store = useReplStore(toRefs(
    reactive({
      files: initFiles(versions, saved),
      mainFile: MAIN_FILE,
      activeFilename: APP_FILE,
      vueVersion: computed(() => versions.vue),
      typescriptVersion: versions.typescript,
      builtinImportMap,
      template: {
        welcomeSFC: mainCode,
      },
      sfcOptions: {
        script: {
          propsDestructure: true,
        },
      },
    }),
  ));

  const { serialize, hideFile, userOptions } = useUserOptions(store, saved);
  store.files[ANTDV_FILE] && (store.files[ANTDV_FILE].hidden = hideFile);
  store.files[MAIN_FILE] && (store.files[MAIN_FILE].hidden = hideFile);

  const { setVersion } = useVersion({
    userOptions,
    initial,
    store,
    versions,
  });

  function init() {
    watchEffect(() => {
      compileFile(store, store.activeFile).then(errs => (store.errors = errs));
    });
    for (const [filename, file] of Object.entries(store.files)) {
      if (filename === store.activeFilename)
        continue;
      compileFile(store, file).then(errs => store.errors.push(...errs));
    }
  }

  watch(
    () => versions.antDesignVue,
    (version) => {
      store.files[ANTDV_FILE].code = generateAntDesignVueCode(version).trim();
      compileFile(store, store.files[ANTDV_FILE]).then(
        errs => (store.errors = errs),
      );
    },
  );

  watch(
    builtinImportMap,
    (newBuiltinImportMap) => {
      const importMap = JSON.parse(store.files[IMPORT_MAP].code);
      store.files[IMPORT_MAP].code = JSON.stringify(
        mergeImportMap(importMap, newBuiltinImportMap),
        undefined,
        2,
      );
    },
    { deep: true },
  );

  const utils = {
    versions,
    serialize,
    init,
    setVersion,
  };
  Object.assign(store, utils);

  return store as typeof store & typeof utils;
}

export type Store = ReturnType<typeof useStore>;
