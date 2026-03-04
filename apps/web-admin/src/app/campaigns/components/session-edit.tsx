import { Dispatch, SetStateAction, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Session } from '@warpzone/shared-schemas';
import { Button, FormInput, useForm } from '@warpzone/web-ui';
import { addTime, localDate, utcDate } from '@warpzone/shared-utils';
import { useSessionService } from '../../sessions/hooks/use-session-service';

type SessionEditProps = {
  session?: Session;
  sessionList: Session[];
  setEditField: Dispatch<SetStateAction<string>>;
  setSessionList: Dispatch<SetStateAction<Session[]>>;
};

const SessionEdit = ({ session, sessionList, setEditField, setSessionList }: SessionEditProps) => {
  const { campaignId } = useParams();
  const { createSession, updateSession, validateSession } = useSessionService();
  const { data, errors, handleChange, handleSubmit, setData, setErrors } = useForm({
    initialValues: {
      startAt: localDate(new Date(), 'YYYY-MM-DD HH:mm'),
      endAt: addTime('1h', localDate(new Date(), 'YYYY-MM-DD HH:mm')),
    },
  });

  const setFormData = () => {
    if (session) {
      setData({
        startAt: localDate(session.startAt, 'YYYY-MM-DD HH:mm'),
        endAt: session.endAt ? localDate(session.endAt, 'YYYY-MM-DD HH:mm') : '',
      });
    }
  };

  useEffect(() => {
    setFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    if (data.startAt > data.endAt) {
      setErrors({ startAt: 'The start date cannot be greater than the end date' });
      return;
    }

    const sessionData = {
      ...session,
      ...data,
      campaignId: campaignId as string,
      startAt: utcDate(data.startAt),
      endAt: data.endAt ? utcDate(data.endAt) : '',
    };

    const errors = validateSession(sessionData);

    if (errors) {
      setErrors(errors);
      return;
    }

    if (sessionData.id) {
      const sessionIndex = sessionList.findIndex((item) => item.id === sessionData.id);
      await updateSession(sessionData, `#${sessionIndex + 1}`);
      setSessionList(sessionList.map((session) => (session.id === sessionData.id ? sessionData : session)));
    } else {
      const sessionId = await createSession(sessionData, `#${sessionList.length + 1}`);
      setSessionList(sessionList.concat({ ...sessionData, id: sessionId }));
    }

    setEditField('');
  };

  const onCancel = () => {
    setFormData();
    setEditField('');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row items-start gap-x-6 py-6 mb-2.5">
        <div className="w-full">
          <FormInput
            error={errors?.startAt}
            label="Start at"
            name="startAt"
            onChange={handleChange}
            type="datetime-local"
            value={data.startAt}
          />
        </div>
        <div className="w-full">
          <FormInput
            error={errors?.endAt}
            label="End at"
            name="endAt"
            onChange={handleChange}
            type="datetime-local"
            value={data.endAt}
          />
        </div>
      </div>
      <div className="flex items-start -mt-3 mb-6">
        <div className="flex flex-shrink-0 justify-end ml-auto">
          <Button className="inline-flex" onClick={onCancel} size="small" variant="neutral">
            Cancel
            <span className="sr-only">{session?.id}</span>
          </Button>
          <Button className="ml-3 inline-flex" size="small" type="submit">
            Save
            <span className="sr-only">{session?.id}</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export { SessionEdit, SessionEditProps };
