const { join } = require('path');
const { homedir } = require('os');

const APP_PATH = exports.APP_PATH = process.cwd();
exports.NODE_PATH = join(APP_PATH, 'nodes');

const HOME_PATH = exports.HOME_PATH = join(homedir(), '.dva-boot-destop');
exports.TEMPLATES_DIR = join(HOME_PATH, 'template');
exports.INSTALL_DIR = join(HOME_PATH, 'installation');

exports.YARN_BIN_PATH = join(APP_PATH, 'node_modules', '.bin');
exports.YARN_PATH = join(APP_PATH, 'node_modules', 'yarn', 'bin', 'yarn');