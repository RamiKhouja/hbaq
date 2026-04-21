import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('liked')) || [], // Initialize from localStorage
  alert: null
};

const likedSlice = createSlice({
  name: 'liked',
  initialState,
  reducers: {
    initializeLiked: (state) => {
      if (!localStorage.getItem('liked')) {
        localStorage.setItem('liked', JSON.stringify([]));
      }
      state.items = JSON.parse(localStorage.getItem('liked')) || [];
    },
    addItemToLiked: (state, action) => {
      const { product, quantity } = action.payload;

      // Check if the product already exists in the liked
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        // Update the quantity of the existing product
        existingItem.quantity += quantity;
      } else {
        // Add new product to the liked
        state.items.push({ product, quantity });
      }

      // Save updated liked to localStorage
      localStorage.setItem('liked', JSON.stringify(state.items));
    },
    removeItemFromLiked: (state, action) => {
      const payload = action.payload;

      // Remove the product from the liked
      state.items = state.items.filter(item => item.product.id !== payload.product.id);

      // Save updated liked to localStorage
      localStorage.setItem('liked', JSON.stringify(state.items));
    },
    clearLiked: (state) => {
      state.items = [];
      localStorage.removeItem('liked');
    },
    showAlert: (state, action) => {
      state.alert = action.payload;
    },
    clearAlert: (state) => {
      state.alert = null;
    }
  },
});

export const {
  initializeLiked,
  addItemToLiked,
  removeItemFromLiked,
  clearLiked,
  showAlert,
  clearAlert
} = likedSlice.actions;

export default likedSlice.reducer;
