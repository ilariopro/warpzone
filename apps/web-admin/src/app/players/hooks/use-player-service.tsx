import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignPlayer, Metadata, Player } from '@warpzone/shared-schemas';
import { useAdminContext, useNotificationContext } from '../../shared';
import { ajv, apiClient, defaultPagination } from '../../config';

const usePlayerService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { organizationId } = useAdminContext();
  const { showDialog, showMessage } = useNotificationContext();

  const createPlayer = async (player: Player) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ playerId: string }>({
        method: 'POST',
        url: `/players`,
        data: player,
        withAuthentication: true,
      });

      showMessage({ level: 'success', text: `Player '${player.email}' created` });

      return response.playerId;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlayer = (player: Player, callback?: () => void) => {
    showDialog({
      buttonText: 'Delete',
      icon: 'ExclamationTriangleIcon',
      level: 'error',
      title: `Delete: ${player.email}`,
      text: 'Are you really sure you want to permanently delete this player?',
      onClick: async () => {
        setIsLoading(true);

        try {
          if (callback) {
            callback();
          }

          await apiClient.request({
            method: 'DELETE',
            url: `/players/${player.id}`,
            withAuthentication: true,
          });

          showMessage({ level: 'success', text: `Player '${player.email}' removed` });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const fetchPlayers = async (searchParams?: URLSearchParams) => {
    try {
      setIsLoading(true);

      const query = [
        `/players?order=${searchParams?.get('order') ?? 'createdAt desc'}`,
        `&page=${searchParams?.get('page') ?? 1}`,
        `&pageSize=${searchParams?.get('pageSize') ?? defaultPagination}`,
        `&organizationId=${searchParams?.get('organizationId') ?? organizationId}`,
        searchParams?.has('search') ? `&search=${searchParams.get('search')}` : '',
      ];

      const response = await apiClient.request<{ players: Player[]; meta: Metadata }>({
        method: 'GET',
        url: query.join('').trim(),
        withAuthentication: true,
      });

      return {
        meta: response.meta,
        players: response.players,
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

  const validatePlayer = (player: CampaignPlayer | Player) => {
    const errors = 'team' in player ? ajv.validate(CampaignPlayer, player) : ajv.validate(Player, player);

    if (errors) {
      showMessage({ level: 'error', text: 'Invalid Player. Check for validation errors' });
    }

    return errors;
  };

  return {
    createPlayer,
    deletePlayer,
    isLoading,
    fetchPlayers,
    validatePlayer,
  };
};

export { usePlayerService };
