import { Link, useLocation } from 'react-router-dom';
import { capitalize, classNames } from '@warpzone/shared-utils';
import { HeroIcon } from './hero-icon';

type VerticalNavigationItem = {
  id?: string | number;
  href: string;
  icon: string | boolean;
  text: string;
};

type VerticalNavigationProps = {
  className?: string;
  items: VerticalNavigationItem[];
};

const VerticalNavigation = ({ className, items }: VerticalNavigationProps) => {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }

    return pathname.startsWith(path);
  };

  return (
    <ul className={[className, '-mx-2 space-y-1'].join(' ').trim()}>
      {items &&
        items.map((item, index) => (
          <li key={item.id ?? index}>
            <Link
              to={item.href}
              className={classNames(
                isActive(item.href)
                  ? 'bg-gray-50 text-indigo-600'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
              )}
            >
              {typeof item.icon === 'string' && (
                <HeroIcon
                  icon={item.icon}
                  className={classNames(
                    isActive(item.href) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                    'h-6 w-6 shrink-0'
                  )}
                />
              )}
              {item.icon === true && (
                <span
                  className={classNames(
                    isActive(item.href)
                      ? 'text-indigo-600 border-indigo-600'
                      : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                  )}
                >
                  {capitalize(item.text).charAt(0)}
                </span>
              )}
              {item.text}
            </Link>
          </li>
        ))}
    </ul>
  );
};

export { VerticalNavigation, VerticalNavigationProps };
