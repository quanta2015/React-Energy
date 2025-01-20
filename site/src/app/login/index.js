import React from 'react';
import { inject, observer, MobXProviderContext } from 'mobx-react';
import { Form, Input, Button, message } from 'antd';
import { saveUser } from '@/util/token';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import * as urls from '@/constant/urls';
import { useNavigate } from 'react-router-dom';

import style from './index.module.less';

import logo from '@/img/kbd.svg';
import bg from '@/img/bg/bg-login.webp';
import logoAns from '@/img/logo-title.svg';

const Login = () => {
  const { store } = React.useContext(MobXProviderContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const doLogin = async () => {
    try {
      const params = await form.validateFields();
      const r = await store.login(params);

      console.log(r);
      message.info(r.msg);
      if (r.code === 200) {
        console.log('aaaaa');
        saveUser(r.data);
        store.saveUser(r.data);
        navigate('/');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <div className={style.login}>
      <div className={style.wrap}>
        <div className={style.logo}>
          <img src={bg} />
        </div>

        <div className={style.main}>
          <div className={style.title}>
            <img src={logoAns} className={style.bg} />
            <p>
              <span>科博达智慧云平台</span>
              <label>Keboda Energy Management System</label>
            </p>
          </div>

          <Form form={form} className={style.login_frm}>
            <Form.Item
              name="usr"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input
                size="large"
                style={{ height: '45px' }}
                placeholder="请输入账号"
                allowClear
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="pwd"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input.Password
                size="large"
                style={{ height: '45px' }}
                placeholder="请输入密码"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            <p></p>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                className="input-btn"
                block
                onClick={doLogin}
              >
                登 录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default observer(Login);
