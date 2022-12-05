import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loading from './services/Loading/Loading';

const FirstPage = lazy(() => import('./pages/FirstPage/FirstPage'));
const ProfileMarket = lazy(() => import('./pages/ProfileMarket/ProfileMarket'));
const ZonePage = lazy(() => import('./pages/ZonePage/ZonePage'));
const SectionPage = lazy(() => import('./pages/SectionPage/SectionPage'));

function AppRouting() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<FirstPage />} />
          <Route path='/profile-market/:id' element={<ProfileMarket />} />
          <Route path='/profile-market/:id/zone' element={<ZonePage />} />
          <Route path='/profile-market/:id/section' element={<SectionPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouting