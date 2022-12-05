import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom'
import ImageMapSection from '../../components/ImageMapSection/ImageMapSection';

function SectionPage() {
    const { id } = useParams();
    // const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
    // const getImagePlan = () => {
    //     axios.get(`${BASE_URL_API}upload/market/`).then(res => {
    //         console.log(res)
    //     })
    // }
    return (
        // <ImageMapSection />
        <h1>{id} ssss</h1>
    )
}

export default SectionPage