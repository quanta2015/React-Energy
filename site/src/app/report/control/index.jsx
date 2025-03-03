import React, { useEffect, useState } from 'react';
import { inject, observer, MobXProviderContext } from 'mobx-react';
import dayjs from 'dayjs';
import { Switch, InputNumber, Button, Modal } from 'antd';
import { loadUser } from '@/util/token';
import { useNavigate } from 'react-router-dom';
import {
  sensorDataToList,
  isNullObj,
  clone,
  getListHead,
  getListTail
} from '@/util/fn';
import mqtt from 'mqtt';
import Header from '@/component/Header';
import { SYS_NAME, POS_SET, SET_MODULE, SET_LIST } from '@/constant/data';
import { serverUrl, SAV_TIME, SubRtg, saveData, cfList } from '@/util/mqtt';
import { SaveOutlined } from '@ant-design/icons';

import s from './index.module.less';

var ret = [];
var setObj = { ...SET_MODULE };

const Control = () => {
  const { store } = React.useContext(MobXProviderContext);
  const navigate = useNavigate();

  const [init, setInit] = useState(false);
  const [code, setCode] = useState('cps_1');
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState({});
  const [cmdList, setCmdList] = useState({});
  const [LIST, setLIST] = useState([{}, {}]);
  const [CHG, setCHG] = useState([...SET_LIST]);

  useEffect(() => {
    let user = loadUser();
    if (!user) {
      navigate('/login');
      store.saveUser(user);
    }
  }, []);

  useEffect(() => {
    const client = mqtt.connect(serverUrl());
    client.on('connect', () => {
      console.log('服务器连接成功');
      cfList.map(e => client.subscribe(SubRtg(e), {}));
    });
    client.on('message', (addr, msg) => saveData(msg, ret));

    const interval = setInterval(() => {
      const filtered = ret.filter(item => item.code === code);

      filtered.map(o => {
        data[o.key] = o.val;
      });

      const dataList = sensorDataToList(data, code);
      setData({ ...data });
      setDataList({ ...dataList });

      // console.log(data,'data')
      // console.log(dataList,'dataList')
    }, SAV_TIME);

    return () => {
      if (client) {
        client.end(); // 断开 MQTT 连接
        console.log('MQTT 连接已断开');
      }
      clearInterval(interval); // 清除定时器
    };
  }, []);

  useEffect(() => {
    const params = { code: code, dt: dayjs().format('YYYYMMDDHHmm00') };
    store.systemDataRun(params).then(r => {
      setCmdList(r.cmd);
    });
  }, []);

  useEffect(() => {
    if (isNullObj(data) && isNullObj(cmdList) && !init) {
      // console.log('data', data);
      let setList = [];
      for (let key in data) {
        if (key.endsWith('_set')) {
          setList.push({ key, val: data[key] });
          delete data[key];
        }
      }

      setList.map((item, i) => {
        const parts = item.key.split('_');
        const type = parts[0];
        const id = parts[1] - 1;
        const key = parts.slice(2).join('_');
        const pos = POS_SET[key];
        const val = item.val;
        setObj[type][id][pos] = val;
        cmdList[type].val[id][pos] = parseFloat(val);
      });

      LIST[0] = clone(cmdList);
      LIST[0].ch.val = getListHead(LIST[0].ch.val);
      LIST[0].cwp.val = getListHead(LIST[0].cwp.val);
      LIST[0].chp.val = getListHead(LIST[0].chp.val);
      LIST[0].ct.val = getListHead(LIST[0].ct.val);
      LIST[0].sys.val = getListHead(LIST[0].sys.val);

      LIST[1] = clone(cmdList);
      LIST[1].ch.val = getListTail(LIST[1].ch.val);
      LIST[1].cwp.val = getListTail(LIST[1].cwp.val);
      LIST[1].chp.val = getListTail(LIST[1].chp.val);
      LIST[1].ct.val = getListTail(LIST[1].ct.val);
      LIST[1].sys.val = getListTail(LIST[1].sys.val);

      setLIST([...LIST]);
      setInit(true);
    }
  }, [data]);

  const doChgValue = (id, key, facId, facPid, val) => {
    let _list = clone(LIST);
    _list[id][key].val[facId][facPid] = val;
    setLIST(_list);

    let _chg = clone(SET_LIST);
    _chg[id][key][facId][facPid] = 1;
    setCHG(_chg);
  };

  const doChgSwitch = (id, key, facId, facPid, val, e) => {
    e.stopPropagation();
    let _list = clone(LIST);
    _list[id][key].val[facId][facPid] = val ? 1 : 0;
    setLIST(_list);

    let _chg = clone(SET_LIST);
    _chg[id][key][facId][facPid] = 1;
    setCHG(_chg);
  };

  // 添加 doConfirm 函数，调用 antd 的对话框确认是否需要更新
  const doConfirm = (id, key, facId, facPid) => {
    Modal.confirm({
      title: '确认更新',
      content: '是否确认更新设置？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 在此处编写确认更新后的逻辑
        // 例如：重置对应的 CHG 标记，并可进行数据提交或其他操作
        let _chg = clone(SET_LIST);
        _chg[id][key][facId][facPid] = 0;
        setCHG(_chg);
        console.log(
          `更新设置：id ${id}, key ${key}, facId ${facId}, facPid ${facPid} -> 新值: ${LIST[id][key].val[facId][facPid]}`
        );
      },
      onCancel() {
        console.log('取消更新');
      }
    });
  };

  // console.log('LIST', LIST);
  // console.log('CHG', CHG);/

  return (
    <div className={s.main}>
      <Header title="系统设备控制" />
      <div className={s.wrap}>
        {LIST.map((fac, id) => (
          <div className={s.sect} key={id}>
            <div className={s.title}>{SYS_NAME[id].name}</div>
            <div className={s.body}>
              {Object.keys(fac).map((key, i) => (
                <div className={s.part} key={i}>
                  {fac[key].val.map((item, j) => (
                    <div className={s.item} key={j}>
                      <div className={s.label}>{SYS_NAME[id][key][j]}</div>
                      <div className={s.tab}>
                        {fac[key].mod.map((conf, k) => (
                          <div className={s.row} key={k}>
                            <div className={s.tl}>{conf.name}</div>
                            <div className={s.cl}>
                              <>
                                {conf.type === 1 && (
                                  <InputNumber
                                    style={{ width: '100%' }}
                                    value={item[k]}
                                    onChange={e => doChgValue(id, key, j, k, e)}
                                  />
                                )}
                                {conf.type === 2 && (
                                  <Switch
                                    style={{ width: '100%' }}
                                    checkedChildren="开"
                                    unCheckedChildren="关"
                                    checked={item[k] === 0 ? false : true}
                                    onChange={(e, v) =>
                                      doChgSwitch(id, key, j, k, e, v)
                                    }
                                  />
                                )}
                                {conf.type === 3 && (
                                  <Switch
                                    style={{ width: '100%' }}
                                    checkedChildren="手动"
                                    unCheckedChildren="自动"
                                    checked={item[k] === 0 ? false : true}
                                    onChange={(e, v) =>
                                      doChgSwitch(id, key, j, k, e, v)
                                    }
                                  />
                                )}
                              </>
                            </div>
                            {CHG[id][key][j][k] === 1 && (
                              <Button
                                type="primary"
                                size="small"
                                danger
                                icon={<SaveOutlined />}
                                style={{ 'margin-left': '10px' }}
                                onClick={() => doConfirm(id, key, j, k)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(Control);
