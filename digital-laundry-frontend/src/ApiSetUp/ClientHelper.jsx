import Axios from "axios";
import { apiInstance } from "./ApiInstance";
import cookieUtils from "./CookieUtils";
import { parseJwt } from "../utils/parseToken";
import {
  ApiUrlCommon,
  BaseUrl,
  LOGIN_TOKEN,
  REFRESH_TOKEN,
  versionControl,
} from "./AuthApi";

export function setToken(token) {
  Object.assign(apiInstance.defaults.headers, {
    Authorization: `Bearer ${token}`,
  });
}

export async function handleRequest(request) {
  let login_token = localStorage.getItem("token");

  if (login_token) {
    let decodedJwt = parseJwt(login_token);
    if (Math.floor(new Date().getTime() / 1000) >= decodedJwt?.exp - 5 * 60) {
      let refresh_token = cookieUtils.getCookie(REFRESH_TOKEN);
      let subscriptionName = cookieUtils.getCookie("subscriptionName");

      await fetch(
        BaseUrl +
          ApiUrlCommon +
          versionControl +
          "ConsultantPortal/RefreshToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            RefreshToken: `${refresh_token}`,
          },
          body: JSON.stringify({
            sourcePlatform: "web",
            subscriptionName: subscriptionName,
          }),
        }
      )
        .then((r) => r.json())
        .then(async (response) => {
          if (response?.code === 0) {
          } else {
            await setToken(response?.data?.jwt);
            cookieUtils.setCookie(LOGIN_TOKEN, response?.data?.jwt);
            request.headers.Authorization = `Bearer ${response?.data?.jwt}`;
          }
        })
        .catch((e) => {});
      return request;
    }
  }
  return request;
}

export function handleResponse(value) {
  return value;
}

export async function handleApiError(error) {
  if (Axios.isCancel(error)) {
    throw error;
  }
  if (!error.response) {
    throw error;
  }
  if (error.response.status === 401 || error.response.status === 402) {
    // localStorage.removeItem("token");
    cookieUtils.removeCookie(REFRESH_TOKEN);
    cookieUtils.removeCookie("subscriptionName");
    return error;
  } else if (error.response.status === 500) {
    throw error;
  } else {
    // showToast(error.toString());
  }
  throw error;
}
