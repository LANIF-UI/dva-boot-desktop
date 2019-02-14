import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col } from 'antd';
import BaseComponent from 'components/BaseComponent';
import './index.less';
const { Content } = Layout;

@connect()
export default class extends BaseComponent {
  render() {
    return (
      <Layout className="full-layout page mocks-page">
        <Content>Content</Content>
      </Layout>
    );
  }
}
