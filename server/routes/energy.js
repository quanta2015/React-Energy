var fs = require('fs')
var path = require('path')
var express = require('express')
var router = express.Router()
var {callP} = require("../db/db")
var dayjs = require('dayjs')

const getParams = (e) => {
  let period = {
    d1: [dayjs().startOf('day'), dayjs().endOf('day'), 10000],
    d0: [dayjs().subtract(1, 'days').startOf('day'), dayjs().subtract(1, 'days').endOf('day'), 10000],
    w1: [dayjs().startOf('week'), dayjs().endOf('week'), 1000000],
    w0: [dayjs().subtract(1, 'weeks').startOf('week'), dayjs().subtract(1, 'weeks').endOf('week'), 1000000],
    m1: [dayjs().startOf('month'), dayjs().endOf('month'), 1000000],
    m0: [dayjs().subtract(1, 'months').startOf('month'), dayjs().subtract(1, 'months').endOf('month'), 1000000],
    y1: [dayjs().startOf('year'), dayjs().endOf('year'), 10000],
    y0: [dayjs().subtract(1, 'years').startOf('year'), dayjs().subtract(1, 'years').endOf('year'), 10000]
  }

  let item = period[e]
  return { fr: item[0].format('YYYYMMDDHHmmss'), to: item[1].format('YYYYMMDDHHmmss'), unit: item[2] }
}

const getDay=(dateStr, type)=> {

  const year = dateStr.toString().substring(0, 4);
  const month = dateStr.toString().substring(4, 6);
  const day = dateStr.toString().substring(6, 8);
  const date = dayjs(`${year}-${month}-${day}`);

  if (!date.isValid()) {
    return '无效的日期';
  }

  if (type === 0) {
    const dayOfWeek = date.day();
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[dayOfWeek];
  } else {
    return date.date();
  }
}


const caluData1 = (r1, r2, r3, r4) => {
  data = r1.map((o, i) => {
    let item = {
      dt: o.dt,
      ea0: o.ea,
      ka0: o.ka,
      da0: o.da,
      ea1: null,
      ka1: null,
      da1: null,
      ef0: o.ea,
      kf0: o.ka,
      df0: o.da,
      ef1: null,
      kf1: null,
      df1: null,
    }
    tmp = r2.filter(e => e.dt === o.dt);
    if (tmp.length > 0) {
      item.ea1 = tmp[0]?.ea ?? null
      item.ka1 = tmp[0]?.ka ?? null
      item.da1 = tmp[0]?.da ?? null
    }
    return item
  })

  return data
}


const caluData2 = (r1, r2) => {
  data = r1.map((o, i) => {
    let item = {
      dt: o.dt,
      ef0: o.ef,
      kf0: o.kf,
      df0: o.df,
      ef1: null,
      kf1: null,
      df1: null,
    }
    tmp = r2.filter(e => e.dt === o.dt);
    if (tmp.length > 0) {
      item.ef1 = tmp[0]?.ef ?? null
      item.kf1 = tmp[0]?.kf ?? null
      item.df1 = tmp[0]?.df ?? null
    }
    return item
  })

  return data
}

const checkResult = (e) => {
  let ret = { ka: 0, da: 0 }
  ret.ka = e[0].ka ?? 0
  ret.da = e[0].da ?? 0
  ret.el = e[0].el ?? 0
  return ret
}



router.post('/queryEnergy01', async (req, res, next) => {
  let sql1 = 'CALL PROC_ANA_USE(?)';
  let pd0 = getParams('d0')
  let pd1 = getParams('d1')
  let pw0 = getParams('w0')
  let pw1 = getParams('w1')
  let pm0 = getParams('m0')
  let pm1 = getParams('m1')

  let rd0 = await callP(sql1, pd0, res);
  let rd1 = await callP(sql1, pd1, res);
  let rw0 = await callP(sql1, pw0, res);
  let rw1 = await callP(sql1, pw1, res);
  let rm0 = await callP(sql1, pm0, res);
  let rm1 = await callP(sql1, pm1, res);

  rd0.map(o => o.dt = o.dt.toString().slice(8))
  rd1.map(o => o.dt = o.dt.toString().slice(8))
  rw0.map(o => o.dt = getDay(o.dt, 0))
  rw1.map(o => o.dt = getDay(o.dt, 0))
  rm0.map(o => o.dt = getDay(o.dt, 1))
  rm1.map(o => o.dt = getDay(o.dt, 1))

  let ret_d = caluData1(rd0, rd1)
  let ret_w = caluData1(rw0, rw1)
  let ret_m = caluData1(rm0, rm1)

  res.status(200).json({ code: 0, ret_d, ret_w, ret_m })
})

router.post('/queryEnergy02', async (req, res, next) => {
  let sql = 'CALL PROC_DATA_FL2(?)';
  let pd0 = getParams('d0')
  let pd1 = getParams('d1')

  let rd0 = await callP(sql, pd0, res);
  let rd1 = await callP(sql, pd1, res);

  rd0.map(o => o.dt = o.dt.toString().slice(8))
  rd1.map(o => o.dt = o.dt.toString().slice(8))

  let ret_f = caluData2(rd0, rd1)

  res.status(200).json({ code: 0, ret_f })
})



router.post('/queryEnergy03', async (req, res, next) => {
  let sql_t01 = 'CALL PROC_TAB_FL()';
  let sql_t02 = 'CALL PROC_TAB_EL()';
  let sql_t2 = 'CALL PROC_TAB_USE(?)';

  let pt_1 = { "type": "day0" };
  let pt_2 = { "type": "day1" };
  let pt_3 = { "type": "week0" };
  let pt_4 = { "type": "week1" };
  let pt_5 = { "type": "month0" };
  let pt_6 = { "type": "month1" };
  let pt_7 = { "type": "year0" };
  let pt_8 = { "type": "year1" };

  let tab_t01 = await callP(sql_t01, null, res);
  let tab_t02 = await callP(sql_t02, null, res);
  let tab_t1 = checkResult(await callP(sql_t2, pt_1, res));
  let tab_t2 = checkResult(await callP(sql_t2, pt_2, res));
  let tab_t3 = checkResult(await callP(sql_t2, pt_3, res));
  let tab_t4 = checkResult(await callP(sql_t2, pt_4, res));
  let tab_t5 = checkResult(await callP(sql_t2, pt_5, res));
  let tab_t6 = checkResult(await callP(sql_t2, pt_6, res));
  let tab_t7 = checkResult(await callP(sql_t2, pt_7, res));
  let tab_t8 = checkResult(await callP(sql_t2, pt_8, res));

  let tab = {
    flow: { kf: tab_t01[0].kf, df: tab_t01[0].df },
    el: { el: tab_t02[0].el },
    day: { ka0: tab_t1.ka, ka1: tab_t2.ka, da0: tab_t1.da, da1: tab_t2.da, el0: tab_t1.el, el1: tab_t2.el },
    week: { ka0: tab_t3.ka, ka1: tab_t4.ka, da0: tab_t3.da, da1: tab_t4.da, el0: tab_t3.el, el1: tab_t4.el },
    month: { ka0: tab_t5.ka, ka1: tab_t6.ka, da0: tab_t5.da, da1: tab_t6.da, el0: tab_t5.el, el1: tab_t6.el },
    year: { ka0: tab_t7.ka, ka1: tab_t8.ka, da0: tab_t7.da, da1: tab_t8.da, el0: tab_t7.el, el1: tab_t8.el },
  }

  res.status(200).json({ code: 0, tab })
})


router.post('/queryEnergy04', async (req, res, next) => {
  let sql_pow_el = 'CALL PROC_POW_EL()';
  let rp = (await callP(sql_pow_el, null, res))[0]

  pow = {
    sys1: [rp.sys1_1, rp.sys1_2, rp.sys1_3, null],
    sys2: [rp.sys2_1, rp.sys2_2, rp.sys2_3, rp.sys2_4],
    sys3: [rp.sys3_1, rp.sys3_2, rp.sys3_3, rp.sys3_4],
  }

  res.status(200).json({ code: 0, pow })
})


router.post('/queryEnergy05', async (req, res, next) => {
  let sql_pow_us = 'CALL PROC_POW_USE()';
  let ru = (await callP(sql_pow_us, null, res))[0]
  pie = {
    sys1: [
      ['生产', ru.sys1_1],
      ['间接生产', ru.sys1_2],
      ['辅助', ru.sys1_3]
    ],
    sys2: [
      ['电子中心', ru.sys2_1],
      ['机电中心', ru.sys2_2],
      ['管理平台', ru.sys2_3],
      ['生产公用', ru.sys2_3]
    ],
    sys3: [
      ['2号楼', ru.sys3_1],
      ['3号楼', ru.sys3_2],
      ['3号楼辅房', ru.sys3_3],
      ['10号楼', ru.sys3_3]
    ],
  }

  res.status(200).json({ code: 0, pie })
})


module.exports = router