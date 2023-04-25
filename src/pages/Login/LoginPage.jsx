import { message } from 'antd';
import React from 'react'
import { useState } from 'react'
import { Image, Form, Container, Button } from 'react-bootstrap'
import { loginUser, switchRich } from '../../services/AuthServices';
import liff from '@line/liff/dist/lib';
function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [marketKey, setMarketKey] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const onLoginSubmit = async () => {
        const statusLogin = await loginUser(form);
        if (statusLogin) {
            setIsLogin(statusLogin);
        } else {
            message.error("ไม่พบผู้ใช้นี้")
        }
    }
    const onSignin = async () => {
        const statusSwitchRich = await switchRich(marketKey);
        if (isLogin && statusSwitchRich) {
            liff.closeWindow();
        } else {
            message.error("ไม่พบตลาดนี้")
        }
    }
    return (
        <Container style={{ height: '100vh', background: "url('./src/assets/bg_login.svg') 0% 0% / cover no-repeat rgba(233, 233, 255, 1)" }}>
            <div className="d-flex flex-column gap-4 ">
                <div className="text-center m-5">
                    <Image src='img/logo.svg' style={{ width: 143, height: 77 }} />
                </div>
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
                        readOnly={isLogin}
                        placeholder="กรอกอีเมล"
                    />

                </div>
                <div className="">
                    <Form.Label htmlFor='password'>รหัสผ่าน</Form.Label>
                    <Form.Control
                        id='password'
                        onInput={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        type="password"
                        readOnly={isLogin}
                        placeholder="กรอกรหัสตลาด"

                    />
                </div>
                {
                    isLogin ? (<div className="">
                        <Form.Label htmlFor='market_key'>รหัสตลาด</Form.Label>
                        <Form.Control
                            id='market_key'
                            onInput={(e) => setMarketKey(e.target.value)}
                            required
                            type="password"
                            placeholder="กรอกรหัสผ่าน"

                        />
                    </div>) : null
                }
                <div className="d-grid">
                    {isLogin ? (<Button variant='primary' onClick={onSignin}>เข้าสู่ระบบสมาชิก</Button>) : (<Button variant='primary' onClick={onLoginSubmit}>ตรวจสอบรหัสผ่าน</Button>)}
                </div>
            </div>
        </Container>
    )
}

export default LoginPage