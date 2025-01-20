import sys_arr1 from '@/img/bg/sys-arrow1.avif';
import sys_arr2 from '@/img/bg/sys-arrow2.avif';

const SERVER = '121.43.61.154';
export const URL = (type, status) =>
  `http://${SERVER}/img/${type}_${status}.png`;

export const POS_ARROW = [
  { x: 832, y: 45, url: sys_arr1, rev: false },
  { x: 840, y: 140, url: sys_arr1, rev: true },
  { x: 865, y: 275, url: sys_arr1, rev: false },
  { x: 850, y: 500, url: sys_arr1, rev: true },
  { x: 260, y: 60, url: sys_arr2, rev: false },
  { x: 310, y: 160, url: sys_arr2, rev: true },
  { x: 240, y: 255, url: sys_arr2, rev: false },
  { x: 270, y: 510, url: sys_arr2, rev: true }
];

export const POS_FM = [
  { id: 1, x: 480, y: 31, url: URL('fm', 'on') },
  { id: 2, x: 480, y: 116, url: URL('fm', 'on') },
  { id: 4, x: 479, y: 329, url: URL('fm', 'on') },
  { id: 3, x: 478, y: 442, url: URL('fm', 'on') },
  { id: 5, x: 630, y: 60, url: URL('fm', 'on') },
  { id: 6, x: 636, y: 147, url: URL('fm', 'on') },
  { id: 8, x: 650, y: 366, url: URL('fm', 'on') },
  { id: 7, x: 657, y: 483, url: URL('fm', 'on') }
].sort((a, b) => a.id - b.id);

export const POS_CWP = [
  { id: 1, x: 373, y: 49 },
  { id: 2, x: 371, y: 113 },
  { id: 4, x: 360, y: 353 },
  { id: 3, x: 356, y: 438 }
].sort((a, b) => a.id - b.id);

export const POS_CHP = [
  { id: 1, x: 717, y: 56 },
  { id: 2, x: 723, y: 122 },
  { id: 4, x: 747, y: 362 },
  { id: 3, x: 755, y: 445 }
].sort((a, b) => a.id - b.id);

export const POS_CT = [
  { x: 108, y: 15, w: 56, h: 51 },
  { x: 95, y: 95, w: 55, h: 47 },
  { x: 54, y: 324, w: 61, h: 58 },
  { x: 34, y: 432, w: 64, h: 63 }
];

export const POS_CH = [
  { x: 508, y: 38, w: 87 },
  { x: 510, y: 125, w: 87 },
  { x: 515, y: 350, w: 89 },
  { x: 514, y: 469, w: 93 }
];

export const LABEL = [
  // CH
  { x: 526, y: 74, label: '3-4机电' },
  { x: 526, y: 163, label: '3-3机电' },
  { x: 526, y: 387, label: '3-2电子三厂' },
  { x: 526, y: 510, label: '3-1电子三厂' },
  // CWP
  { x: 369, y: 32, label: '4#冷却泵' },
  { x: 366, y: 96, label: '3#冷却泵' },
  { x: 355, y: 335, label: '2#冷却泵' },
  { x: 350, y: 420, label: '1#冷却泵' },
  // CHP
  { x: 705, y: 35, label: '4#冷冻泵' },
  { x: 713, y: 100, label: '3#冷冻泵' },
  { x: 739, y: 343, label: '2#冷冻泵' },
  { x: 748, y: 426, label: '1#冷冻泵' },

  // CT
  { x: 30, y: 20, label: '4#冷却塔' },
  { x: 15, y: 93, label: '3#冷却塔' },
  { x: -25, y: 324, label: '2#冷却塔' },
  { x: -42, y: 432, label: '1#冷却塔' },

  // 数据
  { x: 250, y: 5, label: '回水温度', key: 'chg_1_cw_wtpi', unit: '℃' },
  { x: 245, y: 140, label: '供水温度', key: 'chg_1_cw_wtpo', unit: '℃' },

  { x: 240, y: 200, label: '回水温度', key: 'chg_2_cw_wtpi', unit: '℃' },
  { x: 205, y: 490, label: '供水温度', key: 'chg_2_cw_wtpo', unit: '℃' },

  { x: 683, y: -20, label: '回水温度', key: 'chg_1_chw_wtpi', unit: '℃' },
  { x: 778, y: 170, label: '供水温度', key: 'chg_1_chw_wtpo', unit: '℃' },

  { x: 710, y: 202, label: '回水温度', key: 'chg_2_chw_wtpi', unit: '℃' },
  { x: 770, y: 484, label: '供水温度', key: 'chg_2_chw_wtpo', unit: '℃' }
];
