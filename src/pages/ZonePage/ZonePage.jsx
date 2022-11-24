import React, { useState, useEffect } from 'react'
import { Select } from 'antd';
import axios from 'axios';
import { ImageMap } from '@qiuz/react-image-map';
import { useParams, Link } from 'react-router-dom'

function ZonePage() {
    const [selectData, setSelectData] = useState([{ label: "ทั้งหมด", value: "ทั้งหมด" }]);
    const [zoneData, setZoneData] = useState([]);
    const [zoneSelect, setZoneSelect] = useState([]);
    const { id } = useParams();
    const [plan, setPlan] = useState({ image: "", loading: "false" });
    const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
    useEffect(() => {
        getZone();
        getImagePlan();
        getZoneCategories();
    }, [])

    const getZone = () => {
        axios.get(`${BASE_URL_API}market/${id}/zone`).then(res => {
            setZoneData(res.data)
        }).catch(err => {
            console.error(err.response)
        })
    }
    const getImagePlan = () => {
        axios.get(`${BASE_URL_API}market/${id}/image-plan`).then(res => {
            setPlan(res.data);
        }).catch(err => {
            console.error(err.response)
        })
    }
    const getZoneCategories = () => {
        axios.get(`${BASE_URL_API}market/${id}/zone-categories`).then(res => {
            setSelectData([{ label: "ทั้งหมด", value: "ทั้งหมด" }]);
            const select = res.data.map(category => {
                return { label: category.category, value: category.category, zone_id: category.zone_id }
            })
            setSelectData(data => [...data, ...select]);
        })
    }
    const handleChange = (value) => {
        const zone_id = selectData.find((item) => item.value == value);
        setZoneSelect(zone_id);
    };
    return (
        <div className="container">
            <div className='py-3'>
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
        </div>
    )
}

export default ZonePage