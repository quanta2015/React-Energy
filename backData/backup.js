const schedule = require('node-schedule');
const mysql = require('mysql2/promise');
const dayjs = require('dayjs');

const DB_CONFIG = {
  host:'127.0.0.1',
  user: 'kbdplat',
  password: 'Ans-kbd-20240616-???',
  database: 'kbdWater'
};

// '0 * * * *' 表示每个小时的第 0 分钟执行
schedule.scheduleJob('0 * * * *', async () => {
  try {
    // 1. 获取“上一小时”的整点时间
    const lastHour = dayjs().subtract(1, 'hour');
    const summaryDt = lastHour.format('YYYYMMDDHH') + '0000';
    const connection = await mysql.createConnection(DB_CONFIG);

    // 3. 检查 tab_summary 里是否已存在该小时数据
    const sql = `SELECT 1 FROM tab_summary  WHERE dt = '${summaryDt}'  LIMIT 1`
    const [checkRows] = await connection.execute(sql);

    console.log(sql)

    if (checkRows.length > 0) {
      console.log(`[${new Date().toISOString()}] 上一小时(${summaryDt})已存在统计数据，无需重复插入。`);
      await connection.end();
      return;
    }

    // 4. 如果不存在，则从 tab_sys 统计上一小时区间的数据
    const startTime = lastHour.format('YYYYMMDDHH') + '0000';
    const endTime = dayjs(lastHour).add(1, 'hours').format('YYYYMMDDHH') + '0000';
    const summarySql = `
      SELECT
        code,
        FLOOR(dt/10000) AS dt, 
        ROUND(SUM(sys_1_poa)/60, 2) AS sys_1_poa,
        ROUND(SUM(sys_2_poa)/60, 2) AS sys_2_poa,
        ROUND(SUM(chg_1_poa)/60, 2) AS chg_1_poa,
        ROUND(SUM(chg_2_poa)/60, 2) AS chg_2_poa,
        ROUND(SUM(chpg_1_poa)/60, 2) AS chpg_1_poa,
        ROUND(SUM(chpg_2_poa)/60, 2) AS chpg_2_poa,
        ROUND(SUM(cwpg_1_poa)/60, 2) AS cwpg_1_poa,
        ROUND(SUM(cwpg_2_poa)/60, 2) AS cwpg_2_poa,
        ROUND(SUM(ctg_1_poa)/60, 2) AS ctg_1_poa,
        ROUND(SUM(ctg_2_poa)/60, 2) AS ctg_2_poa,
        ROUND(SUM(chg_1_chw_wtpo)/60, 2) AS chg_1_chw_wtpo,
        ROUND(SUM(chg_1_chw_wtpi)/60, 2) AS chg_1_chw_wtpi,
        ROUND(SUM(chg_2_chw_wtpo)/60, 2) AS chg_2_chw_wtpo,
        ROUND(SUM(chg_2_chw_wtpi)/60, 2) AS chg_2_chw_wtpi,
        ROUND(SUM(chg_1_cw_wtpo)/60, 2) AS chg_1_cw_wtpo,
        ROUND(SUM(chg_1_cw_wtpi)/60, 2) AS chg_1_cw_wtpi,
        ROUND(SUM(chg_2_cw_wtpo)/60, 2) AS chg_2_cw_wtpo,
        ROUND(SUM(chg_2_cw_wtpi)/60, 2) AS chg_2_cw_wtpi
      FROM tab_sys
      WHERE code IN ('cps_1','cps_2')
        AND dt >= ?
        AND dt < ?
      GROUP BY code, FLOOR(dt/10000)
    `;
    
    const [rows] = await connection.execute(summarySql, [startTime, endTime]);

    if (rows.length === 0) {
      console.log(`[${new Date().toISOString()}] 上一小时(${summaryDt})在 tab_sys 无记录可汇总，跳过插入。`);
      await connection.end();
      return;
    }

    // 5. 将统计结果插入 tab_summary
    const insertSql = `
      INSERT INTO tab_summary (
        code,
        dt,
        sys_1_poa,
        sys_2_poa,
        chg_1_poa,
        chg_2_poa,
        chpg_1_poa,
        chpg_2_poa,
        cwpg_1_poa,
        cwpg_2_poa,
        ctg_1_poa,
        ctg_2_poa,
        chg_1_chw_wtpo,
        chg_1_chw_wtpi,
        chg_2_chw_wtpo,
        chg_2_chw_wtpi,
        chg_1_cw_wtpo,
        chg_1_cw_wtpi,
        chg_2_cw_wtpo,
        chg_2_cw_wtpi
      ) VALUES ?
    `;

    const insertValues = rows.map(row => ([
      row.code,
      summaryDt,  
      row.sys_1_poa,
      row.sys_2_poa,
      row.chg_1_poa,
      row.chg_2_poa,
      row.chpg_1_poa,
      row.chpg_2_poa,
      row.cwpg_1_poa,
      row.cwpg_2_poa,
      row.ctg_1_poa,
      row.ctg_2_poa,
      row.chg_1_chw_wtpo,
      row.chg_1_chw_wtpi,
      row.chg_2_chw_wtpo,
      row.chg_2_chw_wtpi,
      row.chg_1_cw_wtpo,
      row.chg_1_cw_wtpi,
      row.chg_2_cw_wtpo,
      row.chg_2_cw_wtpi,
    ]));

    await connection.query(insertSql, [insertValues]);
    console.log(`[${new Date().toISOString()}] 成功插入上一小时(${summaryDt})统计数据，共 ${rows.length} 条。`);

    // 6. 关闭数据库连接
    await connection.end();
  } catch (err) {
    console.error('执行定时统计任务出错：', err);
  }
});

