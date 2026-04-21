import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch orders from API
const fetchOrders = createAsyncThunk('orders/fetchOrders', async ({id, role}) => {
  const response = await axios.get(`/api/orders/${id}/role/${role}`);
  return response.data; // Assuming the response contains { orders: [...] }
});

const fetchPaginatedOrders = createAsyncThunk('orders/fetchPaginatedOrders', async () => {
  const response = await axios.get('/api/orders/paginated');
  return response.data; // this contains pagination
});

// Async thunk to create a new order
const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/orders', orderData);
    return response.data?.order?.id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [], // Orders list
    paginated: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.push({ id: action.payload, ...action.meta.arg }); // Add new order to state
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchPaginatedOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paginated = action.payload;
      })
      .addCase(fetchPaginatedOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPaginatedOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export { fetchOrders, createOrder, fetchPaginatedOrders };
export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
