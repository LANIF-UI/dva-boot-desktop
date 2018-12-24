import React from 'react';
import { Layout, Icon, Menu, Button } from 'antd';
import BaseComponent from 'components/BaseComponent';
import './style/index.less';
const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Explorer extends BaseComponent {
  importProject = () => {};

  render() {
    const { currentProject } = this.props;

    const PagesTitle = (
      <div className="menu-pages">
        <span>路由页</span>
        <span className="action">
          <Button size="small" type="primary">
            新增
          </Button>
        </span>
      </div>
    );

    const MockTitle = (
      <div className="menu-mocks">
        <span>模拟数据</span>
        <span className="action">
          <Button size="small" type="primary">
            新增
          </Button>
        </span>
      </div>
    );

    const ConfTitle = (
      <div className="menu-conf">
        <span>配置</span>
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
        <Content style={{ overflowY: 'auto' }}>
          <Menu
            className="explorer-menu"
            onClick={this.handleClick}
            defaultOpenKeys={['0']}
            mode="inline"
          >
            {currentProject.map((item, index) => (
              <SubMenu
                key={`${index}`}
                title={
                  <span className="project-title">
                    <Icon type="project" />
                    <span>{item.name.toUpperCase()}</span>
                  </span>
                }
              >
                <MenuItemGroup title={PagesTitle}>
                  {item.routes.map((jtem, jndex) => (
                    <Menu.Item key={jndex}>{jtem.title}</Menu.Item>
                  ))}
                </MenuItemGroup>
                <MenuItemGroup title={MockTitle}>
                  {item.mocks.map((jtem, jndex) => (
                    <Menu.Item key={jndex}>{jtem.name}</Menu.Item>
                  ))}
                </MenuItemGroup>
                <MenuItemGroup title={ConfTitle}>
                  <Menu.Item key="3">config.js</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
            ))}
          </Menu>
        </Content>
      </Layout>
    );
  }
}

export default Explorer;
