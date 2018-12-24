import React, { Component } from 'react';
import {
  Layout,
  Form,
  Input,
  Icon,
  Tabs,
  Button,
  Checkbox,
  Select
} from 'antd';
import { connect } from 'dva';
import { openDirectory } from 'utils/common';
import { join } from 'path';
import './index.less';
import { Link, routerRedux } from 'dva/router';

const TabPane = Tabs.TabPane;
const { Header, Content } = Layout;
const createForm = Form.create;
const Option = Select.Option;

@connect(({ createProject }) => ({ createProject }))
class CreateProject extends Component {
  state = {
    directory: null
  };

  onOpenDirectory = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const name = getFieldValue('name') || '';
    const directory = openDirectory();
    if (directory) {
      const directoryPath = join(directory, name);
      setFieldsValue({
        directoryPath
      });
      this.setState({
        directory
      });
    }
  };

  onChangeName = e => {
    const { setFieldsValue } = this.props.form;
    const { directory } = this.state;
    const name = e.target.value;
    if (directory) {
      setFieldsValue({
        directoryPath: join(directory, name)
      });
    }
  };

  handleSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'createProject/newProject',
          payload: values
        });
      }
    });
  };

  render() {
    const { createProject, form, dispatch } = this.props;
    const { getFieldDecorator } = form;
    const { download, create, install, complete } = createProject;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    const tailFormItemLayout = {
      wrapperCol: { span: 24, offset: 8 }
    };

    return (
      <Layout className="create-project">
        <Header />
        <Content>
          <Tabs>
            <TabPane tab="基本信息" key="basic">
              <Form onSubmit={this.handleSubmit} className="create-form">
                <Form.Item label="选择模板" {...formItemLayout}>
                  {getFieldDecorator('template', {
                    rules: [{ required: true, message: '请选择模板' }],
                    initialValue: 'dva-boot-admin'
                  })(
                    <Select>
                      <Option value="dva-boot-admin">
                        DVA-BOOT-ADMIN(桌面端)
                      </Option>
                      <Option value="dva-boot-mobile">
                        DVA-BOOT-MOBILE(移动端)
                      </Option>
                      <Option value="dva-boot">DVA-BOOT(基础工程)</Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="项目名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入项目名称' }]
                  })(
                    <Input
                      prefix={<Icon type="edit" />}
                      placeholder="项目名称"
                      onChange={this.onChangeName}
                    />
                  )}
                </Form.Item>
                <Form.Item label="项目描述" {...formItemLayout}>
                  {getFieldDecorator('description')(
                    <Input
                      prefix={<Icon type="tag" />}
                      placeholder="项目描述"
                    />
                  )}
                </Form.Item>
                <Form.Item label="路径" {...formItemLayout}>
                  {getFieldDecorator('directoryPath', {
                    rules: [{ required: true, message: '请选择项目路径' }]
                  })(
                    <Input
                      readOnly
                      prefix={<Icon type="folder" />}
                      placeholder="路径"
                      onClick={this.onOpenDirectory}
                    />
                  )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  {getFieldDecorator('isBlank', {
                    valuePropName: 'checked'
                  })(<Checkbox>保留示例页面</Checkbox>)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button
                    icon="plus"
                    type="primary"
                    htmlType="submit"
                    loading={!!download || !!create || !!install}
                  >
                    {download || create || install || complete || '创建'}
                  </Button>
                  <Button
                    style={{marginLeft: 5}}
                    icon="home"
                    onClick={e => dispatch(routerRedux.push('/home'))}
                  >
                    返回
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="工程设置" key="project">
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    );
  }
}

export default createForm()(CreateProject);
