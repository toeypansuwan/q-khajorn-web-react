import React, { useEffect, useState } from 'react'
import SiteFixBottom from '../../components/SiteFixBottom/SiteFixBottom'
import { Button, Row, Col, Container, Badge } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getMarkerDate, BASE_URL_API } from '../../services/services'
import axios from 'axios'
import { Card, Switch, Space, Input, Button as AntBtn, Transfer, Modal } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import { setService as setServiceStore, addAppliances, editAppliances, removeAppliances } from '../../reducers/reserveSlice';

import './Appliance.css'

import CustomConfigProvider from '../../Config/CustomConfigProvider'
function Appliance() {
    const { id } = useParams();
    const reserveStore = useSelector(state => ({ ...state.reserveStore }))
    const dispatch = useDispatch()
    const [appliances, setAppliances] = useState([]);
    const [service, setService] = useState({});
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }
    useEffect(() => {
        if (!reserveStore.id_market || !reserveStore.id_zone) {
            navigate('/')
        }
        const fetchStart = async () => {

            const dataAppliances = await fetchData({
                method: 'GET',
                url: `${BASE_URL_API}market/${id}/appliance`,
            });

            const newData = dataAppliances.map(i => {
                return { ...i, key: i.id }
            })
            const dataService = await fetchData({
                method: 'GET',
                url: `${BASE_URL_API}market/${reserveStore.id_market}/service-price`,
            });
            setAppliances(newData);
            const isCheck = reserveStore.services.service.status;
            setService({ ...dataService, isCheck });
        }
        fetchStart();
    }, [])
    const fetchData = async ({ method = '', url = '' }) => {
        try {
            let res;
            if (method.toLocaleLowerCase() === 'get') res = await axios.get(url);
            else if (method.toLocaleLowerCase() === 'post') res = await axios.post(url);
            const data = await res.data;
            return data;
        } catch (err) {
            console.error(err.response.data)
        }
    }
    const onChangeInput = ({ item, event }) => {
        const input = parseInt(event.target.value) || 0
        onUpdateState({ input, item })
    }
    const onIncrease = ({ item }) => {
        const input = item.amount + 1;
        onUpdateState({ input, item })
    }
    const onDecrease = ({ item }) => {
        if (item.amount === 0) return;
        const input = item.amount - 1;
        onUpdateState({ input, item })
    }
    const onUpdateState = ({ input, item }) => {
        if (!input || input <= 0) {
            dispatch(editAppliances({ ...item, amount: 1 }))
            return;
        };
        const checkStore = reserveStore.services.appliances.find(i => i.id === item.id);
        if (checkStore) {
            dispatch(editAppliances({ id: item.id, price: item.price, amount: input }))
        } else {
            dispatch(addAppliances({ id: item.id, price: item.price, amount: input }))
        }
    }
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const onChange = (nextTargetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            nextTargetKeys.forEach((key) => {
                const findItem = appliances.find(i => i.id === key);
                dispatch(addAppliances(findItem));
            });
        }
        if (direction === 'left') {
            dispatch(removeAppliances({ id: moveKeys[0] }))
        }
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };
    const onScroll = (direction, e) => {
    };

    const renderListItem = (item) => {
        return (
            <>

                <Card
                    className='card-setting rounded overflow-hidden'
                    cover={<img className='card-img' src={`${BASE_URL_API}upload/market/${item.image}`} alt="" />}
                >
                    <Card.Meta
                        className='d-block'
                        title={
                            <Row className=' justify-content-between'>
                                <Col>{item.name}</Col>
                                {/* <Col xs={'auto'}><DeleteOutlined /></Col> */}
                            </Row>
                        }
                        description={
                            <p>ราคา {item.price} บาท/ชิ้น</p>
                        }
                    />
                </Card>
            </>
        )
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* <CustomConfigProvider type='secondary'> */}
            <Modal
                title="เพิ่ม/ลด อุปกรณ์เสริมต้องการเช่า"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                width={1000}
                // footer={
                //     <>
                //         <AntBtn type='primary' onClick={handleOk}>เลือก</AntBtn>
                //     </>
                // }
                footer={false}
            >
                <Transfer
                    className='tranfer-appliances'
                    dataSource={appliances}
                    titles={['คลังอุปกรณ์', 'อุปกรณ์ที่เลือก']}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={onChange}
                    onSelectChange={onSelectChange}
                    onScroll={onScroll}
                    operations={['เพิ่มอุปกรณ์ที่เลือก']}
                    oneWay
                    listStyle={{
                        height: 350,
                    }}
                    render={renderListItem}
                    style={{ justifyContent: 'flex-end' }}
                />
            </Modal>
            {/* </CustomConfigProvider> */}


            <Container className='pt-3 pb-200'>
                <div className=" position-relative">
                    {/* <button onClick={handleBack} className='btn position-absolute start-0 top-50 translate-middle-y'><Icon icon="eva:arrow-ios-back-fill" className='fs-3' /></button> */}
                    <h4 className='text-center'>เลือกอุปกรณ์เสริม</h4>
                </div>
                <div className="py-3">


                    <Space direction="vertical" size={30}>
                        <div className="">
                            <h5>บริการไฟฟ้า  {service.isCheck ? (<Badge bg='success'>ใช้ไฟฟ้า</Badge>) : (<Badge bg='secondary'>ไม่ใช้ไฟฟ้า</Badge>)}</h5>
                            <p className='text-muted mb-3'>หากเลือกบริการนี้จะสามารถใช้ไฟฟ้าในแผงตนเองได้ อาจมีค่าบริการไฟฟ้าเพิ่มเติม {service?.price || 0} บาท</p>
                            <Switch checked={service.isCheck} onClick={() => {
                                const isCheck = !service.isCheck
                                setService(prev => ({ ...prev, isCheck }))
                                dispatch(setServiceStore({ status: isCheck, price: isCheck ? service.price : 0 }))
                            }} checkedChildren="ใช้ไฟฟ้า" unCheckedChildren="ไม่ใช้ไฟฟ้า" />
                        </div>
                        <div className="">
                            <div className='mb-3'>
                                <h5>เพิ่มอุปกรณ์เสริม</h5>
                                <p className='text-muted mb-0'>เพิ่มอุปกรณที่ตลาดมีให้ เช่น หลอดไฟ โต๊ะ ร่ม เป็นต้นอาจมีค่าบริการอุปกรณ์เสริมเพิ่มเติม</p>
                            </div>
                            <div className="mb-3">
                                <AntBtn onClick={showModal}>
                                    เพิ่ม/ลด อุปกรณ์
                                </AntBtn>
                            </div>
                            <div className="box-scroll-card">
                                <div className="box-card">
                                    {
                                        reserveStore.services.appliances.map((item) => (
                                            <Card
                                                key={item.id}
                                                className='card-setting rounded overflow-hidden'
                                                cover={<img className='card-img' src={`${BASE_URL_API}upload/market/${item.image}`} alt="" />}
                                            >
                                                <Card.Meta
                                                    className='d-block'
                                                    title={
                                                        <Row className=' justify-content-between'>
                                                            <Col><p>{item.name}*{item.amount}</p></Col>
                                                            <Col xs={'auto'}><DeleteOutlined onClick={() => {
                                                                const data = targetKeys.filter(i => i !== item.id)
                                                                setTargetKeys(data);
                                                                dispatch(removeAppliances(item))
                                                            }} /></Col>
                                                        </Row>
                                                    }
                                                    description={
                                                        <div className="">
                                                            <p>ราคา {item.price} บาท/ชิ้น</p>
                                                            <Input.Group
                                                                compact
                                                                className='text-end'
                                                            >
                                                                <AntBtn onClick={() => { onDecrease({ item }) }} icon={<MinusOutlined />} />
                                                                <Input value={item.amount} onChange={(event) => onChangeInput({ item, event })} type="number" min={0} max={100} style={{ width: '40%' }} suffix="ชิ้น" />
                                                                <AntBtn onClick={() => { onIncrease({ item }) }} icon={<PlusOutlined />} />
                                                            </Input.Group>
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </Space>

                </div>
            </Container>
            <SiteFixBottom openTopup={false} getMarkerDate={getMarkerDate}>
                <Row slot='buttonNext' className='gx-3'>
                    <Col xs='4'>
                        <Button variant='outline-primary' onClick={handleBack} className='w-100'>ย้อนกลับ</Button>
                    </Col>
                    <Col xs='8'>
                        <Button as={Link} to={`/profile-market/payment`} className='w-100'>เลือกช่องทางชำระเงิน</Button>
                    </Col>
                </Row>
            </SiteFixBottom>
        </>
    )
}

export default Appliance