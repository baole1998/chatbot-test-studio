import axios from "axios";
import cookie from "js-cookie";
import Qs from "qs";
// import { message } from "antd";
import { TOKEN, CONFIG_SERVER } from "../utils/constant/config";

const request = axios.create();

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error.response || { data: {} });
  }
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { data, status } = error?.response || {};

    if (status === 403) {
    //   message.error(data?.status?.message || "Truy cập không hợp lệ!");
      if (data?.status?.code === "LMS-40011") {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } else if (status === 401) {
      // cookie.remove(TOKEN);
    //   message.error(
    //     "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại!"
    //   );
    } else {
    //   message.error(data?.status?.message || "Lỗi hệ thống!");
    }
    return Promise.reject(error?.response || { data: {} });
  }
);

const api = (options) => {
  let config = {
    baseURL: CONFIG_SERVER.BASE_URL,
    ...options,
    paramsSerializer: (params) =>
      Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  };
  if (cookie.get(TOKEN)) {
    const tmpToken = `Token ${cookie.get(TOKEN)}`;
    config.headers.Authorization = tmpToken;
  }
  return request(config);
};

export default api;
