import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FormInput, Loading, PageHeading, useForm } from '@warpzone/web-ui';
import { Campaign, CampaignPlayer, Game, Player, Session } from '@warpzone/shared-schemas';
import { SessionListComponent } from '../components/session-list';
import { TeamListComponent } from '../components/team-list';
import { useCampaignService } from '../hooks/use-campaign-service';
import { useSessionService } from '../../sessions';
import { useAdminContext } from '../../shared';

const CampaignEdit = () => {
  const [campaign, setCampaign] = useState<Campaign>({} as Campaign);
  const [campaignPlayers, setCampaignPlayers] = useState<CampaignPlayer[]>([]);
  const [game, setGame] = useState<Game>({} as Game);
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const { games } = useAdminContext();
  const { campaignId, gameId } = useParams();
  const { fetchSessions } = useSessionService();
  const { fetchCampaign, fetchCampaignPlayers, isLoading, updateCampaign, validateCampaign } =
    useCampaignService();
  const { data, errors, handleChange, handleSubmit, setData, setErrors } = useForm({
    initialValues: { title: '' },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (campaignId) {
        const response = await fetchCampaignPlayers(campaignId);
        const campaign = await fetchCampaign(campaignId);
        const sessionParams = new URLSearchParams(`campaignId=${campaignId}`);
        const sessions = (await fetchSessions(sessionParams))?.sessions;

        setCampaign(campaign as Campaign);
        setCampaignPlayers(response?.campaignPlayers ?? []);
        setPlayers(response?.players ?? []);
        setSessions(sessions ?? []);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  useEffect(() => {
    if (campaign) {
      setData({ title: campaign.title });
    }

    if (gameId && games) {
      setGame(games.find((game) => game.id === gameId) as Game);
    }
  }, [campaign, gameId, games, setData]);

  const onSubmit = async () => {
    try {
      const campaignData = { ...campaign, ...data };
      const errors = validateCampaign(campaignData);

      if (errors) {
        setErrors(errors);
        return;
      }

      await updateCampaign(campaignData);
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageHeading
          mainTitle={`${campaign ? 'Edit' : 'Add'} Campaign`}
          mainTitleSize="mid"
          topTitle={game.title}
          button={{
            text: 'Save Campaign',
            type: 'submit',
          }}
        />
        <FormInput
          className="mb-2"
          error={errors?.title}
          label="Title"
          name="title"
          onChange={handleChange}
          value={data.title}
        />
      </form>
      <div className="mx-auto">
        <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">Sessions</h2>
        <SessionListComponent sessions={sessions} />
      </div>
      {game.hasTeams && (
        <div className="mx-auto">
          <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">Teams</h2>
          <TeamListComponent campaingPlayers={campaignPlayers} players={players} />
        </div>
      )}
    </div>
  );
};

export { CampaignEdit };
