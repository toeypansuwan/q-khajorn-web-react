import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    data: {
        search: "",
        status: "",
        min_price: 1,
        max_price: 20,
        distance: 30,
    },
}
const filterMarketSlice = createSlice({
    name: 'marketStore',
    initialState: initialState,
    reducers: {
        addFilter: (state, action) => {
            state.data = action.payload
        }
    }
})
export const { addFilter } = filterMarketSlice.actions
export default filterMarketSlice.reducer