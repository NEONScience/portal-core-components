// eslint-disable-next-line import/prefer-default-export
export const desaturate = (color: string, amount: number): string => (
  `hsl(from ${color} h calc(s * ${amount}) l)`
);
