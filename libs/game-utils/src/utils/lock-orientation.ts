/**
 * Try to lock the screen orientation to the desidered orientation.
 *
 * @param orientation The desidered orientation, it can be 'landscape' or 'portrait'.
 * @returns boolean The result of the try
 */
const lockOrientation = (orientation: 'landscape' | 'portrait') => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (screen.orientation as any).lock(orientation);

    return true;
  } catch (error) {
    return false;
  }
};

export { lockOrientation };
