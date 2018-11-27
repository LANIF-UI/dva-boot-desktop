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
    download: false,
    create: false,
    install: false
  },

  effects: {
    // 1.下载模板文件
    *download({ payload }, { call, put }) {
      const { template } = payload;
      yield call({
        type: 'changeStatus',
        payload: { download: true }
      });
      yield boilerplate.downloadDBA(template);
      yield call({
        type: 'create',
        payload: {
          download: false
        }
      });
    },
    // 2.创建工程目录
    *create({ payload }, { select, call, put }) {
      yield call({
        type: 'changeStatus',
        payload: { download: false, create: true }
      });

      const {
        selectBoilerplate, initSetting, selectExtendsProj
      } = yield select(state => state.projectCreate);
      const sourceDir = join(selectBoilerplate.path, 'proj');


      glob.sync('**', {
        cwd: sourceDir,
        nodir: true,
        dot: true
      }).forEach((source) => {
        if (selectExtendsProj.filter && selectExtendsProj.filter(source, initSetting) === false) {
          return false;
        }
        const subDir = source.replace(/__(\w+)__/g, (match, offset) => initSetting[offset]);

        const target = join(initSetting.projPath, subDir);

        mkdirp.sync(dirname(target));

        source = join(sourceDir, source);

        writeToFile(source, target, initSetting);
        return true;
      });

      // 文件复制成功后，开始安装依赖
      yield put({
        type: 'install',
        payload: { isRetry: false },
      });
    },
    // 3.安装依赖
    *install({ payload }, { call, put }) {

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
