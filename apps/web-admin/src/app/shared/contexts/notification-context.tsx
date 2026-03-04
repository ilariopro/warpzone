import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AlertMessage, AlertMessageProps, DialogOverlay, DialogOverlayProps } from '@warpzone/web-ui';

type NotificationContextType = {
  dialog: DialogOverlayProps | null;
  message: AlertMessageProps | null;
  showDialog: Dispatch<SetStateAction<DialogOverlayProps | null>>;
  showMessage: (message: AlertMessageProps) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

const NotificationProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [dialog, setDialog] = useState<DialogOverlayProps | null>(null);
  const [message, setMessage] = useState<AlertMessageProps | null>(null);
  const dialogs = useRef<DialogOverlayProps[]>([]);
  const messages = useRef<AlertMessageProps[]>([]);

  useEffect(() => {
    if (dialogs.current.length > 0 && !dialog) {
      setDialog(dialogs.current.shift() || null);
    }
  }, [dialog]);

  useEffect(() => {
    if (messages.current.length > 0 && !message) {
      setMessage(messages.current.shift() || null);
    }
  }, [message]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showDialog = (newDialog: DialogOverlayProps) => {
    if (dialog) {
      dialogs.current.push(newDialog);
    } else {
      setDialog(newDialog);
    }
  };

  const closeDialog = () => setDialog(null);

  const showMessage = (newMessage: AlertMessageProps) => {
    if (message) {
      messages.current.push(newMessage);
    } else {
      setMessage(newMessage);
    }
  };

  const context = {
    dialog,
    message,
    showDialog,
    showMessage,
  };

  const getNotifications = () => {
    if (dialog) {
      return <DialogOverlay {...dialog} onClose={closeDialog} />;
    }

    if (message) {
      return <AlertMessage {...message} />;
    }
  };

  return (
    <NotificationContext.Provider value={context as NotificationContextType}>
      <>
        {getNotifications()}
        {children}
      </>
    </NotificationContext.Provider>
  );
};

const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('Form error: useNotificationContext must be used within a NotificationProvider');
  }

  return context;
};

export { NotificationProvider, useNotificationContext, NotificationContext };
