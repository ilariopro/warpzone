import { Image, VerticalNavigation } from '@warpzone/web-ui';
import { useAdminContext } from '../../contexts/admin-context';
import { sidebarNavigation } from '../../../config';

const AdminSidebar = () => {
  const { administrator, games } = useAdminContext();
  const navigationItems = sidebarNavigation.filter((navItem) => administrator.role <= navItem.role);

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <Image
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          altText="Warpzone"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <VerticalNavigation items={navigationItems} />
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400 pb-2">Games</div>
            <VerticalNavigation
              items={games.map((game) => {
                return {
                  href: `/games/${game.id}/campaigns`,
                  icon: true,
                  text: game.title,
                };
              })}
            />
          </li>
          <li className="mt-auto">
            <VerticalNavigation
              className="mt-2"
              items={[
                {
                  href: '/settings',
                  icon: 'Cog6ToothIcon',
                  text: 'Settings',
                },
              ]}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export { AdminSidebar };
