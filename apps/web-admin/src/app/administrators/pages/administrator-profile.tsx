import { useEffect } from 'react';
import { Administrator } from '@warpzone/shared-schemas';
import { FormInput, Loading, PageHeading, useForm } from '@warpzone/web-ui';
import { useAdminContext } from '../../shared';
import { useAdministratorService } from '../hooks/use-administrator-service';

const AdministratorProfile = () => {
  // useCheckRole();

  const { administrator, organizationId } = useAdminContext();
  const { updateAdministrator, validateAdministrator, validatePasswords } = useAdministratorService();
  const { data, errors, handleChange, handleSubmit, setData, setErrors } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    setData({
      firstName: administrator.firstName ?? '',
      lastName: administrator.lastName ?? '',
      email: administrator.email ?? '',
      password: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [administrator, setData]);

  const onSubmit = async () => {
    const { newPassword, confirmPassword, ...formData } = data;
    if (formData.password || newPassword || confirmPassword) {
      const errors = validatePasswords(formData.password, newPassword, confirmPassword);

      if (!formData.password && (newPassword || confirmPassword)) {
        setErrors({ password: 'Enter your password to confirm the changes' });
        return;
      }

      if (errors) {
        setErrors(errors);
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrors({ confirmPassword: 'The passwords are different' });
        return;
      }

      if (formData.password !== administrator.password) {
        setErrors({ password: 'Your password is wrong' });
        return;
      }
    }

    const administratorData = {
      ...formData,
      organizationId,
      password: formData.password || administrator.password,
      role: administrator.role,
    } as Administrator;

    const errors = validateAdministrator(administratorData);

    if (errors) {
      setErrors(errors);
      return;
    }

    await updateAdministrator({ id: administrator.id, ...administratorData });
  };

  return !administrator ? (
    <Loading />
  ) : (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageHeading
          mainTitle="Your Profile"
          mainTitleSize="mid"
          button={{
            text: 'Update Profile',
            type: 'submit',
          }}
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Set your personal information here.</p>
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
            <div className="col-span-full">
              <FormInput
                disabled={true}
                error={errors?.email}
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={data.email}
              />
              <div className="sm:mt-2">
                <span className="text-sm leading-6 text-gray-500">
                  Contact the administrator if you need to change your email
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-gray-200 py-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Password</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Update your password here.</p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3 sm:col-start-1">
              <FormInput
                error={errors?.password}
                label="Current Password"
                name="password"
                type="password"
                onChange={handleChange}
                value={data.password}
              />
            </div>
            <div className="sm:col-span-3 sm:col-start-1  ">
              <FormInput
                error={errors?.newPassword}
                label="New Password"
                name="newPassword"
                type="password"
                onChange={handleChange}
                value={data.newPassword}
              />
            </div>
            <div className="sm:col-span-3">
              <FormInput
                error={errors?.confirmPassword}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                value={data.confirmPassword}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export { AdministratorProfile };
