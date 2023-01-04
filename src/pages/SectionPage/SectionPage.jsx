import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ImageMapSection from '../../components/ImageMapSection/ImageMapSection';
import moment from 'moment';
import th from 'moment/dist/locale/th';
import { Tabs } from 'antd';
import { Container, Badge } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react'
import SiteFixBottom from '../../components/SiteFixBottom/SiteFixBottom';
import './SectionPage.css'
moment.locale('th', th);

function SectionPage() {
    const { id } = useParams();
    const [itemsTab, setItemsTab] = useState([]);
    const dataFetchedRef = useRef(false);
    const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
    const [dataTopUp, setDataTopUp] = useState({});
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
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        configTaps();
    }, [])
    useEffect(() => {
        console.log("new", data);
    }, [data])

    const getLengthDayOfMonth = (date = null) => {
        let currentDay;
        if (date) {
            currentDay = moment(date);
        } else {
            currentDay = moment().startOf('day');
        }
        const endDayOfMonth = moment().endOf('month');
        // console.log("statt", currentDay.format("DD-MM-YYYY"), "end", endDayOfMonth.format("DD-MM-YYYY"))
        // .add(2, 'month')
        return endDayOfMonth.diff(currentDay, 'days');
    }
    const configTaps = async () => {
        const days = await getDays();
        try {
            for (let index = 0; index < getLengthDayOfMonth(); index++) {
                const day = new Date(moment(moment().startOf('day'), "DD-MM-YYYY").add(index, 'days').format('YYYY-MM-DD'))
                const isDay = day.toLocaleDateString('en', { weekday: 'long' });
                if (days.includes(isDay)) {
                    const { mapArea } = await getSection(day);
                    const plan = await getImagePlan();
                    setItemsTab(i => {
                        return [
                            ...i,
                            {
                                label: <DaysList days={day} />,
                                key: day,
                                children: <ImageMapSection plan={plan} mapArea={mapArea} className="h-70" onClick={onClickSection} onLoad={(s, e) => { console.log(e) }} />,
                            },
                        ]
                    })
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    const getMarkerDate = async (date) => {
        try {
            const days = await getDays();
            let data = [];
            for (let index = 0; index < getLengthDayOfMonth(date); index++) {
                const day = new Date(moment(date).add(index, 'days').format('YYYY-MM-DD'))
                const isDay = day.toLocaleDateString('en', { weekday: 'long' });
                if (days.includes(isDay)) {
                    const { mapArea } = await getSection(day);
                    data.push(...mapArea.map(i => ({ id: i.id, status: i.status, day: moment(i.day).format("YYYY-MM-DD"), color: i.preFillColor })))
                }
            }
            return data;
        } catch (err) {
            console.log(err)
        }
    }
    const getDays = async () => {
        try {
            const res = await axios.get(`${BASE_URL_API}market/${id}/open-days`)
            const days = res.data.map(i => i.dayname);
            return days;
        } catch (err) {
            console.log(err)
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
    const getSection = (d) => {
        const date = moment(d).format("YYYY-MM-DD")
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_URL_API}market/${id}/section`, { date }).then(res => {
                const mapArea = res.data.map((section) => {
                    const { id, color, name, points, shape, price, image, status } = section;
                    const polygon = points.map(p => {
                        const { axis_x, axis_y } = p;
                        return [axis_x, axis_y];
                    })
                    return {
                        id,
                        title: name,
                        price,
                        shape: shape,
                        fillColor: color,
                        strokeColor: "black",
                        preFillColor: color,
                        coords: polygon.flat(1),
                        polygon,
                        image,
                        status,
                        day: d
                    }
                })
                resolve({ mapArea });
            }).catch(err => {
                console.error(err.response)
                reject(err);
            })
        })
    }
    const closeTopUp = () => {
        setTopup(false)
    }
    const onClickSection = (e) => {
        setDataTopUp({
            id: e.id,
            title: e.title,
            image: `${BASE_URL_API}upload/market/${e.image}`,
            price: e.price,
            day: e.day
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
            <SiteFixBottom dataTopUp={dataTopUp} getMarkerDate={getMarkerDate} openTopup={topup} onCloseTopUp={closeTopUp} />
        </ >
    )
}

export default SectionPage