import React from 'react';
import dynamic from 'dva/dynamic';
import { Route, Switch, Redirect } from 'dva/router';
import assign from 'object-assign';
import $$ from 'cmn-utils';
/**
 * 生成动态组件
 * @param {*} app 
 * @param {*} models 
 * @param {*} component 
 */
export const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models,
  component,
});

/**
 * 生成一组路由
 * @param {*} app 
 * @param {*} routesConfig 
 */
export const createRoutes = (app, routesConfig) => {
  return (
    <Switch>
      {
        routesConfig(app).map(config => createRoute(app, () => config))
      }
    </Switch>
  )
};

/**
 * 生成单个路由
 * @param {*} app 
 * @param {*} routesConfig 
 */
export const createRoute = (app, routesConfig) => {
  const {component: Comp, path, indexRoute, title, ...otherProps} = routesConfig(app);
  const routeProps = assign({
    key: path || $$.randomStr(4),
    render: props => <Comp routerData={otherProps} {...props} />
  }, path && {
    path: path
  });

  if (indexRoute) {
    return [
      <Redirect key={path + "_redirect"} exact from={path} to={indexRoute} />,
      <Route {...routeProps} />
    ]
  }
  
  return <Route {...routeProps} />
};