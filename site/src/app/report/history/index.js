import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import { observer, MobXProviderContext } from 'mobx-react';
import { Spin,TimePicker,DatePicker } from 'antd'
import * as urls from '@/constant/urls'
import { formatDt } from '@/util/fn'
import { caluTable } from '@/util/fac'

import Sensor from './Sensor'
import Header from '@/component/Header'

import style from './style.less';


const History = () => {
  const { store } = React.useContext(MobXProviderContext);
 
  const [loading, setLoading] = useState(false);
  const [date,  setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [time,  setTime] = useState(dayjs().format('HH:mm:ss'));
  const [none,  setNone] = useState(true);
  const [mdata, setMdata] = useState({ cps_1: [{},{},{},{}], cps_2: [{},{},{},{}], sys_1:[{out_1_ftp:0, out_1_rh:0}]});
  const [td,  setTd] = useState([]);


  const doAnalysisSys=async()=>{
    const dt = formatDt(date,time)
    let params = { 
      dt: `${dt}00`
    }

    store.qryReportHistory(params).then( ({data}) => {
      // console.log(data, 'data');
      setLoading(true)
      data.map(o=>{
        const {id,dt,code,...oth} = o
        Object.keys(oth).forEach(key => {
          const index = parseInt(key.split('_')[1]) - 1
          mdata[code][index][key] = oth[key]
        });
      })
      const td = caluTable(mdata)
      setLoading(false)
      setNone(td.length === 0)
      setTd(td)
    })
  }


  const selDate = (e)=>{
    setDate(e.format('YYYY-MM-DD').replaceAll('-',''))
  }

  const selTime = (e)=>{
    setTime(e.format('HH:mm').replaceAll(':','') + '00')
  }

  return (
    <Spin spinning={loading}>
      <div className="g-sys0">
        <Header title={'历史综合分析'}/>
        <div className="m-tab_list">

          <div className="m-query">
            <label>开始日期</label>
            <DatePicker format='YYYY-MM-DD' defaultValue={dayjs(date)} onChange={selDate} />
          </div>

          <div className="m-query">
            <label>开始时间</label>
            <TimePicker defaultValue={dayjs(time,'HH:mm')} format='HH:mm' onChange={selTime}/>
          </div>

          <div className="m-query">
            <div className="m-btn" onClick={doAnalysisSys}>查询系统</div>
          </div>

        </div>

        <div className="m-tab_cnt">
          {(none) && <div className="m-none"> 无数据</div>}
          {(!none) && <Sensor {...{data:td, show: true, inline: true}} /> }
        </div>
      </div>
    </Spin>
  );
};

export default observer(History);
