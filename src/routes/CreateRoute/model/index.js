import { join } from 'path';
import { copySync, existsSync } from 'fs-extra';

export default {
  namespace: 'createRoute',

  state: {
    loading: false,
  },

  effects: {
    *checkExist() {

    },
    *newRoute({ payload }, { call, put, select }) {
      const { name, title, namespace, route, template } = payload;
      const global = yield select(state => state.global);
      const { currentProject } = global;
      const target = join(currentProject.directoryPath, 'src', 'routes', name);
      yield put({
        type: 'changeStatus',
        payload: {
          loading: true
        }
      });
      // 1.copy template
      // copySync(projectPath, target);
      // 2.update route

      // 3.update components

      // 4.update model

      yield put({
        type: 'changeStatus',
        payload: {
          loading: false
        }
      });
    },
    *create() {
      
    }
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
