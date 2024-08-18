import React from 'react';

import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import ReleaseIconOutlined from '@mui/icons-material/LocalOfferOutlined';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxesStacked, faTag } from '@fortawesome/free-solid-svg-icons';

import InfoCard from '@/components/Card/InfoCard';
import WarningCard from '@/components/Card/WarningCard';
import ErrorCard from '@/components/Card/ErrorCard';
import InfoMessageCard from '@/components/Card/InfoMessageCard';
import Theme from '@/components/Theme/Theme';

import CodeBlock from '../../../components/CodeBlock';
import DocBlock from '../../../components/DocBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles((theme: NeonTheme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  paper: {
    width: '100%',
    padding: Theme.spacing(3),
  },
  customReleaseIcon: {
    color: 'rgba(0, 0, 0, 0.9)',
    marginRight: theme.spacing(2),
  },
  customIcon: {
    color: 'rgba(0, 0, 0, 0.9)',
    padding: '5px',
    fontSize: '1.5em',
    marginRight: theme.spacing(2),
  },
  customCard: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: theme.colors.GOLD[50],
    borderColor: theme.colors.GOLD[200],
  },
  customSecondaryIcon: {
    color: theme.colors.GOLD[200],
    marginRight: theme.spacing(2),
  },
  customBrownCard: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: theme.colors.BROWN[50],
    borderColor: theme.colors.BROWN[300],
  },
  customBrownSecondaryIcon: {
    color: theme.colors.BROWN[300],
    marginRight: theme.spacing(2),
  },
  customBlueCard: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: 'rgba(225, 227, 234, 0.6)', // This is => theme.colors.NEON_BLUE[50]
    borderColor: theme.colors.NEON_BLUE[200],
  },
  customBlueSecondaryIcon: {
    color: theme.colors.NEON_BLUE[300],
    marginRight: theme.spacing(2),
  },
  customGreenCard: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: theme.colors.GREEN[50],
    borderColor: theme.colors.GREEN[400],
  },
  customGreenSecondaryIcon: {
    color: theme.colors.GREEN[400],
    marginRight: theme.spacing(2),
  },
}));

const propRows = [
  {
    name: 'message',
    type: 'string',
    default: 'null',
    description: (
      <p>
        The message to be displayed as the main content of the card.
      </p>
    ),
  },
  {
    name: 'title',
    type: 'string',
    default: 'null',
    description: (
      <p>
        The title of the card.
      </p>
    ),
  },
];

export default function StyleGuide() {
  const classes = useStyles(Theme);
  /* eslint-disable jsx-a11y/anchor-is-valid, react/jsx-one-expression-per-line */
  const link = (
    <Link href="#">
      Insert Link Here
    </Link>
  );
  const message = (
    <Typography variant="body2">
      Lorem in proin in nunc in cras et gravida. {link} neque risus risus a
      lectus veneatis sed gravida volutpat viverra. Aenean sem tellus at proin dictum
      scelerisque metus. Sit sit tellus risus diam ultrices amet tortor molestie scelerisque.
    </Typography>
  );
  const messageText = `
Lorem in proin in nunc in cras et gravida. Urna congue neque risus risus a
lectus veneatis sed gravida volutpat viverra. Aenean sem tellus at proin dictum
scelerisque metus. Sit sit tellus risus diam ultrices amet tortor molestie scelerisque.
  `;
  /* eslint-enable jsx-a11y/anchor-is-valid, react/jsx-one-expression-per-line */
  return (
    <>
      <DocBlock>
        A set of modules for displaying messages, cards/callouts, warnings, or errors.
      </DocBlock>
      <CodeBlock>
        {`
import InfoCard from 'portal-core-components/lib/components/Card/InfoCard';
import WarningCard from 'portal-core-components/lib/components/Card/WarningCard';
import ErrorCard from 'portal-core-components/lib/components/Card/ErrorCard';

import InfoMessageCard from 'portal-core-components/lib/components/Card/InfoMessageCard';
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>
        Example Information Card
      </Typography>
      <DocBlock>
        Displays an informational card.
      </DocBlock>
      <CodeBlock>
        {`
import InfoCard from 'portal-core-components/lib/components/Card/InfoCard';

const message = \`
Lorem in proin in nunc in cras et gravida. Urna congue neque risus risus a
lectus veneatis sed gravida volutpat viverra. Aenean sem tellus at proin dictum
scelerisque metus. Sit sit tellus risus diam ultrices amet tortor molestie scelerisque.
  \`;

<InfoCard title="The Card Title" message={message} />
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <InfoCard
            title="Custom Heading Content"
            message={messageText}
          />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>Card Props</Typography>

      <DocBlock>
        <PropsTable props={propRows} />
      </DocBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>
        Example Informational Message Card
      </Typography>
      <DocBlock>
        Displays an informational card.
      </DocBlock>
      <CodeBlock>
        {`
import InfoMessageCard from 'portal-core-components/lib/components/Card/InfoMessageCard';

const message = \`
Lorem in proin in nunc in cras et gravida. Urna congue neque risus risus a
lectus veneatis sed gravida volutpat viverra. Aenean sem tellus at proin dictum
scelerisque metus. Sit sit tellus risus diam ultrices amet tortor molestie scelerisque.
  \`;

<InfoMessageCard title="The Card Title" message={message}/>
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <InfoMessageCard
            title="Custom Heading Content"
            messageContent={message}
          />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>
        Example Warning Card
      </Typography>
      <DocBlock>
        Displays a warning card.
      </DocBlock>
      <CodeBlock>
        {`
import WarningCard from 'portal-core-components/lib/components/Card/WarningCard';

const message = \`
Lorem in proin in nunc in cras et gravida. Urna congue neque risus risus a
lectus veneatis sed gravida volutpat viverra. Aenean sem tellus at proin dictum
scelerisque metus. Sit sit tellus risus diam ultrices amet tortor molestie scelerisque.
  \`;

<WarningCard title="The Card Title" message={message}/>
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <WarningCard
            title="Custom Heading Content"
            message={messageText}
          />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>
        Example Error Card
      </Typography>
      <DocBlock>
        Displays an error card.
      </DocBlock>
      <CodeBlock>
        {`
import ErrorCard from 'portal-core-components/lib/components/Card/ErrorCard';

const message = \`
Lorem in proin in nunc in cras et gravida. Urna congue neque risus risus a
lectus veneatis sed gravida volutpat viverra. Aenean sem tellus at proin dictum
scelerisque metus. Sit sit tellus risus diam ultrices amet tortor molestie scelerisque.
  \`;

<ErrorCard title="The Card Title" message={message}/>
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <ErrorCard
            title="Custom Heading Content"
            message={messageText}
          />
        </Paper>
      </ExampleBlock>

      <Divider className={classes.divider} />

      <Typography variant="h4" component="h2" gutterBottom>
        Example Informational Message Cards
      </Typography>
      <DocBlock>
        Displays an informational message card.
      </DocBlock>
      <CodeBlock>
        {`
import InfoMessageCard from 'portal-core-components/lib/components/Card/InfoMessageCard';

const message = \`
Lorem in proin in nunc in cras et gravida. Urna congue neque risus risus a
lectus veneatis sed gravida volutpat viverra. Aenean sem tellus at proin dictum
scelerisque metus. Sit sit tellus risus diam ultrices amet tortor molestie scelerisque.
  \`;

<InfoMessageCard title="The Card Title" message={message}/>
        `}
      </CodeBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <InfoMessageCard
            title="Custom Heading Content"
            messageContent={message}
          />
        </Paper>
      </ExampleBlock>

      <DocBlock>
        Displays an informational message card with custom icon.
      </DocBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <InfoMessageCard
            icon={(<ReleaseIconOutlined fontSize="small" className={classes.customReleaseIcon} />)}
            title="Data Product Release"
            messageContent={message}
          />
          <InfoMessageCard
            icon={(
              <FontAwesomeIcon
                icon={faTag}
                size="1x"
                className={classes.customIcon}
              />
            )}
            title="Data Product Release"
            messageContent={message}
          />
          <InfoMessageCard
            icon={(
              <FontAwesomeIcon
                icon={faBox}
                size="1x"
                className={classes.customIcon}
              />
            )}
            title="Data Product Bundle"
            messageContent={message}
          />
          <InfoMessageCard
            icon={(
              <FontAwesomeIcon
                icon={faBoxesStacked}
                size="1x"
                className={classes.customIcon}
              />
            )}
            title="Data Product Bundle"
            messageContent={message}
          />
        </Paper>
      </ExampleBlock>

      <DocBlock>
        Displays an informational message card with custom classes.
      </DocBlock>
      <ExampleBlock>
        <Paper className={classes.paper}>
          <InfoMessageCard
            title="Custom Heading Content"
            messageContent={message}
            classes={{
              card: classes.customCard,
              secondaryIcon: classes.customSecondaryIcon,
            }}
          />
          <InfoMessageCard
            title="Custom Heading Content"
            messageContent={message}
            classes={{
              card: classes.customBrownCard,
              secondaryIcon: classes.customBrownSecondaryIcon,
            }}
          />
          <InfoMessageCard
            classes={{
              card: classes.customBlueCard,
              secondaryIcon: classes.customBlueSecondaryIcon,
            }}
            icon={(
              <FontAwesomeIcon
                icon={faTag}
                size="1x"
                className={classes.customIcon}
              />
            )}
            title="Data Product Release"
            messageContent={message}
          />
          <InfoMessageCard
            classes={{
              card: classes.customGreenCard,
              secondaryIcon: classes.customGreenSecondaryIcon,
            }}
            icon={(
              <FontAwesomeIcon
                icon={faTag}
                size="1x"
                className={classes.customIcon}
              />
            )}
            title="Data Product Release"
            messageContent={message}
          />
        </Paper>
      </ExampleBlock>
    </>
  );
}
