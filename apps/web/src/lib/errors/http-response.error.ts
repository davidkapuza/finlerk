export class HttpResponseError extends Error {
  private readonly _response: Response;
  constructor(response: Response) {
    super(`${response.status} ${response.statusText}`);
    this._response = response;
  }

  get response() {
    return this._response;
  }
}
