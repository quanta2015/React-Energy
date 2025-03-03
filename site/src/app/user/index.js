/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useCallback } from 'react';
import { Form, Spin, Button, message, Input, Checkbox } from 'antd';
import Icon, {
  CheckOutlined,
  CloseOutlined,
  EditOutlined
} from '@ant-design/icons';
import cls from 'classnames';
import { observer, MobXProviderContext } from 'mobx-react';
import s from './index.module.less';
import { isN } from '@/util/fn';

const opt = [
  { label: '冷冻机分析', value: '冷冻机分析' },
  { label: '设备数据报表', value: '设备数据报表' },
  { label: '实时状态监控', value: '实时状态监控' },
  { label: '历史状态查询', value: '历史状态查询' },
  { label: '设备信息查询', value: '设备信息查询' },
  { label: '系统设备控制', value: '系统设备控制' },
  { label: '系统能耗优化', value: '系统能耗优化' },
  { label: '系统报表分析', value: '系统报表分析' },
  { label: '系统用户管理', value: '系统用户管理' }
];
const _item = { id: -1, usr: '', name: '', pwd: '', role: '', auth: '' };

const encodeRole = list => {
  let ret = [0, 0, 0, 0];
  list.map((item, i) => {
    opt.map((o, j) => {
      if (item === o) {
        ret[j] = 1;
      }
    });
  });
  return ret.join('|');
};

const decodeRole = s => {
  let ret = [];
  if (isN(s)) {
    return [];
  }

  s.split('').map((item, i) => {
    if (parseInt(item) === 1) {
      ret.push(opt[i]);
    }
  });
  return ret;
};

const User = () => {
  const { store } = React.useContext(MobXProviderContext);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [item, setItem] = useState(_item);

  console.log(user, 'user');

  useEffect(() => {
    setLoading(true);
    store.userList().then(r => {
      console.log(r);
      setLoading(false);
      setUser(r.data);
    });
  }, []);

  const doDelItem = useCallback(
    async id => {
      setLoading(true);
      let r = await store.userDel({ id });
      setUser(r.data);
      setLoading(false);
      message.info('删除用户数据成功');
    },
    [store]
  );

  const doCheckVaild = useCallback(async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      await doSave(values);
    } catch (errorInfo) {
      console.log(errorInfo);
      return;
    }
  }, [form]);
  const doSave = useCallback(
    async u => {
      // 将选中的权限数组转换为9位字符串
      u.auth = opt
        .map(option => (u.auth.includes(option.value) ? '1' : '0'))
        .join('');

      setLoading(true);
      let r = await store.userSave(u);
      setUser(r.data);
      setShow(false);
      setLoading(false);
      message.info('保存用户数据成功');
    },
    [store]
  );
  const doClose = useCallback(() => {
    setShow(false);
  }, []);

  const renderCheck = e =>
    e ? (
      <CheckOutlined className="fc-green" />
    ) : (
      <CloseOutlined className="fc-red" />
    );

  const doShowForm = e => {
    let copy = { ...e };

    // 处理权限字段
    if (copy.auth) {
      // 将auth字符串转换为选中的权限数组
      const authArray = copy.auth.split('');
      copy.auth = opt
        .filter((_, index) => authArray[index] === '1')
        .map(item => item.value);
    } else {
      // 如果是新用户，初始化为空数组
      copy.auth = [];
    }

    setItem(copy);
    form.setFieldsValue(copy);
    setShow(true);
  };

  return (
    <Spin spinning={loading}>
      <div className={s.user}>
        <div className={s.conf}>
          <div className={s.fun}>
            <div
              className={cls(s.btn, s.orange)}
              onClick={e => doShowForm(_item)}
            >
              <Icon type="plus" />
              添加用户
            </div>
          </div>

          <div className={s.list}>
            <div className={s.row}>
              <span>序号</span>
              <span>账号</span>
              <span>用户名</span>
              <span>密码</span>
              {opt.map((o, i) => (
                <span key={i}>{o.label}</span>
              ))}
              <span></span>
            </div>
            {user.map((item, i) => (
              <div className={s.row} key={i}>
                <span>{item.id}</span>
                <span>{item.usr}</span>
                <span>{item.name}</span>
                <span>{item.pwd}</span>
                {opt.map((o, i) => (
                  <span key={i}>
                    {renderCheck(parseInt(item.auth.split('')[i]))}
                  </span>
                ))}
                <span>
                  <Button
                    type="primary"
                    className={cls(s.green)}
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => doShowForm(item)}
                  >
                    编 辑
                  </Button>

                  <Button
                    type="primary"
                    className={cls(s.red)}
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => doDelItem(item.id)}
                  >
                    删 除
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </div>

        {show && (
          <div className={s.form}>
            <div className={s.wrap}>
              <Form form={form} layout="horizontal" initialValues={item}>
                <Form.Item
                  className={s.hide}
                  name="id"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="账号"
                  name="usr"
                  rules={[{ required: true, message: '请输入账号!' }]}
                >
                  <Input
                    size="large"
                    placeholder="请输入账号"
                    allowClear
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="密码"
                  name="pwd"
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input.Password
                    size="large"
                    placeholder="请输入密码"
                    prefix={
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="用户名称"
                  name="name"
                  rules={[{ required: true, message: '请输入用户名称!' }]}
                >
                  <Input
                    size="large"
                    placeholder="请输入用户名称"
                    allowClear
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="访问权限"
                  name="auth"
                  rules={[{ required: true, message: '请选择用户权限!' }]}
                >
                  <Checkbox.Group options={opt} />
                </Form.Item>
                <Form.Item className={s.fun}>
                  <Button
                    type="primary"
                    className="input-btn"
                    onClick={doCheckVaild}
                    block
                  >
                    保存
                  </Button>
                  <Button
                    type="cancel"
                    className="input-btn"
                    onClick={doClose}
                    block
                  >
                    关闭
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default observer(User);
