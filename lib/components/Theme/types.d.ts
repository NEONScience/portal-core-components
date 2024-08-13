import { Theme } from '@mui/material/styles';
export interface NeonTheme extends Theme {
    isNeonTheme: boolean;
    colors: Record<string, Record<number, string>>;
}
declare module '@mui/styles/defaultTheme' {
    interface DefaultTheme extends Theme {
    }
}
