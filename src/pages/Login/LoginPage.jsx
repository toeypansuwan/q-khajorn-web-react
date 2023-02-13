import { message } from 'antd';
import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { Image, Form, Container, Button } from 'react-bootstrap'
import { loginUser } from '../../services/AuthServices';
import liff from '@line/liff/dist/lib';
// import { Button } from 'antd'
function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const onLoginSubmit = async () => {
        const statusLogin = await loginUser(form);
        if (statusLogin) {
            liff.closeWindow();
        } else {
            message.error("ไม่พบผู้ใช้นี้")
        }

    }
    return (
        <Container style={{ height: '100vh' }}>
            <div className="d-flex flex-column gap-4 ">
                <div className="text-center m-5">
                    <Image src='../../../public/logo.svg' style={{ width: 143, height: 77 }} />
                </div>
                <div className="">
                    <h2 className='text-center'>เข้าสู่ระบบ</h2>
                </div>
                <div className="">
                    <Form.Label>ชื่อบัญชี</Form.Label>
                    <Form.Control
                        onInput={(e) => setForm({ email: e.target.value, password: form.password })}
                        required
                        type="email"
                        placeholder="กรอกอีเมล"
                    />

                </div>
                <div className="">
                    <Form.Label>รหัสผ่าน</Form.Label>
                    <Form.Control
                        onInput={(e) => setForm({ password: e.target.value, email: form.username })}
                        required
                        type="password"
                        placeholder="กรอกรหัสผ่าน"
                    />
                </div>
                <div className="d-grid">
                    <Button variant='primary' onClick={onLoginSubmit}>เข้าสู่ระบบสมาชิก</Button>
                </div>
            </div>
        </Container>
    )
}

export default LoginPage