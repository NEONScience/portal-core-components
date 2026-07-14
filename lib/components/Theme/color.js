// eslint-disable-next-line import/prefer-default-export
export const desaturate = (color, amount)=>`hsl(from ${color} h calc(s * ${amount}) l)`;
