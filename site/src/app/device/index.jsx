import React, { useEffect, useState } from 'react';
import { inject, observer, MobXProviderContext } from 'mobx-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import { OptColumn } from './opt/column';

import s from './index.module.less';

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const clr_ch = '#cde064';
const clr_chp = '#33e94d';
const clr_cwp = '#605bea';
const clr_ct = '#66c3f5';

const Device = () => {
  const { store } = React.useContext(MobXProviderContext);

  const [opt_h_ch,  setOptHCh] = useState(null);
  const [opt_h_chp, setOptHChp] = useState(null);
  const [opt_h_cwp, setOptHCwp] = useState(null);
  const [opt_h_ct,  setOptHCt] = useState(null);
  
  const [opt_d_ch,  setOptDCh] = useState(null);
  const [opt_d_chp, setOptDChp] = useState(null);
  const [opt_d_cwp, setOptDCwp] = useState(null);
  const [opt_d_ct,  setOptDCt] = useState(null);

  const [opt_m_ch,  setOptMCh] = useState(null);
  const [opt_m_chp, setOptMChp] = useState(null);
  const [opt_m_cwp, setOptMCwp] = useState(null);
  const [opt_m_ct,  setOptMCt] = useState(null);
  

  

  useEffect(() => {
    store.qryEnergyDevHour(null).then(({ data }) => {
      // console.log(data, 'data hour');
      const cate = [];
      const seriaCh  = [{ name: '冷冻机耗电', data:[], color: clr_ch }]
      const seriaChp = [{ name: '冷冻泵耗电', data:[], color: clr_chp }]
      const seriaCwp = [{ name: '冷却泵耗电', data:[], color: clr_cwp }]
      const seriaCt  = [{ name: '冷却塔耗电', data:[], color: clr_ct  }]
      
      data.map(o=>{
        cate.push(o.dt);
        seriaCh[0].data.push(o.chg_1_poa+o.chg_2_poa);
        seriaChp[0].data.push(o.chpg_1_poa+o.chpg_2_poa);
        seriaCwp[0].data.push(o.cwpg_1_poa+o.cwpg_2_poa);
        seriaCt[0].data.push(o.ctg_1_poa+o.ctg_2_poa);
      })
      setOptHCh(OptColumn(cate, seriaCh,   "冷冻机总耗电量（时）","kwh"));
      setOptHChp(OptColumn(cate, seriaChp, "冷冻泵总耗电量（时）","kwh"));
      setOptHCwp(OptColumn(cate, seriaCwp, "冷却泵总耗电量（时）","kwh"));
      setOptHCt(OptColumn(cate, seriaCt,   "冷却塔总耗电量（时）","kwh"));
    })
  }, []);

  useEffect(() => {
    store.qryEnergyDevDay(null).then(({ data }) => {
      // console.log(data, 'data day');
      const cate = [];
      const seriaCh  = [{ name: '冷冻机耗电', data:[], color: clr_ch }]
      const seriaChp = [{ name: '冷冻泵耗电', data:[], color: clr_chp}]
      const seriaCwp = [{ name: '冷却泵耗电', data:[], color: clr_cwp}]
      const seriaCt  = [{ name: '冷却塔耗电', data:[], color: clr_ct }]
      
      data.map(o=>{
        cate.push(o.dt);
        seriaCh[0].data.push(o.chg_1_poa+o.chg_2_poa);
        seriaChp[0].data.push(o.chpg_1_poa+o.chpg_2_poa);
        seriaCwp[0].data.push(o.cwpg_1_poa+o.cwpg_2_poa);
        seriaCt[0].data.push(o.ctg_1_poa+o.ctg_2_poa);
      })
      setOptDCh(OptColumn(cate, seriaCh,   "冷冻机总耗电量（日）","kwh"));
      setOptDChp(OptColumn(cate, seriaChp, "冷冻泵总耗电量（日）","kwh"));
      setOptDCwp(OptColumn(cate, seriaCwp, "冷却泵总耗电量（日）","kwh"));
      setOptDCt(OptColumn(cate, seriaCt,   "冷却塔总耗电量（日）","kwh"));
    })
  }, []);

  useEffect(() => {
    store.qryEnergyDevMonth(null).then(({ data }) => {
      // console.log(data, 'data day');
      const cate = [];
      const seriaCh  = [{ name: '冷冻机耗电', data:[], color: clr_ch }]
      const seriaChp = [{ name: '冷冻泵耗电', data:[], color: clr_chp}]
      const seriaCwp = [{ name: '冷却泵耗电', data:[], color: clr_cwp}]
      const seriaCt  = [{ name: '冷却塔耗电', data:[], color: clr_ct }]
      
      data.map(o=>{
        cate.push(o.dt);
        seriaCh[0].data.push(o.chg_1_poa+o.chg_2_poa);
        seriaChp[0].data.push(o.chpg_1_poa+o.chpg_2_poa);
        seriaCwp[0].data.push(o.cwpg_1_poa+o.cwpg_2_poa);
        seriaCt[0].data.push(o.ctg_1_poa+o.ctg_2_poa);
      })
      setOptMCh(OptColumn(cate, seriaCh,   "冷冻机总耗电量（月）","kwh"));
      setOptMChp(OptColumn(cate, seriaChp, "冷冻泵总耗电量（月）","kwh"));
      setOptMCwp(OptColumn(cate, seriaCwp, "冷却泵总耗电量（月）","kwh"));
      setOptMCt(OptColumn(cate, seriaCt,   "冷却塔总耗电量（月）","kwh"));
    })
  }, []);

  return (
    <div className={s.main}>
      <div className={s.lt}>
        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_h_ch} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_h_chp} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_h_cwp} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_h_ct} />
        </div>
      </div>

      <div className={s.center}>
        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_d_ch} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_d_chp} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_d_cwp} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_d_ct} />
        </div>
      </div>


      <div className={s.rt}>
        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_m_ch} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_m_chp} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_m_cwp} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_m_ct} />
        </div>
      </div>
    </div>
  );
};

export default observer(Device);
