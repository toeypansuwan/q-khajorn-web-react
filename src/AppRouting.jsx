import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SearchMarketPage from './pages/SearchMarket/SearchMarketPage'
import ProfileMarket from './pages/ProfileMarket/ProfileMarket'

function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SearchMarketPage />} />
        <Route path='/profile-market/:id' element={<ProfileMarket />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouting