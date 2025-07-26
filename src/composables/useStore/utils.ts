import type { SerializeState } from './types';
import type { Versions } from '@/utils/dependency';
import { File } from '@vue/repl';
import { objectOmit } from '@vueuse/core';
import antDesignVueCode from '@/template/ant-design-vue.js?raw';
import tsconfigCode from '@/template/tsconfig.json?raw';
import welcomeCode from '@/template/welcome.vue?raw';
import { genAntdvStyleLink } from '@/utils/dependency';
import { atou } from '@/utils/encode';
import { ANTDV_FILE, APP_FILE, IMPORT_MAP, LEGACY_IMPORT_MAP, TSCONFIG } from './constants';

export function deserialize(text: string): SerializeState {
  const state = JSON.parse(atou(text));
  return state;
}

export function generateAntDesignVueCode(version: string) {
  const style = genAntdvStyleLink(version);
  return antDesignVueCode.replace('#STYLE#', style);
}

export function initFiles(versions: Versions, saved?: SerializeState) {
  const files: Record<string, File> = Object.create(null);
  if (saved) {
    for (let [filename, file] of Object.entries(objectOmit(saved, ['_o']))) {
      if (
        ![IMPORT_MAP, TSCONFIG].includes(filename)
        && !filename.startsWith('src/')
      ) {
        filename = `src/${filename}`;
      }
      if (filename === LEGACY_IMPORT_MAP) {
        filename = IMPORT_MAP;
      }
      files[filename] = new File(filename, file as string);
    }
  }
  else {
    files[APP_FILE] = new File(APP_FILE, welcomeCode);
  }
  if (!files[ANTDV_FILE]) {
    files[ANTDV_FILE] = new File(
      ANTDV_FILE,
      generateAntDesignVueCode(versions.antDesignVue),
    );
  }
  if (!files[TSCONFIG]) {
    files[TSCONFIG] = new File(TSCONFIG, tsconfigCode);
  }
  return files;
}
