import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    data: [],
}
const reserveSlice = createSlice({
    name: 'reserveStore',
    initialState: initialState,
    reducers: {
        addReserve: (state, action) => {
            console.log("add")
            const data = action.payload
            state.data = [
                ...state.data,
                {
                    id: data.id,
                    title: data.title,
                    price: data.price,
                    days: data.days,
                }
            ]
        },
        removeReserve: (state, action) => {
            console.log("remove")
            state.data = state.data.filter(i => i.id != action.payload.id)
        },
        editReserve: (state, action) => {
            const data = action.payload
            state.data = state.data.map(i => {
                if (i.id == data.id) {
                    return {
                        id: data.id,
                        title: data.title,
                        price: data.price,
                        days: data.days,
                    }
                }
                return i;
            })
        },
    }
})
export const { addReserve, editReserve, removeReserve } = reserveSlice.actions
export default reserveSlice.reducer