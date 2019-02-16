import './style.less';
import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Card, Tag } from 'antd';
import BaseComponent from 'components/BaseComponent';
const { Content } = Layout;

@connect(({ global }) => ({ global }))
export default class Home extends BaseComponent {
  enterRoute(item) {
    this.history.push('/route?link=' + item.link);
  }

  render() {
    const { currentProject } = this.props.global;

    const routes = currentProject ? currentProject.routes : [];
    const mocks = currentProject ? currentProject.mocks : [];

    return (
      <Layout className="home-page">
        <Content>
          <Row>
            <Col xs={12} md={8} xl={6}>
              <Card
                className="transfer-card"
                title={`路由页 (${routes.length})`}
                extra={<a>新增</a>}
              >
                <div className="router-card-body">
                  {routes.map((item, index) => (
                    <Tag
                      key={index}
                      color="red"
                      onClick={e => this.enterRoute(item)}
                    >
                      {item.title}
                    </Tag>
                  ))}
                </div>
                {!routes.length && '无'}
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card
                className="transfer-card"
                title={`模拟数据 (${mocks.length})`}
                extra={<a>新增</a>}
              >
                <div className="router-card-body">
                  {mocks.map((item, index) => (
                    <Tag key={index} color="green">
                      {item.name}
                    </Tag>
                  ))}
                </div>
                {!mocks.length && '无'}
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card
                className="transfer-card"
                title="代理配置"
                extra={<a>设置</a>}
              >
                无
              </Card>
            </Col>
            <Col xs={12} md={8} xl={6}>
              <Card
                className="transfer-card"
                title="系统配置"
                extra={<a>设置</a>}
              >
                无
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
