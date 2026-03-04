import { ComponentProps } from 'react';

interface TextAreaProps extends ComponentProps<'textarea'> {
  className?: string;
  error?: string;
  label: string;
  onChange: () => void;
  name: string;
  optional?: boolean;
  rows?: number;
  value?: string;
}

const TextArea = ({
  className,
  error,
  label,
  name,
  onChange,
  optional = false,
  rows = 3,
  value = '',
  ...textAreaProps
}: TextAreaProps) => {
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
      <textarea
        {...textAreaProps}
        id={name}
        name={name}
        rows={rows}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        defaultValue={value}
        onChange={onChange}
      />
      <div className="flex items-start max-sm:pb-2">
        <div className="flex-grow">{error && <small className="text-red-600">{error}</small>}</div>
      </div>
    </>
  );
};

export { TextArea, TextAreaProps };
