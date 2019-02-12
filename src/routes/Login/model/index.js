import { remote } from 'electron';

export default {
  namespace: 'login',

  state: {
    directoryPath: null
  },

  effects: {
    *openDirectory({ payload }, { call, put }) {
      try {
        const openDirectory = remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        });
        if (openDirectory) {
          yield put({
            type: 'changeStatus',
            payload: { directoryPath: openDirectory[0] }
          });
        } 
      } catch (e) {
        console.log(e);
      }
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
