/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as SolidIcons from '@heroicons/react/24/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';

type HeroIconProps = {
  className?: string;
  icon: string;
  type?: 'outline' | 'solid';
};

const HeroIcon = ({ icon, type = 'outline', className = 'size-6 text-black' }: HeroIconProps) => {
  const { ...icons } = type === 'outline' ? OutlineIcons : SolidIcons;

  // @ts-ignore
  const Icon: JSX.Element = icons[icon];

  // @ts-ignore
  return <Icon className={className} aria-hidden="true" />;
};

export { HeroIcon, HeroIconProps };
