import './style.less';
import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Card, Tag } from 'antd';
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
                <div className="router-card-body">
                  {routes.map((item, index) => (
                    <Tag key={index} color="red">
                      {item.title}
                    </Tag>
                  ))}
                </div>
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card title={`模拟数据 (${mocks.length})`} extra={<a>新增</a>}>
                {mocks.map((item, index) => (
                  <Tag key={index} color="red">
                    {item.name}
                  </Tag>
                ))}
                {!mocks.length && "无"}
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card title="代理配置" extra={<a>设置</a>}>
                无
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card title="系统配置" extra={<a>设置</a>}>
                无
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
