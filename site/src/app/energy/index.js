/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { API_SERVER } from '@/constant/apis'
import { observer, MobXProviderContext } from 'mobx-react'
import { listInt,clone } from '@/util/fn'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Sankey from 'highcharts/modules/sankey';


import {opt,optPow,optPie,optBar, optSys, genPowData,ViewHeight,UNIT,POW}  from './chart.js'
import s from './index.module.less';
import bg from '@/img/bg/bg-energy.webp';

Sankey(Highcharts);
Highcharts.setOptions({
  accessibility: {
    enabled: false
  }
});

const crs=(name, color)=> ({ name, data: [], color, connectNulls: false })
const DL = [
    ['昨天','#ff6600'],['今天','#90EE90'],
    ['上周','#ff6600'],['本周','#90EE90'],
    ['上月','#ff6600'],['本月','#90EE90']
  ]

const initChartData = (ret,id, type)=>{
  let K = {
    1: ['ka0','ka1','da0','da1','ea0','ea1'],
    2: ['kf0','kf1','df0','df1','ef0','ef1'],
  }
  let cate = ret.map(e => e.dt.toString());
  let [ser_k,ser_d,ser_e ] = listInt(3).map(o=> [crs(DL[id][0],DL[id][1]), crs(DL[id+1][0],DL[id+1][1])])
  ret.map(o => {
    ser_k[0].data.push(o[K[type][0]]??null)
    ser_k[1].data.push(o[K[type][1]]??null)
    ser_d[0].data.push(o[K[type][2]]??null)
    ser_d[1].data.push(o[K[type][3]]??null)
    ser_e[0].data.push(o[K[type][4]]??null)
    ser_e[1].data.push(o[K[type][5]]??null)
  });
  return [cate, ser_k, ser_d, ser_e]
} 


const Energy = () => {
  const { store } = React.useContext(MobXProviderContext)
  const navigate = useNavigate();
  const [we, setWe] = useState(null)
  
  const [opt_k,  setOptK] = useState(null)
  const [opt_d,  setOptD] = useState(null)
  const [opt_e,  setOptE] = useState(null)

  const [tab, setTab] = useState(null)
  const [tabUnit, setTabUnit] = useState('day')
  const [type_k, setTypeK] = useState(0)

  const [pow, setPow] = useState(null)
  const [powIndex, setPowIndex] = useState('tab')
  const [opt_pow,setOptPow] = useState(null)
  const [opt_pow_bar,setOptPowBar] = useState(null)
  const [opt_sys,setOptSys] = useState(null)

  const [pieData, setPieData] = useState({})
  const [opt_pie, setOptPie] = useState([])
  const [pieIndex, setPieIndex] = useState('sys1')

  const [navModel, setNavModel] = useState([0,0,0])

  const [opt_d_k,  setOptDK] = useState(null)
  const [opt_d_d,  setOptDD] = useState(null)
  const [opt_d_e,  setOptDE] = useState(null)
  

  const [opt_w_k,  setOptWK] = useState(null)
  const [opt_w_d,  setOptWD] = useState(null)
  const [opt_w_e,  setOptWE] = useState(null)


  const [opt_m_k,  setOptMK] = useState(null)
  const [opt_m_d,  setOptMD] = useState(null)
  const [opt_m_e,  setOptME] = useState(null)

  const [opt_f_k,  setOptFK] = useState(null)
  const [opt_f_d,  setOptFD] = useState(null)
  const [opt_f_e,  setOptFE] = useState(null)



  useEffect(() => {
    store.weather(null).then(r => {
      setWe(r)
    })
  }, []);


  useEffect(() => {
    store.queryEnergy01(null).then(({ret_d,ret_w,ret_m}) => {
      let [cate_d,ser_d_k,ser_d_d,ser_d_e ] = initChartData(ret_d,0,1)
      let [cate_w,ser_w_k,ser_w_d,ser_w_e ] = initChartData(ret_w,2,1)
      let [cate_m,ser_m_k,ser_m_d,ser_m_e ] = initChartData(ret_m,4,1)

      setOptK(opt(cate_d, ser_d_k, 'column'))
      setOptD(opt(cate_d, ser_d_d, 'column'))
      setOptE(opt(cate_d, ser_d_e, 'column'))

      setOptDK(opt(cate_d, ser_d_k, 'column' ))
      setOptDD(opt(cate_d, ser_d_d, 'column' ))
      setOptDE(opt(cate_d, ser_d_e, 'column'))

      setOptWK(opt(cate_w, ser_w_k, 'column'))
      setOptWD(opt(cate_w, ser_w_d, 'column'))
      setOptWE(opt(cate_w, ser_w_e, 'column'))
      
      setOptMK(opt(cate_m, ser_m_k, 'column'))
      setOptMD(opt(cate_m, ser_m_d, 'column'))
      setOptME(opt(cate_m, ser_m_e, 'column'))
    })
  }, []);
  
  useEffect(() => {
    store.queryEnergy02(null).then(({ret_f}) => {
      let [cate__,ser_f_k,ser_f_d,ser_f_e ] = initChartData(ret_f,0,2)

      setOptFK(opt(cate__, ser_f_k, 'line'))
      setOptFD(opt(cate__, ser_f_d, 'line'))
      setOptFE(opt(cate__, ser_f_e, 'line'))
    })
  }, []);


  useEffect(() => {
    store.queryEnergy03(null).then(({tab}) => {
      setTab(tab)
      setOptSys(optSys(initSysOpt(tab))) 

    })
  }, []);

  useEffect(() => {
    store.queryEnergy04(null).then(({pow}) => {
      setPow(pow)
      setOptPowBar(optBar(pow))
    })
  }, []);

  useEffect(() => {
    store.queryEnergy05(null).then(({pie}) => {
      setOptPie(optPie(clone(pie[pieIndex])))
      setPieData(pie)
    })
  }, []);


  useEffect(() => {
    setOptPie(optPie(clone(pieData[pieIndex])))
  }, [pieIndex]);


  useEffect(() => {
    if ((powIndex !== 'tab')&& (pow!==null)) {
      let powData = genPowData(pow[powIndex],POW[powIndex])
      setOptPow(optPow(powData))
    }

    if (powIndex === 'tab' && (pow!==null)) {
      setOptPowBar(optBar(pow))
    }
  }, [powIndex]);

  const calLink = (id,val)=>{
    navModel[id]=val; 
    setNavModel([...navModel])
  }

  const initSysOpt = (tab) =>{
    return [{
      name: '今日',
      data: [tab?tab[tabUnit].el1:0, tab?tab[tabUnit].ka1:0, tab?tab[tabUnit].da1:0, 0]
    },{
      name: '昨日',
      data: [tab?tab[tabUnit].el0:0, tab?tab[tabUnit].ka0:0, tab?tab[tabUnit].da0:0, 0]
    },{
      name: '功率/流量',
      data: [tab?.el.el??0, tab?.flow.kf??0, tab?.flow.df??0, 0]
    }]
  }

  useEffect(() => {
    setOptSys(optSys(initSysOpt(tab))) 
  }, [tabUnit]);

  return (

    <div className={s.index}>
      <div className={s.wrap}>
        <img src={bg} alt="" />

        <div className={s.lt}>
          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>天气</h1>
            <div className={s.row}>
              <img src={`${API_SERVER}/img/${we?.icon}.png`} alt="" />
              <span>{we?.text}</span>
            </div>
            <div className={s.row}>
              <div className={s.col}>
                <span>{we?.temp}</span>
                <em>温度</em>
              </div>
              <div className={s.col}>
                <span>{we?.humidity}%</span>
                <em>相对湿度</em>
              </div>
              <div className={s.col}>
                <span>{we?.dew}</span>
                <em>露点温度</em>
              </div>
              <div className={s.col}>
                <span>{we?.precip}</span>
                <em>降水量</em>
              </div>
            </div>
          </div>

          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>
              <i onClick={()=>navigate('/stat')}>系统统计数据</i>
              <p>
                <span onClick={()=>setTabUnit('day')}>日</span>
                <span onClick={()=>setTabUnit('week')}>周</span>
                <span onClick={()=>setTabUnit('month')}>月</span>
                <span onClick={()=>setTabUnit('year')}>年</span>
              </p>
            </h1>
            
            <div className={s.pow}>
              {/*<div className={s.ret}>
                <span className={s.h1}>耗电</span>
                <span className={s.h2}>今{UNIT[tabUnit]}</span>
                <span>{tab?tab[tabUnit].el1:0} kwh</span>
                <span className={s.h2}>昨{UNIT[tabUnit]}</span>
                <span>{tab?tab[tabUnit].el0:0} kwh</span>
                <span className={s.h2}>功率</span>
                <span>{tab?.el.el} kw</span>
              </div>
              
              <div className={s.ret}>
                <span className={s.h1}>压缩空气</span>
                <span className={s.h2}>今{UNIT[tabUnit]}</span>
                <span>{tab?tab[tabUnit].ka1:0} km³</span>
                <span className={s.h2}>昨{UNIT[tabUnit]}</span>
                <span>{tab?tab[tabUnit].ka0:0} km³</span>
                <span className={s.h2}>流量</span>
                <span>{tab?.flow.kf} m³/h</span>
              </div>
              
              <div className={s.ret}>
                <span className={s.h1}>氮气</span>
                <span className={s.h2}>今{UNIT[tabUnit]}</span>
                <span>{tab?tab[tabUnit].da1:0} km³</span>
                <span className={s.h2}>昨{UNIT[tabUnit]}</span>
                <span>{tab?tab[tabUnit].da0:0} km³</span>
                <span className={s.h2}>流量</span>
                <span>{tab?.flow.df} m³/h</span>
              </div>
              <div className={s.ret}>
                <span className={s.h1}>光伏发电</span>
                <span className={s.h2}>今{UNIT[tabUnit]}</span>
                <span>0</span>
                <span className={s.h2}>昨{UNIT[tabUnit]}</span>
                <span>0</span>
                <span className={s.h2}>功率</span>
                <span>0</span>
              </div>*/}
              {opt_sys && <HighchartsReact highcharts={Highcharts} options={opt_sys} key="opt_sys" /> }

            </div>
          </div>

          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>
              <i onClick={()=>navigate('/run')}>能流图</i>
              <p>
                <span onClick={()=>setPowIndex('sys1')}>所属系统</span>
                <span onClick={()=>setPowIndex('sys2')}>所属中心</span>
                <span onClick={()=>setPowIndex('sys3')}>楼栋</span>
                <span onClick={() => setPowIndex('tab')}>柱状图</span>
              </p>
            </h1>
            {powIndex==='tab'?
            <div className={s.pow}>
              {opt_pow_bar && <HighchartsReact highcharts={Highcharts} options={opt_pow_bar} key="pow_bar" /> }
            </div>
            :
            <div className={s.pow}>
              {opt_pow && <HighchartsReact highcharts={Highcharts} options={opt_pow} key="pow"/> }
            </div>}
          </div>
          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>
              <i onClick={()=>navigate('/stat')}>日耗电比例图</i>
              <p>
                <span onClick={()=>setPieIndex('sys1')}>所属系统</span>
                <span onClick={()=>setPieIndex('sys2')}>所属中心</span>
                <span onClick={()=>setPieIndex('sys3')}>楼栋</span>
              </p>
            </h1>
            { opt_pie && <HighchartsReact highcharts={Highcharts} options={opt_pie} />}
          </div>
        </div>

        <div className={s.rt}>
          <div className={s.item} style={{'minHeight':ViewHeight()}} >
            <h1>
              <i onClick={()=>navigate(navModel[0]?'/analysis?index=0':'/stat')}>耗电</i>
              <p>
                <span onClick={()=>{ setOptE(opt_d_e);calLink(0,0)}}>日</span>
                <span onClick={()=>{ setOptE(opt_w_e);calLink(0,1)}}>周</span>
                <span onClick={()=>{ setOptE(opt_m_e);calLink(0,2)}}>月</span>
                <span onClick={()=>{ setOptE(opt_f_e);calLink(0,3)}}>功率</span>
              </p>
            </h1>
            { opt_e && <HighchartsReact highcharts={Highcharts} options={opt_e} /> }
          </div>

          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>
              <i onClick={()=>navigate(navModel[1]?'/analysis?index=1':'/stat')}>压缩空气用量</i>
              <p>
                <span onClick={()=>{setOptK(opt_d_k);calLink(1,0)}}>日</span>
                <span onClick={()=>{setOptK(opt_w_k);calLink(1,1)}}>周</span>
                <span onClick={()=>{setOptK(opt_m_k);calLink(1,2)}}>月</span>
                <span onClick={()=>{setOptK(opt_f_k);calLink(1,3)}}>流量</span>
              </p>
            </h1>
            { opt_k && <HighchartsReact highcharts={Highcharts} options={opt_k} /> }
          </div>
          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>
              <i onClick={()=>navigate(navModel[2]?'/analysis?index=2':'/stat')}>氮气用量</i>
              <p>
                <span onClick={()=>{setOptD(opt_d_d);calLink(2,0)}}>日</span>
                <span onClick={()=>{setOptD(opt_w_d);calLink(2,1)}}>周</span>
                <span onClick={()=>{setOptD(opt_m_d);calLink(2,2)}}>月</span>
                <span onClick={()=>{setOptD(opt_f_d);calLink(2,3)}}>流量</span>
              </p>
            </h1>
            {opt_d && <HighchartsReact highcharts={Highcharts} options={opt_d} />}
          </div>

          
          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>光伏发电
              <p>
                <span>功率</span>
                <span>电量</span>
              </p>
            </h1>
            {/*<HighchartsReact highcharts={Highcharts} options={opt_df} />*/}
          </div>
        </div>


        {/*<div className={s.bt}>
          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>光伏发电量
              <p>
                <span>日</span>
                <span>周</span>
                <span>月</span>
                
              </p>
            </h1>
            <HighchartsReact highcharts={Highcharts} options={opt3} />
          </div>

          <div className={s.item} style={{'minHeight':ViewHeight()}}>
            <h1>光伏发电功率
              <p>
                <span>日</span>
                <span>周</span>
                <span>月</span>
                
              </p>
            </h1>
            <HighchartsReact highcharts={Highcharts} options={opt3} />
          </div>

        </div>*/}
      </div>
    </div>
  )

}

export default observer(Energy)