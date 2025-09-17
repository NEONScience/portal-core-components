import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';

import Theme from '../Theme/Theme';

import AtmosphereSVG from './svg_optimized/atmosphere.svg';
import BiogeochemistrySVG from './svg_optimized/biogeochemistry.svg';
import EcohydrologySVG from './svg_optimized/ecohydrology.svg';
import LandCoverSVG from './svg_optimized/landcover.svg';
import OrganismsSVG from './svg_optimized/organisms.svg';
import ThemeDesc from '../../staticJSON/themeDesc.json'

const dataThemes = {
  atmosphere: {
    title: 'Atmosphere',
    aliases: ['atmos'],
    src: AtmosphereSVG,
    desc: ThemeDesc['Atmosphere'],
  },
  biogeochemistry: {
    title: 'Biogeochemistry',
    aliases: ['biogeo'],
    src: BiogeochemistrySVG,
    desc: ThemeDesc['Biogeochemistry'],
  },
  ecohydrology: {
    title: 'Ecohydrology',
    aliases: ['ecohydro'],
    src: EcohydrologySVG,
    desc: ThemeDesc['Ecohydrology'],
  },
  landcover: {
    title: 'Land Cover & Processes',
    aliases: ['landuse', 'Land Cover and Processes', 'Land Use, Land Cover, and Land Processes'],
    src: LandCoverSVG,
    desc: ThemeDesc['Land Cover & Processes'],
  },
  organisms: {
    title: 'Organisms, Populations, and Communities',
    aliases: [],
    src: OrganismsSVG,
    desc: ThemeDesc['Organisms, Populations, and Communities'],
  },
};

const DataThemeIcon = (props) => {
  const {
    theme,
    size,
    avatar,
    className,
    ...other
  } = props;
  const dataTheme = dataThemes[theme] || Object.values(dataThemes).find(
    (entry) => theme === entry.title || entry.aliases.includes(theme),
  );

  if (!dataTheme) { return null; }

  const elementProps = {
    src: dataTheme.src,
    alt: dataTheme.title,
    title: dataTheme.title,
    className,
    'data-selenium': `data-theme-icon.${theme}`,
    'data-desc': dataTheme.desc,
  };

  if (avatar) {
    return (
      <Avatar
        style={{ width: Theme.spacing(size), height: Theme.spacing(size) }}
        {...elementProps}
      />
    );
  }
  return (
    <img // eslint-disable-line jsx-a11y/alt-text
      width={Theme.spacing(size)}
      height={Theme.spacing(size)}
      {...elementProps}
      {...other}
    />
  );
};

// Data Themes do not have IDs. In order to support identifying a theme
// by its full title, abbreviated name, or other known aliases we build
// a full list of all supported aliases here to feed PropTypes.
const dataThemeAliases = [
  ...Object.keys(dataThemes),
  ...Object.values(dataThemes).map((theme) => theme.aliases.concat(theme.title)).flat(),
];

DataThemeIcon.propTypes = {
  theme: PropTypes.oneOf(dataThemeAliases).isRequired,
  size: PropTypes.number,
  avatar: PropTypes.bool,
  className: PropTypes.string,
};

DataThemeIcon.defaultProps = {
  size: 5,
  avatar: false,
  className: null,
};

const WrappedDataThemeIcon = Theme.getWrappedComponent(DataThemeIcon);

export default WrappedDataThemeIcon;
