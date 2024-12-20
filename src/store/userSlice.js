import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUser, postInactiveUser } from "../services/userService";

// Thunk để lấy danh sách người dùng
export const fetchAllUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await getAllUser();
  return response.data;
});
// Thunk để cập nhật trạng thái người dùng (inactive, active)
export const updateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async ({ idUserSelected }) => {
    const response = await postInactiveUser(idUserSelected);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Cập nhật state users với dữ liệu từ API
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
