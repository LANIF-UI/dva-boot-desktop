const { join } = require('path');
const {
  readFileSync,
  writeFileSync,
  writeJsonSync,
  readJsonSync
} = require('fs-extra');
const { render } = require('ejs');

// 往package.json里写入内容
const writePackage = function(path, data) {
  const pkgPath = join(path, 'package.json');
  const pkgData = readJsonSync(pkgPath);
  const newPkgData = { ...pkgData, ...data };
  return writeJsonSync(pkgPath, newPkgData, { spaces: 2 });
};

const writeToFile = function(source, target, data) {
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

// 从package.json里读内容
const readPackage = function(path) {
  const pkgPath = join(path, 'package.json');
  return readJsonSync(pkgPath);
};

// 往component里写内容
const writeComponent = function(source, target, data) {
  writeToFile(source, target, data)
};

// 往route里写内容
const writeRoute = function(source, target, data) {
  writeToFile(source, target, data)
};

// 往model里写内容
const writeModel = function(source, target, data) {
  writeToFile(source, target, data)
};

exports.writeComponent = writeComponent;
exports.writeRoute = writeRoute;
exports.writeModel = writeModel;
exports.writePackage = writePackage;
exports.readPackage = readPackage;
