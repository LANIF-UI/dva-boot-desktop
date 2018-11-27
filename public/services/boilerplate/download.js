const download = require('download');
const { join, dirname } = require('path');
const { TEMPLATES_DIR } = require('../paths');
const { renameSync, removeSync, existsSync } = require('fs-extra');

const boilerplates = {
  'dva-boot-admin': {
    name: 'dva-boot-admin',
    url: 'https://github.com/LANIF-UI/dva-boot-admin/archive/master.zip'
  },
  'dva-boot-mobile': {
    name: 'dva-boot-mobile',
    url: 'https://github.com/LANIF-UI/dva-boot-mobile/archive/master.zip'
  },
  'dva-boot': {
    name: 'dva-boot',
    url: 'https://github.com/LANIF-UI/dva-boot/archive/master.zip'
  }
}

async function downloadDBA(template) {
  const { url, name } = boilerplates[template];
  
  return download(url, TEMPLATES_DIR, {
    extract: true
  }).then(files => {
    const dir = dirname(files[1].path);
    const tempPath = join(TEMPLATES_DIR, dir);
    const projectPath = join(TEMPLATES_DIR, name);
    if (existsSync(projectPath)) {
      removeSync(projectPath);
    }
    renameSync(tempPath, projectPath);
    return projectPath;
  });
}
exports.downloadDBA = downloadDBA;
