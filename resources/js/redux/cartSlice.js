import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [], // Initialize from localStorage
  alert: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart: (state) => {
      if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
      }
      state.items = JSON.parse(localStorage.getItem('cart')) || [];
    },
    addItemToCart: (state, action) => {
      const { product, quantity } = action.payload;

      // Check if the product already exists in the cart
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        // Update the quantity of the existing product
        existingItem.quantity += quantity;
      } else {
        // Add new product to the cart
        state.items.push({ product, quantity });
      }

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeItemFromCart: (state, action) => {
      const productId = action.payload;

      // Remove the product from the cart
      state.items = state.items.filter(item => item.product.id !== productId);

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      const existingItem = state.items.find(item => item.product.id === productId);

      if (existingItem) {
        // Update the quantity
        existingItem.quantity = quantity;

        // Remove the item if quantity is zero
        if (quantity === 0) {
          state.items = state.items.filter(item => item.product.id !== productId);
        }
      }

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
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
  initializeCart,
  addItemToCart,
  removeItemFromCart,
  updateQuantity,
  clearCart,
  showAlert,
  clearAlert
} = cartSlice.actions;

export default cartSlice.reducer;
