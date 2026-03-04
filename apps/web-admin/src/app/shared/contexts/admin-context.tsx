import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Administrator, OrganizationGame } from '@warpzone/shared-schemas';
import { apiClient } from '../../config';

type AdminContextType = {
  administrator: Administrator;
  games: OrganizationGame[];
  organizationId: string;
  setAdministrator: Dispatch<SetStateAction<Administrator>>;
  setGames: Dispatch<SetStateAction<OrganizationGame[]>>;
};

const AdminContext = createContext<AdminContextType | null>(null);

const AdminProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [administrator, setAdministrator] = useState<Administrator>({} as Administrator);
  const [games, setGames] = useState<OrganizationGame[]>([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          const response = await apiClient.request<{ administrator: Administrator }>({
            method: 'GET',
            url: `/administrators/${jwtDecode(accessToken).sub}`,
            withAuthentication: true,
          });

          const { administrator } = response;

          setAdministrator(administrator);

          if (administrator) {
            const response = await apiClient.request<{ games: OrganizationGame[] }>({
              method: 'GET',
              url: `/organizations/${administrator.organizationId}/games`,
              withAuthentication: true,
            });

            setGames(response.games);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const context = {
    administrator,
    games,
    organizationId: administrator.organizationId,
    setAdministrator,
    setGames,
  };

  return (
    !isLoading && (
      <AdminContext.Provider value={context as AdminContextType}>{children}</AdminContext.Provider>
    )
  );
};

const useAdminContext = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('Form error: useAdminContext must be used within a AdminProvider');
  }

  return context;
};

export { AdminProvider, useAdminContext, AdminContext };
