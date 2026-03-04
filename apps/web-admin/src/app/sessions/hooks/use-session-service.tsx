import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Metadata, Session } from '@warpzone/shared-schemas';
import { useNotificationContext } from '../../shared';
import { ajv, apiClient, defaultPagination } from '../../config';

const useSessionService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showDialog, showMessage } = useNotificationContext();

  const createSession = async (session: Session, sessionName: string) => {
    try {
      const response = await apiClient.request<{ sessionId: string }>({
        method: 'POST',
        url: `/sessions`,
        data: session,
        withAuthentication: true,
      });

      showMessage({ level: 'success', text: `Session ${sessionName} added` });

      return response.sessionId;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSession = async (session: Session, sessionName: string, callback?: () => void) => {
    showDialog({
      buttonText: 'Delete',
      icon: 'ExclamationTriangleIcon',
      level: 'error',
      title: `Delete: ${sessionName}`,
      text: 'Are you really sure you want to permanently delete this session?',
      onClick: async () => {
        try {
          setIsLoading(true);

          if (callback) {
            callback();
          }

          await apiClient.request({
            method: 'DELETE',
            url: `/sessions/${session.id}`,
            withAuthentication: true,
          });

          showMessage({ level: 'success', text: `Session '${sessionName}' removed` });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const fetchSessions = async (searchParams?: URLSearchParams) => {
    try {
      setIsLoading(true);

      const query = [
        `/sessions?order=${searchParams?.get('order') ?? 'createdAt desc'}`,
        `&page=${searchParams?.get('page') ?? 1}`,
        `&pageSize=${searchParams?.get('pageSize') ?? defaultPagination}`,
        searchParams?.has('campaignId') ? `&campaignId=${searchParams.get('campaignId')}` : '',
      ];

      const response = await apiClient.request<{ sessions: Session[]; meta: Metadata }>({
        method: 'GET',
        url: query.join('').trim(),
        withAuthentication: true,
      });

      return {
        meta: response.meta,
        sessions: response.sessions,
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

  const updateSession = async (session: Session, sessionName: string) => {
    try {
      setIsLoading(true);

      await apiClient.request({
        method: 'PATCH',
        url: `/sessions/${session.id}`,
        data: session,
        withAuthentication: true,
      });

      showMessage({ level: 'success', text: `Session '${sessionName}' updated` });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateSession = (session: Session) => {
    const errors = ajv.validate(Session, session);

    if (errors) {
      showMessage({ level: 'error', text: 'Invalid Session. Check for validation errors' });
    }

    return errors;
  };

  return {
    createSession,
    deleteSession,
    fetchSessions,
    isLoading,
    updateSession,
    validateSession,
  };
};

export { useSessionService };
