
import { join } from 'path';
import { homedir } from 'os';

export const APP_PATH = join(process.cwd(), 'app');
export const NODE_PATH = join(APP_PATH, 'nodes');

export const HOME_PATH = join(homedir(), '.dva-boot-destop');
export const TEMPLATES_DIR = join(HOME_PATH, 'template');
export const INSTALL_DIR = join(HOME_PATH, 'installation');
