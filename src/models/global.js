import $$ from 'cmn-utils';
import modelEnhance from '@/utils/modelEnhance';
import { routerRedux } from 'dva/router';
import glob from 'glob';

export default modelEnhance({
  namespace: 'global',

  state: {
    // 当前项目下的工程
    projects: [],
  },

  effects: {
    *setProjects({ payload }, { call, put }) {
      const { projectPath } = payload;
      glob.sync('**/routes/**/components', {
        cwd: projectPath,
        dot: true
      }).forEach((source) => {
        
        return true;
      });
    },

    *getSubMenu({ payload: { currentPath, subpath } }, { call, put, select }) {
      const { menu } = yield select(state => state.global);
      const subMenu = menu.filter(item => item.path === currentPath)[0].children

      yield put(routerRedux.push(subpath || subMenu[0].path || '/notfound'));

      yield put({
        type: 'getSubMenuSuccess',
        payload: subMenu
      });
    }
  },

  reducers: {
    getMenuSuccess(state, { payload }) {
      return {
        ...state,
        menu: payload,
        flatMenu: getFlatMenu(payload),
      };
    },

    getSubMenuSuccess(state, { payload }) {
      return {
        ...state,
        subMenu: payload
      }
    }
  },
});

export function getFlatMenu(menus) {
  let menu = [];
  menus.forEach(item => {
    if (item.children) {
      menu = menu.concat(getFlatMenu(item.children));
    }
    menu.push(item);
  });
  return menu;
}

export async function getMenu(payload) {
  return $$.post('/user/menu', payload);
}