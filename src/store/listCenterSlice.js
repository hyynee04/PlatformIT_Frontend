import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CenterStatus } from "../constants/constants";
import {
  getAllCenter,
  getPendingCenter,
  postApproveCenter,
} from "../services/centerService";

export const fetchCenters = createAsyncThunk(
  "centers/fetchCenters",
  async (status, thunkAPI) => {
    let response;
    if (status === CenterStatus.active) {
      response = await getAllCenter();
    } else if (status === CenterStatus.pending) {
      response = await getPendingCenter();
    }
    return response || [];
  }
);
export const approveCenter = createAsyncThunk(
  "centers/approveCenter",
  async ({ idCenterSelected, idUserUpdated }) => {
    const data = await postApproveCenter(idCenterSelected, idUserUpdated);
    return data;
  }
);

const listCenterSlice = createSlice({
  name: "listCenter",
  initialState: {
    centers: [],
    status: "idle", //default state
    activeStatusCenter: CenterStatus.active,
  },
  reducers: {
    setActiveStatusCenter(state, action) {
      state.activeStatusCenter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCenters.pending, (state) => {
        state.status = "loading";
        state.centers = []; //reset list to delete old data
      })
      .addCase(fetchCenters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.centers = action.payload; //update list with new data
      })
      .addCase(fetchCenters.rejected, (state, action) => {
        state.status = "failed";
        // console.error("Fetch centers failed:", action.error.message);
        state.centers = []; //if fetch failed, also reset list
      })
      .addCase(approveCenter.fulfilled, (state, action) => {
        console.log("Approve center successfully:", action.payload);
      })
      .addCase(approveCenter.rejected, (state, action) => {
        console.error("Approve center failed:", action.error.message);
      });
  },
});

export const { setActiveStatusCenter } = listCenterSlice.actions;

export default listCenterSlice.reducer;
