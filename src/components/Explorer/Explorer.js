import React from 'react';
import { Layout, Icon, Menu, Button } from 'antd';
import BaseComponent from 'components/BaseComponent';
import './style/index.less';
const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Explorer extends BaseComponent {
  importProject = () => {

  };

  render() {
    const PagesTitle = (
      <div className="menu-pages">
        <span>路由页</span>
        <span className="action">
          <Button size="small">new</Button>
        </span>
      </div>
    );

    const MockTitle = (
      <div className="menu-mocks">
        <span>模拟数据</span>
        <span className="action">
          <Button size="small">new</Button>
        </span>
      </div>
    );

    const ConfTitle = (
      <div className="menu-conf">
        <span>配置</span>
        <span className="action">
          <Button size="small">new</Button>
        </span>
      </div>
    );

    return (
      <Layout id="explorer-layout" className="full-layout">
        <Header className="explorer-layout-header">
          <span>资源管理器</span>
          <div className="actions">
            <Icon
              title="导入"
              onClick={this.importProject}
              type="folder-open"
              theme="filled"
            />
            <Icon
              title="新建"
              onClick={e => this.history.push('/createProject')}
              type="folder-add"
              theme="filled"
            />
          </div>
        </Header>
        <Content>
          <Menu
            className="explorer-menu"
            onClick={this.handleClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
              key="sub1"
              title={
                <span className="project-title">
                  <Icon type="project" />
                  <span>DVA-BOOT-ADMIN</span>
                </span>
              }
            >
              <MenuItemGroup title={PagesTitle}>
                <Menu.Item key="1">Form</Menu.Item>
                <Menu.Item key="2">DataTable</Menu.Item>
              </MenuItemGroup>
              <MenuItemGroup title={MockTitle}>
                <Menu.Item key="3">form</Menu.Item>
                <Menu.Item key="4">datatables 4</Menu.Item>
              </MenuItemGroup>
              <MenuItemGroup title={ConfTitle}>
                <Menu.Item key="3">config.js</Menu.Item>
              </MenuItemGroup>
            </SubMenu>
          </Menu>
        </Content>
      </Layout>
    );
  }
}

export default Explorer;
