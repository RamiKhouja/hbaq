import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import contactReducer from './messageSlice';
import requestReducer from './requestSlice';
import likedReducer from './likedSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: orderReducer,
    contacts: contactReducer,
    requests: requestReducer,
    liked: likedReducer
  },
  devTools: true
});

export default store;
