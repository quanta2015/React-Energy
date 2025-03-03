export const PL = [
  'ReportRun',
  'ReportHistory',
  'ReportDevice',
  'ReportHistoryDev',
  'ReportHistorySys',
  'Control',
  'Tmp1',
  'Tmp2',
  'User'
];


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


const SYS_1_NAME = {
  name: '机电机房',
  sys: ['机电系统'],
  ch:  ['3-3机电冰机','3-4机电冰机',],
  chp: ['机电4#冷冻泵','机电3#冷冻泵',],
  cwp: ['机电4#冷却泵','机电3#冷却泵',],
  ct:  ['机电4#冷却塔','机电3#冷却塔',],
}

const SYS_2_NAME = {
  name: '电子三厂机房',
  sys: ['电子三厂系统'],
  ch:  ['3-1电子三厂冰机','3-2电子三厂冰机'],
  chp: ['电子三厂2#冷冻泵','电子三厂1#冷冻泵'],
  cwp: ['电子三厂2#冷却泵','电子三厂1#冷却泵'],
  ct:  ['电子三厂2#冷却塔','电子三厂1#冷却塔'],
}


export const SYS_NAME = [SYS_1_NAME, SYS_2_NAME]



export const POS_SET = {
  son_set: 0,
  rlap_set: 1,
  vlpf_set: 2,
  vlsf_set: 3,
  vlpc_set: 4,
  vlsc_set: 5,
  rlam_set: 6,
  vlp_set: 0,
  vls_set: 1,
  prd_set: 0,
  cw_wtpi_set: 1,
  chw_wtpo_set: 2
};


export const  SET_MODULE = {
  ch: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  chp: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ],
  cwp: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ],
  ct: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ],
  sys: [
    [0, 0, 0],
    [0, 0, 0]
  ]
};



const  SET_OBJ = {
  ch:  [[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0]],
  chp: [[0, 0],[0, 0]],
  cwp: [[0, 0],[0, 0]],
  ct:  [[0, 0],[0, 0]],
  sys: [[0, 0, 0]]
};


export const SET_LIST = [SET_OBJ,SET_OBJ]