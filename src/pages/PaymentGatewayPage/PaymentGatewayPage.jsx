import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Stack, Container, Button, Card, Form, FormCheck, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import liff from '@line/liff'
import { message, Spin } from 'antd';
import axios from 'axios';
import { BASE_URL_API } from '../../services/services';

const PaymentGatewayPage = () => {
    const { reserveStore } = useSelector(state => ({ ...state }));
    const [payment, setPayment] = useState('qrcode');
    const [confirm, setConfirm] = useState(false);
    const [totalSection, setTotalSection] = useState({
        total_price_section: 0,
        total_length_section: 0,
        total_price_service: 0,
        total_price_appliance: 0,
    });
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [profile, setProfile] = useState();
    const haveAppliances = reserveStore.services.appliances.length > 0

    const navigate = useNavigate();


    useEffect(() => {
        if (reserveStore.data?.length < 1) {
            navigate('/')
        }
        setTotalSection({
            total_price_section: 0,
            total_length_section: 0,
            total_price_service: 0,
            total_price_appliance: 0,
        });

        const { total_price_section, total_length_section, total_price_appliance } = calculateTotal(reserveStore.data, reserveStore.services.appliances)
        setTotalSection(prev => ({
            ...prev,
            total_price_section,
            total_length_section,
            total_price_service: reserveStore.services.service.price * total_length_section,
            total_price_appliance,
        }))
        liffFetch();
    }, [])
    const liffFetch = async () => {
        await liff.ready
        const profile = await liff.getProfile()
        setProfile(profile);
    }

    const onClickConfirm = () => {
        setLoading(true);
        console.log(profile)
        const data = {
            line_id: profile.userId,
            market_id: reserveStore.id_market,
            zone_id: reserveStore.id_zone,
            service: reserveStore.services.service.status ? 1 : 0,
            sections: reserveStore.data.map(i => ({
                id: i.id,
                days: i.days
            })),
            appliances: reserveStore.services.appliances.map(i => ({
                id: i.id,
                amount: i.amount
            }))
        }
        axios.post(`${BASE_URL_API}order/create`, data).then(res => {
            if (res.data.res_code == 200) {
                navigate(`../order/${res.data.order_id}`)
            }
        }).catch(err => {
            messageApi.open({
                type: 'error',
                content: err.response.data.message
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const calculateTotal = (sections, appliances) => {
        return sections.reduce((total, section) => {
            total.total_price_section += section.price * Array.from(section.days).length
            total.total_length_section += Array.from(section.days).length
            total.total_price_appliance += appliances.reduce((totalPrice, appliance) => {
                return totalPrice + appliance.price * appliance.amount
            }, 0) * Array.from(section.days).length
            return total;
        }, { total_price_section: 0, total_length_section: 0, total_price_appliance: 0 });
    }
    const handleBack = () => {
        navigate(-1);
    }
    const handleChange = (event) => {
        setPayment(event.target.value)
    }
    const onConfirm = () => {
        setConfirm(!confirm)
    }
    return (
        <Spin spinning={loading}>
            <div className='pb-200'>

                {contextHolder}
                <Container className='pt-3'>
                    <div className=" position-relative">
                        <h4 className='text-center'>ช่องทางการชำระเงิน</h4>
                    </div>
                    <Stack direction='horizontal' className='mt-3 justify-content-between'>
                        <p >ยอดรวมค่าแผง</p>
                        <p>{`฿ ${totalSection.total_price_section}`}</p>
                    </Stack>
                    <Stack gap={2}>
                        {reserveStore.data.map((section) => {
                            const length = Array.from(section.days).length
                            return (
                                <Stack className="text-custom-secondary" key={section.id}>
                                    <span>ค่าแผงที่ {section.title}</span>
                                    <Stack direction='horizontal' className='justify-content-between'>
                                        <span>{section.price}*{length} วัน</span>
                                        <span>{`฿ ${section.price * length}`}</span>
                                    </Stack>
                                </Stack>
                            )
                        })}
                    </Stack>

                    {reserveStore.services.status || haveAppliances ? (
                        <>
                            <hr />
                            <Stack direction='horizontal' className='mt-3 justify-content-between'>
                                <p >ยอดรวมค่าอุปกรณ์ {totalSection.total_length_section}วัน</p>
                                <p>{`฿ ${totalSection.total_price_appliance + totalSection.total_price_service}`}</p>
                            </Stack>
                            <Stack className="text-custom-secondary" gap={2}>
                                {reserveStore.services.service.status ? (
                                    <Stack direction='horizontal' className='justify-content-between'>
                                        <span>ค่าบริการไฟฟ้า</span>
                                        <span>{`฿ ${totalSection.total_price_service}`}</span>
                                    </Stack>
                                ) : null}
                                {haveAppliances ? (
                                    reserveStore.services.appliances.map(appliance => {
                                        return (
                                            <Stack direction='horizontal' className='justify-content-between' key={appliance.id}>
                                                <span>{appliance.name}</span>
                                                <span>{`฿ ${appliance.price * appliance.amount * totalSection.total_length_section}`}</span>
                                            </Stack>
                                        )
                                    })
                                ) : null}
                            </Stack>
                        </>
                    ) : null}
                    <Stack direction='horizontal' className='mt-4 justify-content-between fw-bold'>
                        <span>ยอดรวม</span>
                        <span>{`฿ ${totalSection.total_price_appliance + totalSection.total_price_service + totalSection.total_price_section}`}</span>
                    </Stack>
                </Container>
                <hr />
                <Container className='pt-3'>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                วิธีชำระเงิน
                            </Card.Title>
                            <Form>
                                <FormCheck id='payment1' className='mt-3 ps-0' type='radio'>
                                    <FormCheck.Label className='w-100'>
                                        <Card className={payment == 'qrcode' ? 'border-secondary' : null}>
                                            <Card.Body>
                                                <Stack direction='horizontal' className='align-items-center'>
                                                    <FormCheck.Input name='payment' className='m-1' type='radio' value='qrcode' checked={payment === 'qrcode'} onChange={handleChange} />
                                                    <span className='ms-2 me-auto'>ชำระผ่าน QR Code</span>
                                                    <Icon icon='bi:qr-code' />
                                                </Stack>
                                            </Card.Body>
                                        </Card>
                                    </FormCheck.Label>
                                </FormCheck>
                            </Form>
                        </Card.Body>
                    </Card>
                    <FormCheck checked={confirm} onChange={onConfirm} id='confirm' className='mt-3' type='checkbox' label='ฉันรับทราบว่าฉันได้อ่านและยอมรับ เงื่อนไข ขาย และ นโยบายความเป้นส่วนตัว เรียบร้อยแล้ว' />
                </Container>
                <div className="position-fixed start-0 bottom-0 w-100 bg-white">
                    <Row className='p-3'>
                        <Col xs='4'>
                            <Button variant='outline-primary' onClick={handleBack} className='w-100'>ย้อนกลับ</Button>
                        </Col>
                        <Col xs='8'>
                            <Button className={`w-100 `} disabled={!confirm} onClick={onClickConfirm}>ยืนยันจองแผง</Button>
                        </Col>
                    </Row>
                </div>

            </div>
        </Spin>
    )
}

export default PaymentGatewayPage