// TODO improve error handling
export class HttpResponseError extends Error {
  status: number;
  statusText: string;
  headers: Headers;
  data?: {
    errors: Record<string, string>;
    status: number;
  };
  constructor({
    status,
    statusText,
    headers,
    data,
  }: {
    status: number;
    statusText: string;
    headers: Headers;
    data?: {
      errors: Record<string, string>;
      status: number;
    };
  }) {
    super(`${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.data = data;
  }
}
