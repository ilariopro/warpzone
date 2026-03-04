import Ajv, { Options, AnySchema } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { capitalize } from './string-utils';

type AjvValidationError<T> = {
  [K in keyof T]?: T[K] extends object ? AjvValidationError<T[K]> : string;
};

class AjvValidator {
  protected readonly ajv: Ajv;

  constructor(config?: Options) {
    this.ajv = new Ajv({
      ...config,
      allErrors: config && config.allErrors,
    });

    addFormats(this.ajv);
  }

  validate<S extends AnySchema, T>(schema: S, data: T): AjvValidationError<T> | null {
    this.ajv.validate(schema, data);

    if (!this.ajv.errors) {
      return null;
    }

    return this.ajv.errors.reduce((previous, current) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const message = current.message!.replace(/"/g, "'");
      const path = current.instancePath?.replace('/', '');
      const key = path || Object.keys(data as object).shift();

      return {
        ...previous,
        [`${key}`]: path ? `${capitalize(path)} ${message}` : `${capitalize(message)}`,
      };
    }, {} as AjvValidationError<T>);
  }
}

export { AjvValidator, type AjvValidationError };
