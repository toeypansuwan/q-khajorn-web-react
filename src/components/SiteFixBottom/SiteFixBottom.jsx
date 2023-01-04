import React, { useEffect, useState, useMemo, startTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { Image, Drawer, Space, theme } from 'antd';
import { Icon } from '@iconify/react'
import moment from 'moment';
import { Calendar } from 'react-calendar'
import { v4 as uuisv4 } from 'uuid';
import 'react-calendar/dist/Calendar.css';
import './SiteFixBottom.css'
import { addReserve, editReserve, removeReserve } from '../../reducers/reserveSlice';
import { useRef } from 'react';


function SiteFixBottom({
    openTopup,
    onCloseTopUp,
    dataTopUp,
    getMarkerDate
}) {
    const [isShowCart, setIsShowCart] = useState(false)
    const [isShowTopUp, setIsShowTopUp] = useState(false)
    const [data, setData] = useState({})
    const { reserveStore } = useSelector(state => ({ ...state }))
    const [markerDate, setMarkerDate] = useState([]);
    const setMarkerId = useRef([]);
    const dispatch = useDispatch()
    const dateFree = useRef([])
    const dateSelect = useRef([])
    const fallbackImg = "data:image/png;base64,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";
    const selectedStore = useMemo(() => {
        const data = reserveStore.data.find(item => item.id == dataTopUp.id)
        if (data) {
            setData(data)
            return true;
        }
        setData({
            id: dataTopUp.id,
            title: dataTopUp.title,
            price: dataTopUp.price,
            days: [
                dataTopUp.day
            ]
        })
        return false;
    }, [reserveStore.data, dataTopUp])
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const fetchMarketData = async () => {
            const data = await getMarkerDate()
            setMarkerDate(data);
        }
        fetchMarketData();
    }, []);
    useEffect(() => {
        const filterId = markerDate.filter(i => i.id === dataTopUp.id)
        setMarkerId.current = filterId.sort((a, b) => moment(a.day) - moment(b.day))
    }, [dataTopUp])
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
        setOpen(false)
    }
    const handleSelectRange = (range) => {
        const sortRange = range.sort((a, b) => a - b)
        const selectDays = dateFree.current.filter(i => moment(i.day) >= sortRange[0] && moment(i.day) <= sortRange[1])
        dateSelect.current = selectDays;
    }
    const onClickOk = () => {
        if (!selectedStore) {
            dispatch(addReserve({
                id: data.id,
                title: data.title,
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
            days: [...data.days, moment(dataTopUp.day).format('YYYY-MM-DD').toString()]
        }))
        onCloseTopUp();
    }
    const [dateA, setDateA] = useState(moment().add(1, 'day').toDate());

    const highlightDay = (day) => {
        if (day.date === date.getDate()) {
            return <p>{day.getDate()}</p>;
        }
    }
    function binarySearch(array, target, prop) {
        // Initialize the start and end indices of the search range
        let start = 0;
        let end = array.length - 1;

        // Iterate until the start and end indices meet
        while (start <= end) {
            // Calculate the midpoint of the search range
            const mid = Math.floor((start + end) / 2);

            // If the target is less than the value of the specified property at the midpoint, update the end index
            if (target < array[mid][prop]) {
                end = mid - 1;
            }
            // If the target is greater than the value of the specified property at the midpoint, update the start index
            else if (target > array[mid][prop]) {
                start = mid + 1;
            }
            // If the target is equal to the value of the specified property at the midpoint, return the midpoint index
            else {
                return mid;
            }
        }

        // If the target is not found, return -1
        return -1;
    }
    const tileContent = ({ date, view }) => {
        if (moment(date).isAfter(moment().endOf('month'))) {
            return null;
        }
        const index = binarySearch(setMarkerId.current, moment(date).format('YYYY-MM-DD'), 'day')
        const marker = setMarkerId.current[index]
        if (view === 'month' && marker && marker?.status) {
            const check = binarySearch(dateFree.current, moment(marker.day).format('YYYY-MM-DD'), 'day')
            if (!dateFree.current[check]) {
                dateFree.current.push(marker);
            }
            return (<span className='status status__success'></span>)
        } else if (view === 'month' && marker && !marker?.status) {
            return (<span className='status status__danger'></span>)
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
    return (
        <div className={`w-100 bg-white shadow-custom ${isShowCart ? 'position-fixed start-0 bottom-0' : 'position-relative'}`} style={{ zIndex: 10 }}>
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
                <div className="collapse py-3" id="listCart">
                    {reserveStore.data?.map((item) => {
                        return (
                            <div className="card card-body" key={uuisv4()}>
                                แผงที่ {item.title}<br />
                                {item.price} บาท *{item.days.length}
                            </div>
                        )
                    })}
                </div>
                <hr />
                <Row className=' align-items-center mb-3'>
                    <Col xs={'auto'}>
                        <p className='h5'>ราคาค่าแผงทั้งหมด : </p>
                    </Col>
                    <Col className='text-end'>
                        <h3>{reserveStore.data.reduce((total, cur) => total + cur.price * cur.days.length, 0)} บาท</h3>
                    </Col>
                </Row>
                <Button className='w-100'>ทำการจอง</Button>
            </Container>
            {isShowTopUp ?
                <div className="top-up bg-white">
                    {/* {cardActive} */}
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
                            <Col xs={'auto'}>
                                {selectedStore && data.days.some(i => moment(i).format('YYYY-MM-DD') === moment(dataTopUp.day).format('YYYY-MM-DD'))
                                    ? <Button variant="outline-secondary" onClick={() => { updateStore() }}>แก้ไข</Button>
                                    : <Icon icon='akar-icons:circle-check' className='fs-1 text-success' onClick={onClickOk} />}
                            </Col>
                            <Col xs={'auto'}>
                                <Icon onClick={onCloseTopUp} icon='ion:close' className='fs-1 text-secondary' />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <div className="d-flex gap-2 align-items-center flex-wrap">
                                    <span>วันจอง</span>
                                    {data.days.map(item => (<span key={uuisv4()} className=' rounded border px-2'>{moment(item).format('D MMM')}</span>))
                                        // : (<span className=' rounded border px-2'>{moment(dataTopUp.day).format('D MMM')}</span>)}
                                        // : <span className='px-2 text-secondary'>ไม่มี</span>
                                    }
                                </div>
                            </Col>
                            <Col xs={'auto'}>
                                <Icon icon='uil:calender' className='fs-3' onClick={() => { setOpen(true) }} />
                            </Col>
                        </Row>
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
                                <Button type="primary" onClick={onOk}>
                                    ตกลง
                                </Button>
                            </Space>
                        }
                    >
                        <Calendar
                            selectRange={true}
                            // value={dateA}
                            onChange={handleSelectRange}
                            // view === 'month' && date.getDay() === 0 ? <p>Sunday</p> : null
                            tileContent={tileContent}
                            minDate={
                                new Date()
                            }
                        />
                        <div className="d-flex gap-3 justify-content-center mt-3">
                            <span className='text-secondary before_status before_success'>
                                แผงว่าง
                            </span>
                            <span className='text-secondary before_status before_danger'>
                                แผงไม่ว่าง
                            </span>
                        </div>
                    </Drawer>
                </div> : <></>}
        </div>
    )
}
const sectionType = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.number,
    day: PropTypes.instanceOf(Date),
})

SiteFixBottom.propTypes = {
    openTopup: PropTypes.bool,
    onCloseTopUp: PropTypes.func,
    dataStore: PropTypes.arrayOf(sectionType),
    dataTopUp: sectionType,
}
export default SiteFixBottom