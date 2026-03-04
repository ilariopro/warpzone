import { Number, Static } from '@sinclair/typebox';
import { StrictObject } from './schema-helpers';

const Metadata = StrictObject({
  count: Number({ minimum: 0 }),
  page: Number({ minimum: 0 }),
  pageSize: Number({ minimum: 0 }),
  total: Number({ minimum: 0 }),
  totalPages: Number({ minimum: 0 }),
});

type Metadata = Static<typeof Metadata>;

export { Metadata };
