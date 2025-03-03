import * as mqtt from 'mqtt';
const dayjs = require('dayjs');

var ret = [];

const lik = [
  'chg',
  'ch',
  'chp',
  'chpg',
  'cwp',
  'cwpg',
  'ct',
  'ctg',
  'sys',
  'rom',
  'out',
  'ven'
];
const codeList = ['cps_1', 'cps_2', 'cps_3', 'cps_4'];
const isC = s => {
  return escape(s).indexOf('%u') < 0;
};
const exist = e => {
  let list = e.split('_');
  let last = list[list.length - 1];
  if (last === 'load') return false;
  // if ((last==='set')||(last==='load')) return false
  let ret = false;
  lik.map((item, i) => {
    if (e.includes(item)) {
      ret = true;
    }
  });
  return ret;
};

const vaild = e => {
  let ret = false;
  codeList.map((item, i) => {
    if (item === e) {
      ret = true;
    }
  });
  return ret;
};

const formatVal = v => (typeof v === 'number' && !isNaN(v) ? v.toFixed(1) : '');

export const saveData = (msg, r) => {
  let m = JSON.parse(msg.toString());
  let data = m.devs[0].d;
  let dt = dayjs.unix(m.ts).format('YYYYMMDDHHmmss');
  // console.log('dt',data)

  // 过滤中文和非系统数据
  data.map((item, i) => {
    let { ts, ...o } = item;
    let t = o.m.split('_');
    let [t1, t2, ...t3] = t;
    let code = `${t1}_${t2}`;
    let key = t3.join('_');
    let val = formatVal(o.v);

    if (isC(o.m) && exist(o.m)) {
      const el = ret.find(e => e.key === key && e.code === code);
      if (el) {
        el.val = val;
        el.dt = dt;
      } else {
        r.push({ code, dt, key, val });
      }
    }
  });

  r.sort((a, b) => {
    if (a.code < b.code) return -1;
    if (a.code > b.code) return 1;
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
};

export const sortData = r => {
  r.sort((p, r) => {
    if (p.code === r.code) {
      return p.dt - r.dt;
    }
    return p.code > r.code ? 1 : -1;
  });
};

export const groupData = list => {
  let r = list.reduce((pre, cur, index) => {
    let len = pre.length;
    if (index === 0) {
      let { code, dt, key, val } = cur;
      pre.push({ code: code, dt: dt, data: [{ key: key, val: val }] });
    } else if (pre[len - 1].code === cur.code) {
      let { code, dt, key, val } = cur;
      pre[len - 1].data.push({ key: key, val: val });
    } else if (pre[len - 1].code !== cur.code) {
      let { code, dt, key, val } = cur;
      pre.push({ code: code, dt: dt, data: [{ key: key, val: val }] });
    }
    return pre;
  }, []);
  return r;
};

export const mergeData = (r, ret = []) => {
  r.data.sort(function (a, b) {
    var x = a.key.toLowerCase();
    var y = b.key.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

  r.data.reduce((pre, cur, i) => {
    if (i === 0) {
      ret.push(cur);
      return cur;
    } else if (pre.key !== cur.key) {
      ret.push(cur);
      return cur;
    } else {
      return pre;
    }
  }, []);
  r.dt = `${dayjs().format('YYYYMMDDHHmm')}00`;
  r.data = ret;
  return r;
};

export const merge = (r, ret = []) => {
  r.data.sort(function (a, b) {
    var x = a.key.toLowerCase();
    var y = b.key.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

  r.data.reduce((pre, cur, i) => {
    if (i === 0) {
      ret.push(cur);
      return cur;
    } else if (pre.key !== cur.key) {
      ret.push(cur);
      return cur;
    } else {
      return pre;
    }
  }, []);
  r.dt = `${dayjs().format('YYYYMMDDHHmm')}00`;
  r.data = ret;
  return r;
};

export const SAV_TIME = 2000;
export const PORT = 8883;
export const SERVER = '121.43.61.154';
export const serverUrl = () => `ws://${SERVER}:${PORT}`;
// export const SERVER   = 'keboda.site'
// export const serverUrl= () => `wss://${SERVER}:${PORT}`
export const SubRtg = e => `/edge/${e.key}/${e.sn}/rtg`;
export const cfList = [
  { key: 'kbdjdjf', sn: 'F1838CE6FF11433C8D40CC10EDD08346' },
  { key: 'kbdkajf', sn: '7147FB66678446C28EABEE6D40678790' },
  { key: 'kbdkyjll', sn: 'D57FD31DECDE487AB58CD0EB7E6A5872' }
];
