import React from 'react';
import PropTypes from 'prop-types';

import L from 'leaflet';

import iconCoreTerrestrialSVG from './icon-core-terrestrial.svg';
import iconCoreTerrestrialSelectedSVG from './icon-core-terrestrial-selected.svg';
import iconCoreAquaticSVG from './icon-core-aquatic.svg';
import iconCoreAquaticSelectedSVG from './icon-core-aquatic-selected.svg';
import iconCoreShadowSVG from './icon-core-shadow.svg';
import iconCoreShadowSelectedSVG from './icon-core-shadow-selected.svg';
import iconRelocatableTerrestrialSVG from './icon-relocatable-terrestrial.svg';
import iconRelocatableTerrestrialSelectedSVG from './icon-relocatable-terrestrial-selected.svg';
import iconRelocatableAquaticSVG from './icon-relocatable-aquatic.svg';
import iconRelocatableAquaticSelectedSVG from './icon-relocatable-aquatic-selected.svg';
import iconRelocatableShadowSVG from './icon-relocatable-shadow.svg';
import iconRelocatableShadowSelectedSVG from './icon-relocatable-shadow-selected.svg';

const ICON_SVGS = {
  CORE: {
    AQUATIC: {
      BASE: iconCoreAquaticSVG,
      SELECTED: iconCoreAquaticSelectedSVG,
    },
    TERRESTRIAL: {
      BASE: iconCoreTerrestrialSVG,
      SELECTED: iconCoreTerrestrialSelectedSVG,
    },
    SHADOW: {
      BASE: iconCoreShadowSVG,
      SELECTED: iconCoreShadowSelectedSVG,
    },
  },
  RELOCATABLE: {
    AQUATIC: {
      BASE: iconRelocatableAquaticSVG,
      SELECTED: iconRelocatableAquaticSelectedSVG,
    },
    TERRESTRIAL: {
      BASE: iconRelocatableTerrestrialSVG,
      SELECTED: iconRelocatableTerrestrialSelectedSVG,
    },
    SHADOW: {
      BASE: iconRelocatableShadowSVG,
      SELECTED: iconRelocatableShadowSelectedSVG,
    },
  },
};

// Function to take a single all-caps word and make it lowercase but capitalized
// (e.g. capWord('AQUATIC') === 'Aquatic')
const capWord = word => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`;

const SiteIcon = (props) => {
  const {
    siteCode,
    type,
    terrain,
    isSelected,
    zoom,
    ...other
  } = props;

  const selected = isSelected ? 'SELECTED' : 'BASE';

  let alt = '';
  if (siteCode) { alt = siteCode; }
  if (terrain) {
    const capTerrain = capWord(terrain);
    alt = alt.length ? `${alt} - ${capTerrain}` : capTerrain;
  }
  if (type) {
    const capType = capWord(type);
    alt = alt.length ? `${alt} - ${capType}` : capType;
  }

  return (
    <img
      {...other}
      src={ICON_SVGS[type][terrain][selected]}
      alt={alt}
      title={alt}
    />
  );
};

export const getSiteLeafletIcon = (config) => {
  const {
    type,
    terrain,
    isSelected,
    zoom,
  } = config;

  if (!['CORE', 'RELOCATABLE'].includes(type) || !['TERRESTRIAL', 'AQUATIC'].includes(terrain)) {
    console.error('getSiteLeafletIcon invalid configuration'); // eslint-disable-line no-console
    return null;
  }

  const selected = isSelected ? 'SELECTED' : 'BASE';
  const iconScale = 0.2 + (Math.floor(((zoom || 2) - 2) / 3) / 10);
  const iconSize = isSelected ? [150, 150] : [100, 100];
  const iconAnchor = isSelected ? [75, 150] : [50, 100];
  const shadowSize = isSelected ? [234, 160] : [156, 93];
  const shadowAnchor = isSelected ? [80, 145] : [50, 83];

  return new L.Icon({
    iconUrl: ICON_SVGS[type][terrain][selected],
    iconRetinaUrl: ICON_SVGS[type][terrain][selected],
    iconSize: iconSize.map(x => x * iconScale),
    iconAnchor: iconAnchor.map(x => x * iconScale),
    shadowUrl: ICON_SVGS[type].SHADOW[selected],
    shadowSize: shadowSize.map(x => x * iconScale),
    shadowAnchor: shadowAnchor.map(x => x * iconScale),
    popupAnchor: [0, -100].map(x => x * iconScale),
  });
};

SiteIcon.propTypes = {
  zoom: PropTypes.number,
  siteCode: PropTypes.string,
  type: PropTypes.string.isRequired,
  terrain: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};

SiteIcon.defaultProps = {
  zoom: null,
  siteCode: null,
  isSelected: false,
};

export default SiteIcon;
