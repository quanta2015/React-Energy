import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { inject, observer, MobXProviderContext } from 'mobx-react';

import Menu from '@/component/Menu';
// import Nav from '@/component/Nav'

import s from './index.module.less';
import logo from '@/img/logo.svg';

const Layout = () => {
  const { store } = React.useContext(MobXProviderContext);

  const userAgent = navigator.userAgent.toLowerCase();
  const mobileDevices = ['android', 'iphone', 'ipad', 'ipod', 'windows phone'];
  const isMobileDevice = mobileDevices.some(device =>
    userAgent.includes(device)
  );
  const isSmallScreen = window.innerWidth < 768;
  store.mobile = isMobileDevice || isSmallScreen;

  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};

export default inject('store')(observer(Layout));
