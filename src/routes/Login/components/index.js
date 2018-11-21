import React from 'react';
import { connect } from 'dva';
import { Layout, Button } from 'antd';
import logo from 'assets/images/logo.png';
import BaseComponent from 'components/BaseComponent';
import './style.less';
const { Content } = Layout;

@connect(({ login, loading }) => ({
  login,
  loading: loading.models.login,
}))
export default class Login extends BaseComponent {
  onCreate = () => {
    this.history.push('/createProject');
  }

  onImport = () => {

  }

  render() {
    return (
      <Layout className="login-page">
        <Content>
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="version">
            <span>v1.0.0</span>
          </div>
          <div className="actions">
            <Button onClick={this.onCreate} type="primary" block>创建</Button>
            <Button onClick={this.onImport} block>导入</Button>
          </div>
        </Content>
      </Layout>
    )
  }
}