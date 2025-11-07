import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "../../ApiSetUp/ApiInstance";
import { ApiGetNoAuth, ApiPostNoAuth } from "../../ApiSetUp/CommonApi";
import { api, BaseUrl } from "../../ApiSetUp/AuthApi";

export function setAuthTokenAndSubscription(data: any) {
  apiInstance.defaults.data = data;
}

//--------------------- Auth Apis ------------------------------

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

export const AddStudentEntry: any = createAsyncThunk(
  "AddStudentEntry",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.AddStudentEntry, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

// export const studentProfile: any = createAsyncThunk('studentProfile', async (body: any) => {
//   "login",
//     async (body: any) => {
//       return await ApiGetNoAuth(BaseUrl, api.studentLogin, body)
//         .then(async (res: any) => {
//           return res?.data;
//         })
//         .catch((err) => { return err });
//     }
// });
export const studentProfile: any = createAsyncThunk(
  "login",
  async (body: any) => {
    return await ApiGetNoAuth(BaseUrl, api.studentProfile, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

export const StudentHistory: any = createAsyncThunk(
  "StudentHistory",
  async (body: any) => {
    return await ApiGetNoAuth(BaseUrl, api.StudentHistory, {})
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);