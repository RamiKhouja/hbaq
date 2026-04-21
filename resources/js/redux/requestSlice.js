import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 

export const fetchUnreadRequests = createAsyncThunk('requests/fetchUnread', async () => {
  const response = await axios.get('/api/admin/requests/unread');
  return response.data.data;
});

export const markAllAsRead = createAsyncThunk('requests/markAllAsRead', async () => {
  await axios.put('/api/admin/requests/read');
  return true;
});

// Slice
const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    all: [],
    unread: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadRequests.fulfilled, (state, action) => {
        state.unread = action.payload;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.unread = [];
        state.all = state.all.map((c) => ({ ...c, is_read: true }));
      });
  },
});

export default requestSlice.reducer;
