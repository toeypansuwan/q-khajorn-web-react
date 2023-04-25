import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loading from './services/Loading/Loading';
import PrivateRoutes from './untils/PrivateRoutes'

const FirstPage = lazy(() => import('./pages/FirstPage/FirstPage'));
const ProfileMarket = lazy(() => import('./pages/ProfileMarket/ProfileMarket'));
const ZonePage = lazy(() => import('./pages/ZonePage/ZonePage'));
const SectionPage = lazy(() => import('./pages/SectionPage/SectionPage'));
const Appliance = lazy(() => import('./pages/Appliance/Appliance'));
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const OrderList = lazy(() => import('./pages/OrderList/OrderList'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const PaymentGatewayPage = lazy(() => import('./pages/PaymentGatewayPage/PaymentGatewayPage'));
const QrCode = lazy(() => import('./pages/QrCode/QrCode'));

const Login = lazy(() => import('./pages/Admin/Login/Login'));
const Home = lazy(() => import('./pages/Admin/Home/Home'));
const Create = lazy(() => import('./pages/Admin/Create/Create'));
const Update = lazy(() => import('./pages/Admin/Update/Update'));

function AppRouting() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/system" element={<PrivateRoutes />}>
            <Route index element={<Home />} />
            <Route path='create' element={<Create />} />
            <Route path=':id/edit' element={<Update />} />
          </Route>
          <Route path='/system/login' element={<Login />} />
          <Route path='/' element={<FirstPage />} />
          <Route path='/profile-market'>
            <Route path=':id' element={<ProfileMarket />} />
            <Route path=':id/zone' element={<ZonePage />} />
            <Route path=':id/section' element={<SectionPage />} />
            <Route path=':id/section/appliance' element={<Appliance />} />
            <Route path='payment' element={<PaymentGatewayPage />} />
            <Route path='order/:orderId' element={<OrderList />} />
            <Route path='order/:orderId/qr_code' element={<QrCode />} />
          </Route>
          <Route path='*' element={<NotFound />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouting