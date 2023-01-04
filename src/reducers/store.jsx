import { configureStore } from '@reduxjs/toolkit'
import filterMarketSlice from './filterMarketSlice'
import reserveSlice from './reserveSlice';

const store = configureStore({
    reducer: {
        filterMarketStore: filterMarketSlice,
        reserveStore: reserveSlice,
    }
})
export default store;