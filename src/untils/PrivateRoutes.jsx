import { Outlet, Navigate } from 'react-router-dom'
import { checkAuth } from '../services/AuthServices'

const PrivateRoutes = () => {
    const auth = { token: checkAuth() }

    return (
        auth.token ? <Outlet /> : <Navigate to="/system/login" />
    )
}

export default PrivateRoutes