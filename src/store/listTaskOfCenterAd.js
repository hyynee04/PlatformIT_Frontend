import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPendingQualifications,
  postApproveQualification,
  postRejectQualification,
} from "../services/userService";
import {
  getAllPendingLectureOfCenter,
  postApproveLecture,
  postRejectLecture,
} from "../services/courseService";

export const fetchTaskOfCenterAd = createAsyncThunk(
  "taskOfCenterAd/fetchTaskOfCenterAd",
  async (typeTask, thunkAPI) => {
    let response;
    if (typeTask === "lectures") {
      response = await getAllPendingLectureOfCenter();
    } else if (typeTask === "qualifications") {
      response = await getPendingQualifications();
    }
    return response.data || [];
  }
);
export const countTaskOfCenterAd = createAsyncThunk(
  "taskOfCenterAd/countTaskOfCenterAd",
  async (typeTask, thunkAPI) => {
    let response;
    if (typeTask === "qualifications") {
      response = await getPendingQualifications();
    }
    return response.data.length || [];
  }
);
export const approveQualification = createAsyncThunk(
  "taskOfCenterAd/approveQualification",
  async ({ idUser, idQualification }) => {
    const response = await postApproveQualification(idUser, idQualification);
    return response.data;
  }
);
export const rejectQualification = createAsyncThunk(
  "taskOfCenterAd/rejectQualification",
  async ({ idUser, idQualification, reason }) => {
    const response = await postRejectQualification(
      idUser,
      idQualification,
      reason
    );
    return response.data;
  }
);
export const approveLecture = createAsyncThunk(
  "taskOfCenterAd/approveLecture",
  async ({ idLecture }) => {
    const response = await postApproveLecture(idLecture);
    return response.data;
  }
);
export const rejectLecture = createAsyncThunk(
  "taskOfCenterAd/rejectLecture",
  async ({ idLecture, reason }) => {
    const response = await postRejectLecture(idLecture, reason);
    return response.data;
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
