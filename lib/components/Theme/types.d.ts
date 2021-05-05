import { Theme as MuiTheme } from '@material-ui/core/styles';
export interface NeonTheme extends MuiTheme {
    isNeonTheme: boolean;
    colors: Record<string, Record<number, string>>;
}
