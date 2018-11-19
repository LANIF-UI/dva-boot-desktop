import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import logo from 'assets/images/logo.png';
import './style.less';

@connect(({ login, loading }) => ({
  login,
  loading: loading.models.login,
}))
export default class Login extends Component {

  render() {
    const { loading, login } = this.props;
    const { loggedIn, message } = login;
    return (
      <div className="login-page">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="version">
          <span>v1.0.0</span>
        </div>
        <div className="actions">
          <Button type="primary" block>创建</Button>
          <Button block>导入</Button>
        </div>
      </div>
    )
  }
}