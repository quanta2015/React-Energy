/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useEffect,useState,useRef} from 'react';
import {Input,  Space,  Form, Button, Row, Col, Select, Upload, Modal, message} from 'antd'
import { MinusCircleOutlined, PlusOutlined ,CloudUploadOutlined, DeleteOutlined} from '@ant-design/icons';
import {API_SERVER} from '@/constant/apis'
import { observer,MobXProviderContext } from 'mobx-react'
import {filterData,clone,getBase64} from '@/util/fn'
import s from './index.module.less';


const formItemLayout = {
  labelCol: {
    md: { span: 12 },
  },
  wrapperCol: {
    md: { span: 12 },
  },
};



const FormMain = ({col, item, method,setRefresh, setShowForm,setLoading}) => {
  const { store } = React.useContext(MobXProviderContext)
  

  const initBasic = method==='insert'?{}:{...item, repwd:item.pwd }

  // 保存修改數據
  const onFinish = (values) => {
    if (values.pwd !== values.repwd) {
      message.error("密码必须相同")
      return
    }
    
    const params = {
      id: item?.id,
      method,
      ...values
    }

    console.log(params)

    setLoading(true)
    store.saveUsr(params).then(r=>{
      setLoading(false)
      setShowForm(false)
      setRefresh(true)
      message.info('保存成功')
    })
  };

  



  return (
    <div className={s.form}>
      <div className={s.wrap}>
        <Form 
          {...formItemLayout}
          initialValues={initBasic}
          onFinish={onFinish}
          >

          <div className={s.basic}>
            <div className={s.head}>
              <h1>基本信息</h1>
            </div>

            <Form.Item
              name="name"
              label="用户名称"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: '请输入公司名称'}]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="usr"
              label="用户账号"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: '请输入用户账号'}]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="pwd"
              label="密码"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: '请输入密码'}]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="repwd"
              label="确认密码"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: '请输入确认密码'}]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="phone"
              label="联系方式"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: '请输入联系方式'}]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="email"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: '请输入邮箱'}]}
            >
              <Input />
            </Form.Item>
          </div>

          
          <div className={s.fun}>
            <Button type="default" style={{width:'120px'}} onClick={()=>setShowForm(false)} >取消</Button>  
            <Button type="primary" htmlType="submit" style={{width:'120px'}} >保存</Button>
          </div>
        </Form>
      </div>

    </div>
    
  )

}

export default  observer(FormMain)