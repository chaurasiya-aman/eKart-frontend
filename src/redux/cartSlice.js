import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { itemCount: 0 },
  reducers: {
    setCartItemCount: (state, action) => {
      const count = Number(action.payload);
      state.itemCount = Number.isFinite(count) ? Math.max(0, count) : 0;
    },
    clearCartItemCount: (state) => {
      state.itemCount = 0;
    },
  },
});

export const { setCartItemCount, clearCartItemCount } = cartSlice.actions;

export const getCartItemCount = (cart) => {
  const items = Array.isArray(cart) ? cart : cart?.items || [];
  return items.reduce((count, item) => count + Math.max(0, Number(item?.quantity) || 0), 0);
};

export default cartSlice.reducer;
