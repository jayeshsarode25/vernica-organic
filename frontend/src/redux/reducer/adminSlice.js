import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getProductsApi,
  countProductApi,
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

export const createProduct = createAsyncThunk(
  "api/products/createProduct",
  async (data, thunkApi) => {
    try {
      const res = await createProductApi(data);
      return res.data.data || res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "api/products/updateProduct",
  async (id, data, thunkApi) => {
    try {
      const res = await updateProductApi(id, data);
      return res.data.data || res.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "api/products/deleteProduct",
  async (id, thunkApi) => {
    try {
      const res = await deleteProductApi(id);
      return res.id;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const productCount = createAsyncThunk(
  "api/products/productCount",
  async (thunkApi) => {
    try {
      const res = await countProductApi();
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    items: [],
    total: 0,
    loading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(featchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(featchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id,
        );
        state.items[index] = action.payload;
      })
      .addCase(productCount.fulfilled, (state, action) => {
        state.total = action.payload;
      });
  },
});

export default adminSlice.reducer;
