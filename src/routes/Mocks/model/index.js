import modelEnhance from '@/utils/modelEnhance';
import { join } from 'path';
import { existsSync, writeFileSync } from 'fs-extra';
import { message } from 'antd';

export default modelEnhance({
  namespace: 'mocks',

  state: {},

  subscriptions: {},

  effects: {
    *createMocks({ payload, success }, { put, select }) {
      const { name, description } = payload;
      const global = yield select(state => state.global);
      const { currentProject } = global;
      const mocksFile = join(
        currentProject.directoryPath,
        'src',
        '__mocks__',
        name
      );
      const mocksTemplate = `
/**
 * ${description}
 */
export default ({ fetchMock, delay, mock, toSuccess, toError }) => {
  return {

  };
};
      `;
      if (existsSync(mocksFile)) {
        message('文件已经存在:' + name);
      } else {
        writeFileSync(mocksFile, mocksTemplate);
      }
    }
  },

  reducers: {}
});
