import React, { Component } from 'react';
import { Button } from 'antd';
import Icon from 'components/Icon';
import './style/index.less';

class Toolbar extends Component {
  render() {
    return (
      <div gutter={16} className="top-toolbar">
        <div className="col">
          <Icon type="start" font="iconfont" />
        </div>
        <div className="col">
          <Icon type="chrome" font="iconfont" />
        </div>
        <div className="col">
          <Icon type="webpack" font="iconfont" />
        </div>
        <div className="col">
          <Icon type="vscode" font="iconfont" />
        </div>
        <div className="col">
          <Icon type="cmd" font="iconfont" />
        </div>
        <div className="right">
          <Button icon="form" size="small">运行日志</Button>
        </div>
      </div>
    );
  }
}

export default Toolbar;