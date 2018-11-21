import React from 'react';
import { connect } from 'dva';
import { Switch } from 'dva/router';
import { Layout, Icon } from 'antd';
import Explorer from 'components/Explorer';
import './styles/basic.less';
const { Header, Content, Footer, Sider } = Layout;

@connect()
export default class BasicLayout extends React.PureComponent {
  render() {
    const { routerData } = this.props;
    const { childRoutes } = routerData;

    return (
      <Layout className="basic-layout full-layout">
        <Header />
        <Layout>
          <Sider className="basic-layout-siderbar">
            <Explorer />
          </Sider>
          <Content className="router-page">
            <Switch>{childRoutes}</Switch>
          </Content>
        </Layout>
        <Footer className="basic-layout-footer">
          <Icon type="setting" theme="filled" />
          <Icon type="github" theme="filled" />
          <Icon type="question-circle" theme="filled" />
        </Footer>
      </Layout>
    );
  }
}
