import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import AppsIcon from '@material-ui/icons/Apps';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import NeonContext from '../NeonContext/NeonContext';

// TODO: Synthetic test data, remove this constant when real data is available.
const applications = {
  token: 'token',
  data: {
    apps: [
      {
        name: 'Neon Sign-In',
        description: 'Access your applications.',
        url: 'https://data-neonscience.auth0.com/login?state=hKFo2SBiSjg3dklhMnV6bXFzaUtFQ3dFTl9sdEM4TWI2T0h2N6FupWxvZ2luo3RpZNkgZ2I5Uk1TZm1ZZ0NuSVNYd2JOSUVCQjR1UEVYZktZaTWjY2lk2SBPbjdYRkdrZTROanRZQU03bnE1MUxCcFNFakdGNndtMg&client=On7XFGke4NjtYAM7nq51LBpSEjGF6wm2&protocol=oauth2&redirect_uri=https%3A%2F%2Fdata.neonscience.org%2Fauth0%2Fcallback&audience=https%3A%2F%2Fdata-neonscience.auth0.com%2Fapi%2Fv2%2F&scope=openid%20profile%20email%20read%3Acurrent_user%20create%3Acurrent_user_metadata%20update%3Acurrent_user_metadata&response_type=code',
      },
      {
        name: 'Profile',
        description: 'Edit your account settings after signing in.',
        url: 'https://example.com/app3',
      },
      {
        name: 'Data Explorer',
        description: 'Explore the Neon data collection.',
        url: 'https://data.neonscience.org/data-products/explore',
      },
      {
        name: 'Sample Explorer',
        description: 'Explore the Neon sample collection.',
        url: 'https://data.neonscience.org/sample-explorer',
      },
      {
        name: 'Application 3',
        description: 'Another application.',
        url: 'https://example.com/app3',
      },
    ],
  },
};

// Declare CSS.
const useStyles = makeStyles((theme: Theme) => createStyles({
  menuContainer: {
    zIndex: 1000, // Be sure to display menu over other elements
  },
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.45)',
    position: 'relative',
  },
  toolbarButtons: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: theme.spacing(2.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: '500px', // Limit width of menu
    marginTop: theme.spacing(1), // Line top of menu up with divider
  },
  card: {
    transition: '0.4s', // Raised hover effect for Cards
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.45)',
    },
    cursor: 'pointer', // Visually indicate Cards are links
    width: '100%', // Ensure Cards are equal width
    border: 0,
  },
  cardContent: {
    textAlign: 'center',
  },
  gridItem: {
    display: 'flex', // Help grid items stretch to equal height
  },
}));

// TODO: Get the user's application from the context.
// eslint-disable-next-line
const getApplicationData = () => {
  const [{ auth: authData }] = NeonContext.useNeonContextState();
  // eslint-disable-next-line no-unused-vars
  const { userData } = authData;
  return userData;
};

// The application menu component.
export default function ApplicationMenu() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const { apps } = applications.data;

  // Handle menu toggle.
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Close the menu.
  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  // Open menu by tab key.
  /*   function handleListKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    } */

  // Handle a menu selection.
  const handleMenuItemClick = (event: React.MouseEvent<EventTarget>, index: number) => {
    const app = applications.data.apps[index];
    window.location.href = app.url;
  };

  // Return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.toolbarContainer}>
      <div className={classes.toolbarButtons}>
        <Tooltip
          title="Neon Applications"
          aria-label="Neon Applications"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          classes={classes}
          arrow
        >
          <IconButton
            ref={anchorRef}
            style={{ color: 'black' }}
            aria-label="more"
            aria-controls={open ? 'neon-application-menu' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <AppsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Popper
          className={classes.menuContainer}
          open={open}
          anchorEl={anchorRef.current}
          role="presentation"
          transition
        >
          {({ TransitionProps, placement }) => (
            <Fade
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              timeout={600}
            >
              <Paper elevation={3} className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <Grid
                    container
                    spacing={4}
                    alignItems="stretch"
                  >
                    {apps.map((app, index) => (
                      <Grid item xs={6} className={classes.gridItem}>
                        <Card
                          onClick={(event) => handleMenuItemClick(event, index)}
                          key={app.url}
                          className={classes.card}
                        >
                          <CardContent className={classes.cardContent}>
                            {index % 2 === 0 ? <InboxIcon fontSize="large" />
                              : <MailIcon fontSize="large" />}
                            <Typography variant="h6">{app.name}</Typography>
                            {app.description}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    </div>
  );
}
