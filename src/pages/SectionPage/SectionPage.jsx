import axios from 'axios';
import React, { useState, useEffect, useRef, lazy } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ImageMapSection from '../../components/ImageMapSection/ImageMapSection';
import moment from 'moment';
import th from 'moment/dist/locale/th';
import { getDays, getLengthDayOfMonth, getMarkerDate, getSection, BASE_URL_API } from '../../services/services'
import { Tabs } from 'antd';
import { Container, Button } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react'
import SiteFixBottom from '../../components/SiteFixBottom/SiteFixBottom';
// const SiteFixBottom = lazy(() => import('../../components/SiteFixBottom/SiteFixBottom'))
import { useDispatch } from 'react-redux';
import { setIdZone } from '../../reducers/reserveSlice';
import './SectionPage.css'
moment.locale('th', th);

function SectionPage() {
    const { id } = useParams();
    const [itemsTab, setItemsTab] = useState([]);
    const dataFetchedRef = useRef(false);
    const [dataTopUp, setDataTopUp] = useState({});
    const dispatch = useDispatch()
    const [data, setData] = useState([{
        id: 1,
        title: "a1",
        days: [],
    }])
    const [topup, setTopup] = useState(false);
    const [daySelect, setDaySelect] = useState("");
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
    }, [])
    useEffect(() => {
        // console.log("new", data);
    }, [data])

    const configTaps = async () => {
        const days = await getDays(id);
        try {
            for (let index = 0; index < getLengthDayOfMonth(); index++) {
                const day = new Date(moment(moment().startOf('day'), "DD-MM-YYYY").add(index, 'days').format('YYYY-MM-DD'))
                const isDay = day.toLocaleDateString('en', { weekday: 'long' });
                if (days.includes(isDay)) {
                    const { mapArea } = await getSection({ d: day, id });
                    const plan = await getImagePlan();
                    setItemsTab(i => {
                        return [
                            ...i,
                            {
                                label: <DaysList days={day} />,
                                key: day,
                                children: <ImageMapSection type="section" plan={plan} mapArea={mapArea} className="h-70" onClick={onClickSection} onLoad={(s, e) => { console.log(e) }} />,
                            },
                        ]
                    })
                }
            }
        } catch (err) {
            console.error(err)
        }
    }


    const DaysList = (props) => {
        return (
            <div className="text-center">
                <span className='text-secondary'>{moment(props.days).format('dd')}</span>
                <p className='h4 mb-0'>{moment(props.days).format('D')}</p>
                {/* <span className='text-secondary'>{moment(props.days).format('MMM')}</span> */}
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
        })
        setTopup(true)
    }
    const onChangeTab = (e) => {
        closeTopUp();
        setDaySelect(e);
    }
    return (
        <>
            <Container className='pt-3'>
                <div className=" position-relative">
                    <button onClick={handleBack} className='btn position-absolute start-0 top-50 translate-middle-y'><Icon icon="eva:arrow-ios-back-fill" className='fs-3' /></button>
                    <h3 className='text-center'>เลือกแผง</h3>
                </div>
            </Container>
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
            <SiteFixBottom dataTopUp={dataTopUp} getMarkerDate={getMarkerDate} openTopup={topup} onCloseTopUp={closeTopUp} >
                <Button slot='buttonNext' as={Link} to={`/profile-market/${id}/section/appliance`} className='w-100'>ทำการจอง</Button>
            </SiteFixBottom>
        </ >
    )
}

export default SectionPage