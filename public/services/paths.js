const { join } = require('path');
const { homedir } = require('os');

const APP_PATH = exports.APP_PATH = join(process.cwd(), 'app');
exports.NODE_PATH = join(APP_PATH, 'nodes');

const HOME_PATH = exports.HOME_PATH = join(homedir(), '.dva-boot-destop');
exports.TEMPLATES_DIR = join(HOME_PATH, 'template');
exports.INSTALL_DIR = join(HOME_PATH, 'installation');