import {
  IPaginationOptions,
  InfinityPaginationResultType,
} from '@qbick/shared';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResultType<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
