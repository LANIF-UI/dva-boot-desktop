import $$ from 'cmn-utils';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs-extra';
var acorn = require("acorn");
var jsx = require("acorn-jsx");

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
      console.log(columnsData);
      yield put({
        type: 'changeStatus',
        payload: {
          columnsData
        }
      });
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
    const file = readFileSync(path).toString();
    const ast = acorn.Parser.extend(jsx()).parse(file, {
      sourceType: 'module',
    });
    console.log(ast);
    return [];
  }
  return [];
}
