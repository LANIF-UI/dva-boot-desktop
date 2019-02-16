import React from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import {
  Layout,
  List,
  Breadcrumb,
  Icon,
  Table,
  Button,
  Row,
  Col,
  Card
} from 'antd';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils';
import colFun from './columns';
import './index.less';
const { Header, Content, Sider } = Layout;

@connect(({ global, mocks }) => ({ global, mocks }))
export default class extends BaseComponent {
  render() {
    const { currentProject } = this.props.global;
    const { columnsData } = this.props.mocks;
    const mocksList = currentProject ? currentProject.mocks : [];
    const name = $$.getQueryValue('name');
    const mock = mocksList.filter(item => item.name === name)[0] || {};

    const data = ['add', 'delete', 'update', 'getPageList'];
    return (
      <Layout className="full-layout page mocks-page">
        <Layout>
          <Header>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">
                  <Icon type="home" />
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>接口模拟</Breadcrumb.Item>
              <Breadcrumb.Item>{mock.name}</Breadcrumb.Item>
            </Breadcrumb>
          </Header>
          <Content>
            <div className="toolbar">
              <Button.Group className="delete-btn">
                <Button
                  size="small"
                  onClick={e => this.onDeleteRoute(mock)}
                  icon="disconnect"
                >
                  停用
                </Button>
                <Button
                  size="small"
                  onClick={e => this.onDeleteRoute(mock)}
                  type="danger"
                  icon="delete"
                >
                  删除
                </Button>
              </Button.Group>
            </div>
            <Table
              className="transfer-table"
              size="small"
              rowKey="name"
              dataSource={columnsData}
              columns={colFun()}
              pagination={false}
            />
            <Row className="toolbar">
              <Col>
                <Button
                  type="primary"
                  shape="round"
                  size="small"
                  onClick={this.onAddColumn}
                  icon="thunderbolt"
                >
                  MOCK
                </Button>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Card className="transfer-card" size="small" title="响应模板">
                  <p>Card content</p>
                  <p>Card content</p>
                  <p>Card content</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  className="transfer-card"
                  size="small"
                  title="响应数据"
                  extra={
                    <a>
                      <Icon type="sync" />
                    </a>
                  }
                >
                  <p>Card content</p>
                  <p>Card content</p>
                  <p>Card content</p>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
        <Sider theme="light" className="transfer-sider">
          <List
            header={
              <div className="list-outline">
                <Icon type="bars" /> 接口列表
              </div>
            }
            size="small"
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Icon className="api-icon" type="link" /> {item}
              </List.Item>
            )}
          />
          <Button
            className="add-btn"
            type="primary"
            shape="circle"
            icon="plus"
          />
        </Sider>
      </Layout>
    );
  }
}
