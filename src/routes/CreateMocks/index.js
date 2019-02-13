import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = (app) => ({
  path: '/createMocks',
  title: '新建模拟数据',
  component: dynamicWrapper(app, [import('./model')], () => import('./components')),
});

export default (app) => createRoute(app, routesConfig);
