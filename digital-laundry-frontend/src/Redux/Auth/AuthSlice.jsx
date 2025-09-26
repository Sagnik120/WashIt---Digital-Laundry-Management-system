import { createSlice, combineReducers } from "@reduxjs/toolkit";
import { loginFunction } from "../Actions/AuthUser";

const initialState = {
  userDetail: {},
};

export let loggedInUserDetailsSlice = createSlice({
  name: "loggedInUserDetailsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginFunction.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loginFunction.fulfilled, (state, { payload }) => {
      state.userDetail = payload?.data?.user;
      state.status = "success";
    });
    builder.addCase(loginFunction.rejected, (state, { payload }) => {
      state.userDetail = {};
      state.status = "failed";
    });
  },
});

export default combineReducers({
  loggedInUserDetails: loggedInUserDetailsSlice.reducer,
});
