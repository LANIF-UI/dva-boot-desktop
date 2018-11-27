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
          <span>启动</span>
        </div>
        <div className="col">
          <Icon type="chrome" font="iconfont" />
          <span>浏览器</span>
        </div>
        <div className="col">
          <Icon type="webpack" font="iconfont" />
          <span>打包</span>
        </div>
        <div className="col">
          <Icon type="vscode" font="iconfont" />
          <span>VSCode</span>
        </div>
        <div className="col">
          <Icon type="cmd" font="iconfont" />
          <span>命令行</span>
        </div>
        <div className="right">
          <Button icon="form" size="small">
            运行日志
          </Button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
