import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { observer, MobXProviderContext } from 'mobx-react';
import { Spin, Button, DatePicker, Select } from 'antd';
import clone from '@/util/clone';
import { opt } from './opt';

import s from './index.module.less';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_exporting from 'highcharts/modules/exporting';
import HC_more from 'highcharts/highcharts-more';
import Header from '@/component/Header';
import { set } from 'mobx';

HC_more(Highcharts);
HC_exporting(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

const { Option } = Select;
const nameList = {
  ch: '冰机',
  chp: '冷冻水泵',
  cwp: '冷却水泵',
  ct: '冷却塔',
  chg: '冷水系统',
  chpg: '冷冻水泵组',
  cwpg: '冷却水泵组',
  ctg: '冷却塔组'
};

const HistorySys = () => {
  const { store } = React.useContext(MobXProviderContext);

  const [fr, setFr] = useState(
    dayjs().subtract(1, 'day').hour(12).minute(0).second(0)
  );
  const [to, setTo] = useState(dayjs());
  const [codeList, setCodeList] = useState([
    {
      code: 'cps_1',
      name: '3号楼中庭冷源群控系统'
    },
    {
      code: 'cps_2',
      name: '科奥机房'
    }
  ]);
  const [data, setData] = useState([]);
  const [none, setNone] = useState(true);
  const [fields, setFields] = useState([]);
  const [valList, setValList] = useState([]);
  const [subSelF, setSubSelF] = useState([]);
  const [detail, setDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('cps_1');
  const [selField, setSelField] = useState(null);
  const [chartOpt, setChartOpt] = useState(null);
  const [cate, setCate] = useState([]);

  const doAnalysisSys = useCallback(async () => {
    setLoading(true);
    const params = {
      code: code,
      fr: fr.format('YYYYMMDDHHmm00'),
      to: to.format('YYYYMMDDHHmm00')
    };

    store.analysisG1(params).then(r => {
      const { id, code: resCode, sys, out, ...data } = r.data;
      const list = Object.keys(data);
      const cateData = data.cat;
      const tmp = data[list[0]].sort((a, b) => a.name.localeCompare(b.name));
      const seri = [];
      const fieldsArr = [];

      tmp.forEach(item => {
        fieldsArr.push(item.name);
        seri.push(item);
      });

      setValList(list);
      setSelField(list[0]);
      setData(clone(data));
      setCate(cateData);
      setFields(fieldsArr);
      setChartOpt(opt(cateData, seri));
      setDetail(true);
      setNone(false);
      setLoading(false);
    });
  }, [code, fr, to]);

  const doSelField = useCallback(
    field => {
      const newData = data[field];
      const fieldsArr = [];
      const selFields = [];

      newData.forEach(item => {
        fieldsArr.push(item.name);
        if (item.data[0] !== 0) {
          selFields.push(item.name);
        }
      });

      setSelField(field);
      setFields(fieldsArr);
      setSubSelF(selFields);
    },
    [data]
  );

  const doQueryField = useCallback(() => {
    const tmp = clone(data[selField]);
    const seri = tmp.filter(item => subSelF.includes(item.name));
    setChartOpt(opt(cate, seri));
    setNone(false);
  }, [data, selField, subSelF, cate]);

  const doChgDateFr = e => {
    setFr(e);
  };

  const doChgDateTo = e => {
    setTo(e);
  };

  return (
    <Spin spinning={loading}>
      <div className={s.main}>
        <Header title="系统运行图表分析" float={true} pos={true} />

        <div className={s.wrap}>
          <div className={s.lt}>
            <div className={s.query}>
              <label>请选择开始时间</label>
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: 'HH:mm' }}
                value={fr}
                onChange={doChgDateFr}
              />
            </div>

            <div className={s.query}>
              <label>请选择结束时间</label>
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: 'HH:mm' }}
                value={to}
                onChange={doChgDateTo}
              />
            </div>

            <div className={s.query}>
              <label>请选择系统型号</label>
              <Select
                value={code}
                onChange={e => setCode(e)}
                style={{ width: '100%' }}
              >
                {codeList.map((item, i) => (
                  <Option value={item.code} key={i}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className={s.query}>
              <Button
                type="primary"
                style={{ width: '100%' }}
                onClick={doAnalysisSys}
              >
                查询系统
              </Button>
            </div>

            {detail && (
              <>
                <div className={s.query}>
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="请选择设备类型"
                    value={selField}
                    onChange={doSelField}
                  >
                    {valList.map((item, i) => (
                      <Option key={item}>{nameList[item]}</Option>
                    ))}
                  </Select>
                </div>

                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  value={subSelF}
                  onChange={e => setSubSelF(e)}
                >
                  {fields.map((item, i) => (
                    <Option key={item}>{item}</Option>
                  ))}
                </Select>

                <div className={s.query}>
                  <Button
                    type="primary"
                    style={{ width: '100%' }}
                    onClick={doQueryField}
                  >
                    查询子系统
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className={s.ct}>
            {none ? (
              <div className={s.none}>无系统数据</div>
            ) : (
              <div className={s.chart}>
                {chartOpt && (
                  <HighchartsReact highcharts={Highcharts} options={chartOpt} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default observer(HistorySys);
