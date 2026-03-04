import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Administrator, Metadata } from '@warpzone/shared-schemas';
import { localDate } from '@warpzone/shared-utils';
import { EmptyState, Loading, PageHeading, Pagination, StackedList } from '@warpzone/web-ui';
import { useCheckRole } from '../../shared';
import { useAdministratorService } from '../hooks/use-administrator-service';

const AdministratorList = () => {
  useCheckRole();

  const navigate = useNavigate();
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [meta, setMeta] = useState<Metadata>({} as Metadata);
  const [searchParams] = useSearchParams();
  const { deleteAdministrator, fetchAdministrators, getFullName, isLoading } = useAdministratorService();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAdministrators(searchParams);

      setAdministrators(response?.administrators ?? []);
      setMeta(response?.meta ?? ({} as Metadata));
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onDelete = (administrator: Administrator) => {
    deleteAdministrator(administrator, () => {
      setAdministrators((administrators) => administrators.filter((c) => c.id !== administrator.id));
      setMeta((meta) => ({ ...meta, count: meta.count - 1 }));
    });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <PageHeading
        mainTitle="Administrators"
        description={`In this area you can manage all the administrators`}
        button={{
          text: 'Add Administrator',
          onClick: () => navigate('new'),
        }}
      />
      {!administrators.length ? (
        <div className="border-t border-gray-200 flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <EmptyState
            button={{
              children: (
                <>
                  <span aria-hidden="true">+</span>
                  {` Add Administrator`}
                </>
              ),
              variant: 'transparent',
              onClick: () => navigate('new'),
            }}
            title="Add Administrators"
            icon="FolderPlusIcon"
            description="Add your first administrator and start your journey"
          />
        </div>
      ) : (
        <>
          <StackedList
            items={administrators.map((administrator) => ({
              id: administrator.id,
              avatar: {
                name: administrator.email,
                variant: 'pixel',
              },
              title: `${getFullName(administrator)}`,
              subTitle: administrator.email,
              info: administrator.createdAt && `Created at: ${localDate(administrator.createdAt)}`,
              subInfo: administrator.updatedAt && `Last update: ${localDate(administrator.updatedAt)}`,
              actions: [
                {
                  text: 'Edit',
                  screenReaderText: administrator.id,
                  onClick: () => navigate(administrator.id as string),
                },
                {
                  text: 'Delete',
                  screenReaderText: administrator.id,
                  onClick: () => onDelete(administrator),
                },
              ],
            }))}
          />
          <Pagination {...meta} />
        </>
      )}
    </>
  );
};

export { AdministratorList };
