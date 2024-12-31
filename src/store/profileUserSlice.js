import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPI } from "../services/userService";

const initialState = {
  name: "",
  phoneNum: "",
  email: "",
  dob: "",
  nationality: "",
  avaImg: null,
  centerName: "",
  teachingMajor: "",
  description: "",
  links: [],
  qualificationModels: [],
};

export const fetchUserProfile = createAsyncThunk(
  "profileUser/fetchUserProfile",
  async (idUser, { dispatch }) => {
    const response = await getPI(idUser);
    const data = response.data;
    const today = new Date().toISOString().split("T")[0];
    const responseCountries = await fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    );
    const countryData = await responseCountries.json();
    const countriesData = countryData.countries.map((country) => ({
      label: country.label.split(" ")[1],
    }));

    const userNationality = countriesData.find(
      (country) => country.label === data.nationality
    );

    // Dispatch setUserPI here
    dispatch(
      setUserPI({
        name: data.fullName,
        phoneNum: data.phoneNumber,
        email: data.email,
        gender: data.gender || 0,
        dob: data.dob ? data.dob.split("T")[0] : today,
        nationality: userNationality ? userNationality.label : "",
        avaImg: data.avatar,
        centerName: data.centerName,
        teachingMajor: data.teachingMajor,
        description: data.description,
        links: data.links,
        qualificationModels: data.qualificationModels,
      })
    );
  }
);

const profileUserSlice = createSlice({
  name: "profileUser",
  initialState,
  reducers: {
    setUserPI: (state, action) => {
      return { ...state, ...action.payload };
    },
    setAvatar: (state, action) => {
      state.avaImg = action.payload;
    },
    updateUserPI: (state, action) => {
      return { ...state, ...action.payload };
    },
    changeAvatar: (state, action) => {
      state.avaImg = action.payload;
    },
    resetUserPI: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const { setUserPI, setAvatar, updateUserPI, changeAvatar, resetUserPI } =
  profileUserSlice.actions;
export default profileUserSlice.reducer;
