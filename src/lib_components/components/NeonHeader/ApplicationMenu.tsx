import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import AppsIcon from '@material-ui/icons/Apps';
import Fade from '@material-ui/core/Fade';
import LaunchIcon from '@material-ui/icons/Launch';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import NeonContext from '../NeonContext/NeonContext';

// interface defining the user's applications.
interface App {
  name: string;
  description: string;
  url: string;
}

// declare styles
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

const getApps = (): App[] => {
  const [{ auth: authData }] = NeonContext.useNeonContextState();
  return authData?.userData?.data?.apps;
};

// define the menu component
export default function ApplicationMenu() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const apps: App[] = getApps();

  // handle menu toggle
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // close the menu
  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  // open menu by tab key
  function handleMenuKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // handle a menu selection
  const handleMenuItemClick = (event: React.MouseEvent<EventTarget>, url: string) => {
    window.location.href = url;
  };

  // return focus to the button transitioning from !open -> open
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
          placement="left"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
          arrow
        >
          <IconButton
            ref={anchorRef}
            style={{ color: 'black' }}
            aria-label="more"
            aria-controls={open ? 'neon-application-menu' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            onKeyDown={handleMenuKeyDown}
          >
            <AppsIcon />
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
              timeout={200}
            >
              <Paper elevation={3} className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <Grid
                    container
                    spacing={4}
                    alignItems="stretch"
                  >
                    {apps.map((app) => (
                      <Grid
                        item
                        xs={(apps.length === 1) ? 12 : 6}
                        className={classes.gridItem}
                        key={app.name}
                      >
                        <Card
                          onClick={(event) => handleMenuItemClick(event, app.url)}
                          key={app.url}
                          className={classes.card}
                        >
                          <CardContent className={classes.cardContent}>
                            <LaunchIcon fontSize="large" />
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
