import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Role } from "../constants/constants";
import {
  getAllAdminOfCenter,
  getAllStudentByIdCenter,
  getAllTeacherByIdCenter,
  postAddCenterAmin,
  postAddTeacher,
} from "../services/centerService";

export const fetchListUserOfCenter = createAsyncThunk(
  "usersOfCenter/fetchUserOfCenter",
  async (role, thunkAPI) => {
    let response;
    const idCenter = +localStorage.getItem("idCenter");
    if (role === Role.teacher) {
      response = await getAllTeacherByIdCenter(idCenter);
    } else if (role === Role.student) {
      response = await getAllStudentByIdCenter(idCenter);
    } else if (role === Role.centerAdmin) {
      response = await getAllAdminOfCenter(idCenter);
    }
    return response || [];
  }
);

// export const addTeacher = createAsyncThunk(
//   "usersOfCenter/addTeacher",
//   async ({ email, username, password, idCenter }) => {
//     const data = await postAddTeacher(email, username, password, idCenter);
//     console.log(data);

//     return data;
//   }
// );

// export const addAdminCenter = createAsyncThunk(
//   "usersOfCenter/addAdmin",
//   async ({ username, email, password, idCenter, idUserUpdatedBy }) => {
//     const data = await postAddCenterAmin(
//       username,
//       email,
//       password,
//       idCenter,
//       idUserUpdatedBy
//     );
//     return data;
//   }
// );
const listUserOfCenterSlice = createSlice({
  name: "listUserOfCenter",
  initialState: {
    listUserOfCenter: [],
    status: "idle",
    activeRole: Role.teacher,
  },
  reducers: {
    setActiveRoleUserOfCenter(state, action) {
      state.activeRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListUserOfCenter.pending, (state) => {
        state.status = "loading";
        state.listUserOfCenter = [];
      })
      .addCase(fetchListUserOfCenter.fulfilled, (state, action) => {
        state.status = "succeded";
        state.listUserOfCenter = action.payload;
      })
      .addCase(fetchListUserOfCenter.rejected, (state, action) => {
        state.status = "failed";
        console.error("Fetch centers failed:", action.error.message);
      });
  },
});

export const { setActiveRoleUserOfCenter } = listUserOfCenterSlice.actions;

export default listUserOfCenterSlice.reducer;
