import $$ from 'cmn-utils';
import modelEnhance from '@/utils/modelEnhance';
import glob from 'glob';
import { remote } from 'electron';
import { readFileSync, existsSync } from 'fs-extra';
const { join, sep } = require('path');
const config = remote.getGlobal('config');

export default modelEnhance({
  namespace: 'global',

  state: {
    /**
     * 当前项目下的工程
     * [
     *   {
     *      name: '// 工程名',
     *      routes: [ { name: '', path: '' } ],
     *      mocks: [ { name: '', path: '' } ],
     *      config: { proxy: ... },
     *   }
     * ]
     */
    projects: []
  },

  effects: {},

  reducers: {
    setProjects(state, { payload }) {
      const { projects } = state;
      const { projectInfo } = payload;
      const { name, directoryPath } = projectInfo;
      const proj = projects.filter(item => item.name !== name);
      const routes = [];
      const mocks = [];

      glob
        .sync('**/routes/**/components', {
          cwd: directoryPath,
          dot: true
        })
        .forEach(source => {
          const route = join(source, `..${sep}index.js`);
          const model = join(source, `..${sep}model${sep}index.js`);
          const { link, title } = getModelInfo(join(directoryPath, route));
          const ns = getNS(join(directoryPath, model));
          const name = getRouteName(source);
          routes.push({
            name,
            title,
            link,
            namespace: ns,
            path: route
          });
        });

      proj.push({
        name,
        mocks,
        routes,
        directoryPath
      });
      config.setItem('projects', proj);
      return {
        ...state,
        projects: proj
      };
    }
  }
});

const getModelInfo = path => {
  try {
    const modelStr = readFileSync(path);
    const modelStrNoBr = modelStr.toString().replace(/\r?\n/g, '');
    const matchPath = modelStrNoBr.match(/path:\s*['|"](.*?)['|"]/)[1];
    const matchTitle = modelStrNoBr.match(/title:\s*['|"](.*?)['|"]/)[1];

    return { link: matchPath, title: matchTitle };
  } catch (e) {
    return {};
  }
};

const getRouteName = path => {
  try {
    return path.split(sep).reverse()[0];
  } catch (e) {
    return '';
  }
};

const getNS = path => {
  try {
    const modelStr = readFileSync(path);
    const modelStrNoBr = modelStr.toString().replace(/\r?\n/g, '');
    const namespace = modelStrNoBr.match(/namespace:\s*['|"](.*?)['|"]/)[1];

    return namespace;
  } catch (e) {
    return '';
  }
}
