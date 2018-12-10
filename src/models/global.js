import $$ from 'cmn-utils';
import modelEnhance from '@/utils/modelEnhance';
import glob from 'glob';
import { remote } from 'electron';
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
      console.log(directoryPath);
      glob
        .sync('**/routes/**/components', {
          cwd: directoryPath,
          dot: true
        })
        .forEach(source => {
          routes.push(source);
          console.log(source)
        });
      proj.concat({
        name,
        routes,
        mocks
      });
      config.setItem('projects', proj);
      return {
        ...state,
        projects: proj
      };
    }
  }
});
