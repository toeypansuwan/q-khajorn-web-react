import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react'
import { Button, Container, InputGroup, Stack, Form, Row, Col, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AdminLayout from '../../../Layouts/AdminLayout';
import axios from 'axios';
import { BASE_URL_API } from '../../../services/services';
import { token } from '../../../services/AuthServices';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'

const Home = () => {
    const [markets, setMarkets] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [modal, contextHolder] = Modal.useModal();
    useEffect(() => {
        getMarkets().then(data => setMarkets(data))
    }, [])
    const getMarkets = async (keyword = "") => {
        try {
            const data = await (await axios.get(`${BASE_URL_API}market/?keyword=${keyword}`)).data
            return data;
        } catch (err) {
            console.error(err.response.data)
        }
    }
    const onDestroy = (id, title) => {

        modal.confirm({
            title: `ยืนยันการลบ ${title}` || 'ยืนยันการลบตลาด',
            icon: <ExclamationCircleOutlined />,
            content: `คุณมันใจที่จะลบ${title}หรือไม่ หากคุณยืนยันจะไม่สามารถแก้ไขได้`,
            okText: 'ยืนยันการลบ',
            cancelText: 'ยกเลิกการลบ',
            onOk: () => {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                axios.delete(`${BASE_URL_API}market/delete/${id}`, config).then(({ data }) => {
                    if (data.res_code == 200) {
                        message.success("ลบสำเร็จ")
                        getMarkets().then(data => setMarkets(data))
                    }
                }).catch(error => console.error(error))
            }
        });
    }
    return (
        <AdminLayout isAdmin={true}>
            {contextHolder}
            <Container className='py-3'>
                <Stack direction='horizontal' className='align-items-center justify-content-between mb-3'>
                    <h4>ตลาดทั้งหมด</h4>
                    <InputGroup style={{ maxWidth: 400 }} >
                        <Form.Control placeholder='ค้นชื่อตลาด...' onChange={e => { setKeyword(e.target.value) }} />
                        <Button variant="secondary" onClick={async () => setMarkets(await getMarkets(keyword))} >
                            <Icon icon="akar-icons:search" color='white' />
                        </Button>
                    </InputGroup>
                </Stack>
                <Row className='gy-3'>
                    <Col xs='3'>
                        <LinkContainer to={'./create'} style={{ cursor: 'pointer' }}>
                            <Card className='h-100'>
                                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                                    <Card.Title>+</Card.Title>
                                    <Card.Title>เพิ่มตลาด</Card.Title>
                                </Card.Body>
                            </Card>
                        </LinkContainer>
                    </Col>
                    {
                        markets.map(market => {
                            return (
                                <Col xs='3' key={market.id}>
                                    <Card>
                                        <div style={{ height: 200 }}>
                                            <Card.Img src={`${BASE_URL_API}upload/market/${market.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <Card.Body>
                                            <Stack direction='horizontal' className=' justify-content-between'>
                                                <Card.Title className='col'>{market.name}</Card.Title>
                                                <>
                                                    <Button variant='' className='me-2'>
                                                        <Icon className="text-primary fs-4" icon='material-symbols:edit' />
                                                    </Button>
                                                    <Button variant='' onClick={() => onDestroy(market.id, market.name)}>
                                                        <Icon className="text-secondary fs-4" icon='material-symbols:delete-outline' />
                                                    </Button>
                                                </>
                                            </Stack>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
        </AdminLayout>
    )
}

export default Home;