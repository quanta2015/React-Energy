import React, { useEffect, useState } from 'react';
import { inject, observer, MobXProviderContext } from 'mobx-react';
import {
  POS_ARROW,
  POS_FM,
  POS_CWP,
  POS_CHP,
  POS_CT,
  POS_CH,
  LABEL,
  URL
} from '@/constant/pos';
import { loadUser } from '@/util/token';
import { useNavigate } from 'react-router-dom';
import { sensorDataToList, formatNumber } from '@/util/fn';
import mqtt from 'mqtt';
import {
  serverUrl,
  SAV_TIME,
  SubRtg,
  saveData,
  cfList,
  sortData,
  groupData,
  mergeData,
  merge
} from './mqtt';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import { OptGauge } from './opt/gauge';
import { OptPie } from './opt/pie';
import { OptLineInit } from './opt/line';

import s from './index.module.less';

import sysbg from '@/img/bg/sys-bg.avif';

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

var ret = [];

const Index = () => {
  const { store } = React.useContext(MobXProviderContext);
  const navigate = useNavigate();

  const columnOpt = title => ({
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: {
        color: '#FFFFFF'
      }
    },
    title: {
      text: title,
      align: 'left',
      style: {
        color: '#9ca3d8',
        fontSize: '15px'
      }
    },
    yAxis: {
      title: {
        text: 'unit',
        style: {
          color: '#FFFFFF',
          fontSize: '12px'
        }
      },
      labels: {
        style: {
          color: '#FFFFFF'
        }
      },
      gridLineWidth: 1,
      gridLineColor: 'rgba(255,255,255,.2)'
    },
    xAxis: {
      categories: [
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '24:00'
      ],
      labels: {
        style: {
          color: '#FFFFFF'
        }
      },
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      gridLineWidth: 1,
      gridLineColor: 'rgba(255,255,255,.2)',
      gridLineDashStyle: 'Dash'
    },
    legend: {
      layout: 'horizontal',
      align: 'right',
      verticalAlign: 'top',
      x: 0,
      y: 0,
      floating: true,
      borderWidth: 0,
      backgroundColor: 'transparent', // 设置背景为透明
      shadow: true,
      itemStyle: {
        color: '#FFFFFF'
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: '1号冷冻机',
        data: [
          387749, 280000, 129000, 64300, 54000, 34300, 40000, 35000, 45000,
          30000, 32000, 41000, 39000, 42000, 47000, 36000, 37000, 38000, 39000,
          40000, 41000, 42000, 43000, 44000
        ]
      },
      {
        name: '2号冷冻机',
        data: [
          45321, 140000, 10000, 140500, 19500, 113500, 120000, 135000, 125000,
          118000, 114000, 132000, 140000, 123000, 119000, 128000, 130000,
          134000, 138000, 145000, 142000, 139000, 137000, 136000
        ]
      },
      {
        name: '3号冷冻机',
        data: [
          45321, 140000, 10000, 140500, 19500, 113500, 90000, 85000, 75000,
          72000, 78000, 82000, 81000, 83000, 85000, 86000, 88000, 90000, 91000,
          92000, 93000, 94000, 95000, 96000
        ]
      },
      {
        name: '4号冷冻机',
        data: [
          45321, 140000, 10000, 140500, 19500, 113500, 40000, 38000, 36000,
          35000, 34000, 32000, 33000, 31000, 30000, 29000, 28000, 27000, 26000,
          25000, 24000, 23000, 22000, 21000
        ]
      }
    ]
  });

  return (
    <div className={s.main}>
      <div className={s.lt}>
        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('冷冻机耗电')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('冷冻泵耗电')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('冷却泵耗电')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('冷却塔耗电')}
          />
        </div>
      </div>
      <div className={s.rt}>
        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={columnOpt('a')} />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('机电系统能效比')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('机电耗电功率及占比')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('电子三厂耗电功率及占比')}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(Index);
