import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isNullOrEmpty } from '@warpzone/shared-utils';
import { useAdminContext } from '../contexts/admin-context';
import { sidebarNavigation } from '../../config';

const useCheckRole = (redirectTo = '/') => {
  const navigate = useNavigate();
  const { administrator } = useAdminContext();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isNullOrEmpty(administrator)) return;

    const navigationItem = sidebarNavigation.find((navItem) => pathname.startsWith(navItem.href));

    if (navigationItem && navigationItem.role < administrator.role) {
      navigate(redirectTo);
    }
  }, [administrator, navigate, pathname, redirectTo]);
};

export { useCheckRole };
