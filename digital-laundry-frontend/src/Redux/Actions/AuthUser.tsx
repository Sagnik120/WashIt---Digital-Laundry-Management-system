import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "../../ApiSetUp/ApiInstance";
import { ApiGetNoAuth, ApiPostNoAuth } from "../../ApiSetUp/CommonApi";
import { api, BaseUrl } from "../../ApiSetUp/AuthApi";

export function setAuthTokenAndSubscription(data: any) {
  apiInstance.defaults.data = data;
}

//--------------------- Auth Apis ------------------------------

export const LoginFunction: any = createAsyncThunk(
  "login",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.login, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }

);
export const StudentSignup: any = createAsyncThunk(
  "studentRegister",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.studentRegister, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

export const StaffSingup: any = createAsyncThunk(
  "staffRegister",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.staffRegister, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

export const VerifyEmail: any = createAsyncThunk(
  "verifyEmail",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.verifyEmail, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

export const SendOtp: any = createAsyncThunk(
  "sendOtp",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.sendOtp, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

export const forgotPassword: any = createAsyncThunk(
  "forgotPassword",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.forgotPassword, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

export const changePassword: any = createAsyncThunk(
  "changePassword",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.changePassword, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);


export const ProfileDetails: any = createAsyncThunk(
  'profileDetails',
    async (body: any) => {
      return await ApiGetNoAuth(BaseUrl, api.profileDetails, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
  });

export const hostelCreate: any = createAsyncThunk(
  "hostelCreate",
  async (body: any) => {
    return await ApiPostNoAuth(BaseUrl, api.hostelDetails, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  }
);

export const hostelDetails: any = createAsyncThunk(
  'hostelDetails',
    async (body: any) => {
      return await ApiGetNoAuth(BaseUrl, api.hostelDetails, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
  });

  export const staffCodeCreate: any = createAsyncThunk(
    "staffCodeCreate",
    async (body: any) => {
      return await ApiPostNoAuth(BaseUrl, api.staffCodeDetails, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
    }
  );

export const CreateOrder: any = createAsyncThunk(
    "CreateOrder",
    async (body: any) => {
      return await ApiPostNoAuth(BaseUrl, api.createOrder, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
    }
  );

export const QrScan: any = createAsyncThunk(
    "qrScan",
    async (body: any) => {
      return await ApiPostNoAuth(BaseUrl, api.qrScan, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
    }
  );

export const staffCodeDetails: any = createAsyncThunk(
  'staffCodeDetails',
    async (body: any) => {
      return await ApiGetNoAuth(BaseUrl, api.staffCodeDetails, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
  });

export const OrdersList: any = createAsyncThunk(
  'OrdersList',
    async (body: any) => {
      return await ApiGetNoAuth(BaseUrl, api.ordersList, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
  });

export const complaintsList: any = createAsyncThunk(
  'complaintsList',
    async (body: any) => {
      return await ApiGetNoAuth(BaseUrl, api.complaintsList, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
  });

export const studentList: any = createAsyncThunk(
  'studentList',
    async (body: any) => {
      return await ApiGetNoAuth(BaseUrl, api.studentList, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
  });

export const staffList: any = createAsyncThunk(
  'staffList',
    async (body: any) => {
      return await ApiGetNoAuth(BaseUrl, api.staffList, body)
        .then(async (res: any) => {
          return res?.data;
        })
        .catch((err) => { return err });
  });

export const StudentDashboardData: any = createAsyncThunk(
  'studentDashboardData',
  async (body: any) => {
    return await ApiGetNoAuth(BaseUrl, api.studentDashboardData, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  });

export const notificationData: any = createAsyncThunk(
  'notificationData',
  async (body: any) => {
    return await ApiGetNoAuth(BaseUrl, api.notificationData, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  });

export const OrderListForAdmin: any = createAsyncThunk(
  'OrderListForAdmin',
  async (body: any) => {
    return await ApiGetNoAuth(BaseUrl, api.OrderListForAdmin, body)
      .then(async (res: any) => {
        return res?.data;
      })
      .catch((err) => { return err });
  });