import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Administrator, AdministratorPasswords, Metadata } from '@warpzone/shared-schemas';
import { useAdminContext, useNotificationContext } from '../../shared';
import { ajv, apiClient, defaultPagination } from '../../config';

const useAdministratorService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { administrator: administratorCtx } = useAdminContext();
  const { showDialog, showMessage } = useNotificationContext();

  const getFullName = (admin: Administrator) => admin.firstName?.concat(' ', admin.lastName ?? '').trim();

  const createAdministrator = async (administrator: Administrator) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ administratorId: string }>({
        method: 'POST',
        url: `/administrators`,
        data: administrator,
        withAuthentication: true,
      });

      showMessage({ level: 'success', text: `Administrator '${getFullName(administrator)}' created` });

      return response.administratorId;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAdministrator = (administrator: Administrator, callback?: () => void) => {
    showDialog({
      buttonText: 'Delete',
      icon: 'ExclamationTriangleIcon',
      level: 'error',
      title: `Delete: ${getFullName(administrator)}`,
      text: 'Are you really sure you want to permanently delete this administrator?',
      onClick: async () => {
        try {
          setIsLoading(true);

          if (callback) {
            callback();
          }

          await apiClient.request({
            method: 'DELETE',
            url: `/administrators/${administrator.id}`,
            withAuthentication: true,
          });

          showMessage({ level: 'success', text: `Administrator '${getFullName(administrator)}' removed` });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const fetchAdministrator = async (administratorId: string) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ administrator: Administrator }>({
        method: 'GET',
        url: `/administrators/${administratorId}`,
        withAuthentication: true,
      });

      return response.administrator;
    } catch (error) {
      console.log(error);

      showDialog({
        level: 'error',
        icon: 'ExclamationTriangleIcon',
        title: 'Internal Error',
        text: 'An error occurred while loading data, please reload the page',
        buttonText: 'Reload',
        cancelButton: false,
        onClick: () => navigate(administratorId ? 0 : -1),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdministrators = async (searchParams?: URLSearchParams) => {
    try {
      setIsLoading(true);

      const query = [
        `/administrators?order=${searchParams?.get('order') ?? 'createdAt desc'}`,
        `&page=${searchParams?.get('page') ?? 1}`,
        `&pageSize=${searchParams?.get('pageSize') ?? defaultPagination}`,
        `&organizationId=${searchParams?.get('organizationId') ?? administratorCtx.organizationId}`,
        searchParams?.has('role') ? `&role=${searchParams.get('role')}` : '',
      ];

      const response = await apiClient.request<{ administrators: Administrator[]; meta: Metadata }>({
        method: 'GET',
        url: query.join('').trim(),
        withAuthentication: true,
      });

      const administrators = response.administrators.filter((admin) => admin.id !== administratorCtx.id);
      const meta = {
        ...response.meta,
        count: administrators.length,
        total: response.meta.total - 1,
      };

      return { administrators, meta };
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

  const updateAdministrator = async (administrator: Administrator) => {
    try {
      setIsLoading(true);
      await apiClient.request({
        method: 'PATCH',
        url: `/administrators/${administrator.id}`,
        data: administrator,
        withAuthentication: true,
      });

      showMessage({ level: 'success', text: `Administrator '${getFullName(administrator)}' updated` });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAdministrator = (administrator: Administrator) => {
    const errors = ajv.validate(Administrator, administrator);

    if (errors) {
      showMessage({ level: 'error', text: 'Invalid Player. Check for validation errors' });
    }

    return errors;
  };

  const validatePasswords = (password: string, newPassword: string, confirmPassword: string) =>
    ajv.validate(AdministratorPasswords, { password, newPassword, confirmPassword });

  return {
    createAdministrator,
    deleteAdministrator,
    fetchAdministrator,
    fetchAdministrators,
    getFullName,
    isLoading,
    updateAdministrator,
    validateAdministrator,
    validatePasswords,
  };
};

export { useAdministratorService };
