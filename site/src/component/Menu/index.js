import React, { useState, useRef, useEffect } from 'react';
import { inject, observer, MobXProviderContext } from 'mobx-react';
import { Tooltip } from 'antd';
import s from './index.module.less';
import { useNavigate } from 'react-router-dom';
import { API_SERVER } from '@/constant/apis';

import logo from '@/img/logo-main.svg';
import we01 from '@/img/icon/we01.svg';
import we02 from '@/img/icon/we02.svg';
import we03 from '@/img/icon/we03.svg';
import we04 from '@/img/icon/we04.svg';

import menu01 from '@/img/icon/icon-menu-data.svg';
import menu02 from '@/img/icon/icon-menu-token.svg';
import menu03 from '@/img/icon/icon-menu-ele.svg';
import menu04 from '@/img/icon/icon-menu-pow.svg';
import menu05 from '@/img/icon/icon-menu-db.svg';
import menu06 from '@/img/icon/icon-menu-cal.svg';
import menu07 from '@/img/icon/icon-menu-sys.svg';
import menu08 from '@/img/icon/icon-menu-logout.svg';
import menu09 from '@/img/icon/icon-menu-fac.svg';
import menu10 from '@/img/icon/icon-menu-bar.svg';

const MENU = [
  { router: '/report/history', label: '冷冻机数据分析', img: menu01 },
  { router: '/report/device', label: '设备数据报表', img: menu02 },
  { router: '/report/run', label: '实时系统状态监控', img: menu03 },
  { router: '', label: '菜单说明内容', img: menu04 },
  { router: '', label: '菜单说明内容', img: menu05 },
  { router: '', label: '菜单说明内容', img: menu06 },
  { router: '', label: '菜单说明内容', img: menu09 },
  { router: '', label: '菜单说明内容', img: menu10 },
  { router: '', label: '菜单说明内容', img: menu07 },
  { router: '/logout', label: '菜单说明内容', img: menu08 }
];

const Menu = () => {
  const { store } = React.useContext(MobXProviderContext);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [we, setWe] = useState(null);

  const [curScreen, setCurScreen] = useState(0);
  const [curMenu, setCurMenu] = useState(-1);

  const doLogout = () => {
    store.saveUser(null);
    navigate('login');
  };

  useEffect(() => {
    navigate('/report/run');


    store.weather(null).then(r => {
      setWe(r);
    });
  }, []);

  const doMenu = o => {
    setCurScreen(-1);
    if (o === MENU.length - 1) {
      doLogout();
    }else{
      navigate(MENU[o].router);
      setCurMenu(o);
    }
  };

  const doSwitchScreen = i => {
    setCurMenu(-1);
    setCurScreen(i);
    switch (i) {
      case 0:
        navigate('/');
        break;
      case 1: navigate('period'); break;
      case 2: navigate('device'); break;
      case 3: navigate('run'); break;
      default:
        break;
    }
  };

  return (
    <header className={s.header}>
      <div className={s.headerLeft}>
        <img src={logo} className={s.logo} />
      </div>

      <div className={s.headerCenter}>
        <i>{'2025年1月24日 16:29'}</i>
        <span>安诺赛能源管理平台</span>
        <div className={s.menu}>
          {MENU.map((o, i) => (
            <span key={i} className={curMenu===i?'sel':''} >
              <Tooltip placement="top" color={'geekblue'} title={o.label}>
                <img src={o.img} onClick={() => doMenu(i)} />
              </Tooltip>
            </span>
          ))}
        </div>

        <div className={s.we}>
          <div className={s.weather}>
            <img src={`${API_SERVER}/img/${we?.icon}.png`} alt="" />
            <span>{we?.text}</span>
          </div>

          <div className={s.wrap}>
            <div className={s.item}>
              <em>室外温度</em>
              <div>
                <img src={we01} alt="" />
                <span data-unit="℃">{we?.temp}</span>
              </div>
            </div>

            <div className={s.item}>
              <em>湿球温度</em>
              <div>
                <img src={we02} alt="" />
                <span data-unit="%">{we?.humidity}</span>
              </div>
            </div>
            <div className={s.item}>
              <em>相对湿度</em>
              <div>
                <img src={we03} alt="" />
                <span data-unit="%">{we?.dew}</span>
              </div>
            </div>
            <div className={s.item}>
              <em>降雨量</em>
              <div>
                <img src={we04} alt="" />
                <span data-unit="mm">{we?.precip}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={s.switch}>
          <span className={curScreen===0?'act':''} onClick={() => doSwitchScreen(0)}>监控汇总</span>
          <span className={curScreen===1?'act':''} onClick={() => doSwitchScreen(1)}>分时耗电统计</span>
          <span className={curScreen===2?'act':''} onClick={() => doSwitchScreen(2)}>设备耗电统计</span>
        </div>
      </div>

      <div className={s.headerRight}>
        <div className={s.icons}>
          <div className={s.iconUser}></div>
        </div>
      </div>
    </header>
  );
};

export default inject('store')(observer(Menu));
