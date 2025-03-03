import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { observer, MobXProviderContext } from 'mobx-react';
import dayjs from 'dayjs';
import { sensorDataToList, formatData } from '@/util/fn';
import { Spin, Button, Select, message, DatePicker } from 'antd';
import Header from '@/component/Header';
import { unitByVal } from '@/constant/field';
import { URL } from '@/constant/pos';
import cls from 'classnames';

import s from './index.module.less';
import sysbg from '@/img/bg/sys-bg.avif';

const HistoryDev = () => {
  const nodeRefs = useRef([]);
  const { store } = React.useContext(MobXProviderContext);

  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState([]);
  const [code, setCode] = useState('cps_1');
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState({});

  const [date, setDate] = useState(
    dayjs().subtract(5, 'minute').hour(12).minute(0).second(0)
  );

  useEffect(() => {
    nodeRefs.current = device.map(
      (_, i) => nodeRefs.current[i] || React.createRef()
    );
  }, [device]);

  useEffect(() => {
    store.loadDevices().then(({ data }) => {
      const device = JSON.parse(data.data);
      setDevice(device);
    });
  }, []);

  useEffect(() => {
    doQuery();
  }, []);

  const doChgDate = e => {
    setDate(e);
  };

  const doQuery = () => {
    const params = {
      dt: date.format('YYYYMMDDHHmm00'),
      code
    };
    store.qrySysData(params).then(({ data }) => {
      // console.log(data,'data')
      if (data === undefined) {
        message.info('没有系统数据');
        return;
      }
      formatData(data);
      const dataList = sensorDataToList(data, code);
      setData(data);
      setDataList(dataList);
    });
  };

  return (
    <Spin spinning={loading}>
      <div className={s.main}>
        <Header title={'历史设备监控'} float={true} />
        <div className={s.wrap}>
          <div className={s.lt}>
            <div className={s.wrap}>
              <label>系统时间</label>
              <DatePicker
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: 'HH:mm' }}
                value={date}
                onChange={doChgDate}
                renderExtraFooter={() => (
                  <>
                    <div
                      style={{
                        padding: '8px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '8px'
                      }}
                    >
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(1, 'month'))}
                      >
                        上月
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(1, 'week'))}
                      >
                        上周
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(1, 'day'))}
                      >
                        昨天
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(12, 'hour'))}
                      >
                        前12小时
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(6, 'hour'))}
                      >
                        前6小时
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(2, 'hour'))}
                      >
                        前2小时
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(1, 'hour'))}
                      >
                        前1小时
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(10, 'minute'))}
                      >
                        前30分钟
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(5, 'minute'))}
                      >
                        前10分钟
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => setDate(dayjs().subtract(1, 'minute'))}
                      >
                        前1分钟
                      </Button>
                    </div>
                  </>
                )}
              />
              <Button type="primary" onClick={doQuery}>
                查询
              </Button>
            </div>
          </div>

          <div className={s.ct}>
            <img src={sysbg} className={s.bg} />

            {device.map((item, i) => (
              <Draggable
                key={i}
                bounds="parent"
                handle="none"
                nodeRef={nodeRefs.current[i]}
                position={{ x: item.x, y: item.y }}
              >
                <div
                  className={cls(s.device, item.type, s.run)}
                  ref={nodeRefs.current[i]}
                >
                  {item.type === 'label' ? (
                    <div className={s.label}>
                      {item.val !== null && <label>{item.val}:</label>}
                      <span data-unit={unitByVal(item.field)}>
                        {data[item.field]}
                      </span>
                    </div>
                  ) : (
                    Object.keys(dataList).length > 0 &&
                    dataList[item.type] &&
                    dataList[item.type][item.id].status !== 'off' && (
                      <img
                        src={URL(
                          item.type,
                          dataList[item.type][item.id].status
                        )}
                        style={{ width: `${item.w}px` }}
                      />
                    )
                  )}
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default observer(HistoryDev);
