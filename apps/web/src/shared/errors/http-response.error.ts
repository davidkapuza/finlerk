export class HttpResponseError extends Error {
  private readonly _response: Response;
  constructor(response) {
    super(`${response.status} ${response.statusText}`);
    this._response = response;
  }

  get response() {
    return this._response;
  }
}
