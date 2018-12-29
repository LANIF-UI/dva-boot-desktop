import $$ from 'cmn-utils';
import { join } from 'path';
import { writeJsonSync, readJsonSync, existsSync } from 'fs-extra';

export default {
  namespace: 'route',

  state: {
    columnsData: []
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const link = $$.getQueryValue('link');
        if (pathname.indexOf('/route') !== -1 && link) {
          dispatch({
            type: 'parseRoute',
            payload: {
              link
            }
          });
        }
      });
    }
  },

  effects: {
    // 从指定路由里分析出columns
    *parseRoute({ payload }, { call, put, select }) {
      const { link } = payload;
      const global = yield select(state => state.global);
      const { currentProject } = global;
      // 解析出column
      const route = currentProject.routes.filter(item => item.link === link)[0];
      const columnAbsPath = join(
        currentProject.directoryPath,
        route.path,
        '../',
        'components',
        'columns.js'
      );
      const columnsData = getColumnsData(columnAbsPath);
      console.log(columnsData)
      yield put({
        type: 'changeStatus',
        payload: {
          columnsData
        }
      })
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

function getColumnsData(path) {
  if (existsSync(path)) {
    const jsonData = readJsonSync(path);
    return jsonData;
  }
  return [];
}
