import './style.less';
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Breadcrumb, Icon, Divider, Table, Alert, Button } from 'antd';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils';
const { Header, Content } = Layout;

@connect(({ global, route }) => ({ global, route }))
export default class extends BaseComponent {
  state = {};

  columns = [
    {
      title: '列',
      dataIndex: 'name'
    },
    {
      title: '名称',
      dataIndex: 'title'
    },
    {
      title: '表格(tableItem)',
      dataIndex: 'tableItem',
      align: 'center',
      render: (text, record) => {
        if (!text) return <Icon type="stop" />;
        else if (typeof text === 'string') {
          return text;
        } else {
          return <Icon type="check" />;
        }
      }
    },
    {
      title: '搜索框(searchItem)',
      dataIndex: 'searchItem',
      align: 'center',
      render: (text, record) => {
        if (!text) return <Icon type="stop" />;
        else if (typeof text === 'string') {
          return text;
        } else {
          return <Icon type="check" />;
        }
      }
    },
    {
      title: '表单(formItem)',
      dataIndex: 'formItem',
      align: 'center',
      render: (text, record) => {
        if (!text) return <Icon type="stop" />;
        else if (typeof text === 'string') {
          return text;
        } else {
          return <Icon type="check" />;
        }
      }
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
    const { columnsData } = this.props.route;
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
            size="small"
            rowKey="name"
            dataSource={columnsData}
            columns={this.columns}
            pagination={false}
          />
        </Content>
      </Layout>
    );
  }
}
