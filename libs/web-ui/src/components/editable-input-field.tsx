import { useEffect, useState } from 'react';
import { useForm } from '../hooks/use-form';
import { Button } from './button';
import { FormInput } from './form-input';

type EditableInputFieldProps = {
  label: string;
  name: string;
  value?: string;
  onSubmit: () => Promise<void>;
};

const EditableInputField = ({ label, name, value, onSubmit }: EditableInputFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [defaultValue, setDefaultValue] = useState<string>('');
  const { data, errors, handleChange, handleSubmit, setData } = useForm({
    initialValues: { [name]: '' },
  });

  useEffect(() => {
    if (value) {
      setDefaultValue(value);
      setData({ [name]: value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleCancel = () => {
    setData({ [name]: defaultValue });
    setIsEditing(false);
  };

  return isEditing ? (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1.5 py-6 text-sm">
      <FormInput label={label} name={name} onChange={handleChange} value={data[name]} />
      <div className="flex items-start">
        <div className="flex-grow">{errors && <small className="text-red-600">{errors.value}</small>}</div>
        <div className="flex flex-shrink-0 justify-end ml-2">
          <Button className="inline-flex" onClick={handleCancel} size="small" variant="neutral">
            Cancel
            <span className="sr-only">{name}</span>
          </Button>
          <Button className="ml-3 inline-flex" size="small" type="submit">
            Save
            <span className="sr-only">{name}</span>
          </Button>
        </div>
      </div>
    </form>
  ) : (
    <div className="flex items-center text-sm">
      <div className="space-y-1.5 py-6">
        <span className="block font-medium text-sm leading-6 text-gray-900">{label}</span>
        <span className="block text-gray-900">{value}</span>
      </div>
      <div className="ml-auto">
        <Button onClick={() => setIsEditing(true)} variant="transparent">
          Edit
          <span className="sr-only">{name}</span>
        </Button>
      </div>
    </div>
  );
};

export { EditableInputField, EditableInputFieldProps };
