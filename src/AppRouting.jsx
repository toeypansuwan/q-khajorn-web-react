import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loading from './services/Loading/Loading';

const FirstPage = lazy(() => import('./pages/FirstPage/FirstPage'));
const ProfileMarket = lazy(() => import('./pages/ProfileMarket/ProfileMarket'));
const ZonePage = lazy(() => import('./pages/ZonePage/ZonePage'));
const SectionPage = lazy(() => import('./pages/SectionPage/SectionPage'));
const Appliance = lazy(() => import('./pages/Appliance/Appliance'));

function AppRouting() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<FirstPage />} />
          <Route path='/profile-market'>
            <Route path=':id' element={<ProfileMarket />} />
            <Route path=':id/zone' element={<ZonePage />} />
            <Route path=':id/section' element={<SectionPage />} />
            <Route path=':id/section/appliance' element={<Appliance />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouting