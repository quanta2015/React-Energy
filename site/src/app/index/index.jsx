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

  const [code, setCode] = useState('cps_1');
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState({});
  const [pieData1, setPieData1] = useState([]);
  const [pieData2, setPieData2] = useState([]);
  const [optLine1, setOptLine1] = useState(null);
  const [optLine2, setOptLine2] = useState(null);
  const [optLine3, setOptLine3] = useState(null);
  const [optLine4, setOptLine4] = useState(null);
  const [optLine5, setOptLine5] = useState(null);

  const [eer1, setEer1] = useState(0);
  const [eer2, setEer2] = useState(0);

  useEffect(() => {
    let user = loadUser();
    if (!user) {
      navigate('/login');
      store.saveUser(user);
    }
  }, []);

  useEffect(() => {
    const client = mqtt.connect(serverUrl());
    client.on('connect', () => {
      console.log('服务器连接成功');
      cfList.map(e => client.subscribe(SubRtg(e), {}));
    });
    client.on('message', (addr, msg) => saveData(msg, ret));

    

    const interval = setInterval(() => {
      const filtered = ret.filter(item => item.code === code);

      filtered.map(o => {
        data[o.key] = o.val;
      });
      const dataList = sensorDataToList(data, code);
      setData({ ...data });
      setDataList({ ...dataList });
      // console.log(data,'data')
      // console.log(dataList,'dataList')
      const {
        chg_1_chw_wtpi,
        chg_2_chw_wtpi,
        chg_1_chw_wtpo,
        chg_2_chw_wtpo,
        chg_1_chw_wfla,
        chg_2_chw_wfla,
        sys_1_poa,
        sys_2_poa
      } = data;
      const _eer1 =
        ((chg_1_chw_wtpi - chg_1_chw_wtpo) * chg_1_chw_wfla * 1.163) /
        sys_1_poa;
      const _eer2 =
        ((chg_2_chw_wtpi - chg_2_chw_wtpo) * chg_2_chw_wfla * 1.163) /
        sys_2_poa;
      setEer1(formatNumber(_eer1));
      setEer2(formatNumber(_eer2));
    }, SAV_TIME);


    return () => {
      if (client) {
        client.end(); // 断开 MQTT 连接
        console.log('MQTT 连接已断开');
      }
      clearInterval(interval); // 清除定时器
    };
  }, []);

  useEffect(() => {
    store.qryEnergyScreen(null).then(({ data }) => {
      // console.log(data, 'data');

      const category = [];
      const series1 = [
        { name: '机电', data: [], color: '#a6f900' },
        { name: '电子三厂', data: [], color: '#00f921' }
      ];
      const series2 = [
        { name: '机电', data: [], color: '#0262fc' },
        { name: '电子三厂', data: [], color: '#00f4f4' }
      ];
      const series3 = [
        { name: '机电供水', data: [], color: '#2CAFFE' },
        { name: '机电回水', data: [], color: '#00E272', visible: false },
        { name: '电子三厂供水', data: [], color: '#f400fc' },
        { name: '电子三厂回水', data: [], color: '#ff6600', visible: false }
      ];
      const series4 = [
        { name: '机电供水', data: [], color: '#2CAFFE' },
        { name: '机电回水', data: [], color: '#00E272', visible: false },
        { name: '电子三厂供水', data: [], color: '#f400fc' },
        { name: '电子三厂回水', data: [], color: '#ff6600', visible: false }
      ];
      const series5 = [{ name: '室外温度', data: [], color: '#d8f72c' }];

      data.map((o, i) => {
        category.push(o.dt);
        series1[0].data.push(o.sys_1_poa);
        series1[1].data.push(o.sys_2_poa);

        series2[0].data.push(o.sys_1_eer_o);
        series2[1].data.push(o.sys_2_eer_o);

        series3[0].data.push(o.chg_1_chw_wtpo);
        series3[1].data.push(o.chg_1_chw_wtpi);
        series3[2].data.push(o.chg_2_chw_wtpo);
        series3[3].data.push(o.chg_2_chw_wtpi);

        series4[0].data.push(o.chg_1_cw_wtpo);
        series4[1].data.push(o.chg_2_cw_wtpi);
        series4[2].data.push(o.chg_2_cw_wtpo);
        series4[3].data.push(o.chg_2_cw_wtpi);

        series5[0].data.push(o.out_1_ftp);
      });
      setOptLine1(OptLineInit(category, series1, '耗电功率', 'kw'));
      setOptLine2(OptLineInit(category, series2, '系统能效比', ''));
      setOptLine3(OptLineInit(category, series3, '冷冻水供回水', '℃'));
      setOptLine4(OptLineInit(category, series4, '冷却水供回水', '℃'));
      setOptLine5(OptLineInit(category, series5, '天气', '℃'));
    });
  }, []);

  const fmList =
    dataList['fm'] && dataList['fm'].filter((_, index) => index !== 4);

  useEffect(() => {
    setPieData1([
      ['冷冻机', parseFloat(data.chg_1_poa)],
      ['冷冻泵', parseFloat(data.chpg_1_poa)],
      ['冷却泵', parseFloat(data.cwpg_1_poa)],
      ['冷却塔', parseFloat(data.ctg_1_poa)]
    ]);
    setPieData2([
      ['冷冻机', parseFloat(data.chg_2_poa)],
      ['冷冻泵', parseFloat(data.chpg_2_poa)],
      ['冷却泵', parseFloat(data.cwpg_2_poa)],
      ['冷却塔', parseFloat(data.ctg_2_poa)]
    ]);
  }, [data]);

  return (
    <div className={s.main}>
      <div className={s.lt}>
        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={optLine5} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={optLine1} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={optLine3} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={optLine4} />
        </div>
      </div>

      {/* 中心实时监控 */}
      <div className={s.cn}>
        <div className={s.sys}>
          <img src={sysbg} alt="" />
          {POS_ARROW.map((o, i) => (
            <img
              key={i}
              src={o.url}
              className={s.arrow}
              style={{
                left: o.x,
                top: o.y,
                transform: o.rev ? 'rotateY(180deg)' : ''
              }}
            />
          ))}

          {dataList['fm'] &&
            POS_FM.map(
              (o, i) =>
                dataList['fm'][i].status !== 'off' && (
                  <img
                    key={i}
                    src={URL('fm', fmList[i].status)}
                    className={s.fm}
                    style={{ left: o.x, top: o.y }}
                  />
                )
            )}

          {dataList['cwp'] &&
            POS_CWP.map(
              (o, i) =>
                dataList['cwp'][i].status !== 'off' && (
                  <img
                    key={i}
                    src={URL('cwp', dataList['cwp'][i].status)}
                    className={s.cp}
                    style={{ left: o.x, top: o.y }}
                  />
                )
            )}

          {dataList['chp'] &&
            POS_CHP.map(
              (o, i) =>
                dataList['chp'][i].status !== 'off' && (
                  <img
                    key={i}
                    src={URL('chp', dataList['chp'][i].status)}
                    className={s.cp}
                    style={{ left: o.x, top: o.y }}
                  />
                )
            )}

          {dataList['ct'] &&
            POS_CT.map(
              (o, i) =>
                dataList['ct'][i].status !== 'off' && (
                  <img
                    key={i}
                    src={URL('ct', dataList['ct'][i].status)}
                    className={s.ct}
                    style={{ left: o.x, top: o.y, width: o.w, height: o.h }}
                  />
                )
            )}

          {dataList['ch'] &&
            POS_CH.map(
              (o, i) =>
                dataList['ch'][i].status !== 'off' && (
                  <img
                    key={i}
                    src={URL('ch', dataList['ch'][i].status)}
                    className={s.ct}
                    style={{ left: o.x, top: o.y, width: o.w }}
                  />
                )
            )}

          {LABEL.map((o, i) => (
            <label key={i} className={s.label} style={{ left: o.x, top: o.y }}>
              <i>{o.label}</i>
              {o.key && data[o.key] && (
                <em data-unit={o.unit}>{o.key ? data[o.key] : ''}</em>
              )}
            </label>
          ))}
        </div>

        <div className={s.tab}>
          <div className={s.gp}>
            <h1>机电</h1>
            <div className={s.row}>
              <div className={s.col}>
                <label>冷机功率</label>
                <span data-unit="kw">{data.chg_1_poa}</span>
              </div>
              <div className={s.col}>
                <label>冷机1电流比</label>
                <span data-unit="%">{data.ch_1_rlap}</span>
              </div>
              <div className={s.col}>
                <label>冷机2电流比</label>
                <span data-unit="%">{data.ch_2_rlap}</span>
              </div>
              <div className={s.col}>
                <label>冷却泵功率</label>
                <span data-unit="kw">{data.chpg_1_poa}</span>
              </div>
              <div className={s.col}>
                <label>冷冻泵功率</label>
                <span data-unit="kw">{data.cwpg_1_poa}</span>
              </div>
            </div>
          </div>

          <div className={s.gp}>
            <h1>电子三厂</h1>
            <div className={s.row}>
              <div className={s.col}>
                <label>冷机功率</label>
                <span data-unit="kw">{data.chg_2_poa}</span>
              </div>
              <div className={s.col}>
                <label>冷却泵功率</label>
                <span data-unit="kw">{data.chpg_2_poa}</span>
              </div>
              <div className={s.col}>
                <label>冷冻泵功率</label>
                <span data-unit="kw">{data.cwpg_2_poa}</span>
              </div>
              <div className={s.col}>
                <label>冷机3电流比</label>
                <span data-unit="kw">{data.ch_3_rlap}</span>
              </div>
              <div className={s.col}>
                <label>冷机4电流比</label>
                <span data-unit="kw">{data.ch_4_rlap}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.rt}>
        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={optLine2} />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={OptGauge(eer1, '机电系统能效比')}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={OptGauge(eer2, '电子三厂系统能效比')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={OptPie(pieData1, '机电耗电功率及占比')}
          />
        </div>

        <div className={s.item}>
          <HighchartsReact
            highcharts={Highcharts}
            options={OptPie(pieData2, '电子三厂耗电功率及占比')}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(Index);
