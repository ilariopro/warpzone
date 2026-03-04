import { ComponentProps } from 'react';

interface FormInputProps extends ComponentProps<'input'> {
  className?: string;
  error?: string;
  label: string;
  name: string;
  optional?: boolean;
  value?: string;
}

const FormInput = ({
  className,
  error,
  label,
  name,
  optional = false,
  value = '',
  ...inputProps
}: FormInputProps) => {
  const { type = 'text' } = inputProps;

  const getClassName = () => {
    const classes = [
      'block w-full text-sm rounded-md border-0 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 leading-6',
      'ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600',
      'disabled:cursor-not-allowed disabled:bg-gray-50',
    ];

    return classes
      .join(' ')
      .concat(' ', className ?? '')
      .trim();
  };

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
      <input {...inputProps} id={name} name={name} type={type} value={value} className={getClassName()} />
      <div className="flex items-start max-sm:pb-2">
        <div className="flex-grow">{error && <small className="text-red-600">{error}</small>}</div>
      </div>
    </>
  );
};

export { FormInput, FormInputProps };
