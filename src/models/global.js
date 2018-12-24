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
     *      name: '',             // 工程名
     *      active: true | false, // 是否是当前打开的工程
     *      routes: [ { name: '', path: '' } ],
     *      mocks: [ { name: '', path: '' } ],
     *      config: { proxy: ... },
     *   }
     * ]
     */
    projects: config.getItem('projects') || [],
    currentProject: config.getItem('projects')
      ? config.getItem('projects').filter(item => item.active)
      : []
  },

  effects: {},

  reducers: {
    setProjects(state, { payload }) {
      const { projects } = state;
      const { projectInfo } = payload;
      const { name, directoryPath } = projectInfo;
      const projs = projects
        .map(item => {
          item.active = false; // 关闭之前打开的工程
          return item;
        })
        .filter(item => item.name !== name);
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
          if (route) {
            routes.push({
              name,
              title,
              link,
              namespace: ns,
              path: route
            });
          }
        });

      const proj = {
        name,
        active: true,
        mocks,
        routes,
        directoryPath
      };

      projs.push(proj);
      config.setItem('projects', projs);
      return {
        ...state,
        projects: projs,
        currentProject: proj
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
};
