import { configureStore } from '@reduxjs/toolkit'
import authReduce  from '../redux/reducer/userSlice'
import productReducer from '../redux/reducer/productSlice'

export const store = configureStore({
  reducer: {
    auth : authReduce,
    products : productReducer
  },
})