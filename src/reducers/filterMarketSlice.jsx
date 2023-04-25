import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    data: {},
}
const filterMarketSlice = createSlice({
    name: 'marketStore',
    initialState: initialState,
    reducers: {
        addFilter: (state, action) => {
            state.data = { ...state.data, ...action.payload }
        }
    }
})
export const { addFilter } = filterMarketSlice.actions
export default filterMarketSlice.reducer