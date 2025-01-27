import { formatNumber,formatTime } from '@/util/fn';

const mapName = {
  sys_1_poa: '机电',
  sys_2_poa: '电子三厂',
  chg_1_poa: '冷机组1',
  chg_2_poa: '冷机组2',
  chpg_1_poa: '冷却泵组1',
  chpg_2_poa: '冷却泵组2',
  cwpg_1_poa: '冷冻泵组1',
  cwpg_2_poa: '冷冻泵组2',
  ctg_1_poa: '冷却塔组1',
  ctg_2_poa: '冷却塔组2',
}

// =============== 工具函数 ===============
/**
 * 将 summary.data 中同一 period、同一 code 下的所有 poa 字段相加
 * @param {Array} summaryData - summary.data
 * @param {String} period - e.g. 'd0', 'd1', 'm0', 'm1'
 * @returns {Number} 总和
 */
export function sumPeriodPoa(summaryData, period) {
  // 需要将多种字段 (sys_1_poa, sys_2_poa, chg_1_poa, chg_2_poa, ...) 累加
  // 以下仅示例部分字段，根据实际数据字段自行增加
  const poaFields = [
    'sys_1_poa',
    'sys_2_poa',
    'chg_1_poa',
    'chg_2_poa',
    'chpg_1_poa',
    'chpg_2_poa',
    'cwpg_1_poa',
    'cwpg_2_poa',
    'ctg_1_poa',
    'ctg_2_poa',
  ];

  let total = 0;

  summaryData.forEach((item) => {
    if (item.period === period) {
      poaFields.forEach((field) => {
        const val = item[field];
        if (typeof val === 'number') {
          total += val;
        }
      });
    }
  });

  return formatNumber(total);
}

/**
 * 计算环比增长率
 * @param {Number} current - 当前值
 * @param {Number} previous - 上期值
 * @returns {Number} 环比（百分数, 如 10 表示 +10%）
 */
export function calcComparison(current, previous) {
  if (previous === 0 || previous === null) {
    // 避免除0或无数据情况
    return null; 
  }
  return (((current - previous) / previous) * 100).toFixed(2);
}

/**
 * 找到数组中最大 poa 及其对应 dt
 * @param {Array} arr - e.g. hour.data 或 day.data
 * @returns {{dt: string, poa: number}} 最大值和对应时间
 */
export function findMaxPoa(arr, type) {
  if (!arr || arr.length === 0) return null;
  let maxItem = arr[0];
  arr.forEach((item) => {
    if (item.poa > maxItem.poa) {
      maxItem = item;
    }
  });


  return { dt: type?formatTime(maxItem.dt):maxItem.dt, poa: maxItem.poa };
}

/**
 * 根据小时数据做简单异常检测
 * 此处示例：若在深夜(00:00-06:00)出现 poa > 8，就视为“异常”。
 * @param {Array} hourData 
 * @returns {Array} 异常数组，每个元素包含 dt、poa
 */
export function detectAnomalies(hourData) {
  const anomalies = [];
  hourData.forEach((h) => {
    // dt 形如 "0130", "2350" 等
    const hourStr = h.dt.slice(0, 2); // 前两位表示小时
    const hourNum = parseInt(hourStr, 10);
    // 简单判断 0~6 点
    if (hourNum >= 0 && hourNum < 6) {
      if (h.poa > 8) {
        anomalies.push({
          dt: formatTime(h.dt),
          poa: h.poa
        });
      }
    }
  });
  return anomalies;
}

/**
 * 计算在某一 period 下，各子系统/设备的能耗占比
 * @param {Array} summaryData 
 * @param {String} period - 'd0'、'm0' 等
 * @returns {Object} { total: number, details: { fieldName: {value, percent}, ... } }
 */
export function calcSubsystemShare(summaryData, period) {
  const poaFields = [
    'sys_1_poa',
    'sys_2_poa',
    'chg_1_poa',
    'chg_2_poa',
    'chpg_1_poa',
    'chpg_2_poa',
    'cwpg_1_poa',
    'cwpg_2_poa',
    'ctg_1_poa',
    'ctg_2_poa',
  ];

  // 先汇总 period 下所有字段
  let fieldSumMap = {};
  summaryData.forEach((item) => {
    if (item.period === period) {
      poaFields.forEach((field) => {
        const val = item[field];
        if (typeof val === 'number') {
          fieldSumMap[field] = (fieldSumMap[field] || 0) + val;
        }
      });
    }
  });

  // 求总和
  const total = Object.values(fieldSumMap).reduce((a, b) => a + b, 0);

  // 计算占比
  let details = {};
  Object.keys(fieldSumMap).forEach((field) => {
    const val = fieldSumMap[field];
    details[field] = {
      value: formatNumber(val),
      percent: total ? formatNumber((val / total) * 100, 1) : 0
    };
  });

  return {
    total,
    details
  };
}

/**
 * 从 day.data 计算最近几天的趋势描述(举例近7天或30天等)
 * 这里只是简单示例，实际中可做更复杂的统计
 * @param {Array} dayData 
 * @param {Number} lastDays - 近 X 天
 */
export function calcDayTrend(dayData, lastDays = 7) {
  if (!dayData || dayData.length === 0) return null;
  // dayData 假设是按时间先后排序，也可能需要你根据实际排序
  const recent = dayData.slice(-lastDays); 
  // 计算平均值
  const avg = formatNumber(recent.reduce((sum, d) => sum + d.poa, 0) / recent.length ,2);
  return {
    lastDays,
    average: avg
  };
}

/**
 * 从 month.data 计算最近几个月的趋势(示例近3个月或12个月等)
 * @param {Array} monthData 
 * @param {Number} lastMonths 
 */
export function calcMonthTrend(monthData, lastMonths = 3) {
  if (!monthData || monthData.length === 0) return null;
  const recent = monthData.slice(-lastMonths);
  const total = recent.reduce((sum, d) => sum + d.poa, 0);
  const avg = formatNumber(total / recent.length,2);
  return {
    lastMonths,
    average: avg
  };
}

// =============== 主函数：计算各种统计指标 ===============
export function computeStats(summary, hour, day, month) {
  const summaryData = summary || [];
  const hourData = hour || [];
  const dayData = day || [];
  const monthData = month || [];

  // 1) 计算本日(d0)和昨日(d1)的总能耗
  const d0Total = sumPeriodPoa(summaryData, 'd0');
  const d1Total = sumPeriodPoa(summaryData, 'd1');

  // 2) 计算本月(m0)和上月(m1)的总能耗
  const m0Total = sumPeriodPoa(summaryData, 'm0');
  const m1Total = sumPeriodPoa(summaryData, 'm1');



  // 3) 日环比、月环比（%）
  const dayCompare = calcComparison(d0Total, d1Total); // 今日 vs 昨日
  const monthCompare = calcComparison(m0Total, m1Total); // 本月 vs 上月

  // 4) 小时能耗峰值
  const hourPeak = findMaxPoa(hourData, 1); 
  // 返回 { dt: '2100', poa: 9.3 } 之类

  // 5) 每日最高能耗日
  const dayPeak = findMaxPoa(dayData, 0);
  // 返回 { dt: '01月14日', poa: 17.98 } 等



  // 6) 异常检测（简单示例）
  const anomalies = detectAnomalies(hourData);

  // 7) 多子系统/设备类别占比（以本日 d0 和本月 m0 为例）
  const d0Share = calcSubsystemShare(summaryData, 'd0');
  const m0Share = calcSubsystemShare(summaryData, 'm0');



  // 8) 日/月维度趋势（只示例平均值，可结合 dayData 和 monthData 计算更多）
  const dayTrend = calcDayTrend(dayData, 7);    // 近7天趋势
  const monthTrend = calcMonthTrend(monthData, 3); // 近3个月趋势

  // 9) 关键指标/告警（示例）
  //   - 如果本日能耗 > 1000 kWh 则提示
  //   - 如果发现 anomalies 非空，也提示
  let alarms = [];
  if (d0Total > 1000) {
    alarms.push(`今日能耗(${d0Total.toFixed(2)} kWh)已超出1000 kWh，请注意节能！`);
  }
  if (anomalies.length > 0) {
    alarms.push(`检测到 ${anomalies.length} 个小时段出现异常能耗，请关注。`);
  }

  // 10) 综合概览信息（示例：拼接一句文字）
  // 根据实际业务需要来组织语句
  const overview = `
    今日总能耗：${d0Total.toFixed(2)} kWh\n
    ${dayCompare !== null? `较昨日${dayCompare >= 0 ? '上升' : '下降'} ${Math.abs(dayCompare).toFixed(1)}%` : '无法计算环比'}\n
    当前小时峰值 ${hourPeak?.dt ?? '--'} 功率 ${hourPeak?.poa.toFixed(2) ?? '--'} kW\n
    本日最大能耗 ${ mapName[Object.entries(d0Share.details).sort((a,b)=>b[1].value - a[1].value)[0]?.[0]] || '未知'} 占比 ${ Object.entries(d0Share.details).sort((a,b)=>b[1].value - a[1].value)[0]?.[1].percent.toFixed(1) || '--'}%\n
    异常检测：${anomalies.length > 0 ? `发现 ${anomalies.length} 个异常时段` : '无异常'}
  `;

  return {
    d0Total,
    d1Total,
    m0Total,
    m1Total,
    dayCompare,      // 日环比（%）
    monthCompare,    // 月环比（%）
    hourPeak,        // 小时峰值
    dayPeak,         // 每日峰值
    anomalies,       // 异常时段
    d0Share,         // 本日子系统占比
    m0Share,         // 本月子系统占比
    dayTrend,        // 日维度趋势
    monthTrend,      // 月维度趋势
    alarms,          // 告警信息
    overview         // 综合概览文字
  };
}
