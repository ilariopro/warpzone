import { Array, Boolean, Composite, Number, Optional, Partial, Static, String } from '@sinclair/typebox';
import { StrictObject, StrictPick } from '../utils/schema-helpers';
import { PaginationQuery, SortingQuery } from '../utils/query-options';

const AdministratorRole = Object.freeze(['super', 'admin', 'demo']);

const Administrator = StrictObject({
  id: Optional(String({ format: 'uuid' })),
  firstName: String({ minLength: 1 }),
  lastName: Optional(String()),
  email: String({ format: 'email' }),
  password: String({ minLength: 6 }),
  role: Number({ minimum: 0, maximum: 2 }), // 0: super, 1: admin, 2: demo
  organizationId: String({ format: 'uuid' }),
  isVerified: Optional(Boolean()),
  createdAt: Optional(String({ format: 'date-time' })),
  updatedAt: Optional(String({ format: 'date-time' })),
});

const AdministratorPasswords = StrictObject({
  password: String({ minLength: 6 }),
  newPassword: String({ minLength: 6 }),
  confirmPassword: String({ minLength: 6 }),
});

const AdministratorQuery = Composite([
  PaginationQuery,
  SortingQuery('createdAt'),
  Partial(StrictPick(Administrator, ['organizationId'])),
  StrictObject({ role: Optional(Array(Number({ minimum: 0, maximum: 2 }))) }),
]);

type Administrator = Static<typeof Administrator>;

type AdministratorPasswords = Static<typeof AdministratorPasswords>;

type AdministratorQuery = Static<typeof AdministratorQuery>;

export { Administrator, AdministratorPasswords, AdministratorQuery, AdministratorRole };
