import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { localDate, utcDate } from '@warpzone/shared-utils';
import { Game, Organization, OrganizationGame } from '@warpzone/shared-schemas';
import { CheckBox, FormInput, Loading, PageHeading, TextArea, useForm } from '@warpzone/web-ui';
import { useOrganizationService } from '../hooks/use-organization-service';
import { useGameService } from '../../games';
import { useCheckRole } from '../../shared';

type OrganizationEditProps = { scope: 'new' | 'edit' };

const OrganizationEdit = ({ scope }: OrganizationEditProps) => {
  useCheckRole();

  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [organizationGames, setOrganizationGames] = useState<OrganizationGame[]>([]);
  const [organization, setOrganization] = useState<Organization>({} as Organization);
  const { organizationId } = useParams();
  const { fetchGames } = useGameService();
  const {
    createOrganization,
    fetchOrganization,
    isLoading,
    saveOrganizationGames,
    updateOrganization,
    validateOrganization,
  } = useOrganizationService();
  const { data, errors, handleChange, handleSubmit, setData, setErrors } = useForm({
    initialValues: {
      name: '',
      email: '',
      description: '',
      game: '',
      activeUntil: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (organizationId) {
        const response = await fetchOrganization(organizationId);
        setOrganizationGames(response?.games ?? []);
        setOrganization(response?.organization ?? ({} as Organization));
      }

      const games = await fetchGames();
      setGames(games ?? []);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  useEffect(() => {
    setIsChecked(Boolean(organizationGames?.find((og) => og.id === 'hoopify-city') || data.activeUntil));
    setData({
      name: organization.name ?? '',
      email: organization.email ?? '',
      description: organization.description ?? '',
      game: 'hoopify-city',
      activeUntil: organizationGames[0]?.activeUntil
        ? localDate(organizationGames[0]?.activeUntil, 'YYYY-MM-DD')
        : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization, organizationGames]);

  const onSubmit = async () => {
    const { activeUntil, game, ...formData } = data;
    const organizationData = { ...formData, email: formData.email || undefined };

    if (isChecked && !activeUntil) {
      setErrors({ activeUntil: 'Set as long as this game is active' });
      return;
    }

    if (activeUntil && new Date(activeUntil) < new Date()) {
      setErrors({ activeUntil: 'Set a date greater than today' });
      return;
    }

    const errors = validateOrganization(organizationData);

    if (errors) {
      setErrors(errors);
      return;
    }

    // TODO handle game selection and game form checkbox in more dynamic way
    const gameData = {
      ...games[0],
      activeUntil: activeUntil && utcDate(activeUntil),
    };

    if (scope === 'new') {
      const organizationId = await createOrganization(organizationData);
      await saveOrganizationGames(organizationId as string, isChecked ? [gameData] : []);
      navigate(`/organizations/${organizationId}`);
    } else {
      await updateOrganization({ id: organizationId, ...organizationData });
      await saveOrganizationGames(organizationId as string, isChecked ? [gameData] : []);
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageHeading
          mainTitle={`${scope === 'edit' ? 'Edit' : 'Add'} Organization`}
          mainTitleSize="mid"
          button={{
            text: 'Save Organization',
            type: 'submit',
          }}
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Company Details</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Set the organization information here. You can add a description for internal usage only.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <FormInput
                error={errors?.name}
                label="Name"
                name="name"
                onChange={handleChange}
                value={data.name}
              />
            </div>
            <div className="col-span-full">
              <FormInput
                error={errors?.email}
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                optional={true}
                value={data.email}
              />
            </div>
            <div className="col-span-full">
              <TextArea
                error={errors?.description}
                label="Description"
                name="description"
                onChange={() => handleChange}
                optional={true}
                rows={5}
                value={data.description}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-gray-200 py-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Game Subscriptions</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              From here you can set the games your organization will have access to.
            </p>
          </div>
          <fieldset className="md:col-span-2">
            <legend className="sr-only">Associate Games with Organization</legend>
            {games.map((game) => (
              <div key={game.id} className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 pb-12">
                <div className="sm:col-span-3">
                  <CheckBox
                    checked={isChecked}
                    label={game.title}
                    name="game"
                    value={data.game}
                    description="A management game with team building capabilities."
                    onChange={(event) => {
                      handleChange(event);
                      setIsChecked(!isChecked);
                    }}
                  />
                </div>
                <div className="sm:col-span-3">
                  <FormInput
                    error={errors?.activeUntil}
                    label="Active Until"
                    name="activeUntil"
                    type="date"
                    value={data.activeUntil}
                    onChange={(event) => {
                      handleChange(event);
                      if (event.target.value) {
                        setIsChecked(true);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </fieldset>
        </div>
      </form>
    </div>
  );
};

export { OrganizationEdit };
