import React from 'react';
import { Link } from 'dva/router';
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
        <span>
          <Icon type="link" /> 路由页
        </span>
        <span className="action">
          <Button size="small" type="primary">
            <Link to="/createRoute">新增</Link>
          </Button>
        </span>
      </div>
    );

    const MockTitle = (
      <div className="menu-mocks">
        <span>
          <Icon type="interation" /> 模拟数据
        </span>
        <span className="action">
          <Button size="small" type="primary">
            新增
          </Button>
        </span>
      </div>
    );

    const ConfTitle = (
      <div className="menu-conf">
        <span>
          <Icon type="setting" /> 配置
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
        {currentProject ? (
          <Content style={{ overflowY: 'auto' }}>
            <Menu
              className="explorer-menu"
              onClick={this.handleClick}
              defaultOpenKeys={['0']}
              theme="dark"
              mode="inline"
            >
              <SubMenu
                key="0"
                title={
                  <span className="project-title">
                    <Icon type="project" />
                    <span>{currentProject.name.toUpperCase()}</span>
                  </span>
                }
              >
                <MenuItemGroup title={PagesTitle}>
                  {currentProject.routes.map((jtem, jndex) => (
                    <Menu.Item key={jndex}>
                      <Link to={'/route?link=' + jtem.link}>
                        {jtem.title}-
                        <strong style={{ color: '#c7254e' }}>
                          {jtem.name}
                        </strong>
                      </Link>
                    </Menu.Item>
                  ))}
                </MenuItemGroup>
                <MenuItemGroup title={MockTitle}>
                  {currentProject.mocks.map((jtem, jndex) => (
                    <Menu.Item key={jndex}>{jtem.name}</Menu.Item>
                  ))}
                </MenuItemGroup>
                <MenuItemGroup title={ConfTitle}>
                  <Menu.Item key="3">config.js</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
            </Menu>
          </Content>
        ) : null}
      </Layout>
    );
  }
}

export default Explorer;
