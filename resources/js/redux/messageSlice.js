import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 

// Thunks
export const fetchContacts = createAsyncThunk('contacts/fetchAll', async () => {
  const response = await axios.get('/api/contacts');
  return response.data.contacts;
});

export const fetchUnreadContacts = createAsyncThunk('contacts/fetchUnread', async () => {
  const response = await axios.get('/api/contact/unread');
  return response.data.data;
});

export const markAllAsRead = createAsyncThunk('contacts/markAllAsRead', async () => {
  await axios.put('/api/contact/read');
  return true;
});

export const createContact = createAsyncThunk('contacts/create', async (contactData, { dispatch }) => {
  const response = await axios.post('/api/contact', contactData);
  dispatch(fetchUnreadContacts());
  return response.data.data;
});

// Slice
const contactSlice = createSlice({
  name: 'contacts',
  initialState: {
    all: [],
    unread: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchUnreadContacts.fulfilled, (state, action) => {
        state.unread = action.payload;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.unread = [];
        state.all = state.all.map((c) => ({ ...c, is_read: true }));
      })
      .addCase(createContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.all.unshift(action.payload);
        state.unread.unshift(action.payload);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Create contact failed:", action.error.message);
      });
  },
});

export default contactSlice.reducer;
