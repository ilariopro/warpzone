/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type FormData = Record<string, any>;

type FormErrors = Record<string, any> | null;

type HandleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

type HandleSubmit = (onSubmit: () => Promise<void>) => (e: FormEvent<HTMLFormElement>) => Promise<void>;

type UseForm<T extends FormData = FormData, FormErrors = null> = {
  data: T;
  errors: FormErrors;
  handleChange: HandleChange;
  handleSubmit: HandleSubmit;
  isSubmitting: boolean;
  setData: Dispatch<SetStateAction<T>>;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
};

type FormProps<T> = {
  initialValues: T;
};

type FormProviderProps<T extends FormData, FormErrors = null> = {
  children: ReactNode | ReactNode[];
  context: UseForm<T, FormErrors>;
};

const useForm = <T,>({ initialValues }: FormProps<T>) => {
  const [data, setData] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: HandleSubmit = (onSubmit) => async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!data) {
        throw new Error(
          'Form error: data is undefined. Use the setData hook or consider to set some initial values'
        );
      }

      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange: HandleChange = (e) => {
    const { name, value } = e.target;

    setErrors((formErrors) => ({ ...formErrors, [name]: null }));
    setData((formData) => ({ ...formData, [name]: value }));
  };

  return {
    data,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setData,
    setErrors,
  };
};

const FormContext = createContext<UseForm | null>(null);

const useFormContext = <T extends FormData, FormErrors>() => {
  const context = useContext(FormContext) as unknown as UseForm<T, FormErrors>;

  if (!context) {
    throw new Error('Form error: useFormContext must be used within a FormProvider');
  }

  return context;
};

const FormProvider = <T extends FormData, FormErrors>({
  children,
  context,
}: FormProviderProps<T, FormErrors>) => (
  <FormContext.Provider value={context as unknown as UseForm}>{children}</FormContext.Provider>
);

export {
  useForm,
  useFormContext,
  FormProvider,
  FormData,
  FormErrors,
  FormProps,
  FormProviderProps,
  HandleChange,
  HandleSubmit,
  UseForm,
};
