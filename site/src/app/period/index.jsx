import React, { useEffect, useState } from 'react';
import { inject, observer, MobXProviderContext } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { OptBar } from './opt/bar';
import { OptPie } from './opt/pie';
import { OptLineInit } from './opt/line';
import {computeStats} from './summary';
import s from './index.module.less';

import icon_el from '@/img/icon/icon_el.svg'
import icon_peak from '@/img/icon/icon_peak.svg'
import icon_err from '@/img/icon/icon_err.svg'
import icon_info from '@/img/icon/icon_info.svg'
import icon_percent from '@/img/icon/icon_percent.svg'


HighchartsMore(Highcharts);


const Period = () => {
  const { store } = React.useContext(MobXProviderContext);

  const [opt_d_area_el, setOptDAreaEl] = useState(null);
  const [opt_d_dev_el,  setOptDDevEl] = useState(null);
  const [opt_m_area_el, setOptMAreaEl] = useState(null);
  const [opt_m_dev_el,  setOptMDevEl] = useState(null);

  const [optHour,  setOptHour]  = useState(null);
  const [optDay,   setOptDay]   = useState(null);
  const [optMonth, setOptMonth] = useState(null);


  const [opt_pie1, setOptPie1] = useState(null);
  const [opt_pie2, setOptPie2] = useState(null);
  const [opt_pie3, setOptPie3] = useState(null);
  const [opt_pie4, setOptPie4] = useState(null);
  const [opt_pie5, setOptPie5] = useState(null);
  const [opt_pie6, setOptPie6] = useState(null);
  const [opt_pie7, setOptPie7] = useState(null);
  const [opt_pie8, setOptPie8] = useState(null);

  const [summary, setSummary] = useState([]);
  const [hour, setHour] = useState([]);
  const [day, setDay] = useState([]);
  const [month, setMonth] = useState([]);
  const [info, setInfo] = useState({});

  useEffect(() => {
    store.qryEnergySummary(null).then(({ data }) => {
      console.log(data, 'data');

      const cate_area = ['机电','电子三厂','电子二厂']
      const cate_dev  = ['冷冻机','冷冻泵','冷却泵','冷却塔']

      const d0_s1 = data.filter(o=> o.period === 'd0' && o.code === 'cps_1')[0];
      const d0_s2 = data.filter(o=> o.period === 'd0' && o.code === 'cps_2')[0];
      const d1_s1 = data.filter(o=> o.period === 'd1' && o.code === 'cps_1')[0];
      const d1_s2 = data.filter(o=> o.period === 'd1' && o.code === 'cps_2')[0];
      const m0_s1 = data.filter(o=> o.period === 'm0' && o.code === 'cps_1')[0];
      const m0_s2 = data.filter(o=> o.period === 'm0' && o.code === 'cps_2')[0];
      const m1_s1 = data.filter(o=> o.period === 'm1' && o.code === 'cps_1')[0];
      const m1_s2 = data.filter(o=> o.period === 'm1' && o.code === 'cps_2')[0];

      const d0_clr = '#ff6600';
      const d1_clr = '#2caffe';
      const d1_area_el = [{ name: '当日', color:d1_clr, data: [d1_s1.sys_1_poa, d1_s1.sys_2_poa, d1_s2.sys_2_poa] },
                          { name: '昨日', color:d0_clr, data: [d0_s1.sys_1_poa, d0_s1.sys_2_poa, d0_s2.sys_2_poa] }];
      const d1_dev_el  = [{ name: '当日', color:d1_clr, data: [d1_s1.chg_1_poa + d1_s1.chg_2_poa + d1_s2.chg_2_poa,
                                                  d1_s1.chpg_1_poa+d1_s1.chpg_2_poa+d1_s2.chpg_2_poa,
                                                  d1_s1.cwpg_1_poa+d1_s1.cwpg_2_poa+d1_s2.cwpg_2_poa,
                                                  d1_s1.ctg_1_poa+d1_s2.ctg_2_poa] }, 
                          { name: '昨日', color:d0_clr, data: [d0_s1.chg_1_poa + d0_s1.chg_2_poa + d0_s2.chg_2_poa,
                            d0_s1.chpg_1_poa+d0_s1.chpg_2_poa+d0_s2.chpg_2_poa,
                            d0_s1.cwpg_1_poa+d0_s1.cwpg_2_poa+d0_s2.cwpg_2_poa,
                            d0_s1.ctg_1_poa+d0_s2.ctg_2_poa] }, ];
      
      const m1_area_el = [{ name: '当月', color:d1_clr, data: [m1_s1.sys_1_poa, m1_s1.sys_2_poa, m1_s2.sys_2_poa] },
                          { name: '上月', color:d0_clr, data: [m0_s1.sys_1_poa, m0_s1.sys_2_poa, m0_s2.sys_2_poa] }];
      const m1_dev_el  = [{ name: '当月', color:d1_clr, data: [m1_s1.chg_1_poa + m1_s1.chg_2_poa + m1_s2.chg_2_poa,
                                                  m1_s1.chpg_1_poa+m1_s1.chpg_2_poa+m1_s2.chpg_2_poa,
                                                  m1_s1.cwpg_1_poa+m1_s1.cwpg_2_poa+m1_s2.cwpg_2_poa,
                                                  m1_s1.ctg_1_poa+m1_s2.ctg_2_poa] },
                          { name: '上月', color:d0_clr, data: [m0_s1.chg_1_poa + m0_s1.chg_2_poa + m0_s2.chg_2_poa,
                                                  m0_s1.chpg_1_poa+m0_s1.chpg_2_poa+m0_s2.chpg_2_poa,
                                                  m0_s1.cwpg_1_poa+m0_s1.cwpg_2_poa+m0_s2.cwpg_2_poa,
                                                  m0_s1.ctg_1_poa+m0_s2.ctg_2_poa] }];

      setOptDAreaEl(OptBar(cate_area,d1_area_el,'区域耗电(日)','kwh'));
      setOptDDevEl( OptBar(cate_dev, d1_dev_el ,'设备耗电(日)','kwh'));
      setOptMAreaEl(OptBar(cate_area,m1_area_el,'区域耗电(月)','kwh'));
      setOptMDevEl( OptBar(cate_dev, m1_dev_el ,'设备耗电(月)','kwh'));


      const data1 = [['机电', d1_s1.sys_1_poa],['电子三厂', d1_s1.sys_2_poa],['电子二厂', d1_s2.sys_2_poa]]
      const data2 = [['机电', d0_s1.sys_1_poa],['电子三厂', d0_s1.sys_2_poa],['电子二厂', d0_s2.sys_2_poa]]
      const data3 = [['冷冻机', d1_s1.chg_1_poa + d1_s1.chg_2_poa + d1_s2.chg_2_poa,],
                     ['冷冻泵', d1_s1.chpg_1_poa+d1_s1.chpg_2_poa+d1_s2.chpg_2_poa],
                     ['冷却泵', d1_s1.cwpg_1_poa+d1_s1.cwpg_2_poa+d1_s2.cwpg_2_poa],
                     ['冷却塔', d1_s1.ctg_1_poa+d1_s2.ctg_2_poa]]
      const data4 = [['冷冻机', d0_s1.chg_1_poa + d0_s1.chg_2_poa + d0_s2.chg_2_poa,],
                     ['冷冻泵', d0_s1.chpg_1_poa+d0_s1.chpg_2_poa+d0_s2.chpg_2_poa],
                     ['冷却泵', d0_s1.cwpg_1_poa+d0_s1.cwpg_2_poa+d0_s2.cwpg_2_poa],
                     ['冷却塔', d0_s1.ctg_1_poa+d0_s2.ctg_2_poa]]
      
      const data5 = [['机电', m1_s1.sys_1_poa],['电子三厂', m1_s1.sys_2_poa],['电子二厂', m1_s2.sys_2_poa]]
      const data6 = [['机电', m0_s1.sys_1_poa],['电子三厂', m0_s1.sys_2_poa],['电子二厂', m0_s2.sys_2_poa]]
      const data7 = [['冷冻机', m1_s1.chg_1_poa + m1_s1.chg_2_poa + m1_s2.chg_2_poa,],
                    ['冷冻泵', m1_s1.chpg_1_poa+m1_s1.chpg_2_poa+m1_s2.chpg_2_poa],
                    ['冷却泵', m1_s1.cwpg_1_poa+m1_s1.cwpg_2_poa+m1_s2.cwpg_2_poa],
                    ['冷却塔', m1_s1.ctg_1_poa+m1_s2.ctg_2_poa]]
      const data8 = [['冷冻机', m0_s1.chg_1_poa + m0_s1.chg_2_poa + m0_s2.chg_2_poa,],
                    ['冷冻泵', m0_s1.chpg_1_poa+m0_s1.chpg_2_poa+m0_s2.chpg_2_poa],
                    ['冷却泵', m0_s1.cwpg_1_poa+m0_s1.cwpg_2_poa+m0_s2.cwpg_2_poa],
                    ['冷却塔', m0_s1.ctg_1_poa+m0_s2.ctg_2_poa]]


      setOptPie1(OptPie(data1,"当日"))
      setOptPie2(OptPie(data2,"昨日"))
      setOptPie3(OptPie(data3,"当日"))
      setOptPie4(OptPie(data4,"昨日"))
      setOptPie5(OptPie(data5,"本月"))
      setOptPie6(OptPie(data6,"上月"))
      setOptPie7(OptPie(data7,"本月"))
      setOptPie8(OptPie(data8,"上月"))
      setSummary([...data]);
    })
  }, []);

  useEffect(() => {
    store.qryEnergyHour(null).then(({ data }) => {
      // console.log(data, 'data hour');
      const cate = [];
      const seria = [{ name: '系统', data:[]  }]
      data.map(o=>{
        cate.push(o.dt);
        seria[0].data.push(o.poa)
      })
      setOptHour(OptLineInit(cate, seria, "耗电总功率", "kw"));
      setHour([...data]);
    })
  }, []);

  useEffect(() => {
    store.qryEnergyDay(null).then(({ data }) => {
      // console.log(data, 'data day');
      const cate = [];
      const seria = [{ name: '系统', data:[]  }]
      data.map(o=>{
        cate.push(o.dt);
        seria[0].data.push(o.poa)
      })
      setOptDay(OptLineInit(cate, seria, "总耗电量（日）", "kwh"));
      setDay([...data]);
    })
  }, []);

  useEffect(() => {
    store.qryEnergyMonth(null).then(({ data }) => {
      console.log(data, 'data month');
      const cate = [];
      const seria = [{ name: '系统', data:[]  }]
      data.map(o=>{
        cate.push(o.dt);
        seria[0].data.push(o.poa)
      })
      setOptMonth(OptLineInit(cate, seria, "总耗电量（月）", "kwh"));
      setMonth([...data]);
    })
  }, []);


  useEffect(() => {
    console.log('summary', summary);
    console.log('hour', hour);
    console.log('day', day);
    console.log('month', month);
    const result = computeStats(summary, hour, day, month);

    console.log('统计结果:');
    console.log(JSON.stringify(result, null, 2));
    setInfo(result);
  }, [summary, hour, day, month]);


  return (
    <div className={s.main}>
      <div className={s.lt}>
        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_d_area_el} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_d_dev_el} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_m_area_el} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_m_dev_el} />
        </div>
      </div>


      <div className={s.center}>
        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_pie1} />
          <HighchartsReact highcharts={Highcharts} options={opt_pie2} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_pie3} />
          <HighchartsReact highcharts={Highcharts} options={opt_pie4} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_pie5} />
          <HighchartsReact highcharts={Highcharts} options={opt_pie6} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts} options={opt_pie7} />
          <HighchartsReact highcharts={Highcharts} options={opt_pie8} />
        </div>
      </div>

      <div className={s.rt}>
        <div className={s.item}>
          <div className={s.tab}>
            <div className={s.sect}>
              <h1><img src={icon_el} alt="" />{"总能耗"}</h1>
              <div className={s.row}>
                <label>本日总能耗</label>
                <span data-unit="kw">{info?.d0Total}</span>
              </div>
              <div className={s.row}>
                <label>昨日总能耗</label>
                <span data-unit="kw">{info?.d1Total}</span>
              </div>
              <div className={s.row}>
                <label>日环比</label>
                <span data-unit="%">{info?.dayCompare}</span>
              </div>
              <div className={s.row}>
                <label>月环比</label>
                <span data-unit="%">{info?.monthCompare}</span>
              </div>
            </div>
            <div className={s.sect}>
              <h1><img src={icon_peak} alt="" />{"环比峰值"}</h1>
              <div className={s.row}>
                <label>时能耗峰值</label>
                <span data-unit="kw">
                  <em>{`${info?.hourPeak?.dt} - ${info?.hourPeak?.poa}`}</em>
                </span>
              </div>
              <div className={s.row}>
                <label>日最高能耗</label>
                <span data-unit="kw">
                  <em>{`${info?.dayPeak?.dt} - ${info?.dayPeak?.poa}`}</em>
                </span>
              </div>

              <div className={s.row}>
                <label>7日均值</label>
                <span data-unit="kw">{info?.dayTrend?.average}</span>
              </div>

              <div className={s.row}>
                <label>3月均值</label>
                <span data-unit="kw">{info?.monthTrend?.average}</span>
              </div>
            </div>
            
            <div className={s.sect}>
              <h1><img src={icon_percent} alt="" />{"能耗占比"}</h1>
              <div className={s.row}>
                <label>冷机组1</label>
                <span>{info?.d0Share?.details?.chg_1_poa?.value} <i data-unit="%">{info?.d0Share?.details?.chg_1_poa?.percent}</i> </span>
              </div>
              <div className={s?.row}>
                <label>冷机组2</label>
                <span>{info?.d0Share?.details?.chg_2_poa?.value} <i data-unit="%">{info?.d0Share?.details?.chg_2_poa?.percent}</i> </span>
              </div>
              <div className={s?.row}>
                <label>冷却泵组1</label>
                <span>{info?.d0Share?.details?.chpg_1_poa?.value}<i data-unit="%">{info?.d0Share?.details?.chpg_1_poa?.percent}</i></span>
              </div>
              <div className={s?.row}>
                <label>冷却泵组2</label>
                <span>{info?.d0Share?.details?.chpg_2_poa?.value}<i data-unit="%">{info?.d0Share?.details?.chpg_2_poa?.percent}</i></span>
              </div>
              <div className={s?.row}>
                <label>冷冻泵组1</label>
                <span>{info?.d0Share?.details?.cwpg_1_poa?.value}<i data-unit="%">{info?.d0Share?.details?.cwpg_1_poa?.percent}</i></span>
              </div>
              <div className={s?.row}>
                <label>冷冻泵组2</label>
                <span>{info?.d0Share?.details?.cwpg_2_poa?.value}<i data-unit="%">{info?.d0Share?.details?.cwpg_2_poa?.percent}</i></span>
              </div>
            </div>

            {info?.anomalies?.length > 0 &&
            <div className={s.sect}>
              <h1><img src={icon_err} alt="" />{"异常检测"}</h1>
              {info?.anomalies?.map((o,i)=>
                <div key={i} className={s.row}>
                  <label>{o.dt}</label>
                  <span>{o.poa}</span>
                </div>
              )}
            </div>}


            <div className={s.sect}>
              <h1><img src={icon_info} alt="" />{"综合概览信息"}</h1>
              <div className={s.row}>
                <span>{info?.overview}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts}  options={optHour} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts}  options={optDay} />
        </div>

        <div className={s.item}>
          <HighchartsReact highcharts={Highcharts}  options={optMonth} />
        </div>

        
      </div>
    </div>
  );
};

export default observer(Period);