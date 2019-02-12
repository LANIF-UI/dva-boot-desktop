import modelEnhance from '@/utils/modelEnhance';
import { remote } from 'electron';
import {
  copySync,
  existsSync,
  removeSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs-extra';
import { join } from 'path';
import * as acorn from 'acorn';
import jsx from 'acorn-jsx';
import * as walk from 'acorn-walk';
import escodegen from 'escodegen';
const { boilerplate, commands, utils } = remote.getGlobal('services');

let comments = [];
let tokens = [];
export default modelEnhance({
  namespace: 'createProject',

  state: {
    projectInfo: {},
    download: false,
    create: false,
    install: false,
    complete: false
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('/createProject') !== -1) {
          comments = []; // 清空
          tokens = []; // 清空
        }
      });
    }
  },

  effects: {
    // 0.开始创建工程
    *newProject({ payload }, { call, put }) {
      yield put({
        type: 'download',
        payload
      });
    },
    // 1.下载模板文件
    *download({ payload }, { call, put }) {
      const { template } = payload;
      yield put({
        type: 'changeStatus',
        payload: {
          download: '1.下载模板文件',
          create: false,
          install: false,
          complete: false,
          projectInfo: payload
        }
      });
      const projectPath = yield boilerplate.downloadDBA(template);
      yield put({
        type: 'create',
        payload: {
          projectPath
        }
      });
    },
    // 2.创建工程目录
    *create({ payload }, { select, call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          create: '2.创建工程目录',
          download: false,
          install: false,
          complete: false
        }
      });
      const { projectPath } = payload;
      const { projectInfo } = yield select(state => state.createProject);
      const {
        name,
        description,
        version,
        removeExample,
        removeDocs,
        removeMocks
      } = projectInfo;
      // 复制文件
      copySync(projectPath, projectInfo.directoryPath);
      // 写入package.json
      utils.writePackage(projectInfo.directoryPath, {
        name,
        version,
        description
      });
      // 删除例子
      if (removeExample) {
        const examplePath = join(projectInfo.directoryPath, 'src', 'routes');
        if (existsSync(examplePath)) {
          const files = readdirSync(examplePath);
          // 删除文件
          files.forEach(item => {
            if (
              item !== 'index.js' &&
              item !== 'Login' &&
              item !== 'Register' &&
              item !== 'Pages'
            ) {
              removeSync(join(examplePath, item));
            }
          });
          // 更新配置
          const rootRoutePath = join(examplePath, 'index.js');
          const rootRouteConfig = deleteExampleRoute(rootRoutePath);
          writeFileSync(rootRoutePath, rootRouteConfig);
        }
      }
      // 删除文档
      if (removeDocs) {
        const docsPath = join(projectInfo.directoryPath, 'docs');
        removeSync(docsPath);
      }
      // 删除模拟数据
      if (removeMocks) {
        const mocksPath = join(projectInfo.directoryPath, 'src', '__mocks__');
        // 删除文件
        const files = readdirSync(mocksPath);
        files.forEach(item => {
          if (item !== 'index.js') {
            removeSync(join(mocksPath, item));
          }
        });
        // 更新配置
        const rootMocksPath = join(mocksPath, 'index.js');
        const mocksConfig = rebuildMocksFile();
        writeFileSync(rootMocksPath, mocksConfig);
      }
      yield put({
        type: 'global/setProjects',
        payload: { projectInfo }
      });
      // 文件复制成功后，开始安装依赖
      yield put({
        type: 'install',
        payload: { projectInfo }
      });
    },
    // 3.安装依赖
    *install({ payload }, { call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          install: '3.安装依赖，需要一段时间',
          download: false,
          create: false,
          complete: false
        }
      });

      const { projectInfo } = payload;

      const { status } = yield commands.installPackage({
        root: projectInfo.directoryPath,
        sender: 'import'
      });

      if (status) {
        console.log('install success');
        yield put({
          type: 'complete'
        });
      } else {
        console.log('install err');
        yield put({
          type: 'complete'
        });
      }
    },
    *complete({ payload }, { call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          complete: '重新创建',
          create: false,
          download: false,
          install: false
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
});

function deleteExampleRoute(path) {
  const file = readFileSync(path).toString();
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
        const excludes = [
          './Pages/404',
          './Login',
          './Register',
          '@/utils/core',
          '@/layouts/BasicLayout',
          '@/layouts/UserLayout'
        ];
        for (let i = node.body.length - 1; i >= 0; i--) {
          if (
            node.body[i].type === 'ImportDeclaration' &&
            excludes.indexOf(node.body[i].source.value) === -1
          ) {
            node.body.splice(i, 1);
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
            for (let i = routes.length - 1; i >= 0; i--) {
              if (
                routes[i].type === 'CallExpression' &&
                routes[i].callee.name !== 'NotFound' &&
                routes[i].callee.name !== 'Login' &&
                routes[i].callee.name !== 'Register'
              ) {
                routes.splice(i, 1);
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

function rebuildMocksFile() {
  const comments = [];
  const tokens = [];
  const indexMocks = `
    // http://www.wheresrhys.co.uk/fetch-mock/api
    import packMock from '@/utils/packMock';

    /**
     * 加载mock文件
     * packMock(mock1[,mock2])
     */
    packMock();
  `;
  const ast = acorn.Parser.parse(indexMocks, {
    ranges: true,
    onComment: comments,
    onToken: tokens,
    sourceType: 'module'
  });
  escodegen.attachComments(ast, comments, tokens);
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
