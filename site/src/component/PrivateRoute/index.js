import { Navigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { PL } from '@/constant/data';

// 权限控制组件
const PrivateRoute = ({ element, requiredAuth }) => {
  const location = useLocation();

  // 从localStorage或其他存储中获取用户信息
  const userInfo = JSON.parse(localStorage.getItem('ENERGY_SYS_USER') || '{}');
  const isLoggedIn = !!userInfo.token;
  const userAuth = userInfo.auth || '';

  // 检查用户是否登录以及是否有权限
  if (!isLoggedIn) {
    // 未登录，重定向到登录页面，并记录原始访问路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const privateList = userAuth
    .split('')
    .map((item, index) => {
      if (item === '1') {
        return PL[index];
      }
      return '';
    })
    .filter(item => item !== '');

  // 如果需要特定权限
  if (requiredAuth && !privateList.includes(requiredAuth)) {
    message.info('您无权访问');
    return <Navigate to="/404" replace />;
  }

  return element;
};

export default PrivateRoute;
