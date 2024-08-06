import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import AppsIcon from '@mui/icons-material/Apps';
import Fade from '@mui/material/Fade';
import LaunchIcon from '@mui/icons-material/Launch';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import NeonContext from '../NeonContext/NeonContext';

// interface for user application data
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
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.45)', // match shadow of site header
    position: 'relative',
  },
  toolbarButtons: {
    display: 'flex',
    marginLeft: 'auto', // align content right
    marginRight: theme.spacing(2.5),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
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
    transition: '0.4s',
    '&:hover': { // raised hover effect for Cards
      transform: 'translateY(-2px)', // raise Card
      boxShadow: theme.shadows[2], // add shadow
    },
    cursor: 'pointer', // visually indicate Cards are links
    width: '100%', // ensure Cards are equal width
    border: 0, // remove default Card border
  },
  cardContent: {
    textAlign: 'center',
  },
  gridItem: {
    display: 'flex', // so grid items stretch to equal height
  },
}));

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
  const handleClose = (event: MouseEvent | TouchEvent): void => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  // open menu by tab key
  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  };

  // handle a menu selection
  const handleMenuItemClick = (event: React.MouseEvent<EventTarget>, url: string) => {
    window.location.href = url;
  };

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
            size="large"
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
                            <Typography variant="subtitle1" gutterBottom style={{ lineHeight: 1 }}>{app.name}</Typography>
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

/**
 * Return the application menu
 * @returns The menu or null if the user has no applications to display.
 */
const ApplicationMenu = () => {
  const [{ auth: authData }] = NeonContext.useNeonContextState();
  const apps: UserApp[] = authData?.userData?.data?.apps;
  if (apps?.length > 0) {
    return (
      <Menu apps={apps} />
    );
  }
  return (null);
};

export default ApplicationMenu;
