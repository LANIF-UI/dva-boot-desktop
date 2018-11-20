import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button } from 'antd';
import logo from 'assets/images/logo.png';
import CreateForm from './createForm';
import './style.less';
const { Content } = Layout;

@connect(({ login, loading }) => ({
  login,
  loading: loading.models.login,
}))
export default class Login extends Component {
  openDirectory = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/openDirectory'
    });
  }

  render() {
    const { loading, login } = this.props;
    const { loggedIn, message } = login;
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
            <Button onClick={this.openDirectory} type="primary" block>创建</Button>
            <Button onClick={this.importDirectory} block>导入</Button>
          </div>
          <CreateForm />
        </Content>
      </Layout>
    )
  }
}