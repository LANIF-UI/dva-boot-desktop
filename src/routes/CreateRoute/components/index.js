import React, { Component } from 'react';
import { Layout, Form, Input, Icon, Button, Checkbox, Select } from 'antd';
import { connect } from 'dva';
import './index.less';
import { routerRedux } from 'dva/router';

const { Header, Content } = Layout;
const createForm = Form.create;
const Option = Select.Option;

@connect(({ createRoute }) => ({ createRoute }))
class CreateRoute extends Component {
  state = {
    directory: null
  };

  handleSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'createRoute/newRoute',
          payload: values
        });
      }
    });
  };

  render() {
    const { createRoute, form, dispatch } = this.props;
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
            <Form.Item label="页面标题" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入页面名称' }]
              })(
                <Input
                  prefix={<Icon type="edit" />}
                  placeholder="页面名称"
                  onChange={this.onChangeName}
                />
              )}
            </Form.Item>
            <Form.Item label="路由地址" {...formItemLayout}>
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入路由地址' }]
              })(
                <Input prefix={<Icon type="tag" />} placeholder="路由地址" />
              )}
            </Form.Item>
            <Form.Item label="命名空间" {...formItemLayout}>
              {getFieldDecorator('directoryPath')(
                <Input
                  readOnly
                  prefix={<Icon type="folder" />}
                  placeholder="配置dva model的namespace"
                  onClick={this.onOpenDirectory}
                />
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              {getFieldDecorator('isBlank', {
                valuePropName: 'checked'
              })(<Checkbox>是否按需加载</Checkbox>)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button icon="plus" type="primary" htmlType="submit">
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
