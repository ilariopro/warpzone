import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HeroIcon } from './hero-icon';
import { Button } from './button';

type DialogOverlayProps = {
  buttonText?: string;
  cancelButton?: boolean;
  icon?: string;
  level?: 'error' | 'info' | 'success' | 'warning';
  title: string;
  text: string;
  onClick: () => void | Promise<void>;
  onClose?: () => void;
};

const DialogOverlay = ({
  buttonText = 'Confirm',
  cancelButton = true,
  icon,
  level = 'info',
  title,
  text,
  onClick,
  onClose,
}: DialogOverlayProps) => {
  const [uniqueKey, setUniqueKey] = useState(Date.now());
  const [show, setShow] = useState(true);

  useEffect(() => {
    setUniqueKey(Date.now());
  }, [title, text]);

  const colors = {
    error: {
      background: 'bg-red-100',
      icon: 'text-red-600',
    },
    info: {
      background: 'bg-indigo-100',
      icon: 'text-red-600',
    },
    success: {
      background: 'bg-green-100',
      icon: 'text-red-600',
    },
    warning: {
      background: 'bg-yellow-100',
      icon: 'text-red-600',
    },
  };

  const handleClick = async () => {
    try {
      await onClick();
    } finally {
      setShow(false);

      if (onClose) {
        onClose();
      }
    }
  };

  const handleClose = async () => {
    setShow(false);

    if (onClose) {
      onClose();
    }
  };

  return (
    <Transition.Root key={uniqueKey} show={show} as={Fragment}>
      <Dialog className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  {icon && (
                    <div
                      className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors[level].background} sm:mx-0 sm:h-10 sm:w-10`}
                    >
                      <HeroIcon icon={icon} className={`${colors[level].icon} size-6`} />
                    </div>
                  )}
                  <div className="my-4 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{text}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    className="inline-flex w-full justify-center sm:ml-3 sm:w-auto"
                    variant={level !== 'info' ? level : 'primary'}
                    onClick={handleClick}
                  >
                    {buttonText}
                  </Button>
                  {cancelButton && (
                    <Button
                      className="mt-3 inline-flex w-full justify-center sm:mt-0 sm:w-auto"
                      variant="neutral"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export { DialogOverlay, DialogOverlayProps };
