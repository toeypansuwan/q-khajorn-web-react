import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ImageMapSection from '../../components/ImageMapSection/ImageMapSection';
import { Icon } from '@iconify/react'
import moment from 'moment';
import th from 'moment/dist/locale/th';
import { Tabs } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './SectionPage.css'
moment.locale('th', th);

function SectionPage() {
    const { id } = useParams();
    const [itemsTab, setItemsTab] = useState([]);
    const dataFetchedRef = useRef(false);
    const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
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
        getDays()
    }, [])


    const getLengthDayOfMonth = () => {
        const currentDay = moment().startOf('day');
        const endDayOfMonth = moment().endOf('month');
        return endDayOfMonth.diff(currentDay, 'days');
    }
    const getDays = () => {
        console.log("scsds")
        axios.get(`${BASE_URL_API}market/${id}/open-days`).then(res => {
            const days = res.data.map(i => i.dayname);
            for (let index = 0; index < getLengthDayOfMonth(); index++) {
                const day = new Date(moment(moment().startOf('day'), "DD-MM-YYYY").add(index, 'days').format('YYYY-MM-DD'))
                const isDay = day.toLocaleDateString('en', { weekday: 'long' });
                if (days.includes(isDay)) {
                    getSection(day);
                }
            }
        })
    }
    const DaysList = (props) => {
        return (
            <div className="text-center">
                <span className='text-secondary'>{moment(props.days).format('dd')}</span>
                <p className='h4'>{moment(props.days).format('D')}</p>
            </div>
        )
    };
    const getSection = (d) => {
        const date = moment(d).format("YYYY-MM-DD")
        axios.post(`${BASE_URL_API}market/${id}/section`, { date }).then(res => {
            const mapArea = res.data.map((section) => {
                const { id, color, name, points, shape, price } = section;
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
                }
            })
            setTab(d, mapArea);
        }).catch(err => {
            console.error(err.response)
        })
    }
    const setTab = async (day, mapArea) => {
        try {
            const plan = await getImagePlan();
            setItemsTab(i => {
                return [
                    ...i,
                    {
                        label: <DaysList days={day} />,
                        key: i,
                        children: <ImageMapSection plan={plan} mapArea={mapArea} className="h-70" onClick={e => { console.log(e) }} onLoad={(s, e) => { console.log(e) }} />,

                    }
                ]
            })
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <div className="container pt-4" >
                <div className=" position-relative">
                    <button onClick={handleBack} className='btn position-absolute start-0 top-50 translate-middle-y'><Icon icon="eva:arrow-ios-back-fill" className='fs-3' /></button>
                    <h3 className='text-center'>เลือกแผง</h3>
                </div>
            </div >
            <Tabs
                defaultActiveKey="1"
                tabPosition='top'
                style={{
                    height: `100%`,
                    background: '#F1F5FA',
                }}
                items={itemsTab}
            />
            <div className="position-fixed bottom-0 start-0 w-100 bg-white">
            </div>
        </ >
    )
}

export default SectionPage