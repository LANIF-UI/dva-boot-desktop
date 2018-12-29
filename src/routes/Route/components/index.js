import './style.less';
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Breadcrumb, Icon, Divider, Table, Alert, Button } from 'antd';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils';
const { Header, Content } = Layout;

@connect(({ global }) => ({ global }))
export default class extends BaseComponent {
  state = {
  };

  columns = [
    {
      title: '列',
      dataIndex: 'column'
    },
    {
      title: '表格(tableItem)',
      dataIndex: 'table'
    },
    {
      title: '搜索框(searchItem)',
      dataIndex: 'search'
    },
    {
      title: '表单(formItem)',
      dataIndex: 'form'
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <a>修改</a>
          <Divider type="vertical" />
          <a>删除</a>
        </span>
      )
    }
  ];

  render() {
    const { currentProject } = this.props.global;
    const routes = currentProject ? currentProject.routes : [];
    const link = $$.getQueryValue('link');
    const route = routes.filter(item => item.link === link)[0];

    return (
      <Layout className="route-page">
        <Header>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">
                <Icon type="home" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>视图</Breadcrumb.Item>
            <Breadcrumb.Item>{route.title}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content>
          <div className="toolbar">
            <Button onClick={this.onAddColumn} icon="plus">
              增加一项
            </Button>
          </div>
          <Table
            dataSource={[]}
            columns={this.columns}
          />
        </Content>
      </Layout>
    );
  }
}
