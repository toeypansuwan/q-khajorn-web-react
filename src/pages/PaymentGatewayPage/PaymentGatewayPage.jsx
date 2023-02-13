import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Stack, Container, Button, Card, Form, FormCheck, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

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

    }, [])

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
        <div className='pb-200'>
            <Container className='pt-3'>
                <div className=" position-relative">
                    {/* <button onClick={handleBack} className='btn position-absolute start-0 top-50 translate-middle-y'><Icon icon="eva:arrow-ios-back-fill" className='fs-3' /></button> */}
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
                                        <Stack direction='horizontal' className='justify-content-between'>
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
                        {/* <Button as={Link} to={`/profile-market/payment`} disabled={!confirm} className='w-100'>เลือกช่องทางชำระเงิน</Button> */}
                        <LinkContainer to={`/profile-market/payment`}>
                            <Button className={`w-100 `} disabled={!confirm}>ยืนยันจองแผง</Button>
                        </LinkContainer>
                        {/* <Button className='w-100' onClick={onClickConfirm}>จ่ายค่าแผง</Button> */}
                    </Col>
                </Row>
            </div>
        </div>

    )
}

export default PaymentGatewayPage