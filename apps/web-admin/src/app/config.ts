import { AjvValidator, ApiClient } from '@warpzone/shared-utils';

export const ajv = new AjvValidator({ allErrors: true });

export const baseUrl = import.meta.env.VITE_API_GAMING_MANAGER_ORIGIN;

export const apiClient = new ApiClient({
  baseUrl,
  accessTokenName: 'accessToken',
  refreshTokenName: 'refreshToken',
  refreshTokenUrl: `${baseUrl}/auth/refresh-token`,
});

export const defaultPagination = 10;

export const environment = import.meta.env.VITE_ENVIRONMENT;

export const sidebarNavigation = [
  { id: 0, text: 'Dashboard', href: '/', icon: 'HomeIcon', role: 2 },
  { id: 1, text: 'Organizations', href: '/organizations', icon: 'BuildingOffice2Icon', role: 0 },
  { id: 2, text: 'Administrators', href: '/administrators', icon: 'UsersIcon', role: 1 },
  { id: 3, text: 'Players', href: '/players', icon: 'UserGroupIcon', role: 2 },
  { id: 4, text: 'Scores', href: '/scores', icon: 'ChartBarIcon', role: 2 },
];
