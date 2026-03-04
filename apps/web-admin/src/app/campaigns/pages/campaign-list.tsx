import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Campaign, CampaignCounts, Game, Metadata } from '@warpzone/shared-schemas';
import { localDate, randomName } from '@warpzone/shared-utils';
import { EmptyState, Loading, PageHeading, Pagination, StackedList } from '@warpzone/web-ui';
import { useCampaignService } from '../hooks/use-campaign-service';
import { useAdminContext } from '../../shared';
import { useGameService } from '../../games';

const CampaignList = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignCounts[]>([]);
  const [game, setGame] = useState<Game>({} as Game);
  const [meta, setMeta] = useState<Metadata>({} as Metadata);
  const [searchParams] = useSearchParams();
  const { gameId } = useParams();
  const { fetchGame } = useGameService();
  const { organizationId } = useAdminContext();
  const { createCampaign, fetchCampaigns, deleteCampaign, isLoading } = useCampaignService();

  useEffect(() => {
    const fetchData = async () => {
      if (gameId) {
        const game = await fetchGame(gameId);
        const response = await fetchCampaigns(searchParams);

        setCampaigns(response?.campaigns ?? []);
        setMeta(response?.meta ?? ({} as Metadata));
        setGame(game as Game);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, searchParams]);

  const subTitle = (campaign: CampaignCounts) => {
    const { playerCount = 0, sessionCount = 0, teamCount = 0 } = campaign;
    return `Players: ${playerCount} | Sessions: ${sessionCount} | Teams: ${teamCount}`;
  };

  const onCreate = async () => {
    if (gameId) {
      const campaignId = await createCampaign({
        gameId,
        organizationId,
        title: randomName('campaign', true),
      });

      navigate(`${campaignId}`);
    }
  };

  const onDelete = (campaign: Campaign) => {
    deleteCampaign(campaign, () => {
      setCampaigns((campaigns) => campaigns.filter((c) => c.id !== campaign.id));
      setMeta((meta) => ({ ...meta, count: meta.count - 1 }));
    });
  };

  return isLoading || !game ? (
    <Loading />
  ) : (
    <>
      <PageHeading
        mainTitle="Campaigns"
        topTitle={game.title}
        description={`In this area you can manage all the campaigns related to ${game.title}`}
        button={{
          text: 'Add Campaign',
          onClick: () => onCreate(),
        }}
      />
      {!campaigns.length ? (
        <div className="border-t border-gray-200 flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <EmptyState
            button={{
              children: (
                <>
                  <span aria-hidden="true">+</span>
                  {` Add Campaign`}
                </>
              ),
              variant: 'transparent',
              onClick: onCreate,
            }}
            title="Add Campaigns"
            icon="FolderPlusIcon"
            description="Add your first campaign and start your journey"
          />
        </div>
      ) : (
        <>
          <StackedList
            items={campaigns.map((campaign) => ({
              id: campaign.id,
              title: campaign.title,
              subTitle: subTitle(campaign),
              info: campaign.createdAt && `Created at: ${localDate(campaign.createdAt)}`,
              subInfo: campaign.updatedAt && `Last update: ${localDate(campaign.updatedAt)}`,
              actions: [
                {
                  text: 'Edit',
                  screenReaderText: campaign.id,
                  onClick: () => navigate(campaign.id as string),
                },
                {
                  text: 'Delete',
                  screenReaderText: campaign.id,
                  onClick: () => onDelete(campaign),
                },
              ],
            }))}
          />
          {meta && <Pagination {...meta} />}
        </>
      )}
    </>
  );
};

export { CampaignList };
