import React, { lazy, Suspense } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import injects from '@/store';
import PrivateRoute from '@/component/PrivateRoute';

import '@/less/var.less';
import '@/less/com.less';

configure({ enforceActions: 'observed' });

const Layout = lazy(() => import('./app/layout'));
const Login = lazy(() => import('./app/login'));
const Index = lazy(() => import('./app/index'));
const Period = lazy(() => import('./app/period'));
const Device = lazy(() => import('./app/device'));

const ReportHistory = lazy(() => import('./app/report/history'));
const ReportDevice = lazy(() => import('./app/report/device'));
const ReportRun = lazy(() => import('./app/report/run'));
const ReportHistoryDev = lazy(() => import('./app/report/historyDev'));
const ReportHistorySys = lazy(() => import('./app/report/historySys'));
const Control = lazy(() => import('./app/report/control'));

const User = lazy(() => import('./app/user'));
const NotFound = lazy(() => import('./component/404'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider {...injects}>
    <ConfigProvider locale={zhCN}>
      <HashRouter future={{ v7_startTransition: true }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              {/* 无需登录即可访问的路由 */}
              <Route path="/" element={<Index />} />
              <Route path="/period" element={<Period />} />
              <Route path="/device" element={<Device />} />

              {/* 需要登录和权限验证的路由 */}
              <Route
                path="/report/run"
                element={
                  <PrivateRoute
                    element={<ReportRun />}
                    requiredAuth="ReportRun"
                  />
                }
              />
              <Route
                path="/report/history"
                element={
                  <PrivateRoute
                    element={<ReportHistory />}
                    requiredAuth="ReportHistory"
                  />
                }
              />
              <Route
                path="/report/device"
                element={
                  <PrivateRoute
                    element={<ReportDevice />}
                    requiredAuth="ReportDevice"
                  />
                }
              />
              <Route
                path="/report/historyDev"
                element={
                  <PrivateRoute
                    element={<ReportHistoryDev />}
                    requiredAuth="ReportHistoryDev"
                  />
                }
              />
              <Route
                path="/report/historySys"
                element={
                  <PrivateRoute
                    element={<ReportHistorySys />}
                    requiredAuth="ReportHistorySys"
                  />
                }
              />
              <Route
                path="/report/control"
                element={
                  <PrivateRoute element={<Control />} requiredAuth="Control" />
                }
              />

              <Route
                path="/user"
                element={
                  <PrivateRoute element={<User />} requiredAuth="User" />
                }
              />

              {/* 添加404路由，放在最后匹配所有未定义的路径 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ConfigProvider>
  </Provider>
);
