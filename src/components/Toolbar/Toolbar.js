import React, { Component } from 'react';
import { Button } from 'antd';
import Icon from 'components/Icon';
import cx from 'classnames';
import './style/index.less';

class Toolbar extends Component {
  state = {
    run: false,
    stop: false
  };

  onAction = type => {
    switch (type) {
      case 'run':
        this.setState({
          run: true,
          stop: false
        });
        break;
      case 'stop':
        this.setState({
          run: false,
          stop: true
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { run, stop } = this.state;
    return (
      <div gutter={16} className="top-toolbar">
        <div
          className={cx('col', { run, stop })}
          onClick={e => this.onAction(run ? 'stop' : 'run')}
        >
          <Icon type={run ? 'stop' : 'start'} font="iconfont" />
          <span>
            {run ? '停止' : null}
            {(!run && !stop) || stop ? '启动' : null}
          </span>
        </div>
        <div className="col" onClick={e => this.onAction('browser')}>
          <Icon type="chrome" font="iconfont" />
          <span>浏览器</span>
        </div>
        <div className="col" onClick={e => this.onAction('build')}>
          <Icon type="webpack" font="iconfont" />
          <span>打包</span>
        </div>
        <div className="col" onClick={e => this.onAction('vscode')}>
          <Icon type="vscode" font="iconfont" />
          <span>VSCode</span>
        </div>
        <div className="col" onClick={e => this.onAction('cmd')}>
          <Icon type="cmd" font="iconfont" />
          <span>终端</span>
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
