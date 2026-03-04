import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Administrator, AdministratorRole } from '@warpzone/shared-schemas';
import { randomString } from '@warpzone/shared-utils';
import { FormInput, FormSelect, Loading, PageHeading, useForm } from '@warpzone/web-ui';
import { useAdminContext, useCheckRole } from '../../shared';
import { useAdministratorService } from '../hooks/use-administrator-service';

type AdministratorEditProps = {
  scope: 'new' | 'edit';
};

const AdministratorEdit = ({ scope }: AdministratorEditProps) => {
  useCheckRole();

  const navigate = useNavigate();
  const [administrator, setAdministrator] = useState<Administrator>({} as Administrator);
  const { administratorId } = useParams();
  const { organizationId } = useAdminContext();
  const { createAdministrator, fetchAdministrator, isLoading, updateAdministrator, validateAdministrator } =
    useAdministratorService();
  const { data, errors, handleChange, handleSubmit, setData, setErrors } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      password: '',
      role: 1,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (administratorId) {
        const administrator = await fetchAdministrator(administratorId);
        setAdministrator(administrator as Administrator);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [administratorId]);

  useEffect(() => {
    setData({
      firstName: administrator.firstName ?? '',
      lastName: administrator.lastName ?? '',
      email: administrator.email ?? '',
      confirmEmail: '',
      password: scope === 'edit' ? administrator.password : randomString(10),
      role: administrator.role ?? 1,
    });
  }, [administrator, scope, setData]);

  const onSubmit = async () => {
    const { confirmEmail, ...formData } = data;
    const administratorData = {
      ...formData,
      organizationId,
      role: Number(data.role),
    } as Administrator;

    const errors = validateAdministrator(administratorData);

    if (errors) {
      setErrors(errors);
      return;
    }

    if ((confirmEmail || formData.email !== administrator.email) && formData.email !== confirmEmail) {
      setErrors({ confirmEmail: 'The emails are different' });
      return;
    }

    if (scope === 'new') {
      const administratorId = await createAdministrator(administratorData);
      navigate(`/administrators/${administratorId}`);
    } else {
      await updateAdministrator({ id: administratorId, ...administratorData });
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageHeading
          mainTitle={`${scope === 'edit' ? 'Edit' : 'Add'} Administrator`}
          mainTitleSize="mid"
          button={{
            text: 'Save Administrator',
            type: 'submit',
          }}
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Set the administrator's personal information here.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <FormInput
                error={errors?.firstName}
                label="First Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
              />
            </div>
            <div className="sm:col-span-3">
              <FormInput
                error={errors?.lastName}
                label="Last Name"
                name="lastName"
                onChange={handleChange}
                optional={true}
                value={data.lastName}
              />
            </div>
            <div className="sm:col-span-3">
              <FormInput
                error={errors?.email}
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={data.email}
              />
            </div>
            <div className="sm:col-span-3">
              <FormInput
                error={errors?.confirmEmail}
                label="Confirm Email"
                name="confirmEmail"
                type="email"
                onChange={handleChange}
                value={data.confirmEmail}
              />
            </div>
            <div className="col-span-full">
              <FormInput
                label="Password"
                name="password"
                disabled={true}
                type="password"
                value={data.password}
              />
              <div className="sm:mt-2">
                <span className="text-sm leading-6 text-gray-500">
                  This password is generated automatically, the administrator will change it to one of his
                  choice
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-gray-200 py-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Role and Status</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Change role and status for this administrator.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <FormSelect
                label="Role"
                name="role"
                onChange={handleChange}
                defaultValue={`${data.role}`}
                values={Object.values(AdministratorRole)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export { AdministratorEdit };
