import React from 'react';
import { Icon, Divider } from 'antd';

export default (self) => [
  {
    title: '列',
    dataIndex: 'name'
  },
  {
    title: '名称',
    dataIndex: 'title'
  },
  {
    title: '表格(tableItem)',
    dataIndex: 'tableItem',
    align: 'center',
    render: (text, record) => {
      if (!text) return <Icon type="stop" />;
      else if (typeof text === 'string') {
        return text;
      } else {
        return <Icon type="check" />;
      }
    }
  },
  {
    title: '搜索框(searchItem)',
    dataIndex: 'searchItem',
    align: 'center',
    render: (text, record) => {
      if (!text) return <Icon type="stop" />;
      else if (typeof text === 'string') {
        return text;
      } else {
        return <Icon type="check" />;
      }
    }
  },
  {
    title: '表单(formItem)',
    dataIndex: 'formItem',
    align: 'center',
    render: (text, record) => {
      if (!text) return <Icon type="stop" />;
      else if (typeof text === 'string') {
        return text;
      } else {
        return <Icon type="check" />;
      }
    }
  },
  {
    title: '操作',
    render: (text, record) => (
      <span>
        <a>修改</a>
        <Divider type="vertical" />
        <a>删除</a>
      </span>
    )
  }
];