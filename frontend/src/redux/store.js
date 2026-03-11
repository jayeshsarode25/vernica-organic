import { configureStore } from '@reduxjs/toolkit'
import authReduce  from '../redux/reducer/userSlice'
import productReducer from '../redux/reducer/productSlice'
import adminReducer from '../redux/reducer/adminSlice'
import seaechReducer from '../redux/reducer/searchSlice'
import cartReducer from '../redux/reducer/cartSlice'
import orderReducer from '../redux/reducer/orderSlice'
import paymentReducer from '../redux/reducer/paymentSlice'
import profileReducer from '../redux/reducer/Profileslice'

export const store = configureStore({
  reducer: {
    auth : authReduce,
    products : productReducer,
    admin : adminReducer,
    search : seaechReducer,
    cart: cartReducer,
    order : orderReducer,
    payment : paymentReducer,
    profile : profileReducer, 
  },
})