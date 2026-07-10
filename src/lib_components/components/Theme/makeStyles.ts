import { useTheme } from '@mui/material/styles';
import { createMakeStyles } from 'tss-react';
import { NeonTheme } from './types';

// eslint-disable-next-line import/prefer-default-export
export const { makeStyles } = createMakeStyles({
  useTheme: useTheme as () => NeonTheme,
});
