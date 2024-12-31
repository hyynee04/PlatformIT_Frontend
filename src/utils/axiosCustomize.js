import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:5000/",
  // baseURL: "http://27.71.227.212:5000/",
  baseURL: "https://myidvndut.id.vn:5000/",
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // console.log(">>>", response);
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // console.log(">>> error:", error.response);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error && error.response ? error.response : Promise.reject(error);
  }
);

export default instance;
