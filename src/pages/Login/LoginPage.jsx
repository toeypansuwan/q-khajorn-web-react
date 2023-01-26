import React from 'react'
import { Image, Form, Container } from 'react-bootstrap'
function LoginPage() {
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
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="กรอกชื่อบัญชี หรือ username"
                    />

                </div>
                <div className="">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="กรอกรหัสผ่าน"
                    />
                </div>
            </div>
        </Container>
    )
}

export default LoginPage