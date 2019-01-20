import { join } from 'path';
import { copySync } from 'fs-extra';
import { writeToFile } from 'utils/common';
import { message } from 'antd';

export default {
  namespace: 'createRoute',

  state: {
    loading: false
  },

  effects: {
    *newRoute({ payload }, { call, put, select }) {
      const { name, title, namespace, route, template } = payload;
      const global = yield select(state => state.global);
      const { currentProject } = global;
      const targetDirectory = join(
        currentProject.directoryPath,
        'src',
        'routes',
        name
      );
      const sourceDirectory = join(
        currentProject.directoryPath,
        'templates',
        'routes',
        template
      );
      yield put({
        type: 'changeStatus',
        payload: {
          loading: true
        }
      });
      // 0.copy template
      copySync(sourceDirectory, targetDirectory);
      // 1.create route
      const routeFile = join(targetDirectory, 'index.js');
      writeToFile(routeFile, routeFile, payload);
      // 2.create components
      const componentFile = join(targetDirectory, 'components', 'index.js');
      writeToFile(componentFile, componentFile, payload);
      // 3.create style
      const styleFile = join(targetDirectory, 'components', 'index.less');
      writeToFile(styleFile, styleFile, payload);
      // 4.create model
      const modelFile = join(targetDirectory, 'model', 'index.js');
      writeToFile(modelFile, modelFile, payload);
      // 5.update routes config

      // 6.update project
      yield put({
        type: 'global/setProjects',
        payload: { projectInfo: currentProject }
      });

      yield put({
        type: 'changeStatus',
        payload: {
          loading: false
        }
      });

      message.success('路由创建成功');
    },
    *create() {}
  },

  reducers: {
    changeStatus(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
