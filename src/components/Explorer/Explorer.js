import React from 'react';
import { Link } from 'dva/router';
import { Layout, Icon, Menu, Modal, Input } from 'antd';
import BaseComponent from 'components/BaseComponent';
import './style/index.less';
const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;

class Explorer extends BaseComponent {
  state = {
    mocksVisible: false,
    mockName: null
  };

  createMocks = e => {
    e.stopPropagation();
    this.setState({
      mocksVisible: true
    });
  };

  handleCancel = () => {
    this.setState({
      mocksVisible: false,
      mockName: null
    });
  };

  onChangeMockName = e => {
    this.setState({
      mockName: e.target.value
    });
  };
  // 创建mock文件
  handleCreateMocks = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { mockName } = this.state;
    if (!mockName || !mockName.trim()) return;
    dispatch({
      type: 'global/createMocks',
      payload: {
        name: mockName
          .trim()
          .split('.js')
          .filter(Boolean)
          .concat('.js')
          .join('')
      },
      success: () => {
        this.handleCancel();
        this.history.push('/mocks');
      }
    });
  };

  render() {
    const { currentProject, importProject } = this.props;
    const { mocksVisible, mockName } = this.state;

    const PagesTitle = (
      <div className="menu-pages">
        <span>
          <Icon type="link" /> 路由(
          {currentProject && currentProject.routes.length})
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
          <a onClick={this.createMocks}>新增</a>
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
              onClick={importProject}
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
                        <strong style={{ color: '#FFF' }}>{jtem.name}</strong>
                      </Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
                <SubMenu className="project-title" title={MockTitle}>
                  {currentProject.mocks.map((jtem, jndex) => (
                    <Menu.Item key={'m_' + jndex}>
                      <Link to={'/mocks?name=' + jtem.name}>{jtem.name}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
                <SubMenu className="project-title" title={ConfTitle}>
                  <Menu.Item key="3">config.js</Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
          </Content>
        ) : null}
        <Modal
          title="新建"
          visible={mocksVisible}
          onOk={this.handleCreateMocks}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: !mockName }}
        >
          <form onSubmit={this.handleCreateMocks}>
            <Input
              addonBefore="文件名"
              placeholder="在__mocks__下,创建模拟接口文件,文件名符合规范"
              addonAfter=".js"
              onChange={this.onChangeMockName}
            />
          </form>
        </Modal>
      </Layout>
    );
  }
}

export default Explorer;
