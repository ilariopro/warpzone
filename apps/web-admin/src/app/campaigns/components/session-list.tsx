import { useEffect, useState } from 'react';
import { Button, Dropdown, EmptyState, HeroIcon } from '@warpzone/web-ui';
import { Session } from '@warpzone/shared-schemas';
import { localDate } from '@warpzone/shared-utils';
import { SessionEdit } from './session-edit';
import { useSessionService } from '../../sessions/hooks/use-session-service';

type SessionListComponentProps = { sessions: Session[] };

const SessionListComponent = ({ sessions }: SessionListComponentProps) => {
  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [editField, setEditField] = useState<string>('');
  const { deleteSession } = useSessionService();

  useEffect(() => {
    setSessionList(sessions);
  }, [sessions]);

  const onDelete = (session: Session, sessionName: string) => {
    deleteSession(session, `Session #${sessionName}`, () => {
      setSessionList((sessionList) => sessionList.filter((c) => c.id !== session.id));
    });
  };

  return !sessionList.length && !editField ? (
    <div className="border-t border-gray-200 pt-6">
      <EmptyState
        title="Add Sessions"
        description="Add the first session to your brand new campaign"
        button={{
          children: (
            <>
              <span aria-hidden="true">+</span>
              {` Add Session`}
            </>
          ),
          className: 'pt-2',
          variant: 'transparent',
          onClick: () => setEditField('new'),
        }}
      />
    </div>
  ) : (
    <>
      <ul className="divide-y border-t border-gray-200 divide-gray-100">
        {sessionList.map((session, index) =>
          editField === session.id ? (
            <SessionEdit
              key={session.id}
              sessionList={sessionList}
              setSessionList={setSessionList}
              session={session}
              setEditField={setEditField}
            />
          ) : (
            <li key={session.id} className="flex items-center justify-between gap-x-6 py-6">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <div className="whitespace-nowrap text-sm leading-6">
                    <span className="text-gray-500 border-gray-200 font-medium text-sm rounded-full px-2 py-1 mr-1 ring-1 ring-inset ring-gray-300">
                      {index + 1}
                    </span>{' '}
                    <span className="font-normal">{'Start at '}</span>
                    <time dateTime={session.startAt}>{localDate(session.startAt)}</time>
                    {session.endAt && (
                      <>
                        {' — '}
                        <span className="font-normal">{'End at '}</span>
                        <time dateTime={session.endAt}>{localDate(session.endAt)}</time>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <Dropdown
                  items={[
                    {
                      id: session.id,
                      text: 'Edit',
                      screenReaderText: session.id,
                      onClick: () => setEditField(session.id as string),
                    },
                    {
                      id: session.id,
                      text: 'Delete',
                      screenReaderText: session.id,
                      onClick: () => onDelete(session, `${index + 1}`),
                    },
                  ]}
                >
                  <span className="sr-only">Open options</span>
                  <HeroIcon icon="EllipsisVerticalIcon" />
                </Dropdown>
              </div>
            </li>
          )
        )}
      </ul>
      <div>
        {editField === 'new' ? (
          <SessionEdit
            key="new"
            sessionList={sessionList}
            setSessionList={setSessionList}
            setEditField={setEditField}
          />
        ) : (
          <div className="flex items-center justify-between gap-x-6 py-6">
            <Button
              className="ml-auto px-2.5 leading-6"
              variant="transparent"
              onClick={() => setEditField('new')}
            >
              <span aria-hidden="true">+</span>
              {` Add Session`}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export { SessionListComponent };
