import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    data: {
    },
}
const historyMarketSlice = createSlice({
    name: 'historyStore',
    initialState: initialState,
    reducers: {
        setIdMarket: (state, action) => {
            state.data = { ...state.data, market_id: action.payload }
        }
    }
})
export const { setIdMarket } = historyMarketSlice.actions
export default historyMarketSlice.reducer