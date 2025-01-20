export const RES = [
  { name:"冰机",   key:"ch" },
  { name:"液氮",   key:"ln" },
  { name:"建筑",   key:"bld" },
  { name:"设施",   key:"fac" },
  { name:"配电箱", key:"db" },
  { name:"空调箱", key:"air" },
  { name:"冷冻泵", key:"chp" },
  { name:"冷却泵", key:"cwp" },
  { name:"冷却塔", key:"ct" },
  { name:"空压机", key:"kyj" },
  { name:"冷干机", key:"adr" },
  { name:"冷水机", key:"chl" },
  { name:"排风机", key:"exf" },
  { name:"制氮机", key:"ngn" },
  { name:"变压器", key:"trf" },
  { name:"真空泵", key:"vcp" },
  { name:"蒸汽板换", key:"spe" },
  { name:"建筑设施", key:"bdf" },
  { name:"空调模块机", key:"acu" },
  { name:"空压机冷却塔", key:"act" },
  { name:"液氮供应设备", key:"lne" },
  { name:"余热回收板换", key:"whe" },
  { name:"宿舍余热回收板换", key:"dwh" },
  { name:"SMT冷却水泵", key:"scp" },
  { name:"SMT冷冻水泵", key:"swp" },
  { name:"余热回收水泵", key:"whp" },
  { name:"空调模块机水泵", key:"acp" },
  { name:"空压机冷却水泵", key:"app" },
]




export const RES_TYPE = RES.map(o=> o.name)
export const RES_MAP = RES.reduce((acc, item) => {
  acc[item.name] = item.key;
  return acc;
}, {});


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

export const json_dev = {
  table: 'tab_dev',
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
      title: '名称',
      fixed: 'left',
      width: 200,
      req: true,
    }, {
      dataIndex: 'data_type',
      type: 'string',
      title: '数据类型',
      width: 150,
      req: true,
    }, {
      dataIndex: 'dep1',
      type: 'string',
      title: '所属中心(一级)',
      width: 150,
      req: true,
    }, {
      dataIndex: 'dep2',
      type: 'string',
      title: '所属中心(二级)',
      width: 150,
      req: false,
    }, {
      dataIndex: 'loc1',
      type: 'string',
      title: '位置(一级)',
      width: 120,
      req: false,
    }, {
      dataIndex: 'loc2',
      type: 'string',
      title: '位置(二级)',
      width: 120,
      req: false,
      visible: false,
    }, {
      dataIndex: 'sys1',
      type: 'string',
      title: '所属系统(一级)',
      width: 120,
      req: false,
    }, {
      dataIndex: 'sys2',
      type: 'string',
      title: '所属系统(二级)',
      width: 120,
      req: false,
      visible: false,
    }, {
      dataIndex: 'pro_time',
      type: 'string',
      title: '所属期数',
      width: 100,
      req: false,
    }, {
      dataIndex: 'dev_type',
      type: 'string',
      title: '仪表类型',
      width: 150,
      req: false,
    }, {
      dataIndex: 'dev_brand',
      type: 'string',
      title: '仪表品牌',
      width: 100,
      req: false,
    }, {
      dataIndex: 'dev_id',
      type: 'string',
      title: '仪表型号',
      width: 200,
      req: false,
    }, {
      dataIndex: 'dev_lv',
      type: 'string',
      title: '分级',
      width: 100,
      req: false,
    }, {
      dataIndex: 'loc_ins',
      type: 'string',
      title: '安装位置',
      width: 150,
      req: false,
    }, {
      dataIndex: 'pname',
      type: 'string',
      title: '变压器名称(电)',
      width: 150,
      req: false,
    }, {
      dataIndex: 'ec_id',
      type: 'string',
      title: '柜号(电)',
      width: 120,
      req: false,
    }, {
      dataIndex: 'dr_id',
      type: 'string',
      title: '抽屉柜编号(电)',
      width: 150,
      req: false,
    }
  ]
}


export const json_res = {
  table: 'tab_res',
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
      title: '名称',
      fixed: 'left',
      width: 200,
      req: true,
    }, {
      dataIndex: 'type',
      type: 'select',
      title: '类型',
      width: 135,
      req: true,
      enum: RES_TYPE
    }, {
      dataIndex: 'model',
      type: 'string',
      title: '型号',
      width: 150,
      req: false,
    }, {
      dataIndex: 'brand',
      type: 'string',
      title: '品牌',
      width: 120,
      req: false,
    }, {
      dataIndex: 'loc1',
      type: 'string',
      title: '位置',
      width: 150,
      req: false,
    }, {
      dataIndex: 'dep1',
      type: 'string',
      title: '所属中心',
      width: 150,
      req: false,
    }, {
      dataIndex: 'sys1',
      type: 'string',
      title: '所属系统',
      width: 150,
      req: false,
    }, {
      dataIndex: 'motor',
      type: 'string',
      title: '电机型号',
      width: 200,
      req: false,
    }, {
      dataIndex: 'params',
      type: 'string',
      title: '设备参数',
      width: 280,
      req: false,
    }, {
      dataIndex: 'mfg_date',
      type: 'string',
      title: '出厂日期',
      width: 150,
      req: false,
    }, {
      dataIndex: 'manager',
      type: 'string',
      title: '管理人员',
      width: 100,
      req: false,
    }
  ]
}


export const json_mat = {
  table: 'view_mat',
  define: [{
      dataIndex: 'id',
      type: 'string',
      title: '编号',
      key: true,
      width: 40,
      fixed: 'left',
      align: 'center',
      req: false,
    }, {
      dataIndex: 'status',
      type: 'string',
      title: '状态',
      width: 60,
      req: false,
      align: 'center',
    }, {
      dataIndex: 'name',
      type: 'string',
      title: '设备名称',
      width: 120,
      req: false,
      align: 'center',
    }, {
      dataIndex: 'type',
      type: 'string',
      title: '设备类型',
      width: 60,
      align: 'center',
      req: false,
    },  {
      dataIndex: 'mat_date',
      type: 'select',
      title: '保养时间',
      width: 80,
      req: false,
      align: 'center',
    }, {
      dataIndex: 'mat_month',
      type: 'string',
      title: '保养周期',
      width: 50,
      req: false,
      align: 'center',
    },{
      dataIndex: 'mat_info',
      type: 'string',
      title: '保养内容',
      fixed: 'left',
      width: 250,
      req: true,
    }
  ]
}


export const json_rep = {
  table: 'view_rep',
  define: [{
      dataIndex: 'id',
      type: 'string',
      title: '编号',
      key: true,
      width: 40,
      fixed: 'left',
      align: 'center',
      req: false,
    }, {
      dataIndex: 'status',
      type: 'string',
      title: '状态',
      width: 60,
      req: false,
      align: 'center',
    }, {
      dataIndex: 'name',
      type: 'string',
      title: '设备名称',
      width: 120,
      req: false,
      align: 'center',
    }, {
      dataIndex: 'type',
      type: 'string',
      title: '设备类型',
      width: 60,
      align: 'center',
      req: false,
    },  {
      dataIndex: 'rep_date',
      type: 'select',
      title: '保养时间',
      width: 80,
      req: false,
      align: 'center',
    },{
      dataIndex: 'rep_info',
      type: 'string',
      title: '保养内容',
      fixed: 'left',
      width: 250,
      req: true,
    }
  ]
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