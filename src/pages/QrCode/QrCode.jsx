import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Button, Stack, Image } from 'react-bootstrap'
import { BASE_URL_API, getOrderId } from '../../services/services'
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios'
import { Modal, message } from 'antd'
import liff from '@line/liff/dist/lib';
import * as qrcode from 'qrcode';

const QrCode = () => {
    const { orderId } = useParams();
    const { confirm } = Modal;
    const [order, setOrder] = useState(null);
    const [url, setUrl] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (!order) {
            fetchOrder();
        }
        generateQRcode(order?.qr_code)
    }, [order])
    const fetchOrder = async () => {
        const orderData = await getOrderId(orderId);
        if (!orderData) {
            // navigete('*', { state: { subTitle: `ต้องขออภัยทางเว็บ Q Khajorn ไม่พบหมายเลขการจอง:${orderId} นี้ในระบบ`, titleButton: `ทำการจองอีกครั้ง` } })
        }
        setOrder(orderData);
    }

    const onCheck = () => {
        confirm({
            title: `การชำระเงิน`,
            icon: <ExclamationCircleFilled />,
            content: 'ถ้ากดปุ่ม ok จะจำลองว่า ได้ชำระเงินเรียบร้อยแล้ว',
            okText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
            onOk: async () => {
                try {
                    const lineId = (await liff.getProfile()).userId;
                    const res = (await axios.post(`${BASE_URL_API}order/confirm/${order?.id}`, { lineId })).data;
                    liff.closeWindow();
                    return res;
                } catch (err) {
                    messageApi.open({
                        type: 'error',
                        content: err.response.data.message
                    })
                }
            },
            onCancel() {
            },
        });
    }

    const generateQRcode = (payload) =>{
        if(!payload){
            return;
        }
        const options = { type: 'svg', color: { dark: '#000', light: '#fff' } }
        qrcode.toDataURL(payload, options, (err, svg) => {
            if (err) {
                throw new Error(`qrcode: ${err}`);
            }
            setUrl(svg);
        })
    }
    return (
        <Container className='py-3'>
            {contextHolder}
            <Stack direction={'vertical'} gap='2'>
                <h1 className='fw-light'>
                    Payment Type<br />ThaiQR
                </h1>
                <Stack>
                    <Button onClick={onCheck}>ตรวจสอบสถานะ</Button>
                </Stack>
                <p>กรุณาสแกนคิวอาร์โค้ดด้วยโมบายแอปพลิเคชัน
                    ภายใน 10 นาที
                    Please scan the QR code using the mobile app
                    within 10.minutes.</p>
                <div className="text-center">
                    <Image width={100} src={`https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nueyBV0RNEpETYMKpsYWhA.png`} />
                    {url?(<Image width={300} src={url} />):null}
                    
                </div>
                <div className="">
                    <Stack direction={'horizontal'} className='justify-content-between align-items-start'>
                        <div className="">
                            <h4>บมจ. คิวขาจร</h4>
                            <p>Ref Number: BNN2211030345<br />
                                Remaining time: 577</p>
                        </div>
                        <h4 className='text-end'>{order?.price}<br />
                            TH</h4>
                    </Stack>
                    <p>อยู่ระหว่างทำรายการ กรุณาอย่าปิดหรือรีเฟรชหน้า
                        จอ<br />
                        The transaction is being processed. Please do
                        not close or refresh the page.<br />
                        หน้าจอจะแสดงผลชำระเงินภายใน 30 วินาที หากไม่
                        พบข้อความ กด "ตรวจสอบสถานะ"<br />
                        The screen will display a payment result in 30
                        seconds. If no message is found, please click
                        "Check Status".</p>
                </div>
            </Stack>
        </Container>
    )
}

export default QrCode