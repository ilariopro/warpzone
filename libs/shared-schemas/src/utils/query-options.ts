import { Array, Number, Partial, Static, String } from '@sinclair/typebox';
import { StrictObject, StringEnum } from './schema-helpers';

const IncludeQuery = Partial(StrictObject({ include: Array(String()) }));

const PaginationQuery = Partial(
  StrictObject({
    page: Number(),
    pageSize: Number(),
  })
);

const SearchQuery = Partial(StrictObject({ search: String() }));

const SortingQuery = <K extends string[]>(...order: K) => {
  const orderBy: string[] = [];

  order.forEach((item) => (orderBy.push(`${item} asc`), orderBy.push(`${item} desc`)));

  return Partial(StrictObject({ order: StringEnum(orderBy) }));
};

type IncludeQuery = Static<typeof IncludeQuery>;

type PaginationQuery = Static<typeof PaginationQuery>;

type SearchQuery = Static<typeof SearchQuery>;

export { IncludeQuery, PaginationQuery, SearchQuery, SortingQuery };
