import React, { useEffect, useState } from 'react'
import SearchMarket from '../../components/SearchMarket/SearchMarket';
import { addFilter } from '../../reducers/filterMarketSlice';
import { useDispatch } from 'react-redux';
import Loading from '../../services/Loading/Loading';
import { BASE_URL_API } from '../../services/services'
import axios from 'axios';

function FirstPage() {
    const [done, setDone] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getGeoLocation();
    }, [])
    const getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const currentLocation = { lon: position.coords.longitude, lat: position.coords.latitude };
                dispatch(addFilter(currentLocation))
                axios.get(`${BASE_URL_API}market/min-max/price?lat=${currentLocation.lat}&lon=${currentLocation.lon}`).then(res => {
                    dispatch(addFilter({ max_price: res.data.max, min_price: res.data.min }))
                }).catch(console.error).finally(() => {
                    setDone(true);
                })
            });
        }
    }
    return (
        !done ? (<Loading />) : (<SearchMarket getGeoLocation={getGeoLocation} />)
    )
}

export default FirstPage
