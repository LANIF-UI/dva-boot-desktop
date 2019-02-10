import React from 'react';
import { Link } from 'dva/router';
import { Layout, Icon, Menu, Button } from 'antd';
import BaseComponent from 'components/BaseComponent';
import './style/index.less';
const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;

class Explorer extends BaseComponent {
  importProject = () => {};

  render() {
    const { currentProject } = this.props;

    const PagesTitle = (
      <div className="menu-pages">
        <span>
          <Icon type="link" /> 路由({currentProject.routes.length})
        </span>
        <span className="action">
          <Link onClick={event => event.stopPropagation()} to="/createRoute">
            新增
          </Link>
        </span>
      </div>
    );

    const MockTitle = (
      <div className="menu-mocks">
        <span>
          <Icon type="swap" /> 模拟数据
        </span>
        <span className="action">
          <Link onClick={event => event.stopPropagation()} to="/">
            新增
          </Link>
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
                <SubMenu className="project-title" title={PagesTitle}>
                  {currentProject.routes.map((jtem, jndex) => (
                    <Menu.Item key={'r_' + jndex}>
                      <Link to={'/route?link=' + jtem.link}>
                        {jtem.title}-
                        <strong style={{ color: '#c7254e' }}>
                          {jtem.name}
                        </strong>
                      </Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
                <SubMenu className="project-title" title={MockTitle}>
                  {currentProject.mocks.map((jtem, jndex) => (
                    <Menu.Item key={'m_' + jndex}>{jtem.name}</Menu.Item>
                  ))}
                </SubMenu>
                <SubMenu className="project-title" title={ConfTitle}>
                  <Menu.Item key="3">config.js</Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
          </Content>
        ) : null}
      </Layout>
    );
  }
}

export default Explorer;
