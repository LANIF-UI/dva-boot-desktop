const { exec } = require('child_process');
const { YARN_PATH } = require('../paths');
const env = require('../env');

// 安装依赖，提供日志， 安装所有依赖
exports.installPackage = function({ root, registry, sender }) {
  return new Promise((resolve) => {
    try {
      let log = '';

      const term = exec(YARN_PATH + ' install', {
        silent: true,
        cwd: root,
        env: env,
        detached: true
      });
      term.stdout.on('data', data => {
        log += data.toString();
        console.log(log)
        // mainWin.send(`${sender}-logging`, log);
      });
      term.stderr.on('data', data => {
        log += data.toString();
        console.log(log)
        // mainWin.send(`${sender}-failed`, log);
      });

      term.on('exit', (code) => {
        resolve({ status: code !== 0 });
      });
    } catch (e) {
      console.log(e)
      resolve({ status: false });
    }
  });
}