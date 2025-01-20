import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd'

const { confirm } = Modal;

const Confirm = (title,cb,e) => {
  confirm({
    title,
    icon: <ExclamationCircleFilled />,
    okType: 'danger',
    okText: '确 定',
    cancelText: '取 消',
    onOk() {
      cb(e)
    },
  });
};

export default Confirm;