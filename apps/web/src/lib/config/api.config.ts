import { AxiosRequestConfig } from 'axios';
import * as qs from 'qs';

export const apiConfig: AxiosRequestConfig = {
  withCredentials: true,
  timeout: 30000,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  paramsSerializer: {
    encode: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
};
