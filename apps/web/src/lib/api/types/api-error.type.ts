import { AxiosError } from 'axios';

export type ApiErrorType<T> = AxiosError<{
  errors?: T;
  message?: string;
  status?: number;
  statusCode?: number;
}>;
