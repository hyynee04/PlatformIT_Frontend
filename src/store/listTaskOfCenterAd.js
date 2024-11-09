import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPendingQualifications,
  postApproveQualification,
  postRejectQualification,
} from "../services/userService";

export const fetchTaskOfCenterAd = createAsyncThunk(
  "taskOfCenterAd/fetchTaskOfCenterAd",
  async (typeTask, thunkAPI) => {
    let response;
    if (typeTask === "qualifications") {
      response = await getPendingQualifications();
    }
    return response || [];
  }
);
export const approveQualification = createAsyncThunk(
  "taskOfCenterAd/approveQualification",
  async ({ idUser, idQualification }) => {
    const data = await postApproveQualification(idUser, idQualification);
    return data;
  }
);
export const rejectQualification = createAsyncThunk(
  "taskOfCenterAd/rejectQualification",
  async ({ idUser, idQualification, reason }) => {
    const data = await postRejectQualification(idUser, idQualification, reason);
    return data;
  }
);
const taskOfCenterAdSlice = createSlice({
  name: "taskOfCenterAd",
  initialState: {
    taskOfCenterAd: [],
    status: "idle",
    activeTypeOfTask: "lectures",
  },
  reducers: {
    setActiveTypeOfTask(state, action) {
      state.activeTypeOfTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskOfCenterAd.pending, (state) => {
        state.status = "loading";
        state.taskOfCenterAd = [];
      })
      .addCase(fetchTaskOfCenterAd.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.taskOfCenterAd = action.payload;
      })
      .addCase(fetchTaskOfCenterAd.rejected, (state, action) => {
        state.status = "failed";
        state.taskOfCenterAd = [];
      });
  },
});

export const { setActiveTypeOfTask } = taskOfCenterAdSlice.actions;

export default taskOfCenterAdSlice.reducer;