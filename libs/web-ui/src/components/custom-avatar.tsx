import Avatar, { AvatarProps } from 'boring-avatars';
import randomColor from 'randomcolor';

type CustomAvatarProps = AvatarProps;

const CustomAvatar = ({ name, size = 44, ...avatarProps }: CustomAvatarProps) => {
  const getRandomColor = (seed = 'Welcome to WarpZone') => randomColor({ count: 10, seed });

  return <Avatar {...avatarProps} name={name} size={size} colors={getRandomColor(name)} />;
};

export { CustomAvatar, CustomAvatarProps };
