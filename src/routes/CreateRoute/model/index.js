import { join } from 'path';
import {
  copySync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync
} from 'fs-extra';
import { routerRedux } from 'dva/router';
import { writeToFile } from 'utils/common';
import { message } from 'antd';
import * as acorn from 'acorn';
import jsx from 'acorn-jsx';
import * as walk from 'acorn-walk';
import escodegen from 'escodegen';

let comments = [];
let tokens = [];
export default {
  namespace: 'createRoute',

  state: {
    loading: false,
    templates: [],
    parentRoutes: [],
    routeAST: null
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        comments = []; // 清空
        tokens = []; // 清空
        if (pathname === '/createRoute') {
          dispatch({
            type: 'getRouteTemplates'
          });
          dispatch({
            type: 'getParentRoutes'
          });
        }
      });
    }
  },

  effects: {
    *getParentRoutes({ payload }, { call, put, select }) {
      const global = yield select(state => state.global);
      const { currentProject } = global;
      // 解析出column
      const rootRoute = join(
        currentProject.directoryPath,
        'src',
        'routes',
        'index.js'
      );
      const file = readFileSync(rootRoute).toString();
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

      const parentRoutes = [];
      try {
        walk.simple(ast, {
          ObjectExpression(node) {
            const data = {};
            if (node.properties.length) {
              const properties = node.properties.filter(
                item => item.key.name === 'path' || item.key.name === 'title'
              );

              if (properties.length) {
                properties.forEach(item => {
                  if (item.value.type === 'Literal') {
                    // 解析 title name 普通节点
                    data[item.key.name] = item.value.value;
                  }
                });
                parentRoutes.push(data);
              }
            }
          }
        });

        yield put({
          type: 'changeStatus',
          payload: {
            parentRoutes,
            routeAST: ast
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    *getRouteTemplates({ payload }, { call, put, select }) {
      const global = yield select(state => state.global);
      const { currentProject } = global;
      const templatesDirectory = join(
        currentProject.directoryPath,
        'templates',
        'routes'
      );
      const templates = [];
      const files = readdirSync(templatesDirectory);
      files.forEach((item, index) => {
        let fPath = join(templatesDirectory, item);
        let stats = statSync(fPath);
        if (stats.isDirectory()) {
          templates.push({
            name: item,
            path: fPath
          });
        }
      });
      yield put({
        type: 'changeStatus',
        payload: {
          templates
        }
      });
    },
    *newRoute({ payload }, { call, put, select }) {
      const {
        name,
        parent,
        template,
        isExist
      } = payload;
      const global = yield select(state => state.global);
      const createRoute = yield select(state => state.createRoute);
      const { currentProject } = global;
      const targetDirectory = join(
        currentProject.directoryPath,
        'src',
        'routes',
        name
      );
      const sourceDirectory = template;
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
      if (!isExist) {
        const routeAST = createRoute.routeAST;
        const routeConfig = updateRouteConfig(name, parent, routeAST);
        const routePath = join(
          currentProject.directoryPath,
          'src',
          'routes',
          'index.js'
        );
        writeFileSync(routePath, routeConfig);
      }
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

      yield put(routerRedux.push('/home'));
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

function updateRouteConfig(name, path, routeAST) {
  try {
    escodegen.attachComments(routeAST, comments, tokens);
    walk.simple(routeAST, {
      Program(node) {
        const newImport = acorn.Parser.parse(
          `import ${name} from './${name}';`,
          {
            sourceType: 'module'
          }
        );
        for (let i = 0; i < node.body.length; i++) {
          if (node.body[i].type === 'VariableDeclaration') {
            node.body.splice(i, 0, newImport.body[0]);
            break;
          }
        }
      },
      ObjectExpression(node) {
        if (node.properties.length) {
          const properties = node.properties.filter(
            item => item.key.name === 'path' && item.value.value === path
          );

          if (properties.length) {
            const childRoutesNodes = node.properties.filter(
              item => item.key.name === 'childRoutes'
            );
            if (childRoutesNodes.length) {
              // 如果有childRoutes
              const childRoutes = childRoutesNodes[0];
              // new route
              const newRoute = acorn.Parser.parse(`${name}(app)`);
              childRoutes.value.elements.unshift(newRoute.body[0].expression);
            } else {
              // 如果没有childRoutes
            }
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
  return escodegen.generate(routeAST, {
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
