import React, { useState, useEffect, createContext } from 'react'
import { Container, Row, Col, Badge, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getOrderId, BASE_URL_API, fallbackImage, timeTo_hmm, compareAndCommaDaysOfWeek } from '../../services/services';
import { Skeleton, Image, List, Space, Modal, message } from 'antd';
import { LinkContainer } from 'react-router-bootstrap'
import { ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import th from 'moment/dist/locale/th';
import liff from '@line/liff/dist/lib';
import axios from 'axios';

moment.locale('th', th);

const OrderList = () => {
    const { confirm } = Modal;
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (!order) {
            fetchOrder();
        }
    }, [order])
    const fetchOrder = async () => {
        const orderData = await getOrderId(orderId);
        if (!orderData) {
            // navigete('*', { state: { subTitle: `ต้องขออภัยทางเว็บ Q Khajorn ไม่พบหมายเลขการจอง:${orderId} นี้ในระบบ`, titleButton: `ทำการจองอีกครั้ง` } })
        }
        setOrder(orderData);
        setLoading(false);
    }
    const badgeStatusElem = order?.status_pay == 'wait' ? <Badge bg='warning'>รอชำระเงิน</Badge> : order?.status_pay == 'success' ? <Badge bg='success'>ชำระเงินเสร็จสิ้น</Badge> : <Badge bg='danger'>รายการถูกยกเลิก</Badge>
    const handleClose = () => {
        liff.closeWindow();
    }
    const handleCancel = async () => {
        confirm({
            title: `ยกเลิกรายการ`,
            icon: <ExclamationCircleFilled />,
            content: `คุณยืนยันที่จะยกเลิกรายการการจอง :${order?.order_runnumber} หรือไม่`,
            okText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
            onOk: async () => {
                try {
                    const lineId = (await liff.getProfile()).userId
                    setUserId(lineId);
                    const res = (await axios.post(`${BASE_URL_API}order/cancel/${order?.id}`, { lineId })).data;
                    const orderData = await getOrderId(orderId);
                    setOrder(orderData);
                    return res;
                } catch (err) {
                    messageApi.open({
                        type: 'error',
                        content: err.response.data.message
                    })
                }
            },
            onCancel: () => { },
        });
    }
    return (
        <div>
            {contextHolder}
            <Container className='pt-3'>
                <Skeleton loading={loading} title={0} paragraph={{ rows: 1 }}>
                    <span className='text-custom-secondary'>หมายเลขการจอง</span>
                    <p className='fs-5'>{order?.order_runnumber}</p>
                    <span className='text-custom-secondary'>วันที่ออก: {moment(order?.created_at).format('DD MMM YYYY')}</span>
                </Skeleton>
            </Container>
            <hr />
            <Container>
                <Skeleton active loading={loading}>
                    <h5>ตลาดนัดที่จอง</h5>
                    <Row>
                        <Col xs='4'>
                            {loading ? <Skeleton.Image active className='w-100' />
                                : <Image className='rounded' src={`${BASE_URL_API}upload/market/${order?.market.image}`} fallback={fallbackImage} />
                            }
                        </Col>
                        <Col>
                            <h5>ตลาดนัดที่จอง</h5>
                            <p className='text-custom-secondary'>เปิด {compareAndCommaDaysOfWeek(order?.market.marketDays)}<br />
                                เวลา {`${timeTo_hmm(order?.market.time_open)} - ${timeTo_hmm(order?.market.time_close)}`} น.</p>
                        </Col>
                    </Row>
                </Skeleton>
            </Container>
            <hr />
            <Container>
                <Skeleton active loading={loading}>
                    <h5>ตลาดนัดที่จอง</h5>
                </Skeleton>
            </Container>
            <List
                size="small"
                dataSource={order?.orderSectionZone}
                itemLayout='vertical'
                renderItem={(item) =>
                    <List.Item >
                        <Space className='w-100' direction='vertical' size={'middle'}>
                            <Row>
                                <Col xs='4'>
                                    <div className="" style={{ height: 70 }}>
                                        {loading ? <Skeleton.Image active className='w-100' />
                                            : <Image className='rounded' style={{ objectFit: 'cover' }} width={'100%'} height={'100%'} src={`${BASE_URL_API}upload/market/${item.sectionZone.image}`} fallback={fallbackImage} />
                                        }
                                    </div>
                                </Col>
                                <Col>
                                    <h5>แผง {item.sectionZone.name}</h5>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs='4'>
                                    <span className='text-custom-secondary'>วันจอง</span>
                                </Col>
                                <Col>
                                    {
                                        item.orderSectionZoneDays.map(sectionZoneDay => (<span key={sectionZoneDay.id} className=' rounded border px-2 py-1'>{moment(sectionZoneDay.date).format('D MMM')}</span>))
                                    }
                                </Col>
                            </Row>
                        </Space>
                    </List.Item>
                }
            />
            {
                order?.orderAccessorys > 0 || order?.service ? <>
                    <hr />
                    <Container>
                        <h5>อุปกรณ์เสริม</h5>
                        <span className='text-custom-secondary'>{order?.service ? "บริการไฟฟ้า" : null} {order?.orderAccessorys.map(accessory => accessory.name)}</span>
                    </Container>
                </> : null
            }
            <hr />
            <Container>
                <h5>สถานะชำระเงิน {badgeStatusElem}</h5>
            </Container>
            <hr />
            <Container style={{ paddingBottom: 70 }}>
                <h5>วิธีชำระเงิน</h5>
                <p><span className='text-custom-secondary'>ประเภทการชำระเงิน</span> QR Code</p>
            </Container>
            <div className="position-fixed bottom-0 bg-white shadow-lg start-0 w-100">
                <Container className='py-3'>
                    {
                        order?.status_pay == 'wait' ?
                            <Row>
                                <Col xs='5'>
                                    <Button variant="outline-primary" className='w-100' onClick={handleCancel}>ยกเลิกรายการ</Button>
                                </Col>
                                <Col>
                                    <LinkContainer to={`qr_code`} state={{ order, userId }}>
                                        <Button className={`w-100 `} >ชำระเงิน</Button>
                                    </LinkContainer>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <Col>
                                    <Button variant="primary" className='w-100' onClick={handleClose}>กลับสู่ line</Button>
                                </Col>
                            </Row>
                    }
                </Container>
            </div>
        </div>
    )
}

export default OrderList