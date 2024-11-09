import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCenterInfo } from "../services/centerService";

const initialState = {
  avatarPath: "",
  centerName: "",
  centerEmail: "",
  tin: "",
  address: "",
  phoneNumber: "",
  description: "",
  establishedDate: "",
  submissionDate: "",
  centerStatus: 0,
  idMainAdmin: 0,
  links: [],
  qualificationModels: [],
};
export const fetchCenterProfile = createAsyncThunk(
  "profileCenter/fetchCenterProfile",
  async (_, { dispatch }) => {
    const response = await getCenterInfo();
    const data = response.data
    dispatch(
      setCenterInfo({
        avatarPath: data.avatarPath,
        centerName: data.centerName,
        centerEmail: data.centerEmail,
        tin: data.tin,
        address: data.address,
        phoneNumber: data.phoneNumber,
        description: data.description,
        establishedDate: data.establishedDate
          ? data.establishedDate.split("T")[0]
          : null,
        submissionDate: data.submissionDate
          ? data.submissionDate.split("T")[0]
          : null,
        centerStatus: 0,
        idMainAdmin: data.idMainAdmin,
        links: data.links,
        qualificationModels: data.qualificationModels,
      })
    );
  }
);
const profileCenterSlice = createSlice({
  name: "profileCenter",
  initialState,
  reducers: {
    setCenterInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
    setAvatar: (state, action) => {
      state.avaImg = action.payload;
    },
    updateCenterPI: (state, action) => {
      return { ...state, ...action.payload };
    },
    changeAvatar: (state, action) => {
      state.avaImg = action.payload;
    },
    resetCenterPI: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCenterProfile.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const {
  setCenterInfo,
  setAvatar,
  updateCenterPI,
  changeAvatar,
  resetCenterPI,
} = profileCenterSlice.actions;
export default profileCenterSlice.reducer;
