import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AdministratorEdit, AdministratorList, AdministratorProfile } from './administrators';
import { Login } from './auth';
import { CampaignEdit, CampaignList } from './campaigns';
import { Dashboard } from './dashboard';
import { NotFound } from './errors';
import { OrganizationEdit, OrganizationList } from './organizations';
import { AdminLayout, AdminProvider, LoginLayout, NotificationProvider } from './shared';
import { PlayerCreate, PlayerList } from './players';
import { ScoreList } from './scores';
import { Settings } from './settings';

const App = () => {
  const router = createBrowserRouter(
    [
      {
        element: <AdminLayout />,
        // errorElement: <InternalError />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: 'administrators', element: <AdministratorList /> },
          { path: 'administrators/new', element: <AdministratorEdit scope="new" /> },
          { path: 'profile', element: <AdministratorProfile /> },
          { path: 'administrators/:administratorId', element: <AdministratorEdit scope="edit" /> },
          { path: 'organizations', element: <OrganizationList /> },
          { path: 'organizations/new', element: <OrganizationEdit scope="new" /> },
          { path: 'organizations/:organizationId', element: <OrganizationEdit scope="edit" /> },
          { path: 'games/:gameId/campaigns', element: <CampaignList /> },
          { path: 'games/:gameId/campaigns/new', element: <CampaignEdit /> },
          { path: 'games/:gameId/campaigns/:campaignId', element: <CampaignEdit /> },
          { path: 'players', element: <PlayerList /> },
          { path: 'players/new', element: <PlayerCreate /> },
          { path: 'scores', element: <ScoreList /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
      {
        element: <LoginLayout />,
        children: [{ path: '/login', element: <Login /> }],
      },
      { path: '*', element: <NotFound /> },
    ],
    {
      basename: '/admin',
    }
  );

  return (
    <NotificationProvider>
      <AdminProvider>
        <RouterProvider router={router} />
      </AdminProvider>
    </NotificationProvider>
  );
};

export { App };
