import { ComponentProps, ReactNode } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  children: string | number | ReactNode | ReactNode[];
  className?: string;
  disabled?: boolean;
  rounded?: 'normal' | 'full';
  size?: 'normal' | 'small';
  variant?: 'error' | 'neutral' | 'primary' | 'success' | 'transparent' | 'warning';
}

const Button = ({
  children,
  className,
  disabled = false,
  rounded = 'normal',
  size = 'normal',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) => {
  const { type = 'button' } = buttonProps;

  const classes = [
    'flex items-center gap-x-1 text-sm font-semibold',
    rounded === 'normal' ? 'rounded-md' : 'rounded-full',
    size === 'normal' ? 'px-3 py-2' : 'px-2 py-1.5',
  ];

  switch (variant) {
    case 'error':
      classes.push(
        disabled
          ? 'bg-red-400 text-white shadow-sm cursor-not-allowed'
          : 'bg-red-600 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
      );
      break;

    case 'neutral':
      classes.push(
        disabled
          ? 'bg-white text-gray-400 shadow-sm cursor-not-allowed ring-gray-200 ring-1 ring-inset'
          : 'bg-white text-gray-900 shadow-sm hover:ring-gray-400 ring-gray-300 ring-1 ring-inset'
      );
      break;
    case 'primary':
      classes.push(
        disabled
          ? 'bg-indigo-400 text-white shadow-sm cursor-not-allowed'
          : 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      );
      break;
    case 'success':
      classes.push(
        disabled
          ? 'bg-green-400 text-white shadow-sm  cursor-not-allowed'
          : 'bg-green-600 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
      );
      break;
    case 'transparent':
      classes.push(
        disabled ? 'text-indigo-300 cursor-not-allowed ' : 'text-indigo-600 hover:text-indigo-500'
      );
      break;
    case 'warning':
      classes.push(
        disabled
          ? 'bg-yellow-400 text-white shadow-sm cursor-not-allowed'
          : 'bg-yellow-600 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600'
      );
      break;
  }

  const getClassName = () =>
    classes
      .join(' ')
      .concat(' ', className ?? '')
      .trim();

  return (
    <button {...buttonProps} className={getClassName()} type={type}>
      {children}
    </button>
  );
};

export { Button, ButtonProps };
