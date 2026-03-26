import { Theme } from '@mui/material/styles';

export interface NeonTheme extends Theme {
  isNeonTheme: boolean;
  colors: Record<string, Record<number, string>>;
}

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DefaultTheme extends Theme {}
}
