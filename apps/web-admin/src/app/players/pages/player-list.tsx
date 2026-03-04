import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Metadata, Player } from '@warpzone/shared-schemas';
import { EmptyState, Loading, PageHeading, Pagination, StackedList } from '@warpzone/web-ui';
import { localDate } from '@warpzone/shared-utils';
import { usePlayerService } from '../hooks/use-player-service';

const PlayerList = () => {
  const navigate = useNavigate();
  const [meta, setMeta] = useState<Metadata>({} as Metadata);
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchParams] = useSearchParams();
  const { deletePlayer, fetchPlayers, isLoading } = usePlayerService();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPlayers(searchParams);

      setMeta(response?.meta ?? ({} as Metadata));
      setPlayers(response?.players ?? []);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onDelete = (player: Player) => {
    deletePlayer(player, () => {
      setPlayers((players) => players.filter((p) => p.id !== player.id));
      setMeta((meta) => ({ ...meta, count: meta.count - 1 }));
    });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <PageHeading
        mainTitle="Players"
        description={`In this area you can manage all the players`}
        button={{
          text: 'Add Players',
          onClick: () => navigate('new'),
        }}
      />
      {!players.length ? (
        <div className="border-t border-gray-200 flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <EmptyState
            button={{
              children: (
                <>
                  <span aria-hidden="true">+</span>
                  {` Add Player`}
                </>
              ),
              variant: 'transparent',
              onClick: () => navigate('new'),
            }}
            title="Add Players"
            icon="FolderPlusIcon"
            description="Add your first player and start your journey"
          />
        </div>
      ) : (
        <>
          <StackedList
            items={players.map((player) => ({
              id: player.id,
              avatar: {
                name: player.email,
                variant: 'beam',
              },
              title: player.email,
              info: player.createdAt && `Created at: ${localDate(player.createdAt)}`,
              subInfo: player.updatedAt && `Last update: ${localDate(player.updatedAt)}`,
              actions: [
                // {
                //   text: 'Edit',
                //   screenReaderText: player.id,
                //   onClick: () => navigate(player.id as string),
                // },
                {
                  text: 'Delete',
                  screenReaderText: player.id,
                  onClick: () => onDelete(player),
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

export { PlayerList };
