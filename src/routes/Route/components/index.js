import './style.less';
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Layout,
  Breadcrumb,
  Icon,
  Table,
  Modal,
  Button,
  Row,
  Col,
  Empty
} from 'antd';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils';
import colFun from './columns';
const { Header, Content } = Layout;

@connect(({ global, route }) => ({ global, route }))
export default class extends BaseComponent {
  state = {};

  onDeleteRoute = route => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '警告',
      content: '是否删除这个路由以及其文件夹？',
      onOk() {
        dispatch({
          type: 'route/delete',
          payload: {
            route
          }
        });
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
            <Button
              disabled={!columnsData}
              onClick={this.onAddColumn}
              icon="plus"
            >
              增加一列
            </Button>
            <Button
              onClick={e => this.onDeleteRoute(route)}
              className="delete-btn"
              type="danger"
              icon="delete"
            >
              删除这个路由
            </Button>
          </div>
          <Row>
            <Col>
              {columnsData ? (
                <Table
                  size="small"
                  rowKey="name"
                  dataSource={columnsData}
                  columns={colFun()}
                  pagination={false}
                />
              ) : (
                <div className="blank-panel">
                  <Empty
                    image={<Icon type="dropbox" />}
                    description={<span>没有发现 columns.js</span>}
                  >
                    <Button type="primary">现在创建</Button>
                  </Empty>
                </div>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
