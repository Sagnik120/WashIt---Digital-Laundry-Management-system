import { apiInstance } from "./ApiInstance";
import { LOGIN_TOKEN, versionControl } from "./AuthApi";
import { setToken } from "./ClientHelper";
import cookieUtils from "./CookieUtils";

export const ApiPostNoAuth = async (type, endUrl, userData) => {
  await setToken("token");
  let login_token = localStorage.getItem("token");
  if (login_token) {
    await setToken(login_token);
  }

  return new Promise((resolve, reject) => {
    apiInstance
      .post(type + endUrl, userData)
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          reject(error?.response?.data);
        } else {
          reject(error?.response);
        }
      });
  });
};

export const ApiGetNoAuth = async (type, endUrl, body) => {
  await setToken("token");
  let login_token = localStorage.getItem("token");
  if (login_token) {
    await setToken(login_token);
  }

  return new Promise((resolve, reject) => {
    apiInstance
      .get(type + endUrl, { params: body || {} })
      .then((responseJson) => {
        console.log("res called", responseJson);
        resolve(responseJson);
      })
      .catch((error) => {
        console.log("error", error);
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          reject(error?.response?.data);
        } else {
          reject(error?.response);
        }
      });
  });
};

export const CommonRequest =
  (url, data, type = "get", params, extraData = {}) =>
  async () => {
    try {
      const reqObj = {
        url: url,
        method: type,
        params: params,
        data: data,
        ...extraData,
      };

      // Add token to headers if exists
      const token = cookieUtils.getCookie(LOGIN_TOKEN);
      if (token) {
        reqObj.headers = {
          ...reqObj.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await apiInstance.request(reqObj);

      if (reqObj?.responseType === "blob") {
        return res;
      }

      if (res.data.code === 0) {
        throw res.data.message;
      }

      return res.data;
    } catch (err) {
      // Handle unauthorized error (401)
      if (err?.response?.status === 401) {
        cookieUtils.removeCookie(LOGIN_TOKEN);
        cookieUtils.removeCookie("userData");
        window.location.href = "/login";
      }

      throw new Error(err instanceof Object ? err.message : err);
    }
  };

export const CreateRoute = (type, endUrl) => {
  return `${type}${endUrl}`;
};
