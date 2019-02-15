import React from 'react';
import { connect } from 'dva';
import { Switch } from 'dva/router';
import { Layout, Icon, message } from 'antd';
import Explorer from 'components/Explorer';
import Toolbar from 'components/Toolbar';
import { openDirectory } from 'utils/common';
import { join } from 'path';
import { existsSync, readJsonSync } from 'fs-extra';
import './styles/basic.less';
import { version } from 'package';
const { Header, Content, Footer, Sider } = Layout;

@connect(({ global }) => ({ global }))
export default class BasicLayout extends React.PureComponent {
  /**
   * 引入已存在的工程
   */
  importProject = () => {
    const directoryPath = openDirectory();
    if (directoryPath) {
      const pkgPath = join(directoryPath, 'package.json');
      if (existsSync(pkgPath)) {
        const pkg = readJsonSync(pkgPath);
        const projectInfo = { name: pkg.name, directoryPath };
        this.props.dispatch({
          type: 'global/setProjects',
          payload: { projectInfo }
        });
      } else {
        message.error('请选择使用dva-boot相关框架搭建的工程');
      }
    }
  };

  render() {
    const { global, routerData, dispatch } = this.props;
    const { projects, currentProject } = global;
    const { childRoutes } = routerData;

    return (
      <Layout className="basic-layout full-layout">
        <Layout>
          <Sider className="basic-layout-siderbar">
            <Explorer
              projects={projects}
              currentProject={currentProject}
              importProject={this.importProject}
              dispatch={dispatch}
            />
          </Sider>
          <Layout>
            <Header className="basic-layout-header">
              <Toolbar />
            </Header>
            <Content className="router-page">
              <Switch>{childRoutes}</Switch>
            </Content>
          </Layout>
        </Layout>
        <Footer className="basic-layout-footer">
          <Icon type="setting" theme="filled" />
          <Icon type="github" theme="filled" />
          <Icon type="question-circle" theme="filled" />
          {currentProject ? (
            <div className="project-info">
              {currentProject.name.toUpperCase()} (
              {currentProject.directoryPath}) -{' '}
              <span color="#2db7f5">运行中</span>
            </div>
          ) : null}
          <div className="version">版本 {version}</div>
        </Footer>
      </Layout>
    );
  }
}
