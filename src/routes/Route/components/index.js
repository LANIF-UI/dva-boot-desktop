import './style.less';
import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import BaseComponent from 'components/BaseComponent';
const { Content } = Layout;

@connect(({ global }) => ({ global }))
export default class extends BaseComponent {
  render() {
    return (
      <div>
        
      </div>
    );
  }
}