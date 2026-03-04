type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type RecursiveNullable<T> = {
  [P in keyof T]: T[P] extends object ? RecursiveNullable<T[P]> | null : T[P] | null;
};

export { type Nullable, type RecursiveNullable };
