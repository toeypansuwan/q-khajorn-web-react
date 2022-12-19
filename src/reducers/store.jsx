import { configureStore } from '@reduxjs/toolkit'
import filterMarketSlice from './filterMarketSlice'
import historyMarketSlice from './historyMarketSlice';

const store = configureStore({
    reducer: {
        filterMarketStore: filterMarketSlice,
        historyMarketStore: historyMarketSlice,
    }
})
export default store;