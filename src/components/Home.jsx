/* eslint react/jsx-one-expression-per-line: 0, max-len: 0 */
import React from 'react';

import { makeStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import NeonEnvironment from '@/components/NeonEnvironment/NeonEnvironment';
import Theme from '@/components/Theme/Theme';

import DocBlock from './DocBlock';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export default function Home() {
  const classes = useStyles(Theme);
  const styleGuideUrl = 'https://raw.githubusercontent.com/NEONScience/portal-core-components/master/reference/NSF-NEON-BRAND.GUIDELINES.pdf';

  return (
    <>

      <DocBlock>
        NEON Data Portal Core Components is an open source library of <Link color="primary" href="https://reactjs.org" target="_blank">React</Link> components
        intended for use on <Link href={`${NeonEnvironment.getWebHost()}`} target="_blank">NEON Data Portal</Link> pages.
      </DocBlock>
      <DocBlock>
        This page and component pages accessed through the navigation links provided here serves
        as documentation for the usage of individual components in this library.
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>GitHub Repository</Typography>

      <DocBlock>
        Portal Core Components is open sourced under the MIT license here:
      </DocBlock>
      <DocBlock>
        <Link href="https://github.com/NEONScience/portal-core-components" target="_blank">
          https://github.com/NEONScience/portal-core-components
        </Link>
      </DocBlock>
      <DocBlock>
        See README for further details.
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Material UI</Typography>

      <DocBlock>
        The Portal Core Components library makes use of <Link href="https://material-ui.com" target="_blank">Material UI</Link> as
        a base component library. The presentation of documentation here is also modeled after
        Material UI, as it is a robust pattern for developing and documenting many possible
        iterations of complex components.
      </DocBlock>
      <DocBlock>
        A custom Material UI Theme is also present throught this library. The theme is based
        on guidelines laid out in the <Link href={styleGuideUrl}>NEON Style Guide</Link>.
        See <Link href="#Theme">Theme</Link> for complete details.
      </DocBlock>

    </>
  );
}
