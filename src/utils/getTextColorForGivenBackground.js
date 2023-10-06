export default (backgroundColor) => {
  // Convert the background color to its RGB components
  const rgb = parseInt(backgroundColor.slice(1), 16);
  // eslint-disable-next-line no-bitwise
  const red = (rgb >> 16) & 0xff;
  // eslint-disable-next-line no-bitwise
  const green = (rgb >> 8) & 0xff;
  // eslint-disable-next-line no-bitwise
  const blue = rgb & 0xff;

  // Calculate relative luminance
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  // Choose text color based on luminance threshold (0.5 is a common threshold)
  return luminance > 0.5 ? 'black' : 'white';
};
