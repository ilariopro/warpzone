import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, CustomAvatar, Dropdown, EmptyState, HeroIcon } from '@warpzone/web-ui';
import { CampaignPlayer, Player, Teams } from '@warpzone/shared-schemas';
import { isNullOrEmpty } from '@warpzone/shared-utils';
import { TeamEdit } from './team-edit';
import { useCampaignService } from '../hooks/use-campaign-service';

type TeamListComponentProps = {
  campaingPlayers: CampaignPlayer[];
  players: Player[];
};

const TeamListComponent = ({ campaingPlayers, players }: TeamListComponentProps) => {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [teamList, setTeamList] = useState<Teams>({});
  const [editField, setEditField] = useState<string>('');
  const { campaignId } = useParams();
  const { deleteTeam } = useCampaignService();

  useEffect(() => {
    const playersWithTeam: Teams = {};
    const playersWithoutTeam: CampaignPlayer[] = [];

    campaingPlayers.forEach((player) => {
      if (player.team) {
        if (!playersWithTeam[player.team]) {
          playersWithTeam[player.team] = [];
        }
        playersWithTeam[player.team].push(player);
      } else {
        playersWithoutTeam.push(player);
      }
    });

    setPlayerList(players.concat(playersWithoutTeam));
    setTeamList(playersWithTeam);
  }, [campaingPlayers, players]);

  const onDelete = (teamName: string) => {
    if (campaignId) {
      const newTeamList = { ...teamList };
      delete newTeamList[teamName];

      deleteTeam(campaignId, teamName, teamList);
      setTeamList(newTeamList);
    }
  };

  return isNullOrEmpty(teamList) && !editField ? (
    <div className="border-t border-gray-200 pt-6">
      <EmptyState
        title="Add Teams"
        description="Add the first team to your brand new campaign"
        button={{
          children: (
            <>
              <span aria-hidden="true">+</span>
              {` Add Team`}
            </>
          ),
          variant: 'transparent',
          onClick: () => setEditField('new'),
        }}
      />
    </div>
  ) : (
    <>
      <ul className="divide-y border-t border-gray-200 divide-gray-100">
        {Object.keys(teamList).map((team, index) =>
          editField === `${index}` ? (
            <TeamEdit
              key={index}
              playerList={playerList}
              teamList={teamList}
              teamName={team}
              setEditField={setEditField}
              setPlayerList={setPlayerList}
              setTeamList={setTeamList}
            />
          ) : (
            <li
              key={index}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-6 sm:flex-nowrap"
            >
              <div>
                <p className="font-semibold text-gray-900 leading-6">{team}</p>
              </div>
              <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
                <div className="flex -space-x-0.5">
                  <dt className="sr-only">Players</dt>
                  {teamList[team]?.map((player) => (
                    <dd key={player.id}>
                      <div className="rounded-full ring-2 ring-white">
                        <CustomAvatar name={player.email} variant="beam" size={24} />
                      </div>
                    </dd>
                  ))}
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <Dropdown
                    items={[
                      {
                        text: 'Edit',
                        screenReaderText: team,
                        onClick: () => setEditField(`${index}`),
                      },
                      {
                        text: 'Delete',
                        screenReaderText: team,
                        onClick: () => onDelete(team),
                      },
                    ]}
                  >
                    <span className="sr-only">Open options</span>
                    <HeroIcon icon="EllipsisVerticalIcon" />
                  </Dropdown>
                </div>
              </dl>
            </li>
          )
        )}
      </ul>
      <div>
        {editField === 'new' ? (
          <TeamEdit
            key="new"
            playerList={playerList}
            teamList={teamList}
            setEditField={setEditField}
            setPlayerList={setPlayerList}
            setTeamList={setTeamList}
          />
        ) : (
          <div className="flex items-center justify-between gap-x-6 py-6">
            <Button
              className="ml-auto px-2.5 leading-6"
              variant="transparent"
              onClick={() => setEditField('new')}
            >
              <span aria-hidden="true">+</span>
              {` Add Team`}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export { TeamListComponent };
