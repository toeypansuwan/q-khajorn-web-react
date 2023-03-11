import { Outlet, Navigate } from 'react-router-dom'
import { checkAuth } from '../services/AuthServices'
import { useEffect, useState } from 'react'

const PrivateRoutes = () => {
    // const [auth, setAuth] = useState(false)
    const auth = { token: checkAuth() }

    return (
        auth.token ? <Outlet /> : <Navigate to="/system/login" />
    )
}

export default PrivateRoutes