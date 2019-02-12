import $$ from 'cmn-utils';
import { join } from 'path';
import { readFileSync, existsSync, removeSync, writeFileSync } from 'fs-extra';
import { routerRedux } from 'dva/router';
import * as acorn from 'acorn';
import jsx from 'acorn-jsx';
import * as walk from 'acorn-walk';
import { message } from 'antd';
import escodegen from 'escodegen';

let comments = [];
let tokens = [];
export default {
  namespace: 'route',

  state: {
    columnsData: [],
    deleted: false
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const link = $$.getQueryValue('link');
        if (pathname.indexOf('/route') !== -1 && link) {
          comments = []; // 清空
          tokens = []; // 清空
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
      if (!route) return;
      const columnAbsPath = join(
        currentProject.directoryPath,
        route.path,
        '..',
        'components',
        'columns.js'
      );

      const columnsData = getColumnsData(columnAbsPath);
      yield put({
        type: 'changeStatus',
        payload: {
          columnsData: existsSync(columnAbsPath) ? columnsData : false
        }
      });
    },
    *delete({ payload }, { call, put, select }) {
      const { route } = payload;
      const global = yield select(state => state.global);
      const { currentProject } = global;
      // 1. delete file
      const routePath = join(currentProject.directoryPath, route.path, '..');
      removeSync(routePath);
      // 2. update routes config
      const rootRoutePath = join(
        currentProject.directoryPath,
        'src',
        'routes',
        'index.js'
      );
      const rootRouteConfig = updateRouteConfig(route, rootRoutePath);
      writeFileSync(rootRoutePath, rootRouteConfig);

      yield put({
        type: 'global/setProjects',
        payload: { projectInfo: currentProject }
      });

      yield put(routerRedux.push('/home'));

      message.success('删除成功');
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
                if (item.value.type === 'Literal') {
                  // 解析 title name 普通节点
                  data[item.key.name] = item.value.value;
                } else if (item.value.type === 'ObjectExpression') {
                  // 解析 formItem tableItem 对像类型
                  const objProperty = item.value.properties;
                  if (objProperty.length) {
                    // 如果有其它属性,如type等
                    const types = objProperty.filter(
                      prop => prop.key.name === 'type'
                    );
                    data[item.key.name] = types.length
                      ? types[0].value.value
                      : {};
                  } else {
                    data[item.key.name] = {};
                  }
                } else {
                  // 不处理其它类型
                }
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

// 从总路由中删除指定路由
function updateRouteConfig(route, rootRoutePath) {
  const pathReg = /src\\routes(.*)\\index.js/;
  const result = pathReg.exec(route.path);
  let source = '';
  if (result && result.length === 2) {
    source = '.' + result[1].replace(/\\/g, '/');
  }

  const file = readFileSync(rootRoutePath).toString();
  const ast = acorn.Parser.extend(jsx()).parse(file, {
    ranges: true,
    onComment: comments,
    onToken: tokens,
    sourceType: 'module',
    plugins: {
      stage3: true,
      jsx: true
    }
  });
  try {
    escodegen.attachComments(ast, comments, tokens);
    walk.simple(ast, {
      Program(node) {
        for (let i = 0; i < node.body.length; i++) {
          if (
            node.body[i].type === 'ImportDeclaration' &&
            node.body[i].source.value === source
          ) {
            node.body.splice(i, 1);
            break;
          }
        }
      },
      ObjectExpression(node) {
        if (node.properties.length) {
          const childRoutesNodes = node.properties.filter(
            item => item.key.name === 'childRoutes'
          );
          if (childRoutesNodes.length) {
            // 如果有childRoutes
            const childRoutes = childRoutesNodes[0];
            const routes = childRoutes.value.elements;
            for (let i = 0; i < routes.length; i++) {
              if (
                routes[i].type === 'CallExpression' &&
                routes[i].callee.name === route.name
              ) {
                routes.splice(i, 1);
                break;
              }
            }
          } else {
            // 如果没有childRoutes
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
  return escodegen.generate(ast, {
    format: {
      indent: {
        style: '  ',
        base: 0,
        adjustMultilineComment: true
      },
      semicolons: false
    },
    comment: true
  });
}
