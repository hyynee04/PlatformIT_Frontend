import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUser, postInactiveUser } from "../services/userService";

// Thunk để lấy danh sách người dùng
export const fetchAllUsers = createAsyncThunk("users/fetchAll", async () => {
  const data = await getAllUser();
  return data;
});
// Thunk để cập nhật trạng thái người dùng (inactive, active)
export const updateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async ({ idUserSelected, idUserUpdatedBy }) => {
    console.log("idUserSelected", idUserSelected);
    console.log("idUserUpdatedBy", idUserUpdatedBy);

    const data = await postInactiveUser(idUserSelected, idUserUpdatedBy);
    return data;
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
