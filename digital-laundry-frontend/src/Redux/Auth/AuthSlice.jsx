import { createSlice, combineReducers } from "@reduxjs/toolkit";
import { LoginFunction } from "../Actions/AuthUser";

const initialState = {
  userDetail: {},
};

export let loggedInUserDetailsSlice = createSlice({
  name: "loggedInUserDetailsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LoginFunction.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(LoginFunction.fulfilled, (state, { payload }) => {
      state.userDetail = payload?.data?.user;
      state.status = "success";
    });
    builder.addCase(LoginFunction.rejected, (state, { payload }) => {
      state.userDetail = {};
      state.status = "failed";
    });
  },
});

export default combineReducers({
  loggedInUserDetails: loggedInUserDetailsSlice.reducer,
});
