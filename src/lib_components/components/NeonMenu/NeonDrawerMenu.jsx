import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import HomeIcon from '@material-ui/icons/HomeOutlined';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DownloadDataIcon from '@material-ui/icons/SaveAlt';
import AboutIcon from '@material-ui/icons/InfoOutlined';
import ContactUsIcon from '@material-ui/icons/LiveHelpOutlined';
import ResourcesIcon from '@material-ui/icons/ListAltOutlined';
import MyDatasetsIcon from '@material-ui/icons/PersonOutline';

import Theme from '../Theme/Theme';

const menuItemIconMap = {
  Home: <HomeIcon />,
  About: <AboutIcon />,
  'Download Data': <DownloadDataIcon />,
  Resources: <ResourcesIcon />,
  'Contact Us': <ContactUsIcon />,
  'My Datasets': <MyDatasetsIcon />,
};

const domParser = new DOMParser();
const decodeName = (name) => domParser.parseFromString(name, 'text/html').documentElement.textContent;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listItemIcon: {
    minWidth: theme.spacing(5),
  },
  listItemText: {
    paddingRight: theme.spacing(4),
  },
}));

const NeonDrawerMenu = (props) => {
  const classes = useStyles(Theme);
  const { items } = props;

  // Menu items need a unique identifier so we can map their
  // open states, if they have children. One isn't discretely
  // provided so the function can be used to make one.
  const getMenuId = (item) => `${item.name}|${item.url}`;

  const initialState = items.reduce((acc, cur) => {
    if (cur.children.length) {
      acc[getMenuId(cur)] = false;
    }
    return acc;
  }, {});

  const [open, setOpen] = React.useState(initialState);

  const handleClick = (id) => {
    setOpen({
      ...open,
      [id]: !open[id],
    });
  };

  const renderMenuItem = (item, nesting = 0) => {
    if (item.url === '/home') {
      return null;
    }
    const id = getMenuId(item);
    const listItemIcon = menuItemIconMap[item.name]
      ? <ListItemIcon className={classes.listItemIcon}>{menuItemIconMap[item.name]}</ListItemIcon>
      : null;
    let expandIcon = null;
    let collapse = null;
    const listItemProps = {
      component: 'a',
      href: item.url,
      onClick: null,
    };
    const seleniumKey = item.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (item.children.length) {
      // Throw out the item's URL.
      //
      // Sometimes we have items that have children that also are supposed to have
      // a working URL. In Liferay menus all items have URLs whether they're links
      // or not, but if an item has children and isContainer is true then we treat
      // the menu item as "only a container" and don't wire up an <a> tag.
      //
      // But for a small viewport menu like this that's not workable. Phones and
      // tablets don't have hover states. A "parent" menu item MUST be ONLY a menu
      // item and NOT a link, since the click is the only interaction and it must
      // be used for expand/collapse. Thus, if this item has children, don't ever
      // allow it to be a link here in the drawer menu for small viewports.
      listItemProps.href = null;
      listItemProps.component = 'div';
      listItemProps.onClick = () => handleClick(id);
      expandIcon = open[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />;
      collapse = (
        <Collapse in={open[id]} timeout="auto" unmountOnExit>
          <List data-selenium={`neon-drawer-menu.submenu.${seleniumKey}`} component="div" disablePadding>
            {item.children.map((child) => renderMenuItem(child, nesting + 1))}
          </List>
        </Collapse>
      );
    }
    return (
      <React.Fragment key={id}>
        <ListItem
          button
          data-selenium={`neon-drawer-menu.link.${seleniumKey}`}
          style={{ paddingLeft: Theme.spacing(2 + (nesting * 3)) }}
          {...listItemProps}
        >
          {listItemIcon}
          <ListItemText primary={decodeName(item.name)} className={classes.listItemText} />
          {expandIcon}
        </ListItem>
        {collapse}
      </React.Fragment>
    );
  };

  return (
    <List
      component="nav"
      className={classes.root}
    >
      {renderMenuItem({ name: 'Home', url: '/', children: [] })}
      {items.map((item) => renderMenuItem(item))}
    </List>
  );
};

// for nested proptypes
function lazyFunction(f) {
  // eslint-disable-next-line func-names
  return function () {
    // eslint-disable-next-line prefer-rest-params
    return f().apply(this, arguments);
  };
}

let itemShape;
// eslint-disable-next-line prefer-const
itemShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(
    lazyFunction(() => itemShape),
  ),
});

NeonDrawerMenu.propTypes = {
  items: PropTypes.arrayOf(itemShape).isRequired,
};

export default NeonDrawerMenu;
