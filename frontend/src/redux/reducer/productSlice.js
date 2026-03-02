import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsApi,
  getSingleProductApi,
} from "../services/products.services";

export const featchProducts = createAsyncThunk(
  "api/products/fetchAll",
  async (params, thunkApi) => {
    try {
      const res = await getProductsApi(params);
      return res.data.data || res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const featchProductById = createAsyncThunk(
  "api/products/fetchSingle",
  async (id, thunkApi) => {
    try {
      const res = await getSingleProductApi(id);
      return res.data.data || res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    single: null,

    loading: false,
    error: null,

    pagination: {
      skip: 0,
      limit: 10,
      total: 0,
    },
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(featchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(featchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(featchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(featchProductById.fulfilled, (state, action) => {
        state.single = action.payload;
      });
  },
});

export const {} = productSlice.actions;
export default productSlice.reducer;
