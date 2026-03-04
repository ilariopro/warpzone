import { classNames } from '@warpzone/shared-utils';
import { ComponentProps } from 'react';

interface CheckBoxProps extends ComponentProps<'input'> {
  className?: string;
  description?: string;
  error?: string;
  label: string;
  name: string;
  value: string;
}

const CheckBox = ({ className, description, error, label, name, value, ...checkBoxProps }: CheckBoxProps) => {
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          {...checkBoxProps}
          id={name}
          aria-describedby={description ? `${name}-description` : undefined}
          name={name}
          type="checkbox"
          className={classNames(
            'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600',
            className ?? ''
          )}
          value={value}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={name} className="font-medium text-gray-900">
          {label}
        </label>
        {description && (
          <p id={`${name}-description`} className="text-gray-500">
            {description}
          </p>
        )}
        <div className="flex items-start max-sm:pb-2">
          <div className="flex-grow">{error && <small className="text-red-600">{error}</small>}</div>
        </div>
      </div>
    </div>
  );
};

export { CheckBox, CheckBoxProps };
