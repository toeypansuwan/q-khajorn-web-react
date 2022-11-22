import { configureStore } from '@reduxjs/toolkit'
import filterMarketSlice from './filterMarketSlice'

const store = configureStore({
    reducer: {
        filterMarketStore: filterMarketSlice,
    }
})
export default store;