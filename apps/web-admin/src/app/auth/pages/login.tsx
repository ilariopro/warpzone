import { Link } from 'react-router-dom';
import { classNames } from '@warpzone/shared-utils';
import { Button, FormInput, Loading, useForm } from '@warpzone/web-ui';
import { useAuthService } from '../hooks/use-auth-service';

const Login = () => {
  const { isLoading, loginAdministrator, validateLogin } = useAuthService();
  const { data, errors, isSubmitting, handleChange, handleSubmit, setErrors } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async () => {
    const errors = validateLogin(data);

    if (errors) {
      setErrors(errors);
      return;
    }

    await loginAdministrator(data);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
      <FormInput
        autoComplete="email"
        error={errors?.email}
        label="Email address"
        name="email"
        onChange={handleChange}
        type="email"
        value={data.email}
      />
      <FormInput
        autoComplete="current-password"
        error={errors?.password}
        label="Password"
        name="password"
        onChange={handleChange}
        type="password"
        value={data.password}
      />
      <div className="flex items-center justify-between">
        {/* <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
              Remember me
            </label>
          </div> */}
        <div className="text-sm leading-6 ml-auto mb-2">
          <Link to="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </Link>
        </div>
      </div>
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={classNames('flex w-full justify-center', isSubmitting ? 'bg-indigo-500' : '')}
        >
          Sign in
        </Button>
      </div>
    </form>
  );
};

export { Login };
