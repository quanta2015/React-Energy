export const MAP_NAME = {
  sys_1_poa: '机电能耗',
  sys_2_poa: '电子三厂能耗',
  chg_1_poa: '冷冻机组1能耗',
  chg_2_poa: '冷冻机组2能耗',
  chpg_1_poa: '冷却泵组1能耗',
  chpg_2_poa: '冷却泵组2能耗',
  cwpg_1_poa: '冷冻泵组1能耗',
  cwpg_2_poa: '冷冻泵组2能耗',
  ctg_1_poa: '冷却塔组1能耗',
  ctg_2_poa: '冷却塔组2能耗',
  chg_1_chw_wtpo: '机电冷冻水供水',
  chg_1_chw_wtpi: '机电冷冻水回水',
  chg_2_chw_wtpo: '电子三厂冷冻水供水',
  chg_2_chw_wtpi: '电子三厂冷冻水回水',
  chg_1_cw_wtpo: '机电冷却水供水',
  chg_1_cw_wtpi: '机电冷却水回水',
  chg_2_cw_wtpo: '电子三厂冷却水供水',
  chg_2_cw_wtpi: '电子三厂冷却水回水',
}


export const FAC_DATA = [
  { id:2, key: 'cps_1', title: '3-1电子三厂'},
  { id:3, key: 'cps_1', title: '3-2电子三厂'},
  { id:0, key: 'cps_1', title: '3-3机电' },
  { id:1, key: 'cps_1', title: '3-4机电' },
  { id:0, key: 'cps_2', title: '1-1科奥'},
  { id:1, key: 'cps_2', title: '1-2科奥'},
  { id:2, key: 'cps_2', title: '1-3电子二厂' },
  { id:3, key: 'cps_2', title: '1-4电子二厂' },
]




export const FAC_TD = {
  tab1: {
    title: '室外空气数据',
    data: [
      { k:'温度', v: '' },
      { k:'湿度', v: '' },
    ],
    unit: ['℃','%','g/kg']
  },
  tab2: {
    title: [
      { k: '冰机数据'},
      { k: '状态及设定', v: ['运行状态','温度设定值'] },
      { k: '制冷', v: [
        '蒸发器进水温度',
        '蒸发器出水温度\n标准:与温度设定值偏差在1℃以内',
        '冷凝器进水温度\n标准:＜32℃\n否则有喘振风险',
        '冷凝器出水温度\n标准:＜38℃\n否则有喘振风险',
        '蒸发器水流状态',
        '冷凝器水流状态',
        ] 
      },
      { k: '电力', v: ['功率','电流百分比'] },
      { k: '部件', v: ['蒸发器冷媒压力','冷凝器冷媒压力'] },
      { k: '保养', v: [
        '冷凝器趋近温度\n标准:＜4℃\n否则建议清洗',
        '蒸发器趋近温度\n标准:＜4℃\n否则建议清洗',
        '油压差\n标准:120-180kPa\n＜120kPa建议换油',
        ] 
      },
    ], 
      
    data: [],
    unit: ['','','℃','℃','℃','℃','℃','','','KW','%','kPa','kPa','℃','℃','kPa']
  }
}





export const mapDev = (type)=>{
  return {
    "冷却塔": "ct",
    "冷却泵": "cwp",
    "冷冻泵": "chp",
    "冰机": "ch",
    "空调箱": "air",
    "风管": "apip",
  }[type]
}






export const json_field = {
  table: 'tab_field',
  define: [{
      dataIndex: 'id',
      type: 'string',
      title: '编号',
      key: true,
      width: 80,
      fixed: 'left',
      align: 'center',
      req: false,
    },
    {
      dataIndex: 'name',
      type: 'string',
      title: '字段名称',
      fixed: 'left',
      width: 150,
      req: true,
    }
  ],
}

export const json_user = [{
    dataIndex: 'id',
    type: 'string',
    title: '編號',
    width: 60,
    fixed: 'left',
    align: 'center',
  },{
    dataIndex: 'name',
    type: 'string',
    title: '用戶名称',
    width: 120,
    fixed: 'left',
    align: 'center',
  },{
    dataIndex: 'usr',
    type: 'string',
    title: '賬號',
    width: 200,
     align: 'center',
  },{
    dataIndex: 'phone',
    type: 'string',
    title: '联系方式',
    width: 200,
     align: 'center',
  },{
    dataIndex: 'email',
    type: 'string',
    title: '邮箱地址',
    width: 200,
     align: 'center',
  },{
    dataIndex: 'pwd',
    type: 'string',
    title: '密碼',
    width: 200,
    align: 'center',
    render: (text, r) => {
      var lastChar = text[text.length - 1];

      return <span>{`*****${lastChar}`}</span>
    }
  }
]