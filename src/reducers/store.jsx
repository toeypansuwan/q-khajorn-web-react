import { configureStore } from '@reduxjs/toolkit'
import filterMarketSlice from './filterMarketSlice'

const store = configureStore({
    reducer: {
        filerMarketStore: filterMarketSlice,
    }
})
export default store;