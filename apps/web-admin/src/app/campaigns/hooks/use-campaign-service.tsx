import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaign, CampaignCounts, CampaignPlayer, Metadata, Teams } from '@warpzone/shared-schemas';
import { useAdminContext, useNotificationContext } from '../../shared';
import { ajv, apiClient, defaultPagination } from '../../config';
import { usePlayerService } from '../../players';

const useCampaignService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { organizationId } = useAdminContext();
  const { fetchPlayers } = usePlayerService();
  const { showDialog, showMessage } = useNotificationContext();

  const teamsToPlayers = (teams: Teams) =>
    Object.entries(teams).flatMap(([team, members]) => members.map((member) => ({ ...member, team })));

  const createCampaign = async (campaign: Campaign) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ campaignId: string }>({
        method: 'POST',
        url: `/campaigns`,
        data: campaign,
        withAuthentication: true,
      });

      // showMessage({ level: 'success', text: `Campaign '${campaign.title}' created` });

      return response.campaignId;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (campaign: Campaign, callback?: () => void) => {
    showDialog({
      buttonText: 'Delete',
      icon: 'ExclamationTriangleIcon',
      level: 'error',
      title: `Delete: ${campaign.title}`,
      text: 'Are you really sure you want to permanently delete this campaign?',
      onClick: async () => {
        try {
          setIsLoading(true);

          if (callback) {
            callback();
          }

          await apiClient.request({
            method: 'DELETE',
            url: `/campaigns/${campaign.id}`,
            withAuthentication: true,
          });

          showMessage({ level: 'success', text: `Campaign '${campaign.title}' removed` });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const deleteTeam = (campaignId: string, teamName: string, teamList: Teams) => {
    showDialog({
      buttonText: 'Delete',
      icon: 'ExclamationTriangleIcon',
      level: 'error',
      title: `Delete: ${teamName}`,
      text: 'Are you really sure you want to permanently delete this team?',
      onClick: async () => {
        try {
          setIsLoading(true);

          await saveCampaignPlayers(campaignId, teamsToPlayers(teamList));
          showMessage({ level: 'success', text: `Team '${teamName}' removed` });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const fetchCampaign = async (campaignId: string) => {
    try {
      setIsLoading(true);

      const response = await apiClient.request<{ campaign: Campaign }>({
        method: 'GET',
        url: `/campaigns/${campaignId}`,
        withAuthentication: true,
      });

      return response.campaign;
    } catch (error) {
      console.log(error);

      showDialog({
        level: 'error',
        icon: 'ExclamationTriangleIcon',
        title: 'Internal Error',
        text: 'An error occurred while loading data, please reload the page',
        buttonText: 'Reload',
        cancelButton: false,
        onClick: () => navigate(campaignId ? 0 : -1),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaigns = async (searchParams?: URLSearchParams) => {
    try {
      setIsLoading(true);

      const query = [
        `/campaigns?order=${searchParams?.get('order') ?? 'createdAt desc'}`,
        `&page=${searchParams?.get('page') ?? 1}`,
        `&pageSize=${searchParams?.get('pageSize') ?? defaultPagination}`,
        `&organizationId=${searchParams?.get('organizationId') ?? organizationId}`,
        searchParams?.has('gameId') ? `&gameId=${searchParams.get('gameId')}` : '',
      ];

      const includes = (searchParams?.get('include') ?? []) as string[];
      query.push(
        includes.length
          ? includes.map((include) => `&include=${encodeURIComponent(include)}`).join('')
          : '&include=playerCount&include=sessionCount&include=teamCount'
      );

      const response = await apiClient.request<{ campaigns: CampaignCounts[]; meta: Metadata }>({
        method: 'GET',
        url: query.join('').trim(),
        withAuthentication: true,
      });

      return {
        campaigns: response.campaigns,
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

  const fetchCampaignPlayers = async (campaignId: string) => {
    try {
      const response = await apiClient.request<{ players: CampaignPlayer[] }>({
        method: 'GET',
        url: `/campaigns/${campaignId}/players`,
        withAuthentication: true,
      });

      const campaignPlayerIds = response.players.map((player) => player.id);
      const players = (await fetchPlayers())?.players;

      return {
        campaignPlayers: response.players,
        players: players?.filter((player) => !campaignPlayerIds.includes(player.id as string)),
      };
    } catch (error) {
      console.log(error);
    }
  };

  const saveCampaignPlayers = async (campaignId: string, players: CampaignPlayer[], teamName?: string) => {
    try {
      setIsLoading(true);

      await apiClient.request({
        method: 'POST',
        url: `/campaigns/${campaignId}/players`,
        data: players,
        withAuthentication: true,
      });

      if (teamName) {
        showMessage({ level: 'success', text: `Team '${teamName}' saved` });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCampaign = async (campaign: Campaign) => {
    try {
      setIsLoading(true);

      await apiClient.request({
        method: 'PATCH',
        url: `/campaigns/${campaign.id}`,
        data: campaign,
        withAuthentication: true,
      });

      showMessage({ level: 'success', text: `Campaign '${campaign.title}' updated` });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateCampaign = (campaign: Campaign) => {
    const errors = ajv.validate(Campaign, campaign);

    if (errors) {
      showMessage({ level: 'error', text: 'Invalid Player. Check for validation errors' });
    }

    return errors;
  };

  return {
    createCampaign,
    deleteCampaign,
    deleteTeam,
    fetchCampaign,
    fetchCampaigns,
    fetchCampaignPlayers,
    saveCampaignPlayers,
    isLoading,
    teamsToPlayers,
    updateCampaign,
    validateCampaign,
  };
};

export { useCampaignService };
