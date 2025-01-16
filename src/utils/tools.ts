import { message } from 'ant-design-vue';

/**
 * 复制文本到剪贴板
 */
export function copy(text: string, prompt: string | null = '已成功复制到剪切板!') {
  if (navigator.clipboard) {
    return navigator.clipboard
      .writeText(text)
      .then(() => {
        prompt && message.success(prompt);
      })
      .catch((error) => {
        message.error(`复制失败!${error.message}`);
        return error;
      });
  }
  if (Reflect.has(document, 'execCommand')) {
    return new Promise<void>((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.width = '0';
        textArea.style.position = 'fixed';
        textArea.style.left = '-999px';
        textArea.style.top = '10px';
        textArea.setAttribute('readonly', 'readonly');
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        prompt && message.success(prompt);
        resolve();
      }
      catch (error: any) {
        message.error(`复制失败!${error.message}`);
        reject(error);
      }
    });
  }
  return Promise.reject(new Error(`"navigator.clipboard" 或 "document.execCommand" 中存在API错误, 拷贝失败!`));
}
