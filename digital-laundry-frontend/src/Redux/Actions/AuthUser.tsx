import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "../../ApiSetUp/ApiInstance";
import { ApiPostNoAuth } from "../../ApiSetUp/CommonApi";
import { api, BaseUrl } from "../../ApiSetUp/AuthApi";

export function setAuthTokenAndSubscription(data: any) {
  apiInstance.defaults.data = data;
}

//--------------------- Auth Apis ------------------------------
// export const signup = createAsyncThunk(
//   "signup",
//   async (body) => {
//     return ApiPostNoAuth(BaseUrl, api.signup, body)
//       .then((res) => {
//         return res?.data;
//       })
//       .catch((err) => err);
//   }
// );

// export const loginFunction = createAsyncThunk("login", async (body: any) => {
//   return await ApiPostNoAuth(BaseUrl, api.login, body)
//     .then(async (res: any) => {
//       return res?.data;
//     })
//     .catch((err: any) => err);
// });


export const loginFunction: any = createAsyncThunk(
  "login",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.login, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }

);
export const studentSignup: any = createAsyncThunk(
  "login",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.studentSignup, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

export const staffSingup: any = createAsyncThunk(
  "login",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.staffSingup, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);
export const staffRegisterAction: any = createAsyncThunk(
  "login",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.staffRegister, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);
export const studentLoginAction: any = createAsyncThunk(
  "login",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.studentLogin, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);