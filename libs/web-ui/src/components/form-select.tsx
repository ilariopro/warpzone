import { ComponentProps } from 'react';
import { classNames } from '@warpzone/shared-utils';

interface FormSelectProps extends ComponentProps<'select'> {
  className?: string;
  defaultValue?: string;
  error?: string;
  label: string;
  optional?: boolean;
  name: string;
  values: string[];
}

const FormSelect = ({
  className,
  defaultValue = '',
  error,
  label,
  name,
  optional = false,
  values,
  ...selectProps
}: FormSelectProps) => {
  return (
    <>
      <div className="flex justify-between mb-2">
        <label htmlFor={name} className="block font-medium text-sm leading-6 text-gray-900">
          {label}
        </label>
        {optional && (
          <span className="text-sm leading-6 text-gray-500" id={`${name}-optional`}>
            Optional
          </span>
        )}
      </div>
      <select
        {...selectProps}
        id={name}
        name={name}
        className={classNames(
          className ?? '',
          'block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
        )}
        value={defaultValue}
      >
        {values.map((value, index) => (
          <option key={index} value={index}>
            {value}
          </option>
        ))}
      </select>
      <div className="flex items-start max-sm:pb-2">
        <div className="flex-grow">{error && <small className="text-red-600">{error}</small>}</div>
      </div>
    </>
  );
};

export { FormSelect, FormSelectProps };
