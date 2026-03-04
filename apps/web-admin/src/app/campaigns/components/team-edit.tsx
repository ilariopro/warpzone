import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignPlayer, Player, Teams } from '@warpzone/shared-schemas';
import {
  Button,
  ComboBox,
  ComboBoxItem,
  CustomAvatar,
  EmptyState,
  FormInput,
  HeroIcon,
  useForm,
} from '@warpzone/web-ui';
import { randomName } from '@warpzone/shared-utils';
import { useCampaignService } from '../hooks/use-campaign-service';
import { usePlayerService } from '../../players';
import { useAdminContext } from '../../shared';

type TeamEditProps = {
  playerList: CampaignPlayer[];
  teamList: Teams;
  teamName?: string;
  setEditField: Dispatch<SetStateAction<string>>;
  setPlayerList: Dispatch<SetStateAction<CampaignPlayer[]>>;
  setTeamList: Dispatch<SetStateAction<Teams>>;
};

const TeamEdit = ({
  playerList,
  teamList,
  teamName,
  setEditField,
  setPlayerList,
  setTeamList,
}: TeamEditProps) => {
  const [initialTeamName, setInitialTeamName] = useState(randomName('team'));
  const [initialPlayers, setInitialPlayers] = useState<CampaignPlayer[]>([]);
  const [initialTeams, setInitialTeams] = useState<Teams>({});
  const [newPlayers, setNewPlayers] = useState<CampaignPlayer[]>([]);
  const { campaignId } = useParams();
  const { organizationId } = useAdminContext();
  const { createPlayer, validatePlayer } = usePlayerService();
  const { saveCampaignPlayers, teamsToPlayers } = useCampaignService();
  const { data, errors, handleChange, handleSubmit, setData, setErrors } = useForm({
    initialValues: { team: '', player: '' },
  });

  useEffect(() => {
    if (teamName) {
      setInitialTeamName(teamName);
      setData({ team: teamName, player: '' });
    } else {
      setInitialTeamName(initialTeamName);
      setData({ team: initialTeamName, player: '' });
    }

    setInitialTeams(teamList ? teamList : {});
    setInitialPlayers(playerList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewPlayer = async (player: Player) => {
    const playerId = await createPlayer(player);
    const newPlayer = { id: playerId, ...player };

    setNewPlayers((players) => [...players, newPlayer]);
    return newPlayer;
  };

  const addTeamPlayer = async (item: ComboBoxItem) => {
    const playerData = playerList.find((player) => player.id === item.id) ?? {
      email: item.value,
      organizationId,
    };

    const errors = validatePlayer(playerData);

    if (errors) {
      setErrors({ player: errors.email });
      return;
    }

    const player = playerData.id ? playerData : await addNewPlayer(playerData);
    const currentTeam = teamList[initialTeamName] ?? [];

    setPlayerList((playerList) => playerList.filter((p) => p.id !== player.id));
    setTeamList((teamList) => ({
      ...teamList,
      [initialTeamName]: currentTeam.concat(player),
    }));

    if (!teamList[initialTeamName]) {
      setEditField(`${Object.keys(teamList).length}`);
    }
  };

  const removeTeamPlayer = (player?: CampaignPlayer) => {
    if (player) {
      setPlayerList((playerList) => playerList.concat(player));
      setTeamList((teamList) => ({
        ...teamList,
        [initialTeamName]: teamList[initialTeamName].filter((p) => p.id !== player.id),
      }));
    }
  };

  const onSubmit = async () => {
    if (campaignId) {
      if (data.team.length === 0) {
        setErrors({ team: 'Team must NOT have fewer than 1 characters' });
        return;
      }

      const currentTeam = teamList[initialTeamName] ?? [];

      if (!currentTeam.length) {
        setErrors({ player: 'Add at least one player' });
        return;
      }

      await saveCampaignPlayers(campaignId, teamsToPlayers(teamList), initialTeamName);

      setEditField('');
      setPlayerList(playerList);
      setTeamList({
        ...teamList,
        [initialTeamName]: currentTeam.map((player) => ({ ...player, team: initialTeamName })),
      });
    }
  };

  const onCancel = () => {
    setData({ team: initialTeamName, player: '' });
    setEditField('');
    setPlayerList([...initialPlayers, ...newPlayers]);
    setTeamList(initialTeams);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row items-start gap-x-6 py-6 mb-2.5">
        <div className="w-full">
          <FormInput
            error={errors?.team}
            label="Team Name"
            name="team"
            onChange={handleChange}
            value={data.team ?? ''}
          />
        </div>
        <ComboBox
          avatar={{ size: 24, variant: 'beam' }}
          error={errors?.player}
          className="w-full"
          items={playerList.map((player) => ({ id: player.id, value: player.email }))}
          label="Add Player"
          name="player"
          onChange={handleChange}
          onSelection={(item) => addTeamPlayer(item)}
        />
      </div>
      <div className="flex items-start -mt-3">
        <div className="flex flex-shrink-0 justify-end ml-auto">
          <Button className="inline-flex" onClick={onCancel} size="small" variant="neutral">
            Cancel
            <span className="sr-only">{initialTeamName}</span>
          </Button>
          <Button className="ml-3 inline-flex" size="small" type="submit">
            Save
            <span className="sr-only">{initialTeamName}</span>
          </Button>
        </div>
      </div>
      {teamList[initialTeamName]?.length ? (
        <ul className="divide-y border-gray-200 divide-gray-100">
          {teamList[initialTeamName].map((player, index) => (
            <li key={index} className="flex items-center justify-between gap-x-6 py-6">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <CustomAvatar name={player.email} size={24} variant="beam" />
                  <div className="whitespace-nowrap text-sm leading-6">
                    <span className="font-semibold font-normal">{player.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-none items-center">
                <Button className="pr-0" onClick={() => removeTeamPlayer(player)} variant="transparent">
                  <HeroIcon icon="XMarkIcon" />
                  <span className="sr-only">{`Delete ${player.id}`}</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Add Team Players"
          description="You haven’t added any players for this team yet"
          icon="UserGroupIcon"
        />
      )}
    </form>
  );
};

export { TeamEdit, TeamEditProps };
