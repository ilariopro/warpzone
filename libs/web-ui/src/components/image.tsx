type ImageProps = {
  altText: string;
  className?: string;
  src: string;
};

const Image = ({ altText, className, src }: ImageProps) => {
  return <img className={className} src={src} alt={altText} />;
};

export { Image, ImageProps };
