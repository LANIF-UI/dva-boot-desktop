import React, { Component } from 'react';
import {
  Layout,
  Form,
  Input,
  Icon,
  Button,
  Checkbox,
  Select,
  Modal
} from 'antd';
import { connect } from 'dva';
import './index.less';
import { routerRedux } from 'dva/router';
import { join } from 'path';
import { existsSync } from 'fs-extra';

const { Header, Content } = Layout;
const createForm = Form.create;
const Option = Select.Option;

@connect(({ createRoute, global }) => ({
  createRoute,
  currentProject: global.currentProject
}))
class CreateRoute extends Component {
  state = {
    directory: null
  };

  handleSubmit = e => {
    const { dispatch, currentProject } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const target = join(
          currentProject.directoryPath,
          'src',
          'routes',
          values.name
        );
        if (existsSync(target)) {
          Modal.confirm({
            title: '提示',
            content: '文件夹已存在，是否覆盖？',
            onOk() {
              dispatch({
                type: 'createRoute/newRoute',
                payload: values
              });
            }
          });
        } else {
          dispatch({
            type: 'createRoute/newRoute',
            payload: values
          });
        }
      }
    });
  };

  render() {
    const { createRoute, form, dispatch } = this.props;
    const { loading } = createRoute;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
    const tailFormItemLayout = {
      wrapperCol: { span: 24, offset: 6 }
    };

    return (
      <Layout className="create-route">
        <Header />
        <Content>
          <Form onSubmit={this.handleSubmit} className="create-form">
            <Form.Item label="页面模板" {...formItemLayout}>
              {getFieldDecorator('template', {
                rules: [{ required: true, message: '请选择模板' }],
                initialValue: 'blank'
              })(
                <Select>
                  <Option value="blank">Blank(空白页)</Option>
                  <Option value="dva-boot-mobile">CRUD(标准列表页)</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="页面Name" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入页面名称' },
                  { pattern: /^[a-zA-z]+$/, message: '文件名称请用英文' }
                ]
              })(
                <Input
                  prefix={<Icon type="edit" />}
                  placeholder="创建文件夹及组件所用的名称，请用英文"
                  onChange={this.onChangeName}
                />
              )}
            </Form.Item>
            <Form.Item label="页面Title" {...formItemLayout}>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入页面Title' }]
              })(
                <Input
                  prefix={<Icon type="edit" />}
                  placeholder="设置<title />显示信息"
                  onChange={this.onChangeName}
                />
              )}
            </Form.Item>
            <Form.Item label="路由地址" {...formItemLayout}>
              {getFieldDecorator('route', {
                rules: [{ required: true, message: '请输入路由地址' }]
              })(<Input prefix={<Icon type="tag" />} placeholder="路由地址" />)}
            </Form.Item>
            <Form.Item label="命名空间" {...formItemLayout}>
              {getFieldDecorator('namespace', {
                rules: [{ required: true, message: '请输入命名空间' }]
              })(<Input prefix={<Icon type="tag" />} placeholder="命名空间" />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              {getFieldDecorator('isAsync', {
                valuePropName: 'checked',
                initialValue: true
              })(<Checkbox>是否按需加载</Checkbox>)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button icon="plus" type="primary" htmlType="submit" loading={loading}>
                生成页面
              </Button>
              <Button
                style={{ marginLeft: 5 }}
                icon="home"
                onClick={e => dispatch(routerRedux.push('/home'))}
              >
                返回
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    );
  }
}

export default createForm()(CreateRoute);
