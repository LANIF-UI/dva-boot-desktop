import { join } from 'path';
import { copySync, readdirSync, statSync, readFileSync } from 'fs-extra';
import { writeToFile } from 'utils/common';
import { message } from 'antd';
import * as acorn from 'acorn';
import jsx from 'acorn-jsx';
import * as walk from 'acorn-walk';

export default {
  namespace: 'createRoute',

  state: {
    loading: false,
    templates: [],
    parentRoutes: []
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
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
                item => item.key.name === 'path'
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
            parentRoutes
          }
        });
      } catch (e) {}
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
      const { name, title, namespace, route, template } = payload;
      const global = yield select(state => state.global);
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
