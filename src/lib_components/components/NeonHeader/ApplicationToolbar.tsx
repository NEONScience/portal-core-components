import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Tooltip from '@material-ui/core/Tooltip';
import AppsIcon from '@material-ui/icons/Apps';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const applications = {
  token: 'token',
  data: {
    apps: [
      {
        name: 'NEON Single Sign-On',
        url: 'https://data-neonscience.auth0.com/login?state=hKFo2SBiSjg3dklhMnV6bXFzaUtFQ3dFTl9sdEM4TWI2T0h2N6FupWxvZ2luo3RpZNkgZ2I5Uk1TZm1ZZ0NuSVNYd2JOSUVCQjR1UEVYZktZaTWjY2lk2SBPbjdYRkdrZTROanRZQU03bnE1MUxCcFNFakdGNndtMg&client=On7XFGke4NjtYAM7nq51LBpSEjGF6wm2&protocol=oauth2&redirect_uri=https%3A%2F%2Fdata.neonscience.org%2Fauth0%2Fcallback&audience=https%3A%2F%2Fdata-neonscience.auth0.com%2Fapi%2Fv2%2F&scope=openid%20profile%20email%20read%3Acurrent_user%20create%3Acurrent_user_metadata%20update%3Acurrent_user_metadata&response_type=code',
      },
      {
        name: 'Data Explorer',
        url: 'https://data.neonscience.org/data-products/explore',
      },
      {
        name: 'Application 3',
        url: 'https://example.com/app3',
      },
    ],
  },
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    marginRight: theme.spacing(2),
  },
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    boxShadow: '0px 0px 0px rgb(0 0 0 / 0%), 0px 1px 3px rgb(0 0 0 / 35%)',
  },
  toolbarButtons: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: theme.spacing(2.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  appBar: {
    background: 'white',
    borderTop: '2px solid transparent',
    marginTop: '-8px',
  },
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: 'white',
  },
  appButton: {
    marginLeft: theme.spacing(1),
  },
  horizontalMenu: {
    '> div': {
      display: 'inline-block',
    },
  },
}));

export default function ApplicationToolbar() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const { apps } = applications.data;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleMenuItemClick = (event: React.MouseEvent<EventTarget>, index: number) => {
    setSelectedIndex(index);
    const app = applications.data.apps[index];
    window.location.href = app.url;
  };

  // return focus to the button when we transitioned from !open -> open
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
          title="NEON Applications"
          aria-label="NEON Applications"
          arrow
          classes={classes}
        >
          <IconButton
            ref={anchorRef}
            style={{ color: 'black' }}
            aria-label="more"
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <AppsIcon />
          </IconButton>
        </Tooltip>

        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              timeout={1000}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                    className={classes.horizontalMenu}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                    {apps.map((app, index) => (
                      <MenuItem
                        onClick={(event) => handleMenuItemClick(event, index)}
                        key={app.url}
                        selected={index === selectedIndex}
                      >
                        {app.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
