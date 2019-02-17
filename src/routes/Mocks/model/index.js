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
  namespace: 'mocks',

  state: {
    columnsData: []
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
    // 从指定mock里分析出columns
    *parseMock({ payload }, { call, put, select }) {
      const { name } = payload;
      const global = yield select(state => state.global);
      const { currentProject } = global;
    }
  },

  reducers: {}
};
