import { remote } from 'electron';
import { readFileSync, writeFileSync } from 'fs-extra';
import { render } from 'ejs';

export function openDirectory() {
  try {
    const openDirectory = remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    return openDirectory[0];
  } catch (e) {
    console.log(e.message);
  }
}

export const writeToFile = (source, target, data) => {
  try {
    const tpl = readFileSync(source);
    let content;
    try {
      content = render(tpl.toString(), data);
    } catch (e) {
      content = tpl;
    }
    writeFileSync(target, content);
  } catch (e) {
    console.error(e);
  }
};
