import { Button, ButtonProps } from './button';
import { HeroIcon } from './hero-icon';

type EmptyStateProps = {
  button?: ButtonProps;
  description?: string;
  icon?: string;
  title?: string;
};

const EmptyState = ({ button, description, icon, title }: EmptyStateProps) => {
  return (
    <div className="text-center mx-auto max-w-lg space-y-4">
      {icon && <HeroIcon icon={icon} className="mx-auto size-12 text-gray-400 stroke-1" />}
      <div>
        {title && <h3 className="mt-4 text-base font-semibold leading-6 text-gray-900">{title}</h3>}
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
      </div>
      {button && (
        <div>
          <Button {...button} className="mx-auto">
            {button.children}
          </Button>
        </div>
      )}
    </div>
  );
};

export { EmptyState, EmptyStateProps };
