var fs = require('fs')
var path = require('path')
var axios = require('axios')
var dayjs = require('dayjs')
var dotenv = require('dotenv')
var express = require('express')
var jwt = require('jsonwebtoken')
var formidable = require('formidable')
var Excel = require('exceljs');
var router = express.Router()
var db = require("../db/db")


const SECRET_KEY = 'KBD-PLATFORM-2024'
const UPLOAD_DIR = `${__dirname}/../upload`


dotenv.config()

var root = path.resolve(__dirname, '../')
var clone = (e) => {
  return JSON.parse(JSON.stringify(e))
}
var isN = (e) => {
  return ((e === null) || (e === '') || (e === undefined)) ? true : false
}

const callSQLProc = (sql, params, res) => {
  return new Promise(resolve => {
    db.procedureSQL(sql, JSON.stringify(params), (err, ret) => {
      if (err) {
        res.status(500).json({ code: -1, msg: '提交请求失败，请联系管理员！', data: null })
      } else {
        resolve(ret)
      }
    })
  })
}

const callP = async (sql, params, res) => {
  return await callSQLProc(sql, params, res)
}


router.post('/login',async (req, res, next) =>{
  let params = req.body
  let sql = `CALL PROC_LOGIN(?)`
  let r = await callP(sql, params, res)
  if (r.length > 0) {
    let ret = clone(r[0])
    let token = jwt.sign(ret, SECRET_KEY)
    res.status(200).json({code:0, data: ret, token: token, msg: '登录成功'})
  } else {
    res.status(200).json({code:1, data: null, msg: '用户名或密码错误'})
  }
})



router.post('/upload', function(req, res,next) {
  const form = formidable({ uploadDir: `${__dirname}/../upload` });

  form.on('fileBegin', function(name, file) {
    const filename = file.originalFilename;
    const filepath =  file.filepath;
    const fileext = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);

    file.filepath = `upload/${dayjs().format('YYYYMMDDhhmmss')}.${fileext}`
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    res.status(200).json({
      status: 200,
      success: true,
      msg: '文件上传成功',
      data: files.file.filepath
    })
  });
})




router.post('/queryTable', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_QUERY_TABLE(?)`
  let r = await callP(sql, params, res)

  res.status(200).json({ code: 0, data: r })
})


router.post('/saveField', async (req, res, next) => {
  let { data } = req.body
  let sql = `CALL PROC_SAVE_FIELD(?)`
  let r = await callP(sql, data, res)

  res.status(200).json({ code: 0, data: r })
})

router.post('/queryField', async (req, res, next) => {
  let sql1 = `CALL PROC_QUERY_FIELD()`
  let sql2 = `CALL PROC_QUERY_DEV()`
  let sql3 = `CALL PROC_QUERY_MAP()`

  let r = await callP(sql1, null, res)
  let s = await callP(sql2, null, res)
  let t = await callP(sql3, null, res)

  res.status(200).json({ code: 0, sns: r, dev: s, map: t })
})


router.post('/saveTable', async (req, res, next) => {
  let { table, def, method } = req.body;
  let id = def.splice(0, 1)[0].val;
  let sql;

  if (!id) {
    const values = def.map(param => `'${param.val ?? ''}'`).join(',');
    const fields = def.map(param => `${param.dataIndex}`).join(',');
    sql = `INSERT INTO ${table}(${fields}) VALUES(${values});`;
  } else {
    const setClause = def.map(param => `${param.dataIndex} = '${param.val}'`).join(', ');
    sql = `UPDATE ${table} SET ${setClause} WHERE id = ${id};`;
  }

  console.log(sql)

  let r = await callP(sql, null, res)
  res.status(200).json({ code: 0 })
})


router.post('/deleteRecord', async (req, res, next) => {
  let { table, key, val } = req.body
  let sql = `delete from ${table} where ${key}='${val}'`
  
  let r = await callP(sql, null, res)
  res.status(200).json({ code: 0 })
})


router.post('/saveMapData', async (req, res, next) => {
  let { data } = req.body
  
  let sql1 = `CALL PROC_SAVE_MAP(?)`
  let sql2 = `CALL PROC_QUERY_MAP()`

  let r = await callP(sql1, data, res)
  let t = await callP(sql2, null, res)

  res.status(200).json({ code: 0, map: t })
})

router.post('/delMapData', async (req, res, next) => {
  let params = req.body
  
  let sql = `CALL PROC_DEL_MAP(?)`
  let r = await callP(sql, params, res)

  res.status(200).json({ code: 0, map: r })
})

router.post('/queryMap', async (req, res, next) => {
  let sql = `CALL PROC_QUERY_MAP()`
  let r = await callP(sql, null, res)

  // console.log(r)

  res.status(200).json({ code: 0, data: r })
})

router.post('/querySysData', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_QUERY_SYS_DATA(?)`
  let r = await callP(sql, params, res)

  res.status(200).json({ code: 0, data: r })
})


const res_column = [
    { key: 'id', header: '编号', width: 10 },
    { key: 'name', header: '名称', width: 30 },
    { key: 'type', header: '类型', width: 10 },
    { key: 'model', header: '型号', width: 10 },
    { key: 'brand', header: '品牌', width: 10 },
    { key: 'loc1', header: '位置(1级)', width: 10 },
    // { key: 'loc2', header: '位置(2级)', width: 10 },
    { key: 'dep1', header: '所属中心(1级)', width: 15 },
    // { key: 'dep2', header: '所属子中心(2级)', width: 15 },
    { key: 'sys1', header: '所属系统(1级)', width: 15 },
    { key: 'sys2', header: '所属子系统(2级)', width: 15 },
    { key: 'sys3', header: '所属子系统(3级)', width: 30 },
    { key: 'pur_date', header: '采购日期', width: 15 },
    { key: 'pur_price', header: '采购金额', width: 10 },
  ];

router.post('/exportRes', async (req, res, next) => {
  let params = { res_id:'' }
  let sql = `CALL PROC_QUERY_RES(?)`
  let data = await callP(sql, params, res)


  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  worksheet.columns = res_column

  data.forEach((item, index) => {
    const rowValues = {
      id: item.id,
      name: item.name,
      type: item.type,
      model: item.model,
      brand: item.brand,
      loc1: item.loc1,
      // loc2: item.loc2,
      dep1: item.dep1,
      // dep2: item.dep2,
      sys1: item.sys1,
      sys2: item.sys2,
      sys3: item.sys3,
      pur_date: item.pur_date,
      pur_price: item.pur_price,
    };
    const row = worksheet.addRow(rowValues);

    row.getCell('id').protection = { locked: true };

    Object.keys(rowValues).forEach((key) => {
      if (key !== 'id') {
        row.getCell(key).protection = { locked: false };
      }
    });
  });

  worksheet.protect();

  let file = `export/${dayjs().format('YYYYMMDDhhmmss')}.xlsx`
  await workbook.xlsx.writeFile(file);

  res.status(200).json({ code: 0, file  })
})

router.post('/importRes', async (req, res, next) => {
  let filename 
  let filepath 

  const form = formidable({ uploadDir: `${root}/upload` });

  form.on('fileBegin', function(name, file) {
    const fileext = file.originalFilename.slice(((file.originalFilename.lastIndexOf(".") - 1) >>> 0) + 2);
    filename = `import_${dayjs().format('YYYYMMDDhhmmss')}.${fileext}`
    filepath = `${root}/upload/${filename}`

    file.filepath = `upload/${filename}`
  })

  form.parse(req, async(err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filepath);
    const worksheet = workbook.getWorksheet(1);

    let head = []
    let data = [];

    worksheet.eachRow({ includeEmpty: true }, (row, i) => {
      if (i===1) {
        row.eachCell({ includeEmpty: true }, (cell, j) => {
          head.push(cell.value??'');
        });
      }else{
        let rowData = [];
        row.eachCell({ includeEmpty: true }, (cell, j) => {
          rowData.push(cell.value??'');
        });
        data.push(rowData);
      }
    })

    let sql = `CALL PROC_IMPORT_RES(?)`
    let r = await callP(sql, data, res)

    res.status(200).json({
      status: 200,
      success: true,
      data: r,
      msg: '数据导入成功',
    })
  });
})

const dev_column = [
  { key: 'id', header: '编号', width: 10 },
  { key: 'name', header: '名称', width: 30 },
  { key: 'data_type', header: '数据类型', width: 20 },
  { key: 'dep1', header: '所属中心(一级)', width: 20 },
  { key: 'dep2', header: '所属中心(二级)', width: 20 },
  { key: 'loc1', header: '位置(一级)', width: 15 },
  { key: 'loc2', header: '位置(二级)', width: 15 },
  { key: 'sys1', header: '所属系统(一级)', width: 15 },
  { key: 'sys2', header: '所属系统(二级)', width: 15 },
  { key: 'pro_time', header: '所属期数', width: 10 },
  { key: 'dev_type', header: '仪表类型', width: 20 },
  { key: 'dev_brand', header: '仪表品牌', width: 10 },
  { key: 'dev_id', header: '仪表型号', width: 15 },
  { key: 'dev_lv', header: '分级', width: 15 },
  { key: 'loc_ins', header: '安装位置', width: 20 },
  { key: 'pname', header: '变压器名称(电)', width: 20 },
  { key: 'ec_id', header: '柜号(电)', width: 15 },
  { key: 'dr_id', header: '抽屉柜编号(电)', width: 20 }
];

router.post('/exportDev', async (req, res, next) => {

  let sql = `CALL PROC_QUERY_DEV()`
  let data = await callP(sql, null, res)


  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  worksheet.columns = dev_column

  data.forEach((item, index) => {
    const rowValues = {
      id: item.id,
      name: item.name,
      data_type: item.data_type,
      dep1: item.dep1,
      dep2: item.dep2,
      loc1: item.loc1,
      loc2: item.loc2,
      sys1: item.sys1,
      sys2: item.sys2,
      pro_time: item.pro_time,
      dev_type: item.dev_type,
      dev_brand: item.dev_brand,
      dev_id: item.dev_id,
      dev_lv: item.dev_lv,
      loc_ins: item.loc_ins,
      pname: item.pname,
      ec_id: item.ec_id,
      dr_id: item.dr_id,
    };
    const row = worksheet.addRow(rowValues);

    row.getCell('id').protection = { locked: true };

    Object.keys(rowValues).forEach((key) => {
      if (key !== 'id') {
        row.getCell(key).protection = { locked: false };
      }
    });
  });

  worksheet.protect();

  let file = `export/${dayjs().format('YYYYMMDDhhmmss')}.xlsx`
  await workbook.xlsx.writeFile(file);

  res.status(200).json({ code: 0, file  })
})

router.post('/importDev', async (req, res, next) => {
  let filename 
  let filepath 

  const form = formidable({ uploadDir: `${root}/upload` });

  form.on('fileBegin', function(name, file) {
    const fileext = file.originalFilename.slice(((file.originalFilename.lastIndexOf(".") - 1) >>> 0) + 2);
    filename = `import_${dayjs().format('YYYYMMDDhhmmss')}.${fileext}`
    filepath = `${root}/upload/${filename}`
    file.filepath = `upload/${filename}`
  })

  form.parse(req, async(err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filepath);
    const worksheet = workbook.getWorksheet(1);

    let head = []
    let data = [];

    worksheet.eachRow({ includeEmpty: true }, (row, i) => {
      if (i===1) {
        row.eachCell({ includeEmpty: true }, (cell, j) => {
          head.push(cell.value??'');
        });
      }else{
        let rowData = [];
        row.eachCell({ includeEmpty: true }, (cell, j) => {
          rowData.push(cell.value??'');
        });
        data.push(rowData);
      }
    })

    let sql = `CALL PROC_IMPORT_DEV(?)`
    let r = await callP(sql, data, res)

    res.status(200).json({
      status: 200,
      success: true,
      data: r,
      msg: '数据导入成功',
    })
  });
})

router.post('/saveSensorData', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_SAVE_SS_DATA(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data: r })
})

const checkResult = (e) => {
  let ret = { ka: 0, da: 0 }
  ret.ka = e[0].ka ?? 0
  ret.da = e[0].da ?? 0
  ret.el = e[0].el ?? 0
  return ret
}


router.post('/queryAnalysis', async (req, res, next) => {
  let { mode } = req.body
  let params = req.body
  let sql = 'CALL PROC_ANA_FL(?)';

  if (mode === 1) {
    let { fr1, to1, fr0, to0 } = req.body
    let params1 = { fr: fr0, to: to0, ...params }
    let params2 = { fr: fr1, to: to1, ...params }
    let r1 = await callP(sql, params1, res);
    let r2 = await callP(sql, params2, res);

    let data = r1.map((o, i) => {
      let item = {
        dt: o.dt.toString().slice(8),
        val1: o.val,
        val2: null,
      }
      tmp = r2.filter(e => e.dt.toString().slice(8) === o.dt.toString().slice(8));
      if (tmp.length > 0) {
        item.val2 = tmp[0]?.val ?? null
      }
      return item
    })
    res.status(200).json({ code: 0, data })

  } else {
    let r = await callP(sql, params, res);
    res.status(200).json({ code: 0, data: r })
  }
})


const formatList =(list)=>{
  list.forEach(o => {
    o.file = o.file === '' ? [] : JSON.parse(o.file);
    o.imgs = o.imgs === '' ? [] : JSON.parse(o.imgs);
  })
}


router.post('/saveResMat', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_SAVE_MAT(?)`
  let r = await callP(sql, params, res)
  formatList(r)
  res.status(200).json({ code: 0, data: r })
})


router.post('/queryResMat', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_QUERY_RES_MAT(?)`
  let r = await callP(sql, params, res)
  formatList(r)
  res.status(200).json({ code: 0, data: r })
})


router.post('/saveResRep', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_SAVE_REP(?)`
  let r = await callP(sql, params, res)
  formatList(r)
  res.status(200).json({ code: 0, data: r })
})


router.post('/queryResAch', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_QUERY_RES_ACH(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 0, data: r })
})


router.post('/saveResAch', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_SAVE_ACH(?)`
  let r = await callP(sql, params, res)
  // formatList(r)
  res.status(200).json({ code: 0, data: r })
})


router.post('/queryResRep', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_QUERY_RES_REP(?)`
  let r = await callP(sql, params, res)
  formatList(r)
  res.status(200).json({ code: 0, data: r })
})

router.post('/queryResBak', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_QUERY_RES_BAK(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 0, data: r })
})


router.post('/saveResBak', async (req, res, next) => {
  let params = req.body
  let sql = `CALL PROC_SAVE_BAK(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 0, data: r })
})


router.post('/queryRes', async (req, res, next) => {
  let params = req.body
  // console.log(params)
  let sql1 = `CALL PROC_QUERY_RES(?)`
  let sql2 = `CALL PROC_QUERY_RES_MAT(?)`
  let sql3 = `CALL PROC_QUERY_RES_REP(?)`
  let sql4 = `CALL PROC_QUERY_RES_BAK(?)`

  let r  = await callP(sql1, params, res)
  let s1 = await callP(sql2, params, res)
  let s2 = await callP(sql3, params, res)
  let s3 = await callP(sql4, params, res)

  formatList(s1)
  formatList(s2)
  res.status(200).json({ code: 0, data: r, mat: s1, rep:s2, bak:s3 })
})


const caluSum = (data) => {
  let countSet = new Set()
  data.map(o => countSet.add(o.res_id))
  const main = [...countSet].length
  const sub  = data.length
  return { main, sub }
}


const caluCount = (data) => {
  const sysCount = data.reduce((acc, item) => {
    const sysName = item.sys;
    if (acc[sysName]) {
      acc[sysName] += 1; // 如果已经有了这个系统的计数，则增加
    } else {
      acc[sysName] = 1; // 如果没有这个系统的计数，则初始化为1
    }
    return acc;
  }, {});
  return sysCount
}




router.post('/queryMatInfo', async (req, res, next) => {
  const params1 = { status: 1, month: 1 }
  const params2 = { status: 0, month: 1 }
  const params3 = { status: 2, month: 1 }

  const sql1 = `CALL PROC_QUERY_MAT_INFO(?)`
  const data1 = await callP(sql1, params1, res)
  const data2 = await callP(sql1, params2, res)
  const data3 = await callP(sql1, params3, res)
  // console.log(data1,'d1', data2, 'd2', data3, 'd3')

  const sql2 = `CALL PROC_QUERY_REP_INFO(?)`
  const data4 = await callP(sql2, params1, res)
  const data5 = await callP(sql2, params2, res)


  const sql3 = `CALL PROC_QUERY_RES(?)`
  const dataRes = await callP(sql3, {res_id:''}, res)

  const r1 = caluSum(data1)
  const r2 = caluSum(data2)
  const r3 = caluSum(data3)
  const r4 = caluSum(data4)
  const r5 = caluSum(data5)
  const sysInfo = caluCount(data2)

  const total = {
    mat_done: r1,
    mat_wait: r2,
    mat_err:  r3,
    rep_done: r4,
    rep_wait: r5,
  }


  res.status(200).json({ code: 0, total, data: sysInfo, res:dataRes })
})


// router.post('/queryMatInfo', async (req, res, next) => {
//   const params1 = { status: 1, month: 1 }
//   const params2 = { status: 0, month: 1 }
//   const params3 = { status: 2, month: 1 }

//   const sql1 = `CALL PROC_QUERY_MAT_INFO(?)`
//   const data1 = await callP(sql1, params1, res)
//   const data2 = await callP(sql1, params2, res)
//   const data3 = await callP(sql1, params3, res)
//   // console.log(data1,'d1', data2, 'd2', data3, 'd3')

//   const sql2 = `CALL PROC_QUERY_REP_INFO(?)`
//   const data4 = await callP(sql2, params1, res)
//   const data5 = await callP(sql2, params2, res)

//   const r1 = caluSum(data1)
//   const r2 = caluSum(data2)
//   const r3 = caluSum(data3)
//   const r4 = caluSum(data4)
//   const r5 = caluSum(data5)
//   const sysInfo = caluCount(data2)

//   const total = {
//     mat_done: r1,
//     mat_wait: r2,
//     mat_err:  r3,
//     rep_done: r4,
//     rep_wait: r5,
//   }

//   res.status(200).json({ code: 0, total, data: sysInfo })
// })



const FIELD_EL1 = ["PA23","PA27","PA31","PA35","PA39","PA43","PA47","PB01","PB05","PB09","PB33","PB37","PB41","PB45","PB49","PC03","PC07","PC11","PC15","PC19","PC23","PC27","PC30","PC34","PC38","PC42","PC46","PC50","PD04","PD08"]
const FIELD_EL2 = ["PB13","PB17","PB21","PB25","PB29"]
const FIELD_EL3 = ["PA35+PA39+PB13+PB17+PB21+PB25+PC11+PC15+PC46","PA47+PB29+PC03+PC07+PD08","PB33+PB45","PC23+PC27+PC42"]
const FIELD_EL = [...FIELD_EL1,...FIELD_EL2,...FIELD_EL3]

const FIELD_AI = ["PA21","PD13","PA11","PA17","PA01","PA05","PA09","PA13"]
const FIELD_NI = ["PA19","PA03","PA07","PA15"]

router.post('/queryEngTab', async (req, res, next) => {
  let sql = 'CALL PROC_ENG_TAB(?)';

  // const data = ["PA23","PA27","PA31","PA35","PA39","PA43","PA47","PB01","PB05","PB09","PB33","PB37","PB41","PB45","PB49","PC03","PC07","PC11","PC15","PC19","PC23","PC27","PC30","PC34","PC38","PC42","PC46","PC50","PD04","PD08","PB13","PB17","PB21","PB25","PB29","PA21","PD13","PA11","PA17","PA01","PA05","PA09","PA13","PA19","PA03","PA07","PA15","PA35+PA39+PB13+PB17+PB21+PB25+PC11+PC15+PC46","PA47+PB29+PC03+PC07+PD08","PB33+PB45","PC23+PC27+PC42"]

  const data = [...FIELD_EL,...FIELD_AI,...FIELD_NI]

  let pd0 = {...getParams('d0'), data }
  let pd1 = {...getParams('d1'), data }
  let pw0 = {...getParams('w0'), data }
  let pw1 = {...getParams('w1'), data }
  let pm0 = {...getParams('m0'), data }
  let pm1 = {...getParams('m1'), data }

  let rd0 = (await callP(sql, pd0, res))[0];
  let rd1 = (await callP(sql, pd1, res))[0];
  let rw0 = (await callP(sql, pw0, res))[0];
  let rw1 = (await callP(sql, pw1, res))[0];
  let rm0 = (await callP(sql, pm0, res))[0];
  let rm1 = (await callP(sql, pm1, res))[0];

  let ret = {}

  data.map(o=>{
    ret[o] = { d0: rd0[o], d1: rd1[o],  w0:rw0[o], w1:rw1[o], m0:rm0[o], m1:rm1[o]}
  })  

  res.status(200).json({ code: 0, ret})
})


router.post('/queryEngPrice', async (req, res, next) => {
  const sql = 'CALL PROC_ENG_PRICE(?)';
  const data = [...FIELD_EL]
  const params = {...req.body, data }
  // console.log(params)
  const PRI_NO = 0.673
  const price = {
    SA: { p: PRI_NO*1.65, f: PRI_NO, v: PRI_NO*0.45 },
    SW: { s: PRI_NO*1.98, p: PRI_NO*1.65, f: PRI_NO, v: PRI_NO*0.38 }
  }

  const r = await callP(sql, params, res);
  const ret = {}

  data.map(o=>{
    ret[o] = { 
      s: { val: 0, cost: 0 },
      p: { val: 0, cost: 0 },
      f: { val: 0, cost: 0 },
      v: { val: 0, cost: 0 }
    }
  })  

  r.map(item=>{
    const dt = item.dt.toString()
    const month = parseInt(dt.slice(4, 6), 10);
    const hour = parseInt(dt.slice(8, 10), 10);
    let period;
    let season = [2, 3, 4, 5, 6, 9, 10, 11].includes(month) ? 'SA' : 'SW';
    if (season === 'SA') {
        if ((hour >= 8 && hour <= 10) || (hour >= 13 && hour <= 16)) period = 'p';
        else if (hour >= 17 && hour <= 23) period = 'f';
        else period = 'v';
    } else {
        if ((hour >= 9 && hour <= 10) || (hour >= 15 && hour <= 16)) period = 's';
        else if ((hour == 8) || (hour >= 17 && hour <= 22)) period = 'p';
        else if ((hour >= 13 && hour <= 14) || hour == 23) period = 'f';
        else period = 'v';
    }

    data.map(o=>{
      ret[o][period].val += item[o]
      ret[o][period].cost += Math.floor(item[o] * price[season][period]);
    })  
  })
  res.status(200).json({ code: 0, ret})
})


router.post('/queryEngDwm', async (req, res, next) => {
  const sql = 'CALL PROC_ENG_DWM(?)';
  const data = [...FIELD_EL,...FIELD_AI,...FIELD_NI]
  const params = {...req.body, data }

  const r = await callP(sql, params, res);
  res.status(200).json({ code: 0, ret: r})
})


router.post('/queryEngPeak', async (req, res, next) => {
  const sql = 'CALL PROC_ENG_PEAK(?)';
  const data = [...FIELD_EL,...FIELD_AI,...FIELD_NI]
  const params = {...req.body, data }
  // console.log(params)
  const r = await callP(sql, params, res);
  res.status(200).json({ code: 0, ret: r})
})




function transformData(data) {
    // 创建一个新的数组用来存储结果
    let transformed = [];

    // 对原始数据数组进行处理，每两个对象为一组
    
    return transformed;
}


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

function getDay(dateStr, type) {

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

router.post('/queryStat', async (req, res, next) => {
  let sql = 'CALL PROC_ANA_USE(?)';

  let pd0 = getParams('d0')
  let pd1 = getParams('d1')
  let pw0 = getParams('w0')
  let pw1 = getParams('w1')
  let pm0 = getParams('m0')
  let pm1 = getParams('m1')

  let rd0 = await callP(sql, pd0, res);
  let rd1 = await callP(sql, pd1, res);
  let rw0 = await callP(sql, pw0, res);
  let rw1 = await callP(sql, pw1, res);
  let rm0 = await callP(sql, pm0, res);
  let rm1 = await callP(sql, pm1, res);


  rd0.map(o => o.dt = o.dt.toString().slice(8))
  rd1.map(o => o.dt = o.dt.toString().slice(8))
  rw0.map(o => o.dt = getDay(o.dt, 0))
  rw1.map(o => o.dt = getDay(o.dt, 0))
  rm0.map(o => o.dt = getDay(o.dt, 1))
  rm1.map(o => o.dt = getDay(o.dt, 1))

  let ret_d = caluData1(rd0, rd1)
  let ret_w = caluData1(rw0, rw1)
  let ret_m = caluData1(rm0, rm1)




  let sql_pow_us = 'CALL PROC_POW_USE()';
  let ru = (await callP(sql_pow_us, pd0, res))[0]


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
    sys4: [
      ['1号楼压缩空气', ru.k1],
      ['2号楼压缩空气', ru.k2],
      ['3号楼压缩空气', ru.k3]
    ],
    sys5: [
      ['3号楼氮气', ru.d3],
      ['4号楼氮气', ru.d4]
    ],
  }


  res.status(200).json({ code: 0, ret_d, ret_w, ret_m, pie })

})






module.exports = router