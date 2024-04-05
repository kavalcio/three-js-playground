export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomColor = () => {
  // Generate random rgb color
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  // Convert to hex
  const rgb = b | (g << 8) | (r << 16);
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
};

export const findIndexOfMaxValue = (a) =>
  a.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);

/* Based on formula by Arnauld: https://codegolf.stackexchange.com/a/259638 */
export const getNormalizedBayerMatrix = (n) => {
  let g;
  let t = n + 1;
  const matrix = [...Array(1 << t)].map((_, y, a) =>
    a.map(
      (g = (k = t, x) =>
        k-- && (4 * g(k, x)) | ((2 * (x >> k) + 3 * ((y >> k) & 1)) & 3)),
    ),
  );
  return matrix.flat().map((el) => el / Math.pow(2, 2 * n + 2));
};

export const getRandomPolarCoordinate = (radius) => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI * 2;
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);
  return { x, y, z };
};
