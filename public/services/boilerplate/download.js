const download = require('download');
const { join, dirname } = require('path');
const { TEMPLATES_DIR } = require('../paths');
const { renameSync } = require('fs-extra');

async function downloadDBA() {
  const ZIP_URL =
    'https://github.com/LANIF-UI/dva-boot-admin/archive/master.zip';

  return download(ZIP_URL, TEMPLATES_DIR, {
    extract: true
  }).then(files => {
    const dir = dirname(files[1].path)
    renameSync(join(TEMPLATES_DIR, dir), join(TEMPLATES_DIR, 'dva-boot-admin'));
  });
}
exports.downloadDBA = downloadDBA;
