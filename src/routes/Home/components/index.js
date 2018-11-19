import React from 'react';
import { connect } from 'dva';
import './style.less';
import BaseComponent from 'components/BaseComponent';

@connect()
export default class Home extends BaseComponent {

  render() {
    return ( 
      <div className="home-page">
      </div>
    )
  }
}