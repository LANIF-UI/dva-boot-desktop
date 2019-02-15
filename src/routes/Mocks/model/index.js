import modelEnhance from '@/utils/modelEnhance';
import { join } from 'path';
import { existsSync, writeFileSync } from 'fs-extra';
import { message } from 'antd';

export default modelEnhance({
  namespace: 'mocks',

  state: {
    columnsData: [],
  },

  subscriptions: {},

  effects: {},

  reducers: {}
});
