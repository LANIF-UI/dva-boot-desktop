import {createRoutes} from '@/utils/core';
import BaseLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import NotFound from './Pages/404';
import Login from './Login';
import Home from './Home';
import CreateProject from './CreateProject';
import Route from './Route';
import CreateRoute from './CreateRoute';

const routesConfig = (app) => ([
  {
    path: '/user',
    title: '登录',
    indexRoute: '/user/login',
    component: UserLayout,
    childRoutes: [
      Login(app),
      NotFound()
    ]
  }, {
    path: '/',
    title: '系统中心',
    component: BaseLayout,
    indexRoute: '/home',
    childRoutes: [
      Home(app),
      CreateProject(app),
      CreateRoute(app),
      Route(app),
      NotFound()
    ]
  }
]);

export default app => createRoutes(app, routesConfig);