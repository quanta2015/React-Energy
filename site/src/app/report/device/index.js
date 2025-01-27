import React, { useState } from 'react';
import dayjs from 'dayjs';
import { observer, MobXProviderContext } from 'mobx-react';
import { Spin, DatePicker, Button } from 'antd';
import Header from '@/component/Header';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { formatData, groupData } from './fn';
import { OptLineInit } from './opt';

import s from './index.module.less';


HighchartsMore(Highcharts);


const MAP_SYS = {
  sys1: '机电',
  sys2: '电子三厂',
  sys3: '科奥',
  sys4: '电子二厂',
}


const { RangePicker } = DatePicker;

const Device = () => {
  const { store } = React.useContext(MobXProviderContext);

  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [sys, setSys] = useState(null)
  const [data, setData] = useState(null);
  const [mod, setMod] = useState('table');
  const [opt1, setOpt1] = useState(null);
  const [opt2, setOpt2] = useState(null);
  const [chartType, setChartType] = useState(0);

  const doAnalysisSys = async () => {
    if (!dateRange || dateRange.length !== 2) {
      console.error('Invalid date range');
      return;
    }
    const params = {
      fr: dateRange[0].format('YYYYMMDDHHmm00'), 
      to: dateRange[1].format('YYYYMMDDHHmm59'),
    };
    setLoading(true);
    try {
      const { data } = await store.qryReportSummary(params);
      const rawData = groupData(formatData(data));
      setData(rawData);
      setSys('sys1');

      const categories = rawData.sys1.map(item => item.dtf); 
      const systems = ['sys1', 'sys2', 'sys3', 'sys4'];
      const seriesData1 = systems.flatMap(sys => [
          { name: `${MAP_SYS[sys]} - 冷冻水供水`, data: rawData[sys].map(item => item.chg_chw_wtpo) },
          { name: `${MAP_SYS[sys]} - 冷冻水回水`, data: rawData[sys].map(item => item.chg_chw_wtpi) },
          { name: `${MAP_SYS[sys]} - 冷却水供水`, data: rawData[sys].map(item => item.chg_cw_wtpo) },
          { name: `${MAP_SYS[sys]} - 冷却水回水`, data: rawData[sys].map(item => item.chg_cw_wtpi) }
      ]);


      const seriesData2 = systems.flatMap(sys => [
        { name: `${MAP_SYS[sys]} - 系统`, data: rawData[sys].map(item => item.sys_poa) },
        { name: `${MAP_SYS[sys]} - 冷机`, data: rawData[sys].map(item => item.chg_poa) },
        { name: `${MAP_SYS[sys]} - 冷却泵`, data: rawData[sys].map(item => item.chpg_poa) },
        { name: `${MAP_SYS[sys]} - 冷冻泵`, data: rawData[sys].map(item => item.cwpg_poa) },
        { name: `${MAP_SYS[sys]} - 冷却塔`, data: rawData[sys].map(item => item.ctg_poa) },
    ]);


      const opt1 = OptLineInit(categories, seriesData1, '供回水温度', '℃');
      const opt2 = OptLineInit(categories, seriesData2, '系统设备能耗', 'kW');
      setOpt1(opt1);
      setOpt2(opt2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Spin spinning={loading}>
      <div className={s.main}>
        <Header title={'设备综合分析'} />

        <div className={s.wrap}>
          <div className={s.tap}>
            <span className={mod==='table'?'act':''} onClick={()=>setMod('table')}>表格模式</span>
            <span className={mod==='chart'?'act':''} onClick={()=>setMod('chart')}>图表模式</span>
          </div>
          <div className={s.menu}>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              value={dateRange}
              onChange={(dates) => {
                if (!dates || dates.length !== 2) {
                  setDateRange([dayjs().startOf('day'), dayjs().endOf('day')]);
                } else {
                  setDateRange(dates);
                }
              }}
              format="YYYY-MM-DD HH:mm"
            />
            <Button type="primary" onClick={doAnalysisSys}>查询</Button>
            
            {mod === 'chart' &&
            <div className={s.chartType}>
              <em onClick={ ()=>setChartType(0)}>能耗</em>  
              <em onClick={ ()=>setChartType(1)}>供回水</em>  
            </div>}
          </div>
          
          { mod === 'table' && 
          <div className={s.table}>
            <div className={s.tap}>
              <span className={sys==='sys1'?'act':''}  onClick={()=>setSys('sys1')}>机电</span>
              <span className={sys==='sys2'?'act':''}  onClick={()=>setSys('sys2')}>电子三厂</span>
              <span className={sys==='sys3'?'act':''}  onClick={()=>setSys('sys3')}>科奥</span>
              <span className={sys==='sys4'?'act':''}  onClick={()=>setSys('sys4')}>电子二厂</span>
            </div>
            <div className={s.content}>
              <div className={s.row}>
                <span>时间</span>
                <span>系统能耗</span>
                <span>冷冻机能耗</span>
                <span>冷却泵能耗</span>
                <span>冷冻泵能耗</span>
                <span>冷却塔能耗</span>
                <span>冷冻水供水</span>
                <span>冷冻水回水</span>
                <span>冷却水供水</span>
                <span>冷却水回水</span>
              </div>
              {data && data[sys].map((item, index) => 
                <div key={index} className={s.row}>
                  <span>{item.dtf}</span>
                  <span>{item.sys_poa}</span>
                  <span>{item.chg_poa}</span>
                  <span>{item.chpg_poa}</span>
                  <span>{item.cwpg_poa}</span>
                  <span>{item.ctg_poa}</span>
                  <span>{item.chg_chw_wtpo}</span>
                  <span>{item.chg_chw_wtpi}</span>
                  <span>{item.chg_cw_wtpo}</span>
                  <span>{item.chg_cw_wtpi}</span>
                </div>
              )}
            </div>

          </div>}


          { mod === 'chart' && 
          <div className={s.chart}>

            {chartType === 0 && <HighchartsReact highcharts={Highcharts} options={opt1} />}
            {chartType === 1 && <HighchartsReact highcharts={Highcharts} options={opt2} />}
          </div>}
        </div>
      </div>
    </Spin>
  );
};

export default observer(Device);