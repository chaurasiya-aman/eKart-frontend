import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    title: "",
    message: "",
    code: null,
  },
  reducers: {
    setError: (state, action) => {
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.code = action.payload.code;
    },
    clearError: (state) => {
      state.title = "";
      state.message = "";
      state.code = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
