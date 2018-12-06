import modelEnhance from '@/utils/modelEnhance';
import { remote } from 'electron';
import { copySync } from 'fs-extra';
const { boilerplate, commands, utils } = remote.getGlobal('services');

export default modelEnhance({
  namespace: 'createProject',

  state: {
    projectInfo: {},
    download: false,
    create: false,
    install: false,
    complete: false
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
      const { name, version = '1.0.0', description, baseURL = '/' } = projectInfo;
      // 复制文件
      copySync(projectPath, projectInfo.directoryPath);
      // 写入package.json
      utils.writePackage(projectInfo.directoryPath, {
        name,
        version,
        description,
        baseURL
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
