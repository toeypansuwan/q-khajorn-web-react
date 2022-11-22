import React, { useEffect, useState } from 'react'
import SearchMarket from '../../components/SearchMarket/SearchMarket';
import { addFilter } from '../../reducers/filterMarketSlice';
import { useDispatch } from 'react-redux';

function FirstPage() {
    const [done, setDone] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getGeoLocation();
    }, [])
    const getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                dispatch(addFilter({ lon: position.coords.longitude, lat: position.coords.latitude }))
                setDone(true);
            });
        }
    }
    return (
        !done ? (<div>loading</div>) : (<SearchMarket getGeoLocation={getGeoLocation} />)
    )
}

export default FirstPage