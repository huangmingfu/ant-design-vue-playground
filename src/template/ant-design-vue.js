import * as Antd from 'ant-design-vue';
import { getCurrentInstance } from 'vue';
import * as AntDesignIconsVue from "@ant-design/icons-vue";

let installed = false;

await loadStyle();

export function setupAntDesignVue() {
  if (installed)
    return;
  const instance = getCurrentInstance();
  const app = instance.appContext.app;
  app.use(Antd);
  Object.entries(AntDesignIconsVue).forEach(([name, comp]) => {
    app.component(name, comp);
  });
  installed = true;
}

export function loadStyle() {
  const styles = ['#STYLE#'].map((style) => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = style;
      link.addEventListener('load', resolve);
      link.addEventListener('error', reject);
      document.body.append(link);
    });
  });
  return Promise.allSettled(styles);
}
