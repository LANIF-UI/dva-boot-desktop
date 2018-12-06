const { join } = require('path');
const { writeJsonSync, readJsonSync } = require('fs-extra');

// 往package.json里写入内容
const writePackage = function(path, data) {
  const pkgPath = join(path, 'package.json');
  const pkgData = readJsonSync(pkgPath);
  const newPkgData = { ...pkgData, ...data };
  return writeJsonSync(pkgPath, newPkgData, { spaces: 2 });
};

// 从package.json里读内容
const readPackage = function(path) {
  return readJsonSync(path);
}

exports.writePackage = writePackage;
exports.readPackage = readPackage;