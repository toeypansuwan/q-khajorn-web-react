import { useState, useEffect } from 'react'
import Routing from './AppRouting'

import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle'
import './App.css'

function App() {
  const liffId = import.meta.env.VITE_PUBLIC_LIFF_ID;

  useEffect(() => {
    const liffFetch = async () => {
      const liff = (await import('@line/liff')).default;
      try {
        await liff.init({ liffId })
      } catch (err) {
        console.error('liff error', err.message)
      }
      if (!liff.isLoggedIn()) {
        liff.login()
      }
    }
    liffFetch();
  })
  return (
    <div className="App">
      <Routing />
    </div>
  )
}

export default App
