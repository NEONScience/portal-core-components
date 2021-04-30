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

// interface for user applications
interface UserApp {
  name: string;
  description: string;
  url: string;
}

// interface for the menu component props
interface MenuProps {
  apps: UserApp[];
}

// declare styles
const useStyles = makeStyles((theme: Theme) => createStyles({
  menuContainer: {
    zIndex: 1000, // be sure to display the menu over other elements
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
    maxWidth: '500px', // limit width of menu
    marginTop: theme.spacing(1), // line top of menu up with divider
    overflowX: 'unset',
    overflowY: 'unset',
    '&::before': { // add tooltip like arrow to top of menu
      content: '""',
      position: 'absolute',
      marginRight: theme.spacing(4), // center arrow point beneath menu button
      top: 0,
      right: 0,
      width: theme.spacing(2), // width of arrow
      height: theme.spacing(2), // height of arrow
      backgroundColor: theme.palette.background.paper, // match paper background
      boxShadow: theme.shadows[2], // add arrow shadow
      transform: 'rotate(315deg)', // point arrow up toward menu button
      clipPath: 'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))',
    },
  },
  card: {
    transition: '0.4s', // raised hover effect for Cards
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.45)',
    },
    cursor: 'pointer', // visually indicate Cards are links
    width: '100%', // ensure Cards are equal width
    border: 0,
  },
  cardContent: {
    textAlign: 'center',
  },
  gridItem: {
    display: 'flex', // so grid items stretch to equal height
  },
}));

const getApps = (): UserApp[] => {
  const [{ auth: authData }] = NeonContext.useNeonContextState();
  return authData?.userData?.data?.apps;
};

// define the menu component
const Menu = (props: MenuProps) => {
  const { apps } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

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

  // return focus to the button when toggling
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
                    {apps.map((app: { name: string, description: string, url: string }) => (
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
};

export default function ApplicationMenu() {
  const apps: UserApp[] = getApps();
  if (apps?.length > 0) {
    return (
      <Menu apps={apps} />
    );
  }
  return (null);
}
