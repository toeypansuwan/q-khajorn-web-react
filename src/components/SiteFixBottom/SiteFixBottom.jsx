import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReserve, editReserve, removeReserve } from '../../reducers/reserveSlice';
import { Card, Container, Row, Col, Button, ListGroup, Stack } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { Image, Drawer, Space, Skeleton } from 'antd';
import { Icon } from '@iconify/react'
import moment from 'moment';
import { Calendar } from 'react-calendar'
import { v4 as uuisv4 } from 'uuid';
import 'react-calendar/dist/Calendar.css';
import './SiteFixBottom.css'
import { useRef } from 'react';
import { BASE_URL_API, binarySearch, fallbackImage as fallbackImg } from '../../services/services'
import axios from 'axios';
import liff from '@line/liff';

function SiteFixBottom({
    openTopup,
    onCloseTopUp,
    dataTopUp,
    getMarkerDate,
    notifications,
    onClickNotification,
    onRemoveNotification,
    children
}) {
    const childs = React.Children.toArray(children);
    const buttonNext = childs.find(child => child.props.slot === 'buttonNext');

    const [isShowCart, setIsShowCart] = useState(false)
    const [isShowTopUp, setIsShowTopUp] = useState(false)
    const [data, setData] = useState({})
    const { reserveStore } = useSelector(state => ({ ...state }))
    const [markerDate, setMarkerDate] = useState([]);
    const setMarkerId = useRef([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const dateFree = useRef([])
    const dateSelect = useRef([])

    const selectedStore = useMemo(() => {
        if (dataTopUp) {
            const data = reserveStore.data.find(item => item.id == dataTopUp.id)
            if (data) {
                setData(data)
                return true;
            }
            setData({
                id: dataTopUp.id,
                title: dataTopUp.title,
                price: dataTopUp.price,
                image: dataTopUp.image,
                days: [
                    dataTopUp.day
                ]
            })
            return false;
        }
        return false
    }, [reserveStore.data, dataTopUp])
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setLoading(true);
        const fetchMarketData = async () => {
            if (reserveStore.id_zone != null && openTopup) {
                const data = await getMarkerDate({ id_zone: reserveStore.id_zone })
                setLoading(false);
                setMarkerDate(data);
            }
        }
        fetchMarketData();
    }, [openTopup]);
    useEffect(() => {
        dateFree.current = [];
        const filterId = markerDate.filter(i => i.id === dataTopUp.id)
        setMarkerId.current = filterId.sort((a, b) => moment(a.day) - moment(b.day))

    }, [markerDate])
    useEffect(() => {
        setIsShowTopUp(openTopup)
    }, [openTopup])
    const style = {
        topBorderSiteMenu: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden'
        }
    }
    const onClose = () => {
        dateFree.current = [];
        setOpen(false)
    }
    const handleSelectRange = (range) => {
        const sortRange = range.sort((a, b) => a - b)
        const selectDays = dateFree.current.filter(i => moment(i.day) >= sortRange[0] && moment(i.day) <= sortRange[1])
        dateSelect.current = selectDays;
    }
    const onClickOk = () => {
        // console.log(data, "sss")
        if (!selectedStore && data.days.length > 0) {
            dispatch(addReserve({
                id: data.id,
                title: data.title,
                image: data.image,
                price: data.price,
                days: data.days.map(i => moment(i).format('YYYY-MM-DD').toString())
            }))
            onCloseTopUp();
            return;
        }
        dispatch(editReserve({
            id: data.id,
            title: data.title,
            price: data.price,
            image: data.image,
            days: [...data.days, moment(dataTopUp.day).format('YYYY-MM-DD').toString()]
        }))
        onCloseTopUp();
    }
    const tileContent = ({ date, view }) => {
        if (moment(date).isAfter(moment().endOf('month').add(1, 'month'))) {
            return null;
        }
        const index = binarySearch(setMarkerId.current, moment(date).format('YYYY-MM-DD'), 'day')
        const marker = setMarkerId.current[index]
        if (view === 'month' && marker && marker?.status == 1) {
            const dateFreeIndex = binarySearch(dateFree.current, moment(marker.day).format('YYYY-MM-DD'), 'day')
            if (!dateFree.current[dateFreeIndex]) {
                dateFree.current.push(marker);
            }
            return (<span className='status status__success'></span>)
        } else if (view === 'month' && marker && marker?.status == 0) {
            return (<span className='status status__danger'></span>)
        }
        else if (view === 'month' && marker && marker?.status == 2) {
            return (<span className='status status__warning'></span>)
        }
        else {
            return null
        }
    }
    const onOk = () => {
        console.log("ok")
        setData(prev => ({
            ...prev,
            days: dateSelect.current.map(i => moment(i.day).toDate())
        }))
        onClose();
    }
    const updateStore = () => {
        const dataNew = {
            ...data,
            days: data.days.map(d => moment(d).format('YYYY-MM-DD'))
        }
        dispatch(editReserve(dataNew))
        onCloseTopUp()
    }
    const removeStore = (id) => {
        dispatch(removeReserve(id))
    }

    return (
        <div className={`position-fixed start-0 bottom-0 w-100 bg-white shadow-custom ${isShowCart ? 'position-fixed start-0 bottom-0' : 'position-relative'}`} style={{ zIndex: 10 }}>
            <Container className='py-3'>
                <Row className=' align-items-center' >
                    <Col xs={'auto'}><h5>แผงที่เลือกไว้</h5></Col>
                    <Col className='text-end'>
                        <div onClick={() => { setIsShowCart(!isShowCart) }} type="button" data-bs-toggle="collapse" data-bs-target="#listCart" aria-expanded="false" aria-controls="listCart">
                            <span className='me-2'>{reserveStore.data?.length || 0} แผง</span>
                            <Icon className={`fs-1 icon group-collapse ${isShowCart ? 'rotate-icon' : ''}`} icon='akar-icons:chevron-down' />
                        </div>
                    </Col>
                </Row>
                <div className="collapse py-3 overflow-scroll" id="listCart">
                    <Stack gap={3}>
                        {reserveStore.data?.map((item) => {
                            return (
                                <Card key={item.id}>
                                    <Card.Body className="bg-white">
                                        <Row className='align-items-center'>
                                            <Col xs={4}>
                                                <div className="box_image">
                                                    <Image className='rounded' fallback={fallbackImg} src={item.image} />
                                                </div>
                                            </Col>
                                            <Col>
                                                <h3>แผงที่ {item.title}</h3>
                                                <h5><strong>{item.price}</strong><small> บาท *{item.days.length}</small></h5>
                                            </Col>
                                            <Col xs={'auto'}>
                                                <Icon onClick={() => { removeStore(item.id) }} icon='ic:baseline-delete-outline' className='fs-1 text-secondary' />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>
                                                    <div className="d-flex gap-2 align-items-center flex-wrap">
                                                        <span>วันจอง</span>
                                                        {item.days.map(date => (<span key={uuisv4()} className=' rounded border px-2'>{moment(date).format('D MMM')}</span>))}
                                                    </div>
                                                </Col>
                                                {/* <Col xs={'auto'}>
                                                <Icon icon='uil:calender' className='fs-3' onClick={() => { setOpen(true) }} />
                                            </Col> */}
                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            )
                        })}
                    </Stack>
                </div>
                <hr />
                <Row className=' align-items-center mb-3'>
                    <Col xs={'auto'}>
                        <p className='h5'>ราคาค่าแผงทั้งหมด : </p>
                    </Col>
                    <Col className='text-end'>
                        <h3 className='text-secondary'>{
                            reserveStore.data.reduce((total, cur) => {
                                const days = cur.days.length;
                                const appliPrice = reserveStore.services.appliances.reduce((totalAppli, curAppli) => totalAppli + curAppli.price * curAppli.amount, 0) * days
                                const service = reserveStore.services.service.price * days;
                                return (total + cur.price * days + appliPrice + service);
                            }, 0).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

                            // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }บาท</h3>

                        {console.log(reserveStore.data.reduce((total, cur) => {
                            const days = cur.days.length;
                            const appliPrice = reserveStore.services.appliances.reduce((totalAppli, curAppli) => totalAppli + curAppli.price * curAppli.amount, 0) * days
                            const service = reserveStore.services.service.price * days;
                            return (total + cur.price * days + appliPrice + service);
                        }, 0))}
                    </Col>
                </Row>
                {buttonNext}
            </Container>
            {isShowTopUp ?
                <div className="top-up bg-white">
                    <Container className='py-3'>
                        <Row className='align-items-center'>
                            <Col xs={4}>
                                <div className="box_image">
                                    <Image className='rounded' rootClassName='h-100' fallback={fallbackImg} width={'100%'} src={dataTopUp.image} />
                                </div>
                            </Col>
                            <Col>
                                <h3>แผงที่ {dataTopUp.title}</h3>
                                <h5><strong>{dataTopUp.price}</strong><small> บาท/วัน</small></h5>
                            </Col>
                            {dataTopUp.status == 1 ? <Col xs={'auto'}>
                                {selectedStore && data.days.some(i => moment(i).format('YYYY-MM-DD') === moment(dataTopUp.day).format('YYYY-MM-DD'))
                                    ? <Button variant="outline-secondary" onClick={() => { updateStore() }}>แก้ไข</Button>
                                    : <Icon icon='akar-icons:circle-check' className='fs-1 text-success' onClick={onClickOk} />}
                            </Col> : (dataTopUp.status == 2) ? <Col xs={'auto'}>
                                {
                                    !notifications.some(notification => notification.order_id == dataTopUp.order_id) ? <Icon icon='mdi:bell-notification-outline' onClick={onClickNotification} className='fs-1 text-warning' /> : <Icon icon='mdi:bell-notification' onClick={onRemoveNotification} className='fs-1 text-muted' />
                                }
                            </Col> : null}
                            <Col xs={'auto'}>
                                <Icon onClick={onCloseTopUp} icon='ion:close' className='fs-1 text-black-50' />
                            </Col>
                        </Row>
                        {
                            dataTopUp.status == 1 ?
                                (
                                    <>
                                        <hr />
                                        <Skeleton loading={loading} active title={null} paragraph={{ rows: 1 }}>
                                            <Row>
                                                <Col>
                                                    <div className="d-flex gap-2 align-items-center flex-wrap">
                                                        <span>วันจอง</span>
                                                        {
                                                            data.days.map(item => (<span key={uuisv4()} className=' rounded border-primary border px-2'>{moment(item).format('D MMM')}</span>))
                                                        }
                                                    </div>
                                                </Col>
                                                <Col xs={'auto'}>
                                                    <Icon icon='uil:calender' className='fs-3 text-secondary' onClick={() => { setOpen(true) }} />
                                                </Col>
                                            </Row>
                                        </Skeleton>
                                    </>
                                ) : null
                        }
                    </Container>

                    <Drawer
                        title="วันจอง"
                        placement="bottom"
                        height='auto'
                        contentWrapperStyle={{ ...style.topBorderSiteMenu }}
                        onClose={onClose}
                        bodyStyle={{ paddingTop: 8 }}
                        open={open}
                        closable={false}
                        extra={
                            <Space>
                                <Button variant='outline-secondary' onClick={onClose}>ยกเลิก</Button>
                                <Button variant="secondary" onClick={onOk}>
                                    ตกลง
                                </Button>
                            </Space>
                        }
                    >
                        <Calendar
                            selectRange={true}
                            onChange={handleSelectRange}
                            tileContent={tileContent}
                            minDate={
                                new Date()
                            }
                        />
                        <div className="d-flex gap-3 justify-content-center mt-3">
                            <span className='text-muted before_status before_success'>
                                แผงว่าง
                            </span>
                            <span className='text-muted before_status before_danger'>
                                แผงไม่ว่าง
                            </span>
                            <span className='text-muted before_status before_warning'>
                                แผงรอชำระเงิน
                            </span>
                        </div>
                    </Drawer>
                </div> : null}
        </div>
    )
}
const sectionType = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.number,
    day: PropTypes.instanceOf(Date),
    status: PropTypes.number,
})

SiteFixBottom.propTypes = {
    openTopup: PropTypes.bool,
    onCloseTopUp: PropTypes.func,
    dataStore: PropTypes.arrayOf(sectionType),
    dataTopUp: sectionType,
}
export default SiteFixBottom