import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export class Axios {
  public instance: AxiosInstance;
  public interceptors: {
    /**
     * The **Request** interceptor will be call rigth before the `http request`
     * @summary
     * This a useful method especially if you need to send a token on each request.
     */
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    /**
     * The **Response** interceptor will be call rigth before the `http request` is received.
     * @summary
     * This a useful method especially if you need to send a token on each request.
     */
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
  }
}
