import { Button, ButtonProps } from './button';
import { HeroIcon } from './hero-icon';

type PageHeadingButtonProps = {
  icon?: string;
  text: string;
} & Pick<ButtonProps, 'onClick' | 'type' | 'disabled' | 'name' | 'size'>;

type PageHeadingProps = {
  mainTitle: string;
  mainTitleSize?: 'mid' | 'big';
  topTitle?: string;
  description?: string;
  button?: PageHeadingButtonProps;
};

const PageHeading = ({
  mainTitle,
  mainTitleSize = 'big',
  topTitle,
  description,
  button,
}: PageHeadingProps) => {
  const getMainTitleSize = () => {
    return mainTitleSize === 'big' ? 'text-3xl' : 'text-2xl';
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap items-center gap-6 sm:flex-nowrap">
        <div className="min-w-0">
          {topTitle && (
            <h2 className="font-semibold leading-7 text-gray-500 pb-1 text-sm text-base">{topTitle}</h2>
          )}
          <h1 className={`${getMainTitleSize()} font-bold leading-7 text-gray-900 sm:tracking-tight`}>
            {mainTitle}
          </h1>
        </div>
        {button && (
          <Button {...button} className="ml-auto" size={button.size}>
            {button.icon && <HeroIcon icon={button.icon} />}
            {button.text}
          </Button>
        )}
      </div>
      {description && (
        <div className="flex flex-wrap items-center gap-6 -mt-2 sm:flex-nowrap">
          <p className="text-sm text-gray-900 ">{description}</p>
        </div>
      )}
    </div>
  );
};
export { PageHeading, PageHeadingProps };
