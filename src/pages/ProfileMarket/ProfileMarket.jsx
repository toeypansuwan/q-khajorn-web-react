import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import { useEffect } from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { nameDaysFormat } from '../../services/services'
import { useDispatch } from 'react-redux';
import { setIdMarket } from '../../reducers/reserveSlice';
import DOMPurify from 'dompurify';

import "swiper/css/pagination";
import "swiper/css";
import "./ProfileMarket.css";
import moment from 'moment'
import th from 'moment/dist/locale/th';
moment.locale('th', th);

function ProfileMarket() {
    const dispatch = useDispatch();
    const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
    const { id } = useParams();
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }
    const dataInterface = {
        galleries: [],
        marketDays: []
    }

    const [profileData, setProfileData] = useState(dataInterface)
    const [loadData, setLoadData] = useState(false)

    useEffect(() => {
        getProfile();
        dispatch(setIdMarket(id));
    }, [])

    const getProfile = () => {
        axios.get(`${BASE_URL_API}market/${id}`).then(res => {
            setProfileData(res.data);
            setLoadData(true)
        }).catch((err) => {
            console.error(err.respone.message)
        })
    }
    const listGalleries = profileData.galleries.map((gallery) => {
        return (
            <SwiperSlide className='img-slider' key={uuidv4()}>
                <img className='' src={`${BASE_URL_API}upload/market/${gallery.image}`} alt="" />
            </SwiperSlide>
        )
    })
    const listDays = profileData.marketDays.map((day, i) => {
        const dayNameTH = nameDaysFormat(day.dayname);
        if (i < profileData.marketDays.length) {
            `วัน${dayNameTH} -`
        }
        return `วัน${dayNameTH}`;
    })

    return (
        <div className='h-screen flex-col flex justify-between'>
            {!loadData ? null : (
                <div className="detail__market">
                    <Swiper
                        className="mySwiper"
                        modules={[Pagination, Autoplay]}
                        pagination={{
                            type: "fraction",
                            horizontalClass: "text-end p-3 text-white fw-bold shadow"
                        }}
                        autoplay={{
                            delay: 5000,
                        }}
                    >
                        <SwiperSlide className='img-slider'>
                            <img className='' src={`${BASE_URL_API}upload/market/${profileData.image}`} alt="" />
                        </SwiperSlide>
                        {loadData ? listGalleries : null}
                    </Swiper>

                    <div className="py-3 container">
                        <h2 className='mb-3'>{profileData.name}</h2>
                        <div className="row mb-3">
                            <div className="col">
                                <p>เปิด {listDays}<br />เวลา {`${moment(profileData.time_open, 'th').format('LT')} - ${moment(profileData.time_close, 'th').format('LT')} น.`}</p>
                            </div>
                            <div className="col-4 text-end">
                                <p className='mb-0'>ราคาเริ่มต้น</p>
                                <h5 className='fw-bold text-dark'>{profileData.min} บาท</h5>
                            </div>
                        </div>
                        <div className="content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(profileData.detail) }}>

                        </div>
                        <div className="position-fixed bottom-0 bg-white shadow-lg start-0 w-100">
                            <Container className='py-3'>
                                <div className="row ">
                                    <div className="col-4">
                                        <Button variant="outline-primary" className='w-100' onClick={handleBack}>ย้อนกลับ</Button>
                                    </div>
                                    <div className="col-8">
                                        <Link to={`/profile-market/${id}/zone`}><Button variant="primary" className='w-100'>ดูผังตลาดเพื่อเลือกจอง</Button></Link>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileMarket