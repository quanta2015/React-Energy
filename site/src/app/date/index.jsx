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

const colOpt = title => ({
  chart: {
    type: 'bar',
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
    categories: ['机电', '电子二厂', '电子三厂'],
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
  plotOptions: {
    bar: {
      borderWidth: 0,
      // borderRadius: '50%',
      dataLabels: {
        enabled: true
      },
      groupPadding: 0.1
    }
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'top',
    x: -40,
    y: 80,
    floating: true,
    borderWidth: 1,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
    shadow: true
  },
  credits: {
    enabled: false
  },
  series: [
    {
      name: 'Year 1990',
      data: [632, 727, 3202]
    }
  ]
});

const lineOpt = title => ({
  chart: {
    type: 'spline',
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
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
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
    enabled: true,
    floating: true,
    align: 'right',
    verticalAlign: 'top',
    x: 0,
    y: -10,
    layout: 'horizontal',
    itemStyle: {
      color: '#FFFFFF',
      fontSize: '10px'
    }
  },
  plotOptions: {
    spline: {
      marker: {
        radius: 4,
        lineColor: '#666666',
        lineWidth: 1
      }
    }
  },
  series: [
    {
      name: 'Tokyo',
      marker: {
        symbol: 'square'
      },
      data: [
        5.2,
        5.7,
        8.7,
        13.9,
        18.2,
        21.4,
        25.0,
        {
          y: 26.4,
          marker: {
            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
          },
          accessibility: {
            description:
              'Sunny symbol, this is the warmest point in the ' + 'chart.'
          }
        },
        22.8,
        17.5,
        12.1,
        7.6
      ]
    }
  ]
});

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
    categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
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
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'top',
    x: -40,
    y: 80,
    floating: true,
    borderWidth: 1,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
    shadow: true
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  },
  series: [
    {
      name: 'Corn',
      data: [387749, 280000, 129000, 64300, 54000, 34300]
    },
    {
      name: 'Wheat',
      data: [45321, 140000, 10000, 140500, 19500, 113500]
    }
  ]
});

const Index = () => {
  const { store } = React.useContext(MobXProviderContext);
  const navigate = useNavigate();

  const [opt, setOpt] = useState(null);

  useEffect(() => {}, []);

  return (
    <div className={s.main}>
      <div className={s.lt}>
        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={colOpt('区域耗电(日)')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={colOpt('设备耗电(日)')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={colOpt('区域耗电(月)')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={colOpt('设备耗电(月)')}
          />
        </div>
      </div>

      <div className={s.rt}>
        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={lineOpt('设备总功率')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('30日')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={columnOpt('12时')}
          />
        </div>

        <div className={s.item}></div>
      </div>
    </div>
  );
};

export default observer(Index);
