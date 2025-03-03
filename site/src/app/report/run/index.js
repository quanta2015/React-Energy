import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable'; 
import { observer, MobXProviderContext } from 'mobx-react';
import { sensorDataToList, formatNumber, fix } from '@/util/fn';
import { Spin, FloatButton , Button, Select, Input, message, Modal   } from 'antd';
import Header from '@/component/Header';
import { FIELDS,unitByVal } from '@/constant/field';
import { URL } from '@/constant/pos';
import cls from 'classnames';
import mqtt from 'mqtt';
import {
  serverUrl,
  SAV_TIME,
  SubRtg,
  saveData,
  cfList,
} from '@/util/mqtt';
import { PlusOutlined, EyeOutlined,SaveOutlined,EditOutlined } from '@ant-design/icons';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { OptLineInit } from './opt';

import s from './index.module.less';
import sysbg from '@/img/bg/sys-bg.avif';

HighchartsMore(Highcharts);


const { Option } = Select;
const TYPE_LIST = [{ val:'label', name: '标签'}, {val:'image', name:'动画'}];
const W = {
  ch: 87,
  chp: 50,
  cwp: 50,
  ct: 75,
  fm: 28,
}


var ret = [];





const Run = () => {
  const nodeRefs = useRef([]);
  const { store } = React.useContext(MobXProviderContext);
  
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState([]);
  const [type, setType] = useState('label');
  const [tid, setTid] = useState(0);
  const [deviceType, setDeviceType] = useState('ch');
  const [deviceId, setDeviceId] = useState([1,2, 3, 4]); 
  const [selId, setSelId] = useState(0);
  const [field, setField] = useState(null);
  const [val, setVal] = useState(null);
  const [imgType, setImgType] = useState('ch');
  const [showEdit, setShowEdit] = useState(false);
  const [cur, setCur] = useState(null);
  const [code, setCode] = useState('cps_1');
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState({});
  const [model, setModel] = useState('run');

  const [fac, setFac] = useState(0);
  const [wd1, setWd1] = useState(Array(50).fill(0))
  const [wd2, setWd2] = useState(Array(50).fill(0))
  const [wd3, setWd3] = useState(Array(50).fill(0))
  const [wd4, setWd4] = useState(Array(50).fill(0))
  const [wd5, setWd5] = useState(Array(50).fill(0))
  const [wd6, setWd6] = useState(Array(50).fill(0))
  const [wd7, setWd7] = useState(Array(50).fill(0))
  const [wd8, setWd8] = useState(Array(50).fill(0))
  const [opt1, setOpt1] = useState(null)
  const [opt2, setOpt2] = useState(null)
  const [opt3, setOpt3] = useState(null)
  const [opt4, setOpt4] = useState(null)
  const [opt5, setOpt5] = useState(null)
  const [opt6, setOpt6] = useState(null)
  const [opt7, setOpt7] = useState(null)
  const [opt8, setOpt8] = useState(null)

  const devCount =(list,attr)=> {
    let len = list.filter(item => item.type === attr).length;
    return len === 0 ? 1: len
  };

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
      console.log(data,'data');
      console.log(dataList,'dataList')
      
    }, SAV_TIME);


    return () => {
      if (client) {
        client.end();
        console.log('MQTT 连接已断开');
      }
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    nodeRefs.current = device.map((_, i) => nodeRefs.current[i] || React.createRef());
  }, [device]);

  const onStop = (item,i,pos) => {
    const _device = [...device];
    _device[i].x = pos.x;
    _device[i].y = pos.y;
    setDevice(_device);
  }

  const doChgType = (val, id) => {
    const _device = [...device];
    _device[cur].type = val==='label'?'label':'ch';
    _device[cur].id = val==='label'?null:devCount(device,'ch')
    setDevice(_device);
    setType(val)
    setTid(id)
  }

  const init =()=>{
    // init value
    setType('label');
    setTid(0);
    setDeviceType('ch');
    setDeviceId([1,2, 3, 4])
    setSelId(0);
    setField(null);
    setImgType('ch');
  }

  const doClose = () => {
    setShowEdit(false);
    init();
  }

  const doChgDevice = (value) => {
    setDeviceType(value);
    switch (value) {
      case "ch":
      case "chp":
      case "cwp":
      case "ct":
        setDeviceId([1, 2, 3, 4]);
        setSelId(1);
        setField(null);
        break;
      case "chg":
      case "chpg":
      case "cwpg":
      case "ctg":
        setDeviceId([1, 2]);
        setSelId(1);
        setField(null);
        break;
      case "system":
        setDeviceId([1]); 
        setSelId(1);
        setField(null);
        break;
      default:
        setDeviceId([]); 
        setField(null);
    }
  };

  const doSelField = (e) => {
    setField(e);
    const _device = [...device];
    _device[cur].field = e;
    setDevice(_device);
  }


  const doChgVal = (e) => {
    const val = e.target.value === '' ? null : e.target.value;
    setVal(val);
    const _device = [...device];
    _device[cur].val = val;
    setDevice(_device);
  }

  const doEdit = (i,e) => {
    e.stopPropagation();

    const item = device[i];
    setType((item.type === 'label')?'label':'image');
    

    if (item.type === 'label') {
      setDeviceType(item.field.split('_')[0]);
      setSelId(item.field.split('_')[1]);
      setField(item.field);
      setVal(item.val);
    }else{
      setImgType(item.type);
    }

    setCur(i);
    setShowEdit(true);
  }


  const doChgImgType = (e) => {
    console.log(devCount(device,e),'eeee')
    setImgType(e);
    const _device = [...device];
    _device[cur].id = devCount(device,e)
    _device[cur].type = e;
    _device[cur].w = W[e];
    setDevice(_device);
  }


  const doAddItem = () => { 
    setShowEdit(true);
    const _device = [...device];
    _device.push({
      type: 'label',
      id: null,
      x: 0,
      y: 30,
      field: 'ch_1_chw_wtpo',
      val: null,
    });
    setDevice(_device);
    setSelId(1);
    setCur(_device.length-1)
  }


  const doCloseModal = (e) => {
    // e.stopPropagation();
    // setShowEdit(false);
    // init();
  }


  const doSwitchModel =(e)=>{
    if (e === 'edit') {
      let pwd = '';
      Modal.confirm({
        title: '切换到编辑模式',
        content: (
          <Input.Password placeholder="请输入密码" onChange={(e) => (pwd = e.target.value)}
          />
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          if (pwd === '123456') {
            setModel(e);
            setShowEdit(false);
            message.success('成功切换到编辑模式！');
          } else {
            message.error('密码错误，无法切换到编辑模式！');
          }
        },
      });
    } else {
      setModel(e);
      setShowEdit(false);
    }
  }


  const doDel = ()=> {
    if (cur !== null) { 
      const _device = [...device];
      _device.splice(cur, 1); 
      setDevice(_device); 
      setShowEdit(false); 
      setCur(null); 
      message.info("设备已删除！");
    } else {
      message.warning("未选中任何设备！");
    }
  }

  const doSave =()=>{
    const params = { device, code: 'cps_1' }
    store.saveDevices(params).then(({ data }) => {
      const _device = JSON.parse(data.data)
      setDevice(_device)
      message.info("保存系统设备数据成功！")
    });
  }

  useEffect(() => {
    store.loadDevices().then(({ data }) => {
      const device = JSON.parse(data.data)
      setDevice(device)
    });
  }, []);


  useEffect(() => {
    const interval = setInterval(()=>{
      initSeries('chg_1_cw_wtpo', wd1,'冷却水供水', setWd1, setOpt1);
      initSeries('chg_1_cw_wtpi', wd2,'冷却水回水', setWd2, setOpt2);
      initSeries('chg_1_chw_wtpo',wd3,'冷冻水供水', setWd3, setOpt3);
      initSeries('chg_1_chw_wtpi',wd4,'冷冻水回水', setWd4, setOpt4);

      initSeries('chg_2_cw_wtpo', wd5,'冷却水供水', setWd5, setOpt5);
      initSeries('chg_2_cw_wtpi', wd6,'冷却水回水', setWd6, setOpt6);
      initSeries('chg_2_chw_wtpo',wd7,'冷冻水供水', setWd7, setOpt7);
      initSeries('chg_2_chw_wtpi',wd8,'冷冻水回水', setWd8, setOpt8);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const initSeries =(key, wd, title, setWd, setOpt)=>{
    const val = data[key];
    val && wd.push(parseFloat(val));
    wd.length > 50 && wd.shift(); 
    const series = [{ name: title, data: [...wd] }];
    setWd([...wd]);
    setOpt(OptLineInit(Array(50).fill(0),series,title,'℃' ))
  }
  


  return (
    <Spin spinning={loading}>
      <div className={s.main}>
        <Header title={'实时设备监控'} float={true} />

        <div className={s.wrap}>

          {model === 'edit' ?
            !showEdit && 
            <FloatButton.Group shape="circle">
              <FloatButton icon={<PlusOutlined />} onClick={doAddItem} />
              <FloatButton icon={<SaveOutlined />} onClick={doSave} />
              <FloatButton icon={<EyeOutlined />} type="primary" onClick={()=>doSwitchModel('run')} />
            </FloatButton.Group>
            :
            <FloatButton.Group shape="circle">
              <FloatButton icon={<EditOutlined />} type="primary" onClick={()=>doSwitchModel('edit')} />
            </FloatButton.Group>}
          
          {model === 'run' &&
          <div className={s.lt}>
            <div className={s.tap}>
              <span className={fac===0?'act':''} onClick = {()=>setFac(0)}>机电</span>
              <span className={fac===1?'act':''} onClick = {()=>setFac(1)}>电子三厂</span>
            </div>
              {!fac ? 
                <>
                  <div><HighchartsReact highcharts={Highcharts}  options={opt1} /></div>
                  <div><HighchartsReact highcharts={Highcharts}  options={opt2} /></div>
                  <div><HighchartsReact highcharts={Highcharts}  options={opt3} /></div>
                  <div><HighchartsReact highcharts={Highcharts}  options={opt4} /></div>
                </>
                :
                <>
                  <div><HighchartsReact highcharts={Highcharts}  options={opt5} /></div>
                  <div><HighchartsReact highcharts={Highcharts}  options={opt6} /></div>
                  <div><HighchartsReact highcharts={Highcharts}  options={opt7} /></div>
                  <div><HighchartsReact highcharts={Highcharts}  options={opt8} /></div>
                </>
              }
          </div>}



          <div className={s.ct} onClick={doCloseModal}>
            <img src={sysbg} className={s.bg} />


            {device.map((item,i)=>
              <Draggable key={i} bounds="parent" 
                handle={model==="run"?"none":""}
                nodeRef={nodeRefs.current[i]} 
                position={{x: item.x, y: item.y}} 
                onStop={(e,pos)=>onStop(item,i,pos)} >
                <div className={cls(s.device, item.type, model==="run"?s.run:"")} ref={nodeRefs.current[i]} >
                  
                  {model === 'edit' && <span className={s.id} onClick={(e)=>doEdit(i,e)}>{item.id!==null?item.id+1:'L'}</span>}
                  {item.type === 'label' ? 
                    <div className={s.label}>
                      {item.val !== null && <label>{item.val}:</label>}
                      <span data-unit={unitByVal(item.field)}>{model === 'edit' ?item.field: data[item.field]}</span>
                    </div>
                    :
                      model === 'edit' ? <img src={URL(item.type)} style={{ width:`${item.w}px` }}/> 
                      :
                      Object.keys(dataList).length>0 && dataList[item.type] &&
                        dataList[item.type][item.id].status !== 'off' && 
                        <img src={URL(item.type, dataList[item.type][item.id].status)} style={{ width:`${item.w}px` }}/>
                    }
                </div>
              </Draggable>
            )}
          </div>
          
          {showEdit &&
          <div className={s.rt}>
            <div className={s.wrap} >
              <em>类型</em>
              {TYPE_LIST.map((o,i)=> 
                <div className={cls(s.btn, tid===i?'act':'')} key={i}  onClick={()=>doChgType(o.val, i)}>{o.name}</div> 
              )}
            </div>

            {type === 'label'?
            <>
              <div className={s.wrap} >
                <em>设备</em>
                <Select placeholder="设备类型" value={deviceType} onChange={doChgDevice} style={{ width:'calc( 50% - 5px)'}} >
                  <Option value="ch">冷冻机</Option>
                  <Option value="chp">冷却泵</Option>
                  <Option value="cwp">冷冻泵</Option>
                  <Option value="ct">冷却塔</Option>
                  <Option value="chg">冷冻机组</Option>
                  <Option value="chpg">冷却泵组</Option>
                  <Option value="cwpg">冷冻泵组</Option>
                  <Option value="ctg">冷却塔组</Option>
                  <Option value="system">系统</Option>
                </Select>

                <Select 
                  placeholder="设备编号" 
                  value={selId} 
                  disabled={deviceType === "system"} 
                  onChange={(e)=>setSelId(e)} 
                  style={{ width:'calc( 50% - 5px)'}} >
                  {deviceId.map(o => (
                    <Option key={o} value={o}>{o}</Option>
                  ))}
                </Select>
              </div>

              <div className={s.wrap} >
                <em>网关数据</em>
                <Select value={field} onChange={doSelField} style={{ width: "100%" }} >
                  {FIELDS(selId,deviceType).map((field,i)=>
                    <Option value={field} key={i}>{field.split('_').slice(2).join('_')}</Option>
                  )}
                </Select>
              </div>

              <div className={s.wrap} >
                <em>标题</em>
                <Input type="text" value={val} onChange={doChgVal}/>
              </div>
            </>:
            <>
              <div className={s.wrap} >
                <em>图片</em>
                <Select placeholder="图片类型" value={imgType} onChange={doChgImgType} style={{ width:'100%'}} >
                  <Option value="ch">冷冻机</Option>
                  <Option value="chp">冷却泵</Option>
                  <Option value="cwp">冷冻泵</Option>
                  <Option value="ct">冷却塔</Option>
                  <Option value="fm">阀门</Option>
                </Select>
              </div>
            </>}
            
            <div className={s.wrap} >
              <Button type='primary' onClick={doClose} style={{ width:'calc( 70% - 5px )'}}>关闭</Button>
              <Button type='primary' onClick={doDel} style={{ width:'calc( 30% - 5px )'}} danger>删除</Button>
            </div>
            
          </div>}
          
          
        </div>
      </div>
    </Spin>
  );
};

export default observer(Run);