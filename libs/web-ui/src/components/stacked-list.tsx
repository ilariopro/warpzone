import { CustomAvatar, CustomAvatarProps } from './custom-avatar';
import { Dropdown, DropdownItem } from './dropdown';
import { HeroIcon } from './hero-icon';
import { Image, ImageProps } from './image';

type StackedListItem = {
  id?: string | number;
  actions?: DropdownItem[];
  avatar?: CustomAvatarProps;
  image?: ImageProps;
  title: string;
  subTitle?: string;
  info?: string;
  subInfo?: string;
};

type StackedListProps = {
  items: StackedListItem[];
};

const StackedList = ({ items }: StackedListProps) => {
  return (
    <ul className="border-t border-gray-200 divide-y divide-gray-100">
      {items.map((item, index) => (
        <li key={item.id ?? index} className="relative flex items-center justify-between gap-x-6 py-6">
          <div className="flex gap-x-4 pr-6 items-center sm:w-1/2 sm:flex-none">
            {item.image && <Image {...item.image} />}
            {item.avatar && <CustomAvatar name={item.avatar.name} variant={item.avatar.variant} />}
            <div className="whitespace-nowrap text-sm leading-6">
              <p className="font-semibold text-gray-900">{item.title}</p>
              {item.subTitle && (
                <p className="mt-1 flex text-xs text-gray-500">
                  <span className="truncate">{item.subTitle}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
            {(item.info || item.subInfo) && (
              <div className="hidden sm:block">
                <p className="text-sm leading-5 text-gray-900">{item.info}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{item.subInfo}</p>
              </div>
            )}
            {item.actions && (
              <div className="flex flex-none items-center gap-x-4 ml-auto md:px-6">
                <Dropdown items={item.actions}>
                  <span className="sr-only">Open options</span>
                  <HeroIcon icon="EllipsisVerticalIcon" />
                </Dropdown>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export { StackedList, StackedListItem, StackedListProps };
