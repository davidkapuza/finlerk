import {
  IPaginationOptions,
  InfinityPaginationResultType,
} from '@finlerk/shared';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResultType<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
