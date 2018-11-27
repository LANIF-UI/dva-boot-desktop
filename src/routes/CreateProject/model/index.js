import modelEnhance from '@/utils/modelEnhance';
import { remote } from 'electron';
import mkdirp from 'mkdirp';
import glob from 'glob';
import { join, dirname } from 'path';
import { writeToFile } from 'utils/common';
const { boilerplate } = remote.getGlobal('services');

export default modelEnhance({
  namespace: 'createProject',

  state: {
    projectInfo: {},
    download: false,
    create: false,
    install: false,
    complete: false,
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
      glob
        .sync('**', {
          cwd: projectPath,
          nodir: true,
          dot: true
        })
        .forEach(source => {
          const subDir = source.replace(
            /__(\w+)__/g,
            (match, offset) => projectInfo[offset]
          );
          const target = join(projectInfo.directoryPath, subDir);

          mkdirp.sync(dirname(target));

          source = join(projectPath, source);

          writeToFile(source, target, projectInfo);
          return true;
        });

      // 文件复制成功后，开始安装依赖
      yield put({
        type: 'install'
      });
    },
    // 3.安装依赖
    *install({ payload }, { call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          install: '3.安装依赖',
          download: false,
          create: false,
          complete: false
        }
      });

      yield put({
        type: 'complete'
      });
    },
    *complete({ payload }, { call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          complete: '重新创建',
          create: false,
          download: false,
          install: false,
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
