import { SpinnerCircularSplit } from 'spinners-react';

const Loading = () => {
  const primaryColor = 'indigo';
  const secondaryColor = '#f0f0f0';

  return (
    <div className="h-screen flex items-center justify-center">
      <div role="status">
        <SpinnerCircularSplit color={primaryColor} secondaryColor={secondaryColor} />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export { Loading };
