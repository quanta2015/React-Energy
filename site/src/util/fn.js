export const clone = obj => {
  let copy = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    let value = obj[key];
    copy[key] =
      typeof value === 'object' && value !== null ? clone(value) : value;
  }
  return copy;
};

export const opt = list => list.map(o => ({ label: o, value: o }));

export const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const filterOption = (e, opt) =>
  (opt?.label ?? '').toLowerCase().includes(e.toLowerCase());

export const clearSets = obj => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] instanceof Set) {
      obj[key].clear();
    }
  }
};

export const genClr = n =>
  Array.from({ length: n }, () => {
    const r = Math.floor(Math.random() * 128); // 0-127
    const g = Math.floor(Math.random() * 128); // 0-127
    const b = Math.floor(Math.random() * 128); // 0-127
    const rHex = (r + 128).toString(16).padStart(2, '0'); // 调整范围并转为16进制
    const gHex = (g + 128).toString(16).padStart(2, '0'); // 调整范围并转为16进制
    const bHex = (b + 128).toString(16).padStart(2, '0'); // 调整范围并转为16进制
    return `#${rHex}${gHex}${bHex}`;
  });

export const listInt = n =>
  Array.from({ length: n }, (_, i) => String(i + 1).padStart(2, '0'));
export const optInit = o => o.map(item => ({ value: item, label: item }));
export const optInitN = (list, item, fdb) =>
  list.map(o => {
    if (item.fld_db === '' || item.fld_db === undefined) {
      return { value: o, label: o };
    } else {
      // console.log(item.fld_db,'item')
      let name = item.fld_db.substring(0, 2);
      let set = fdb[name];
      return { value: o, label: o, disabled: set.has(o) };
    }
  });

export const isN = e => {
  return e === null || e === '' || e === undefined ? true : false;
};

export const formatNumber = (e, n=2) => {
  if (isNaN(e)) return 0; // 如果不是数字，返回 0
  const formatted = parseFloat(e.toFixed(n)); // 保留两位小数
  return formatted < 0 ? 0 : formatted; // 如果小于 0，则返回 0，否则返回格式化后的值
};

export const formatTime=(input)=> {
  const str = input.toString().padStart(4, '0');
  const formatted = str.slice(0, 2) + ':' + str.slice(2);
  return formatted;
}

export const isMobile = width => {
  return document.querySelector('html').clientWidth < width;
};

export const scrollToBottom = direction => {
  setTimeout(() => {
    const el = document.getElementById('chatContent');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, 100);
};

export const filterData = (data, type) => {
  let condSet,
    ret = [];
  switch (type) {
    case 'sign':
      condSet = new Set(['json', 'auto_user', 'auto_date']);
      ret = data.filter(item => true ^ condSet.has(item.type));
      break;
    case 'json':
      condSet = new Set(['json']);
      ret = data.filter(item => false ^ condSet.has(item.type));
      break;
    case 'auto':
      ret = data.filter(item => item.type.startsWith('auto_'));
      break;
  }
  return ret;
};

export const getKeyField = e => {
  let list = e.filter(item => item.key);
  return list[0].dataIndex;
};

var unitList = {
  chcp: 'kw',
  chcpa: 'kw',
  el: 'kwh',
  ela: 'kwh',
  fl: 'm3/h',
  fla: 'm3',
  fr: 'hz',
  hcp: 'kw',
  hcpa: 'kw',
  li: 'm',
  po: 'kw',
  poa: 'kw',
  pr: 'kpa',
  pri: 'bar',
  pro: 'bar',
  son: '',
  tp: '℃',
  vlp: '%',
  vls: '',
  wfl: `m3/h`,
  wfla: `m3/h`,
  wpri: 'kpa',
  wpro: 'kpa',
  wtpi: '℃',
  wtpo: '℃',
  yc: 'm',
  rlap: '%',
  al: '',
  vlpf: '',
  vlpc: '',
  rem: '',
  sdal: '',
  eer_o: '',
  acp_po: 'kw',
  acp_el: 'kwh',
  vlp: '%',
  cnt: '%',
  sfb: '%',
  pos: '%',
  fac: '%',
  cod: '%',
  avg: '%',
  l3: '%',
  l2: '%',
  l1: '%',
  ac: '%',
  bc: '%',
  ab: '%',
  prd: '%',
  src: '%',
  rst: '%',
  tp1: '℃',
  tp2: '℃',
  tp3: '℃'
};

var propList = {
  chcp: '制冷量',
  chcpa: '总制冷量',
  chw_fl: '冷冻水流量',
  chw_pr: '冷冻水压',
  chw_wfla: '冷冻总流量',
  chw_wtpi: '冷冻回水温度',
  chw_wtpo: '冷冻供水温度',
  cw_fl: '冷却水流量',
  cw_pr: '冷却水压',
  cw_wfla: '冷却总流量',
  cw_wtpi: '冷却回水温度',
  cw_wtpo: '冷却供水温度',
  el: '电量',
  ela: '总电量',
  fl: '流量',
  fr: '电机频率',
  hcp: '排热量',
  hcpa: '总排热量',
  li: '扬程',
  ln_pr: '冷凝器冷媒压力',
  ln_tp: '冷凝器冷媒温度',
  oil_pr: '油压差',
  oil_tp: '油温',
  po: '功率',
  poa: '总功率',
  pri: '进水压力',
  pro: '出水压力',
  son: '运行状态',
  vlp: '阀门开度',
  vls: '阀门状态',
  wfl: '水流量',
  wfla: '总水流量',
  wpri: '进压',
  wpro: '出压',
  wtpi: '进水温度',
  wtpo: '出水温度',
  yc: '扬程',
  zf_pr: '蒸发器冷媒压力',
  zf_tp: '蒸发器冷媒温度',
  rlap: '电流百分比',
  al: '报警状态',
  f1_el: '风扇风机电量',
  f1_fr: '风扇电机频率',
  f1_po: '风扇风机功率',
  f1_son: '风扇风机状态',
  f2_el: '风扇风机电量',
  f2_fr: '风扇电机频率',
  f2_po: '风扇风机功率',
  f2_son: '风扇风机状态',
  f3_el: '风扇风机电量',
  f3_fr: '风扇电机频率',
  f3_po: '风扇风机功率',
  f3_son: '风扇风机状态',
  f4_el: '风扇风机电量',
  f4_fr: '风扇电机频率',
  f4_po: '风扇风机功率',
  f4_son: '风扇风机状态',
  chv_wtpi: '冷冻回水温度2',
  chv_wtpo: '冷冻供水温度2',
  cv_wtpi: '冷却回水温度2',
  cv_wtpo: '冷却供水温度2',
  vlpf: '冷冻阀开度',
  vlpc: '冷却阀开度',
  rem: '本地远程状态',
  sdal: '冷冻机停机故障',
  acp_fl_1: '3#1F空压流量',
  acp_fl_2: '3#1F氮气流量',
  acp_fl_3: '3#2F空压流量',
  acp_fl_4: '3#2F氮气流量',
  acp_fl_5: '1#3F空压流量',
  acp_fl_6: '2#1F空压流量',
  acp_fl_7: '2#2F空压流量',
  acp_fl_8: '4#氮气流量',
  acp_fl_9: '空压总流量',
  acp_fl_10: '氮气总流量',
  acp_fla_1: '3#1F空压累计用量',
  acp_fla_2: '3#1F氮气累计用量',
  acp_fla_3: '3#2F空压累计用量',
  acp_fla_4: '3#2F氮气累计用量',
  acp_fla_5: '1#3F空压累计用量',
  acp_fla_6: '2#1F空压累计用量',
  acp_fla_7: '2#2F空压累计用量',
  acp_fla_8: '4#氮气累计用量',
  acp_fla_9: '空压总累计用量',
  acp_fla_10: '氮气总累计用量',
  str_cnt: '启动次数',
  tp_sfb: '当前温度设定值',
  rlam_sfb: '当前温度设定值',
  igv2_pos: 'IGV2位置',
  mtr_tp3: '马达绕组温度3',
  igv1_pos: 'IGV1位置',
  mtr_tp2: '马达绕组温度2',
  mtr_tp1: '马达绕组温度1',
  pow_fac: '功率因素',
  dag_cod: '诊断代码',
  phc_avg: '平均相电流',
  phc_l3: 'L3相电流',
  phc_l2: 'L2相电流',
  phc_l1: 'L1相电流',
  phv_avg: '平均相电压',
  phv_ac: 'AC相电压',
  phv_bc: 'BC相电压',
  phv_ab: 'AB相电压',
  oil_prd: '油压差',
  tnk_pr: '油箱压力',
  ref_prd: '冷媒压差',
  stp_src: '设定点来源',
  bas_err_rst: 'BAS故障复位',
  pan_ast_st: '面板AUTO_STOP状态',
  alm_st: '报警状态',
  cdr_fls_st: '冷凝器水流状态',
  eva_fls_st: '蒸发器水流状态',
  cdr_apr_tp: '冷凝器趋近温度',
  eva_apr_tp: '蒸发器趋近温度',
  tnk_tp: '油箱温度',
  cpr_air_tp: '压缩机冷媒排气温度'
};

export const unitByVal = field => {
  return unitList[field];
};

export const propByVal = field => {
  return propList[field];
};

export const caluStatus = (list, prop) => {
  if (!list) return 'on';
  let status = false;

  list.map((item, i) => {
    if (item.m === prop) {
      status = item.v > 0.1;
    }
  });
  return status;
};

const sortObjectByKey = obj => {
  const sortedObj = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sortedObj[key] = obj[key];
    });
  return sortedObj;
};

export const sensorDataToList = (data_org, code, ret = {}) => {
  // 将对象以字母排序
  const data = sortObjectByKey(data_org);

  Object.keys(data).reduce((pre, cur, i) => {
    let cList = cur.split('_');
    let cKey = cList[0];
    let cId = parseInt(cList[1]);
    let cProp = `${cKey}_${cId}`;
    let cName = cList.filter((o, i) => i > 1).join('_');
    let cNameS = cList[cList.length - 1];

    if (!pre) {
      ret[cKey] = [
        {
          id: cId,
          list: [
            {
              p: propByVal(cName),
              m: cName,
              v: data[cur],
              u: unitByVal(cNameS)
            }
          ]
        }
      ];
      return cur;
    }

    let pList = pre.split('_');
    let pKey = pList[0];
    let pId = parseInt(pList[1]);

    if (cKey === pKey && cId === pId) {
      let len = ret[cKey].length;
      ret[cKey][len - 1].list.push({
        p: propByVal(cName),
        m: cName,
        v: data[cur],
        u: unitByVal(cNameS)
      });
    } else if (cKey === pKey && cId !== pId) {
      ret[cKey].push({
        id: cId,
        list: [
          { p: propByVal(cName), m: cName, v: data[cur], u: unitByVal(cNameS) }
        ]
      });
    } else if (cKey !== pKey) {
      ret[cKey] = [
        {
          id: cId,
          list: [
            {
              p: propByVal(cName),
              m: cName,
              v: data[cur],
              u: unitByVal(cNameS)
            }
          ]
        }
      ];
    }
    return cur;
  }, null);

  if (Object.keys(ret).length === 0) {
    return {};
  }

  ret.fm = [
    { id: 1, list: [] },
    { id: 2, list: [] },
    { id: 3, list: [] },
    { id: 4, list: [] },
    { id: 5, list: [] },
    { id: 6, list: [] },
    { id: 7, list: [] },
    { id: 8, list: [] },
    { id: 9, list: [] },
    { id: 10, list: [] }
  ];
  ret.pf = [
    { id: 1, list: [] },
    { id: 2, list: [] }
  ];

  const FM_LEN = code === 'cps_1' ? 5 : 4;

  Object.keys(ret).map((item, i) => {
    ret[item].map((o, j) => {
      let emp = o.list.every(p => Number.isNaN(p.v));

      if (j === 4) {
        emp = true;
      }
      o.emp = emp;

      switch (item) {
        case 'ch':
          var al = caluStatus(o.list, 'al') || caluStatus(o.list, 'sdal');
          var on = caluStatus(o.list, 'son') && caluStatus(o.list, 'rlap');
          o.status = al ? 'al' : on ? 'on' : 'off';
          break;
        case 'chp':
        case 'cwp':
        case 'ct':
          var al = caluStatus(o.list, 'al') || caluStatus(o.list, 'sdal');
          var on = caluStatus(o.list, 'son');
          o.status = al ? 'al' : on ? 'on' : 'off';
          break;
        case 'fm':
          if ('ch' in ret) {
            let index = j < FM_LEN ? j : j % FM_LEN;
            let list = ret['ch'][index]?.list;
            let fm =
              j < FM_LEN ? caluStatus(list, 'vlpc') : caluStatus(list, 'vlpf');
            o.status = fm ? 'on' : 'al';
          }
          break;
        case 'pf':
          // const ven1 = ret?.sys[0].list.filter(o=> o.m === "ven_son_1")
          // const ven2 = ret?.sys[0].list.filter(o=> o.m === "ven_son_2")
          // const ven = ret?.sys[0].list.filter(o=> o.m === `ven_son_${j+1}`)
          // o.status = ven[0]?.v===1 ? 'on' : 'off';
          break;
      }
    });
  });

  // console.log('pfff',ret)
  return ret;
};
