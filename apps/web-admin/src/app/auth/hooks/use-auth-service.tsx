import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Administrator, AuthPayload, OrganizationGame } from '@warpzone/shared-schemas';
import { useAdminContext, useNotificationContext } from '../../shared';
import { ajv, apiClient } from '../../config';

const useAuthService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setAdministrator, setGames } = useAdminContext();
  const { showMessage } = useNotificationContext();

  const loginAdministrator = async (authPayload: AuthPayload) => {
    try {
      setIsLoading(true);

      const accessTokenResponse = await apiClient.request<{ accessToken: string }>({
        method: 'POST',
        url: '/auth/login',
        data: authPayload,
        // withAuthentication: true,
        withCredentials: true,
      });

      const accessToken = accessTokenResponse.accessToken;
      localStorage.setItem('accessToken', accessToken);

      const adminResponse = await apiClient.request<{ administrator: Administrator }>({
        method: 'GET',
        url: `/administrators/${jwtDecode(accessToken).sub}`,
        withAuthentication: true,
      });

      const gameResponse = await apiClient.request<{ games: OrganizationGame[] }>({
        method: 'GET',
        url: `/organizations/${adminResponse.administrator.organizationId}/games`,
        withAuthentication: true,
      });

      setAdministrator(adminResponse.administrator);
      setGames(gameResponse.games);
      navigate('/');
    } catch (error) {
      console.log(error);

      showMessage({ level: 'error', text: 'Administrator not found' });
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdministrator = async () => {
    try {
      setIsLoading(true);

      await apiClient.request({
        method: 'DELETE',
        url: `/auth/refresh-token`,
        withCredentials: true,
        withAuthentication: true,
      });

      localStorage.removeItem('accessToken');

      setAdministrator({} as Administrator);
      navigate('/login');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateLogin = (authPayload: AuthPayload) => ajv.validate(AuthPayload, authPayload);

  return {
    isLoading,
    loginAdministrator,
    logoutAdministrator,
    validateLogin,
  };
};

export { useAuthService };
