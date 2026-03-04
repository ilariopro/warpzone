import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { classNames } from '@warpzone/shared-utils';

type DropdownItem = {
  id?: string | number;
  screenReaderText?: string;
  text: string;
  onClick?: () => void;
};

type DropdownProps = {
  children: ReactNode;
  items: DropdownItem[];
};

const Dropdown = ({ children, items }: DropdownProps) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="-m-1.5 flex items-center p-1.5">{children}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {items.map((item, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? 'bg-gray-50' : '',
                    'block px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left'
                  )}
                  onClick={item.onClick}
                >
                  {item.text}
                  {item.screenReaderText && <span className="sr-only"> {item.screenReaderText}</span>}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export { Dropdown, DropdownItem, DropdownProps };
