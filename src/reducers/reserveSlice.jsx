import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    id_market: '',
    id_zone: '',
    data: [],
    services: {
        service: {
            status: false,
            price: 0,
        },
        appliances: []
    }
}
const reserveSlice = createSlice({
    name: 'reserveStore',
    initialState: initialState,
    reducers: {
        addReserve: (state, action) => {
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
        setIdMarket: (state, action) => {
            state.id_market = action.payload
        },
        setIdZone: (state, action) => {
            state.id_zone = action.payload
        },
        setService: (state, action) => {
            state.services.service = {
                status: action.payload.status,
                price: action.payload.price
            }
        },
        addAppliances: (state, action) => {
            const data = action.payload
            if (state.services.appliances.some(i => i.id === data.id)) return;
            state.services.appliances = [
                ...state.services.appliances,
                {
                    id: data.id,
                    name: data.name,
                    image: data.image,
                    amount: 1,
                    price: data.price,
                }
            ]
        },
        editAppliances: (state, action) => {
            const data = action.payload;
            state.services.appliances = state.services.appliances.map(i => {
                if (i.id == data.id) {
                    return {
                        ...i,
                        amount: data.amount,
                    }
                }
                return i;
            })
        },
        removeAppliances: (state, action) => {
            state.services.appliances = state.services.appliances.filter(i => i.id !== action.payload.id)
        }
    }
})
export const {
    addReserve,
    editReserve,
    removeReserve,
    setIdMarket,
    setIdZone,
    setService,
    addAppliances,
    editAppliances,
    removeAppliances
} = reserveSlice.actions
export default reserveSlice.reducer