import './style.less';
import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Card, Button, Icon } from 'antd';
import BaseComponent from 'components/BaseComponent';
const { Content } = Layout;

@connect(({ global }) => ({ global }))
export default class Home extends BaseComponent {
  render() {
    const { currentProject } = this.props.global;

    const routes = currentProject[0] ? currentProject[0].routes : [];
    const mocks = currentProject[0] ? currentProject[0].mocks : [];

    return (
      <Layout className="home-page">
        <Content>
          <Row>
            <Col xs={12} md={8} xl={6}>
              <Card title={`路由页 (${routes.length})`} extra={<a>新增</a>}>
                Card content
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card title={`模拟数据 (${mocks.length})`} extra={<a>新增</a>}>
                Card content
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card title="代理配置" extra={<a>设置</a>}>
                Card content
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card title="Card title" extra={<a>新增</a>}>
                Card content
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
