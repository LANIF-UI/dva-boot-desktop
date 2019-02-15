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
              <Button
                disabled={!columnsData}
                onClick={this.onAddColumn}
                icon="plus"
              >
                增加一列
              </Button>
              <Button
                onClick={e => this.onDeleteRoute(mock)}
                className="delete-btn"
                type="danger"
                icon="delete"
              >
                删除这个文件
              </Button>
            </div>
            <Table
              size="small"
              rowKey="name"
              dataSource={columnsData}
              columns={colFun()}
              pagination={false}
            />
          </Content>
        </Layout>
        <Sider theme="light">
          <List
            header={
              <div>
                接口列表<a>新增</a>
              </div>
            }
            size="small"
            bordered
            dataSource={data}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Sider>
      </Layout>
    );
  }
}
