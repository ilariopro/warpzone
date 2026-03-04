import { useEffect, useState } from 'react';
import { classNames } from '@warpzone/shared-utils';
import { HeroIcon } from './hero-icon';

type AlertMessageProps = {
  icon?: string;
  level?: 'error' | 'info' | 'success' | 'warning';
  text: string;
  description?: string;
};

const AlertMessage = ({ level = 'info', icon, text, description }: AlertMessageProps) => {
  const [uniqueKey, setUniqueKey] = useState(Date.now());
  const [show, setShow] = useState(true);

  const colors = {
    error: {
      background: 'bg-red-50',
      hover: 'hover:bg-red-100',
      icon: 'text-red-400',
      text: 'text-red-800',
      description: 'text-red-500',
    },
    info: {
      background: 'bg-blue-50',
      hover: 'hover:bg-blue-100',
      icon: 'text-blue-400',
      text: 'text-blue-800',
      description: 'text-blue-500',
    },
    success: {
      background: 'bg-green-50',
      hover: 'hover:bg-green-100',
      icon: 'text-green-400',
      text: 'text-green-800',
      description: 'text-green-500',
    },
    warning: {
      background: 'bg-yellow-50',
      hover: 'hover:bg-yellow-100',
      icon: 'text-yellow-400',
      text: 'text-yellow-800',
      description: 'text-yellow-500',
    },
  };

  const icons = {
    error: 'ExclamationTriangleIcon',
    info: 'ExclamationCircleIcon',
    success: 'CheckCircleIcon',
    warning: 'ExclamationTriangleIcon',
  };

  useEffect(() => {
    setUniqueKey(Date.now());
  }, [text, description]);

  return (
    show && (
      <div
        key={uniqueKey}
        className={classNames(
          colors[level].background,
          'fixed top-0 left-1/2 transform -translate-x-1/2 w-full',
          'py-6 px-3 md:px-6 mb-8 z-50 shadow-md'
        )}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <HeroIcon icon={icon || icons[level]} className={`h-5 w-5 ${colors[level].icon}`} />
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${colors[level].text}`}>{text}</h3>
            {description && (
              <div className={`mt-2 text-sm ${colors[level].description}`}>
                <p>{description}</p>
              </div>
            )}
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-0.5 -my-1.5">
              <button
                type="button"
                className={classNames(
                  'inline-flex rounded-md focus:outline-none focus:ring-2',
                  `${colors[level].background} p-1.5 ${colors[level].description} ${colors[level].hover}`
                )}
                onClick={() => setShow(false)}
              >
                <span className="sr-only">Dismiss</span>
                <HeroIcon icon="XMarkIcon" className={`h-5 w-5 ${colors[level].icon}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export { AlertMessage, AlertMessageProps };
