import React from 'react'
import { Button, Result } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'
const NotFound = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const subTitle = location.state?.subTitle
    const titleButton = location.state?.titleButton
    return (
        <Result
            status="404"
            title="404"
            subTitle={subTitle ? subTitle : 'Sorry, the page you visited does not exist.'}
            extra={<Button type="primary" onClick={() => { navigate('/') }}>{titleButton ? titleButton : 'กลับสู่หน้าการจอง'}</Button>}
        />
    )
}

export default NotFound