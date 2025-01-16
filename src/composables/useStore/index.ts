import type { Initial, SerializeState } from './types';
import mainCode from '@/template/main.vue?raw';
import { genImportMap, type Versions } from '@/utils/dependency';
import { compileFile, type ImportMap, mergeImportMap, type StoreState, useStore as useReplStore } from '@vue/repl';
import { useDebounceFn } from '@vueuse/core';
import { computed, reactive, toRefs, watch, watchEffect } from 'vue';
import { useUserOptions } from './composables/useUserOptions';
import { useVersion } from './composables/useVersion';
import { ANTDV_FILE, APP_FILE, IMPORT_MAP, MAIN_FILE, TSCONFIG } from './constants';
import { deserialize, generateAntDesignVueCode, initFiles } from './utils';

export function useStore(initial: Initial) {
  const saved: SerializeState | undefined = initial.serializedState
    ? deserialize(initial.serializedState)
    : undefined;

  const versions = reactive<Versions>({
    vue: '3.3.13',
    antDesignVue: '3.3.0-beta.4',
    typescript: '5.0.2',
  });

  // const { vueVersion, importMap } = useVueImportMap();
  // const store = useReplStore(
  //   {
  //     builtinImportMap: importMap,
  //     vueVersion,
  //   },
  //   location.hash,
  // );
  const builtinImportMap = computed<ImportMap>(() => genImportMap(versions));
  console.log(`builtinImportMap -->`, builtinImportMap.value);

  const storeState: Partial<StoreState> = toRefs(
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
  );

  console.log(`storeState -->`, storeState);
  const store = useReplStore(storeState);

  const { serialize } = useUserOptions(store);
  useVersion({
    initial,
    store,
    versions,
  });

  // function initFiles() {
  //   const files: Record<string, File> = Object.create(null);
  //   if (saved) {
  //     for (let [filename, file] of Object.entries(objectOmit(saved, ['_o']))) {
  //       if (
  //         ![IMPORT_MAP, TSCONFIG].includes(filename)
  //         && !filename.startsWith('src/')
  //       ) {
  //         filename = `src/${filename}`;
  //       }
  //       if (filename === LEGACY_IMPORT_MAP) {
  //         filename = IMPORT_MAP;
  //       }
  //       files[filename] = new File(filename, file as string);
  //     }
  //   }
  //   else {
  //     files[APP_FILE] = new File(APP_FILE, welcomeCode);
  //   }
  //   if (!files[ANTDV_FILE]) {
  //     files[ANTDV_FILE] = new File(
  //       ANTDV_FILE,
  //       generateAntDesignVueCode(versions.antDesignVue),
  //     );
  //   }
  //   if (!files[TSCONFIG]) {
  //     files[TSCONFIG] = new File(TSCONFIG, tsconfigCode);
  //   }
  //   return files;
  // }

  function init() {
    watchEffect(() => {
      compileFile(store, store.activeFile).then(errs => (store.errors = errs));
    });
    for (const [filename, file] of Object.entries(store.files)) {
      if (filename === store.activeFilename)
        continue;
      compileFile(store, file).then(errs => store.errors.push(...errs));
    }

    watch(
      () => [
        store.files[TSCONFIG]?.code,
        store.typescriptVersion,
        store.locale,
        store.dependencyVersion,
        store.vueVersion,
      ],
      useDebounceFn(() => store.reloadLanguageTools?.(), 300),
      { deep: true },
    );
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
  };
  Object.assign(store, utils);

  return store as typeof store & typeof utils;
}
