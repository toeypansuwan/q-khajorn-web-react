import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FirstPage from './pages/FirstPage/FirstPage'
import ProfileMarket from './pages/ProfileMarket/ProfileMarket'
import ZonePage from './pages/ZonePage/ZonePage'

function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FirstPage />} />
        <Route path='/profile-market/:id' element={<ProfileMarket />} />
        <Route path='/profile-market/:id/zone' element={<ZonePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouting