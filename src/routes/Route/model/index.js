import $$ from 'cmn-utils';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs-extra';
import * as acorn from 'acorn';
import jsx from 'acorn-jsx';
import * as walk from 'acorn-walk';

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
      plugins: {
        stage3: true,
        jsx: true
      }
    });
    // column table search form
    const columnData = [];
    try {
      walk.simple(ast, {
        ObjectExpression(node) {
          const data = {};
          if (node.properties.length) {
            const properties = node.properties.filter(
              item =>
                item.key.name === 'title' ||
                item.key.name === 'name' ||
                item.key.name === 'tableItem' ||
                item.key.name === 'searchItem' ||
                item.key.name === 'formItem'
            );
            if (properties.length) {
              properties.forEach(item => {
                data[item.key.name] = item.value.value;
              });
              columnData.push(data);
            }
          }
        }
      });
    } catch (e) {}
    return columnData;
  }
  return [];
}
