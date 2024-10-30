import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CenterStatus } from "../constants/constants";
import {
  getAllCenter,
  getPendingCenter,
  postApproveCenter,
  postRejectCenter,
} from "../services/centerService";

export const fetchCenters = createAsyncThunk(
  "centers/fetchCenters",
  async (status, thunkAPI) => {
    let response;
    if (status === CenterStatus.pending) {
      response = await getPendingCenter();
    } else {
      response = await getAllCenter();
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
export const rejectCenter = createAsyncThunk(
  "centers/rejectCenter",
  async ({ idCenterSelected, reasonReject, idUserUpdated }) => {
    console.log(idCenterSelected, reasonReject);

    const data = await postRejectCenter(
      idCenterSelected,
      reasonReject,
      idUserUpdated
    );
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
        state.centers = [];
      })
      .addCase(fetchCenters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.centers = action.payload; //update list with new data
      })
      .addCase(fetchCenters.rejected, (state, action) => {
        state.status = "failed";
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
