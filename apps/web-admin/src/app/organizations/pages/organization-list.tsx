import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Metadata, Organization } from '@warpzone/shared-schemas';
import { localDate } from '@warpzone/shared-utils';
import { EmptyState, Loading, PageHeading, Pagination, StackedList } from '@warpzone/web-ui';
import { useCheckRole } from '../../shared';
import { useOrganizationService } from '../hooks/use-organization-service';

const OrganizationList = () => {
  useCheckRole();

  const navigate = useNavigate();
  const [meta, setMeta] = useState<Metadata>({} as Metadata);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchParams] = useSearchParams();
  const { deleteOrganization, fetchOrganizations, isLoading } = useOrganizationService();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchOrganizations(searchParams);

      setMeta(response?.meta ?? ({} as Metadata));
      setOrganizations(response?.organizations ?? []);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onDelete = (organization: Organization) => {
    deleteOrganization(organization, () => {
      setOrganizations((organizations) => organizations.filter((o) => o.id !== organization.id));
      setMeta((meta) => ({ ...meta, count: meta.count - 1 }));
    });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <PageHeading
        mainTitle="Organizations"
        description={`In this area you can manage all the organizations`}
        button={{
          text: 'Add Organization',
          onClick: () => navigate('new'),
        }}
      />
      {!organizations.length ? (
        <div className="border-t border-gray-200 flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <EmptyState
            button={{
              children: (
                <>
                  <span aria-hidden="true">+</span>
                  {` Add Organization`}
                </>
              ),
              variant: 'transparent',
              onClick: () => navigate('new'),
            }}
            title="Add Organizations"
            icon="FolderPlusIcon"
            description="Add your first organization and start your journey"
          />
        </div>
      ) : (
        <>
          <StackedList
            items={organizations.map((organization) => ({
              id: organization.id,
              avatar: {
                name: organization.name,
                variant: 'bauhaus',
              },
              title: organization.name,
              subTitle: organization.email,
              info: organization.createdAt && `Created at: ${localDate(organization.createdAt)}`,
              subInfo: organization.updatedAt && `Last update: ${localDate(organization.updatedAt)}`,
              actions: [
                {
                  text: 'Edit',
                  screenReaderText: organization.id,
                  onClick: () => navigate(organization.id as string),
                },
                {
                  text: 'Delete',
                  screenReaderText: organization.id,
                  onClick: () => onDelete(organization),
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

export { OrganizationList };
