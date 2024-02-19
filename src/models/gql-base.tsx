export type GqlQueryResponse<T, U extends string> = {
  [key in U]: T;
};

export interface GqlPaginatedResponse<T> {
  totalItems: number;
  items: Array<T>;
}
