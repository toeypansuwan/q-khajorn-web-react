import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Image, Stack } from 'react-bootstrap'
import AdminLayout from '../../../Layouts/AdminLayout'
import { message } from 'antd'
import { checkAuth, loginUser } from '../../../services/AuthServices'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [status, setStatus] = useState(false)
    useEffect(() => {
        setStatus(checkAuth());
        if (status) {
            navigate('/system/')
        }
    }, [status])
    const onSignin = async () => {
        const isLogin = await loginUser(form)
        if (!isLogin) {
            message.error("ไม่พบผู้ใช้")
        }
        setStatus(isLogin);
    }
    return (
        <AdminLayout>
            <Container fluid style={{ height: 'calc(100vh - 76px)', background: "url('/img/bg_login.svg') 0% 0% / cover no-repeat rgba(233, 233, 255, 1)" }}>
                <Stack direction={'vertical'} className="h-100 justify-content-center">
                    <div className="d-flex flex-column gap-4 mx-auto" style={{ maxWidth: 400, minWidth: 400 }}>
                        <div className="">
                            <h2 className='text-center'>เข้าสู่ระบบ</h2>
                        </div>
                        <div className="">
                            <Form.Label htmlFor="username">ชื่อบัญชี</Form.Label>
                            <Form.Control
                                id='username'
                                onInput={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                required
                                type="email"
                                placeholder="กรอกอีเมล"
                            />

                        </div>
                        <div className="mb-3">
                            <Form.Label htmlFor='password'>รหัสผ่าน</Form.Label>
                            <Form.Control
                                id='password'
                                onInput={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                                required
                                type="password"
                                placeholder="กรอกรหัสตลาด"

                            />
                        </div>
                        <div className="d-grid">
                            <Button variant='primary' onClick={onSignin}>เข้าสู่ระบบ</Button>
                        </div>
                    </div>
                </Stack>
            </Container>
        </AdminLayout>
    )
}

export default Login