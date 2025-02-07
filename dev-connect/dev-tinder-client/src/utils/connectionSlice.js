import { createSlice } from "@reduxjs/toolkit";

const connectonSlice = createSlice({
  name: "connection",
  initialState: null,
  reducers: {
    addConnection: (state, action) => action.payload,
    removeConnection: (state, action) => null,
  },
});

export const { addConnection, removeConnection } = connectonSlice.actions;
export default connectonSlice.reducer;
