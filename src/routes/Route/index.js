import {dynamicWrapper, createRoute} from '@/utils/core';

const routesConfig = (app) => ({
  path: '/route',
  title: '路由管理',
  component: dynamicWrapper(app, [], () => import('./components'))
});

export default (app) => createRoute(app, routesConfig);
