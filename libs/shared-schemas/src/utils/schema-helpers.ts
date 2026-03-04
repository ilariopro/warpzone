import { Object, ObjectOptions, Omit, Pick, TProperties, TSchema, Unsafe } from '@sinclair/typebox';

const StrictObject = <T extends TProperties>(properties: T, options: ObjectOptions = {}) =>
  Object(properties, { additionalProperties: false, ...options });

const StrictOmit = <S extends TSchema, T extends string[]>(
  schema: S,
  properties: [...T],
  options: ObjectOptions = {}
) => Omit(schema, [...properties], { additionalProperties: false, ...options });

const StrictPick = <S extends TSchema, T extends string[]>(
  schema: S,
  properties: [...T],
  options: ObjectOptions = {}
) => Pick(schema, [...properties], { additionalProperties: false, ...options });

const StringEnum = <T extends string[]>(values: [...T]) =>
  Unsafe<T[number]>({ type: 'string', enum: values });

export { StrictObject, StrictOmit, StrictPick, StringEnum };
