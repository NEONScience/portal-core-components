import { Theme } from '@mui/material/styles';

export interface NeonTheme extends Theme {
  isNeonTheme: boolean;
  colors: Record<string, Record<number, string>>;
}

declare module '@mui/material/styles' {
  interface Theme {
    isNeonTheme: boolean;
    colors: Record<string, Record<number, string>>;
  }
}
