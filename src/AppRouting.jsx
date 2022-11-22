import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FirstPage from './pages/FirstPage/FirstPage'
import ProfileMarket from './pages/ProfileMarket/ProfileMarket'

function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FirstPage />} />
        <Route path='/profile-market/:id' element={<ProfileMarket />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouting