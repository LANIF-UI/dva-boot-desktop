import './style.less';
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Breadcrumb, Icon, Divider, Table, Modal, Button } from 'antd';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils';
import colFun from './columns';
const { Header, Content } = Layout;

@connect(({ global, route }) => ({ global, route }))
export default class extends BaseComponent {
  state = {};

  onDeleteRoute = () => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '警告',
      content: '是否删除这个路由以及其文件夹？',
      onOk() {
        dispatch({
          type: 'route/delete'
        })
      }
    });
  };

  render() {
    const { currentProject } = this.props.global;
    const { columnsData } = this.props.route;
    const routes = currentProject ? currentProject.routes : [];
    const link = $$.getQueryValue('link');
    const route = routes.filter(item => item.link === link)[0] || {};

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
            <Button
              onClick={this.onDeleteRoute}
              className="delete-btn"
              type="danger"
              icon="delete"
            >
              删除这个路由
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
    );
  }
}
