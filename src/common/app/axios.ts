import axios, { AxiosError, AxiosRequestConfig } from 'axios';
// import { getCookie, saveCookie } from './cookie';

const onRequest = async (config: AxiosRequestConfig) => {
  // const token = getCookie('t');

  // if (config.headers) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error?.response?.data);
};

// const onResponse = (response: AxiosResponse) => {
//   return response;
// };

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
instance.interceptors.request.use(onRequest, onRequestError);
// instance.interceptors.response.use(onResponse, onResponseError);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// axiosAuthIDMS.interceptors.request.use(onRequest, onRequestError);

export default instance;
