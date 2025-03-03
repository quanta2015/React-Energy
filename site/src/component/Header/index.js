/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import cls from 'classnames';

import s from './index.module.less';

const Header = ({ title, float, pos }) => {
  return (
    <header className={cls(s.hd, float ? s.float : '', pos ? s.pos : '')}>
      <span>{title}</span>
    </header>
  );
};

export default Header;
