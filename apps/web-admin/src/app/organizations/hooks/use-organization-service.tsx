import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Metadata, Organization, OrganizationGame } from '@warpzone/shared-schemas';
import { useNotificationContext } from '../../shared';
import { ajv, apiClient, defaultPagination } from '../../config';

const useOrganizationService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showDialog, showMessage } = useNotificationContext();

  const createOrganization = async (organization: Organization) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ organizationId: string }>({
        method: 'POST',
        url: `/organizations`,
        data: organization,
        withAuthentication: true,
      });

      showMessage({ level: 'success', text: `Organization '${organization.name}' created` });

      return response.organizationId;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizationGames = async (organizationId: string) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ games: OrganizationGame[] }>({
        method: 'GET',
        url: `/organizations/${organizationId}/games`,
        withAuthentication: true,
      });

      return response.games;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrganizationGames = async (organizationId: string, games: OrganizationGame[]) => {
    try {
      setIsLoading(true);

      await apiClient.request({
        method: 'POST',
        url: `/organizations/${organizationId}/games`,
        data: games,
        withAuthentication: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganization = async (organizationId: string) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ organization: Organization }>({
        method: 'GET',
        url: `/organizations/${organizationId}`,
        withAuthentication: true,
      });

      const organization = response.organization;
      const games = await fetchOrganizationGames(organizationId);

      return { organization, games };
    } catch (error) {
      console.log(error);

      showDialog({
        level: 'error',
        icon: 'ExclamationTriangleIcon',
        title: 'Internal Error',
        text: 'An error occurred while loading data, please reload the page',
        buttonText: 'Reload',
        cancelButton: false,
        onClick: () => navigate(0),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizations = async (searchParams?: URLSearchParams) => {
    try {
      setIsLoading(true);

      const query = [
        `/organizations?order=${searchParams?.get('order') ?? 'createdAt desc'}`,
        `&page=${searchParams?.get('page') ?? 1}`,
        `&pageSize=${searchParams?.get('pageSize') ?? defaultPagination}`,
        searchParams?.has('search') ? `&search=${searchParams.get('search')}` : '',
      ];

      const response = await apiClient.request<{ organizations: Organization[]; meta: Metadata }>({
        method: 'GET',
        url: query.join('').trim(),
        withAuthentication: true,
      });

      return {
        organizations: response.organizations,
        meta: response.meta,
      };
    } catch (error) {
      console.log(error);

      showDialog({
        level: 'error',
        icon: 'ExclamationTriangleIcon',
        title: 'Internal Error',
        text: 'An error occurred while loading data, please reload the page',
        buttonText: 'Reload',
        cancelButton: false,
        onClick: () => navigate(0),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrganization = (organization: Organization, callback?: () => void) => {
    showDialog({
      buttonText: 'Delete',
      icon: 'ExclamationTriangleIcon',
      level: 'error',
      title: `Delete: ${organization.name}`,
      text: 'Are you really sure you want to permanently delete this organization?',
      onClick: async () => {
        try {
          setIsLoading(true);

          if (callback) {
            callback();
          }

          await apiClient.request({
            method: 'DELETE',
            url: `/organizations/${organization.id}`,
            withAuthentication: true,
          });

          showMessage({ level: 'success', text: `Organization '${organization.name}' removed` });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const updateOrganization = async (organization: Organization) => {
    try {
      setIsLoading(true);

      await apiClient.request({
        method: 'PATCH',
        url: `/organizations/${organization.id}`,
        data: organization,
        withAuthentication: true,
      });

      showMessage({ level: 'success', text: `Organization '${organization.name}' updated` });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateOrganization = (organization: Organization) => {
    const errors = ajv.validate(Organization, organization);

    if (errors) {
      showMessage({ level: 'error', text: 'Invalid Organization. Check for validation errors' });
    }

    return errors;
  };

  return {
    createOrganization,
    deleteOrganization,
    fetchOrganization,
    fetchOrganizations,
    fetchOrganizationGames,
    isLoading,
    saveOrganizationGames,
    updateOrganization,
    validateOrganization,
  };
};

export { useOrganizationService };
