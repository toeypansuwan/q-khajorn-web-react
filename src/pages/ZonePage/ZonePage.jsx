import React, { lazy, useState, useEffect } from 'react'
import { Select } from 'antd';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'
import ImageMapSection from '../../components/ImageMapSection/ImageMapSection';
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
                    href: `/profile-market/${id}/section`
                }

            })
            setZoneData(mapArea)

            // console.log(mapArea)
        }).catch(err => {
            console.error(err.response)
        })
    }
    const getImagePlan = () => {
        axios.get(`${BASE_URL_API}market/${id}/image-plan`).then(res => {
            setPlan(i => { return { image: `${BASE_URL_API}upload/market/${res.data.image_plan}` } });
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

    return (
        <div className='h-zone-page'>
            <div className="h-15vh container py-3">
                <p>เลือกประเภทสินค้า</p>
                <Select
                    defaultValue={selectData[0].value}
                    style={{
                        width: '100%',
                    }}
                    onChange={handleChange}
                    options={selectData}
                />
            </div>
            <ImageMapSection plan={plan.image} mapArea={zoneData} />

        </div>
    )
}

export default ZonePage