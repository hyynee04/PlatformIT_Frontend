import { configureStore } from "@reduxjs/toolkit";
import profileUserReducer from "./profileUserSlice";
import userReducer from "./userSlice";
import listCenterReducer from "./listCenterSlice";
import listUserOfCenterReducer from "./listUserOfCenter";
import taskOfCenterAdReducer from "./listTaskOfCenterAd";
import profileCenterReducer from "./profileCenterSlice";

export const store = configureStore({
  reducer: {
    profileUser: profileUserReducer,
    users: userReducer,
    centers: listCenterReducer,
    listUserOfCenter: listUserOfCenterReducer,
    taskOfCenterAd: taskOfCenterAdReducer,
    profileCenter: profileCenterReducer,
  },
});
