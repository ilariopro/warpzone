import { Dispatch, SetStateAction } from 'react';
import { CustomAvatar, Dropdown, HeroIcon } from '@warpzone/web-ui';
import { useAdminContext } from '../../contexts/admin-context';
import { useAdministratorService } from '../../../administrators';
import { useAuthService } from '../../../auth';
import { useNavigate } from 'react-router-dom';

type TopbarProps = {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const AdminTopbar = ({ setSidebarOpen }: TopbarProps) => {
  const navigate = useNavigate();
  const { administrator } = useAdminContext();
  const { getFullName } = useAdministratorService();
  const { logoutAdministrator } = useAuthService();

  const userDropdown = [
    { id: 0, text: 'Your profile', onClick: () => navigate('profile') },
    { id: 1, text: 'Sign out', onClick: async () => await logoutAdministrator() },
  ];

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <HeroIcon icon="Bars3Icon" className="size-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          {/* <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <HeroIcon
            icon="MagnifyingGlassIcon"
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          /> */}
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Separator */}
          {/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" /> */}

          {/* Profile dropdown */}
          <Dropdown items={userDropdown}>
            <CustomAvatar name={administrator.email} size={40} variant="pixel" />
            <span className="hidden lg:flex lg:items-center ">
              <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                {getFullName(administrator)}
              </span>
              <HeroIcon icon="ChevronDownIcon" className="ml-2 size-5 text-gray-400" />
            </span>
            <span className="sr-only">Open user menu</span>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export { AdminTopbar, TopbarProps };
