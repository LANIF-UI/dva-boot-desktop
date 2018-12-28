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
    route: {}
  };

  componentDidMount() {
    const { currentProject } = this.props.global;
    const routes = currentProject ? currentProject.routes : [];
    const link = $$.getQueryValue('link');
    if (link) {
      this.setState({
        route: routes.filter(item => item.link === link)[0]
      });
    }
  }

  render() {
    const { route } = this.state;
    const columns = [
      {
        title: '列',
        dataIndex: 'column'
      },
      {
        title: '表格',
        dataIndex: 'table'
      },
      {
        title: '搜索框',
        dataIndex: 'search'
      },
      {
        title: '表单',
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

    return (
      <Layout className="route-page">
        <Header>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">
                <Icon type="home" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{route.title}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content>
          <div className="toolbar">
            <Button onClick={this.onAddColumn} icon="plus">
              新增
            </Button>
          </div>
          <Table
            dataSource={[]}
            columns={columns}
          />
        </Content>
      </Layout>
    );
  }
}
