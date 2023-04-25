import React, { useState, useEffect } from 'react'
import { Alert, Select } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'
import ImageMapSection from '../../components/ImageMapSection/ImageMapSection';
import { Icon } from '@iconify/react'
import "./ZonePage.css"

function ZonePage() {
    const [selectData, setSelectData] = useState([{ label: "ทั้งหมด", value: "ทั้งหมด" }]);
    const [zoneData, setZoneData] = useState([]);
    const { id } = useParams();
    const [plan, setPlan] = useState({});
    const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
    useEffect(() => {
        getZone();
        getImagePlan();
        getZoneCategories();
    }, [])
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }
    const getZone = (category_id = null) => {
        axios.post(`${BASE_URL_API}market/${id}/zone`, { category_id }).then(res => {
            const mapArea = res.data.map((zone) => {
                const { id, color, name, points, shape } = zone;
                const polygon = points.map(p => {
                    const { axis_x, axis_y } = p;
                    return [axis_x, axis_y];
                })
                return {
                    id,
                    title: name,
                    shape: shape,
                    fillColor: color,
                    strokeColor: "black",
                    preFillColor: color,
                    coords: polygon.flat(1),
                    polygon,
                }

            })
            setZoneData(mapArea)
        }).catch(err => {
            console.error(err.response)
        })
    }
    const getImagePlan = () => {
        axios.get(`${BASE_URL_API}market/${id}/image-plan-market`).then(res => {
            setPlan({ image: `${BASE_URL_API}upload/market/${res.data.image_plan}` });
        }).catch(err => {
            console.error(err.response)
        })
    }
    const getZoneCategories = () => {
        axios.get(`${BASE_URL_API}market/${id}/zone-categories`).then(res => {
            const select = res.data.map(category => {
                return { label: category.category, value: category.id }
            })
            setSelectData([{ label: "ทั้งหมด", value: "" }, ...select]);
        })
    }
    const handleChange = (category_id) => {
        if (!category_id) {
            getZone();
            return;
        }
        getZone(category_id);
    };
    const onChangePage = (e) => {
        navigate(`/profile-market/${e.id}/section`)
    }

    return (
        <div className='h-zone-page'>
            <div className="h-15vh container py-3 shadow-sm border border-bottom">
                <div className=" position-relative mb-3">
                    <button onClick={handleBack} className='btn position-absolute start-0 top-50 translate-middle-y'><Icon icon="eva:arrow-ios-back-fill" className='fs-3' /></button>
                    <h3 className='text-center'>เลือกโซน</h3>
                </div>

                <h5>เลือกประเภทสินค้า</h5>
                <Select
                    defaultValue={selectData[0].value}
                    style={{
                        width: '100%',
                    }}
                    onChange={handleChange}
                    options={selectData}
                />
                <Alert className='mt-3' message="คุณสามารถกดเลือกโซนบนผังตลาดได้" type="info" closable />
            </div>
            <ImageMapSection plan={plan.image} mapArea={zoneData} type="zone" onClick={onChangePage} fullscreen={true} className="h-85vh" />

        </div >
    )
}

export default ZonePage