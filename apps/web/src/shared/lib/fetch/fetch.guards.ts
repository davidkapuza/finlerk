import {
  GenericError,
  PreparationError,
  PREPARATION,
  HttpError,
  HTTP,
  NetworkError,
  NETWORK,
} from './fetch.types';

export function isPreparationError(
  error: GenericError,
): error is PreparationError {
  return error?.errorType === PREPARATION;
}

export function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errorType' in error &&
    error?.errorType === HTTP
  );
}

export function isHttpErrorCode<Code extends number>(code: Code | Code[]) {
  return function isExactHttpError(
    error: GenericError,
  ): error is HttpError<Code> {
    if (!isHttpError(error)) {
      return false;
    }

    const codes = Array.isArray(code) ? code : [code];

    return codes.includes(error.status as Code);
  };
}

export function isNetworkError(error: GenericError): error is NetworkError {
  return error?.errorType === NETWORK;
}
