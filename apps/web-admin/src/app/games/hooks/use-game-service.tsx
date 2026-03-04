import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../../shared';
import { apiClient } from '../../config';
import { Game } from '@warpzone/shared-schemas';
import { isAxiosError } from 'axios';

const useGameService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showDialog } = useNotificationContext();

  const fetchGame = async (gameId: string) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ game: Game }>({
        method: 'GET',
        url: `/games/${gameId}`,
        withAuthentication: true,
      });

      return response.game;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        navigate('/');
        return;
      }

      console.log(error);

      showDialog({
        level: 'error',
        icon: 'ExclamationTriangleIcon',
        title: 'Internal Error',
        text: 'An error occurred while loading data, please reload the page',
        buttonText: 'Reload',
        cancelButton: false,
        onClick: () => navigate(gameId ? 0 : -1),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGames = async (searchParams?: URLSearchParams) => {
    try {
      setIsLoading(true);

      const query = [
        `/games?order=${searchParams?.get('order') ?? 'createdAt desc'}`,
        searchParams?.has('hasScheduledSessions')
          ? `&hasScheduledSessions=${searchParams.get('hasScheduledSessions')}`
          : '',
        searchParams?.has('hasTeams') ? `&hasTeams=${searchParams.get('hasTeams')}` : '',
      ];

      const response = await apiClient.request<{ games: Game[] }>({
        method: 'GET',
        url: query.join('').trim(),
        withAuthentication: true,
      });

      return response.games;
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

  return {
    fetchGame,
    fetchGames,
    isLoading,
  };
};

export { useGameService };
