import React from 'react';
import { connect } from 'dva';
import { Switch } from 'dva/router';
import { Layout, Icon } from 'antd';
import Explorer from 'components/Explorer';
import Toolbar from 'components/Toolbar';
import './styles/basic.less';
import { version } from 'package';
const { Header, Content, Footer, Sider } = Layout;

@connect(({ global }) => ({ global }))
export default class BasicLayout extends React.PureComponent {
  render() {
    const { global, routerData } = this.props;
    const { projects } = global;
    const { childRoutes } = routerData;

    return (
      <Layout className="basic-layout full-layout">
        <Layout>
          <Sider className="basic-layout-siderbar">
            <Explorer projects={projects} />
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
          <div className="project-info">
            dva-boot-admin (d:\abc) - <span color="#2db7f5">运行中</span>
          </div>
          <div className="version">版本 {version}</div>
        </Footer>
      </Layout>
    );
  }
}
