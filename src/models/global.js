import modelEnhance from '@/utils/modelEnhance';
import glob from 'glob';
import { remote } from 'electron';
import { readFileSync, readdirSync } from 'fs-extra';
import { join, sep } from 'path';
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
      ? config.getItem('projects').filter(item => item.active)[0]
      : null
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
      const routes = getRoutes(directoryPath);
      const mocks = getMocks(directoryPath);

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

const getRoutes = directoryPath => {
  const routes = [];

  glob
    .sync('src/**/routes/**/components', {
      cwd: directoryPath,
      ignore: 'node_modules/**',
      dot: true
    })
    .forEach(source => {
      const route = join(source, `..${sep}index.js`);
      const model = join(source, `..${sep}model${sep}index.js`);
      const { link, title } = getModelInfo(join(directoryPath, route));
      const ns = getNS(join(directoryPath, model));
      const name = getRouteName(route);
      if (link) {
        routes.push({
          name,
          title,
          link,
          namespace: ns,
          path: route
        });
      }
    });
  return routes;
};

const getMocks = directoryPath => {
  const mocks = [];

  const mockPath = join(directoryPath, 'src', '__mocks__');
  const files = readdirSync(mockPath);
  files
    .filter(item => item !== 'index.js')
    .forEach((item, index) => {
      mocks.push({
        name: item,
        path: join(mockPath, item)
      });
    });

  return mocks;
};

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
    return path.split(sep).reverse()[1];
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
