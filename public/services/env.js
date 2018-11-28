/*
	环境变量
*/
const fixPath = require('fix-path');
const npmRunPath = require('npm-run-path');
const { delimiter } = require('path');
const { NODE_PATH, YARN_BIN_PATH } = require('./paths');
const is = require('electron-is');

// 修复electron的process.env.PATH 缺失路径的文静
fixPath();

const npmEnv = npmRunPath.env();
const pathEnv = [process.env.Path, npmEnv.PATH, NODE_PATH, YARN_BIN_PATH]
  .filter(p => !!p)
  .join(delimiter);
const env = { ...npmEnv, FORCE_COLOR: 1 };

if (is.windows()) {
  env.Path = pathEnv;
} else {
  env.PATH = `${pathEnv}:/usr/local/bin`;
}

exports.default = env;
