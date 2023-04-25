import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import ImageMapSection from '../../components/ImageMapSection/ImageMapSection';
import moment from 'moment';
import th from 'moment/dist/locale/th';
import { getDays, getLengthDayOfMonth, getMarkerDate, getSection, BASE_URL_API } from '../../services/services'
import { Tabs, Alert } from 'antd';
import { Container, Button } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import SiteFixBottom from '../../components/SiteFixBottom/SiteFixBottom';
import { useDispatch, useSelector } from 'react-redux';
import { setIdZone } from '../../reducers/reserveSlice';
import './SectionPage.css'
moment.locale('th', th);

function SectionPage() {
    const { id } = useParams();
    const [itemsTab, setItemsTab] = useState([]);
    const dataFetchedRef = useRef(false);
    const [dataTopUp, setDataTopUp] = useState({});
    const dispatch = useDispatch()
    const reserveStore = useSelector(state => ({ ...state.reserveStore }));
    const [notification, setNotification] = useState([])
    const [topup, setTopup] = useState(false);
    const getImagePlan = async () => {
        try {
            const res = await axios.get(`${BASE_URL_API}market/${id}/image-plan-zone`)
            const plan = await res.data.image_plan
            return `${BASE_URL_API}upload/market/${plan}`;
        } catch (err) {
            console.log(err)
        }
    }
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }
    useEffect(() => {
        dispatch(setIdZone(id));
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        configTaps();
        getNotificationOrder();
        return () => {
            setItemsTab([]);
        }
    }, [])

    const configTaps = async () => {
        const days = await getDays(id);
        try {
            const items = [];
            for (let index = 0; index < getLengthDayOfMonth(); index++) {
                const day = new Date(moment(moment().startOf('day'), "DD-MM-YYYY").add(index, 'days').format('YYYY-MM-DD'))
                const isDay = day.toLocaleDateString('en', { weekday: 'long' });
                if (days.includes(isDay)) {
                    const { mapArea } = await getSection({ d: day, id });
                    const plan = await getImagePlan();
                    items.push({
                        label: (<DaysList days={day} />),
                        key: day,
                        children: (<ImageMapSection type="section" plan={plan} mapArea={mapArea} className="h-70" onClick={onClickSection} fullscreen={true} onLoad={(s, e) => { }} />),
                    });
                }
            }
            setItemsTab(items)
        } catch (err) {
            console.error(err)
        }
    }

    const DaysList = (props) => {
        return (
            <div className="text-center">
                <span className='text-muted'>{moment(props.days).format('dd')}</span>
                <p className='h4 mb-0'>{moment(props.days).format('D')}</p>
                <span className='text-muted'>{moment(props.days).format('MMM')}</span>
            </div>
        )
    };
    const closeTopUp = () => {
        setTopup(false)
    }
    const onClickSection = (e) => {
        setDataTopUp({
            id: e.id,
            title: e.title,
            image: `${BASE_URL_API}upload/market/${e.image}`,
            price: e.price,
            day: e.day,
            status: e.status,
            order_id: e.order_id,
        })
        setTopup(true)
    }

    const onChangeTab = (e) => {
        closeTopUp();
    }
    const getNotificationOrder = async () => {
        try {
            const lineId = (await liff.getProfile()).userId;
            const data = (await axios.post(`${BASE_URL_API}order/notification/`, { lineId })).data
            setNotification(data);
        } catch (err) {
            console.error(err.response.data);
        }

    }
    const onRequestNotification = async () => {
        const { order_id, id, day } = dataTopUp;
        if (!order_id) {
            return;
        }
        try {
            const lineId = (await liff.getProfile()).userId
            const res = await (await axios.post(`${BASE_URL_API}order/notification/${order_id}`, { lineId, id, date: moment(day).format('YYYY-MM-DD') })).data
            if (res.res_code == 200) {
                setNotification((prev) => [
                    ...prev, res.notification
                ]);
            }
        } catch (err) {
            console.error(err.response.data)
        }

    }
    const onRemoveNotification = async (id) => {
        const notificationFindId = notification.find(noti => noti.order_id === id)
        try {
            const data = (await axios.delete(`${BASE_URL_API}order/notification/${notificationFindId.id}/delete`)).data
            if (data.res_code == 200)
                setNotification(prev => prev.filter(noti => noti.id != notificationFindId.id))
        } catch (err) {
            console.error(err.response)
        }
    }

    return (
        <>
            <Container className='pt-3'>
                <div className=" position-relative">
                    <button onClick={handleBack} className='btn position-absolute start-0 top-50 translate-middle-y'><Icon icon="eva:arrow-ios-back-fill" className='fs-3' /></button>
                    <h3 className='text-center'>เลือกแผง</h3>
                </div>
            </Container>
            <div className="position-relative">
                <Tabs
                    defaultActiveKey="1"
                    tabPosition='top'
                    style={{
                        height: `100%`,
                        background: '#F1F5FA',
                    }}
                    destroyInactiveTabPane
                    onChange={onChangeTab}
                    items={itemsTab}
                >
                    {itemsTab.sort((a, b) => new Date(a.key) - new Date(b.key)).map((tab) => (
                        <Tabs.TabPane tab={tab.title} key={tab.key}>
                            {tab.children}
                        </Tabs.TabPane>
                    ))}
                </Tabs>
                <div style={{ top: 80 }} className=" position-absolute start-0 w-100 p-3">
                    <Alert message="คุณสามารถลากนิ้วเพื่อย่อขยายได้" type="info" closable />
                </div>
            </div>


            <SiteFixBottom dataTopUp={dataTopUp} getMarkerDate={getMarkerDate} openTopup={topup} onCloseTopUp={closeTopUp} onClickNotification={onRequestNotification} onRemoveNotification={() => onRemoveNotification(dataTopUp.order_id)} notifications={notification}>
                <LinkContainer slot='buttonNext' to={`/profile-market/${id}/section/appliance`}>
                    <Button className={`w-100 `} disabled={reserveStore.data.length < 1}>ทำการจอง</Button>
                </LinkContainer>
            </SiteFixBottom>
        </ >
    )
}

export default SectionPage
