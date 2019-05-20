import { remote } from 'electron';
import {
  existsSync,
  readFileSync,
  writeFileSync
} from 'fs-extra';
import { render } from 'ejs';
import { join } from 'path';

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
  const tpl = readFileSync(source);
  let content;
  try {
    content = render(tpl.toString(), data);
  } catch (e) {
    content = tpl;
  }
  writeFileSync(target, content);
};

/**
 * 检查工程是否有效，是否是dva-boot-*项目
 */
export const isNormalProject = directoryPath => {
  if (directoryPath) {
    const pkgPath = join(directoryPath, 'package.json');
    if (existsSync(pkgPath)) {
      return true;
    } else {
      return false;
    }
  }
};
