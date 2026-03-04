import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { classNames } from '@warpzone/shared-utils';
import { CustomAvatar, CustomAvatarProps } from './custom-avatar';
import { HeroIcon } from './hero-icon';
import { HandleChange } from '../hooks/use-form';

type ComboBoxItem = {
  id?: string | number;
  value: string;
};

type ComboBoxProps = {
  avatar?: Pick<CustomAvatarProps, 'size' | 'variant'>;
  className?: string;
  error?: string;
  label: string;
  name: string;
  items: ComboBoxItem[];
  onChange?: HandleChange;
  onSelection: (item: ComboBoxItem) => void;
};

const ComboBox = ({ avatar, className, error, label, name, items, onChange, onSelection }: ComboBoxProps) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ComboBoxItem | null>(null);

  const filteredItems =
    query === '' ? items : items.filter((item) => item.value.toLowerCase().includes(query.toLowerCase()));

  const handleChange: HandleChange = (event) => {
    setQuery(event.target.value);

    if (onChange) {
      onChange(event);
    }
  };

  const handleSelection = (item: ComboBoxItem) => {
    onSelection(item);
    setQuery('');
    setSelected(null);
  };

  return (
    <Combobox as="div" className={className} value={selected} onChange={handleSelection}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">{label}</Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={handleChange}
          name={name}
          onBlur={() => setQuery('')}
          displayValue={(item: ComboBoxItem) => item?.value}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <HeroIcon icon="ChevronUpDownIcon" className="size-5 text-gray-400" />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredItems.map((item, index) => (
            <Combobox.Option
              key={item.id ?? index}
              value={item}
              className={({ active }) =>
                classNames(
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                  active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                )
              }
            >
              {({ active, selected }) => (
                <>
                  <div className="flex items-center">
                    {avatar && <CustomAvatar {...avatar} name={item.value} />}
                    <span
                      className={classNames(
                        'truncate',
                        avatar !== undefined && 'ml-3',
                        selected && 'font-semibold'
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                  {selected && (
                    <span
                      className={classNames(
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                        active ? 'text-white' : 'text-indigo-600'
                      )}
                    >
                      <HeroIcon icon="CheckIcon" className="size-5" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}
          {!filteredItems.length && (
            <Combobox.Option
              key={'new'}
              value={{ value: query }}
              className={({ active }) =>
                classNames(
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                  active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                )
              }
            >
              {({ active, selected }) => (
                <>
                  <div className="flex items-center">
                    <div className="relative inline-flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500">
                      <span className="absolute -inset-2" />
                      <span className="sr-only">Add team member</span>
                      <HeroIcon icon="PlusIcon" className="size-5" />
                    </div>
                    <span
                      className={classNames(
                        'truncate',
                        avatar !== undefined && 'ml-3',
                        selected && 'font-semibold'
                      )}
                    >
                      {query}
                    </span>
                  </div>
                  {selected && (
                    <span
                      className={classNames(
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                        active ? 'text-white' : 'text-indigo-600'
                      )}
                    >
                      <HeroIcon icon="CheckIcon" className="size-5" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          )}
        </Combobox.Options>
      </div>
      <div className="flex items-start max-sm:pb-2">
        <div className="flex-grow">{error && <small className="text-red-600">{error}</small>}</div>
      </div>
    </Combobox>
  );
};

export { ComboBox, ComboBoxItem, ComboBoxProps };
