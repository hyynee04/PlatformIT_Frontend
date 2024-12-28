import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  unreadCount: 0,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setUnreadMsgCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      if (state.unreadCount < 99) {
        state.unreadCount += 1;
      } else {
        state.unreadCount = "99+";
      }
    },
    decrementUnreadCount: (state) => {
      if (typeof state.unreadCount === "number" && state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  setUnreadMsgCount,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
} = messageSlice.actions;

export default messageSlice.reducer;
