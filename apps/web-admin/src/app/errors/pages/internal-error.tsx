import { useNavigate } from 'react-router-dom';
import { PageHeading } from '@warpzone/web-ui';
import { useNotificationContext } from '../../shared';

const InternalError = () => {
  const navigate = useNavigate();
  const { dialog, showDialog } = useNotificationContext();

  showDialog({
    level: 'error',
    icon: 'ExclamationTriangleIcon',
    title: 'Internal Error',
    text: 'An error occurred while loading data, please reload the page',
    buttonText: 'Reload',
    cancelButton: false,
    onClick: () => navigate(0),
  });

  return dialog;
};

export { InternalError };
