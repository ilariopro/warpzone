import { Number, Optional, Static, String } from '@sinclair/typebox';
import { StrictObject } from '../utils/schema-helpers';

const AuthPayload = StrictObject({
  email: String({ format: 'email' }),
  password: String({ minLength: 6 }),
});

const RefreshToken = StrictObject({
  id: Optional(Number()),
  userId: String({ format: 'uuid' }),
  token: String(),
  family: String({ minLength: 6, maxLength: 6 }),
  issuedAt: String({ format: 'date-time' }),
  expireAt: String({ format: 'date-time' }),
});

type AuthPayload = Static<typeof AuthPayload>;

type RefreshToken = Static<typeof RefreshToken>;

export { AuthPayload, RefreshToken };
