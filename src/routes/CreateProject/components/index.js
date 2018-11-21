import React, { Component } from 'react';
import { Layout, Form, Input, Icon } from 'antd';
import { connect } from 'dva';
import './index.less';
const { Header, Content } = Layout;
const createForm = Form.create;

@connect()
class CreateProject extends Component {
  state = {
    current: 0
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const {} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    return (
      <Layout className="create-project">
        <Header />
        <Content>
          <Form onSubmit={this.handleSubmit} className="create-form">
            <Form.Item label="项目名称" {...formItemLayout}>
              {getFieldDecorator('项目名称', {
                rules: [{ required: true, message: '请输入项目名称' }]
              })(
                <Input prefix={<Icon type="edit" />} placeholder="项目名称" />
              )}
            </Form.Item>
            <Form.Item label="项目描述" {...formItemLayout}>
              {getFieldDecorator('description')(
                <Input prefix={<Icon type="tag" />} placeholder="项目描述" />
              )}
            </Form.Item>
            <Form.Item label="路径" {...formItemLayout}>
              {getFieldDecorator('directoryPath', {
                rules: [{ required: true, message: '请选择项目路径' }]
              })(<Input prefix={<Icon type="folder" />} placeholder="路径" />)}
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    );
  }
}

export default createForm()(CreateProject);
