import React from 'react';
import dva from 'dva';
import { Router } from 'dva/router';
import dynamic from 'dva/dynamic';
import createLoading from 'dva-loading';
import createHistory from 'history/createHashHistory';
import request from 'cmn-utils/lib/request';
import createRoutes from '@/routes';
import 'assets/styles/index.less';
import config from './config';

// -> 初始化
const app = dva({ history: createHistory() });

// -> 插件
app.use(createLoading());
app.use({onError: config.exception.global});
request.config(config.request);
// -> 使用mock数据
require('./__mocks__');
dynamic.setDefaultLoadingComponent(() => config.router.loading);

// -> 注册全局模型
// app.model(require('./models/global').default);

// -> 初始化路由
app.router(({ history, app }) => (
  <Router history={history}>{createRoutes(app)}</Router>)
);

// -> Start
app.start('#root');