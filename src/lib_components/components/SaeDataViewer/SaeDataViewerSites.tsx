import React, { forwardRef } from 'react';

import Select, {
  ActionMeta,
  ControlProps,
  CSSObjectWithLabel,
  FilterOptionOption,
  GroupBase,
  MenuProps,
  MultiValue,
  OptionProps,
  SelectComponentsConfig,
  SingleValue,
  StylesConfig,
  ValueContainerProps,
} from 'react-select';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import NoSsr from '@mui/material/NoSsr';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import LocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';

import { InputBaseComponentProps } from '@mui/material/InputBase';

import NeonContext from '../NeonContext/NeonContext';
import MapSelectionButton from '../MapSelectionButton/MapSelectionButton';
import SaeDataViewerContext from './SaeDataViewerContext';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
import { NeonTheme } from '../Theme/types';

import iconCoreTerrestrialSVG from '../SiteMap/svg/icon-site-core-terrestrial.svg';
import iconCoreAquaticSVG from '../SiteMap/svg/icon-site-core-aquatic.svg';
import iconGradientTerrestrialSVG from '../SiteMap/svg/icon-site-gradient-terrestrial.svg';
import iconGradientAquaticSVG from '../SiteMap/svg/icon-site-gradient-aquatic.svg';

const MAX_NUM_SITES_SELECTABLE = 1;

const ucWord = (word: string) => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;

interface SvgIcon {
  src: string;
}

const ICON_SVGS: Record<string, Record<string, SvgIcon>> = {
  CORE: {
    AQUATIC: iconCoreAquaticSVG,
    TERRESTRIAL: iconCoreTerrestrialSVG,
  },
  GRADIENT: {
    AQUATIC: iconGradientAquaticSVG,
    TERRESTRIAL: iconGradientTerrestrialSVG,
  },
};

const useStyles = makeStyles()((theme: NeonTheme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  input: {
    display: 'flex',
    padding: '2px',
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
  optionSubtitle: {
    fontSize: '0.75rem',
    color: theme.palette.grey[500],
  },
  sitesContainer: {
    display: 'flex',
    alignContent: 'flex-start',
    flexFlow: 'row wrap',
  },
  siteCard: {
    width: '100%',
    padding: theme.spacing(1.5, 2, 1.5, 2),
    backgroundColor: theme.palette.grey[50],
    marginTop: theme.spacing(3),
  },
  siteTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  siteDetailsRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'space-between',
  },
  siteDetailsColumn: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(0.5),
  },
  siteDetail: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(4),
  },
  noneIcon: {
    color: theme.palette.grey[400],
    marginRight: theme.spacing(0.5),
    fontSize: '1rem',
  },
  noneLabel: {
    color: theme.palette.grey[400],
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
}));

interface SiteOptionType {
  siteCode: string;
  description: string;
  type: string;
  terrain: string;
  domainCode: string;
  domainName: string;
  stateCode: string;
  latitude: number;
  longitude: number;
  search: string;
}

const buildSelectStyles = (
  theme: NeonTheme,
): StylesConfig<SiteOptionType, boolean, GroupBase<SiteOptionType>> => ({
  input: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    color: theme.palette.text.primary,
    '& input': {
      font: 'inherit',
    },
  }),
  clearIndicator: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    display: 'none',
  }),
  indicatorSeparator: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    display: 'none',
  }),
  dropdownIndicator: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    cursor: 'pointer',
  }),
  groupHeading: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
  }),
});

const InputComponent = forwardRef<
  HTMLDivElement,
  InputBaseComponentProps
>((props: InputBaseComponentProps, ref: React.ForwardedRef<HTMLDivElement>) => (
  <div ref={ref} {...props as React.HTMLAttributes<HTMLInputElement>} />
));

type ValueContainerPropsType = React.PropsWithChildren<ValueContainerProps<
  SiteOptionType,
  boolean,
  GroupBase<SiteOptionType>
>>;

const ValueContainer: React.FC<ValueContainerPropsType> = (
  props: ValueContainerPropsType,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { children } = props;
  return <div className={classes.valueContainer}>{children}</div>;
};

type MenuPropsType = React.PropsWithChildren<MenuProps<
  SiteOptionType,
  boolean,
  GroupBase<SiteOptionType>
>>;

const Menu: React.FC<MenuPropsType> = (
  props: MenuPropsType,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { innerProps, children } = props;
  return (
    <Paper square className={classes.paper} {...innerProps}>
      {children}
    </Paper>
  );
};

type SitesControlPropsType = React.PropsWithChildren<ControlProps<
  SiteOptionType,
  boolean,
  GroupBase<SiteOptionType>
>>;

const SitesControl: React.FC<SitesControlPropsType> = (
  props: SitesControlPropsType,
): React.JSX.Element => {
  const {
    children,
    innerProps,
    innerRef,
  } = props;
  return (
    <TextField
      fullWidth
      label="Select Site"
      variant="outlined"
      slotProps={{
        input: {
          inputComponent: InputComponent,
          inputProps: {
            ref: innerRef,
            children,
            ...innerProps as InputBaseComponentProps,
          },
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon color="disabled" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

type SiteOptionPropsType = React.PropsWithChildren<OptionProps<
  SiteOptionType,
  boolean,
  GroupBase<SiteOptionType>
>>;

type SiteOptionDefaultPropsType = {
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
};

const siteOptionDefaultProps: SiteOptionDefaultPropsType = {
  isDisabled: false,
  isSelected: false,
  isFocused: false,
};

const SiteOption: React.FC<SiteOptionPropsType> = (
  inProps: SiteOptionPropsType,
): React.JSX.Element => {
  const props = resolveProps(
    siteOptionDefaultProps,
    inProps,
  ) as SiteOptionPropsType;
  const { classes, theme } = useStyles();
  const {
    innerRef,
    isFocused,
    isDisabled,
    innerProps,
    data,
  } = props;
  const {
    siteCode,
    description,
    type,
    terrain,
    domainCode,
    domainName,
    stateCode,
    latitude,
    longitude,
  } = data;
  const terrainTypeTitle = `${ucWord(terrain)} ${ucWord(type)}`;
  let optionContent = <Typography variant="body1" gutterBottom>{siteCode}</Typography>;
  if (stateCode) {
    const iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    optionContent = (
      <div className={classes.startFlex}>
        {iconSvg ? (
          <img
            src={iconSvg.src}
            alt={terrainTypeTitle}
            title={terrainTypeTitle}
            width={theme.spacing(3)}
            height={theme.spacing(3)}
            style={{ marginRight: theme.spacing(1.5), marginTop: theme.spacing(0.5), flexGrow: 0 }}
          />
        ) : null}
        <div style={{ flexGrow: 1 }}>
          <Typography variant="body1">
            {`${siteCode} - ${description}, ${stateCode}`}
          </Typography>
          <Typography variant="body2" className={classes.optionSubtitle} gutterBottom>
            {`${terrainTypeTitle} - Domain ${domainCode} (${domainName}) - Lat/Lon: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
          </Typography>
        </div>
      </div>
    );
  }
  // Note: wrapping each of these MenuItem elements in a MenuList
  // is a workaround for no longer being able to utilize the MenuItem
  // component as a standalone component outside of a Menu or MenuList.
  // The MenuItem brings along desired characteristics for selection
  // interactions.
  return (
    <MenuList style={{ padding: 0, margin: 0 }}>
      <MenuItem
        key={siteCode}
        ref={innerRef}
        selected={isFocused && !isDisabled}
        component="div"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
        {...innerProps}
      >
        {optionContent}
      </MenuItem>
    </MenuList>
  );
};

interface SelectedSiteProps {
  site: string;
}

const SelectedSite: React.FC<SelectedSiteProps> = (
  props: SelectedSiteProps,
): React.JSX.Element => {
  const { classes, theme } = useStyles();
  const { site: siteCode } = props;
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;
  let selectedSiteContent = (
    <div>
      <Typography variant="body1" gutterBottom>
        {`${siteCode} (loading site details…)`}
      </Typography>
    </div>
  );
  if (allSites[siteCode]) {
    const {
      description,
      type,
      terrain,
      domainCode,
      stateCode,
      latitude,
      longitude,
    } = allSites[siteCode];
    let typeTitle = 'Core';
    let typeSubtitle = 'fixed location';
    if (type === 'GRADIENT') {
      typeTitle = 'Gradient';
      typeSubtitle = 'gradient location';
    }
    let terrainTitle = 'Terrestrial';
    let terrainSubtitle = 'land-based';
    if (terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }
    const terrainTypeTitle = `${terrainTitle} ${typeTitle}`;
    const terrainTypeSubtitle = `${terrainSubtitle}; ${typeSubtitle}`;
    const domainName = allDomains[domainCode] ? allDomains[domainCode].name : null;
    const stateName = allStates[stateCode] ? allStates[stateCode].name : null;
    const stateFieldTitle = (stateCode === 'PR' ? 'Territory' : 'State');
    const iconSvg = ICON_SVGS[type as string] && ICON_SVGS[type as string][terrain]
      ? ICON_SVGS[type][terrain]
      : null;
    const terrainIcon = iconSvg ? (
      <img
        src={iconSvg.src}
        alt={terrainTypeTitle}
        title={terrainTypeTitle}
        width={theme.spacing(4)}
        height={theme.spacing(4)}
        style={{ marginRight: theme.spacing(1), flexGrow: 0 }}
      />
    ) : null;
    selectedSiteContent = (
      <div>
        <div className={classes.siteTitleContainer}>
          {terrainIcon}
          <Typography variant="h6" style={{ lineHeight: '1.4rem', flexGrow: 1 }}>
            {`${description} (${siteCode})`}
          </Typography>
        </div>
        <div className={classes.siteDetailsRow}>
          <div className={classes.siteDetailsColumn}>
            {/* Terrain and Type */}
            <div className={classes.siteDetail}>
              <Typography variant="subtitle2">{terrainTypeTitle}</Typography>
              <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                <i>{terrainTypeSubtitle}</i>
              </Typography>
            </div>
            {/* Latitude/Longitude */}
            <div className={classes.siteDetail}>
              <div className={classes.startFlex} style={{ alignItems: 'center' }}>
                <CopyToClipboard text={`${latitude} ${longitude}`}>
                  <Tooltip title="Latitude / Longitude (click to copy)">
                    <IconButton
                      size="small"
                      style={{ marginRight: theme.spacing(0.5) }}
                      aria-label="Latitude / Longitude (click to copy)"
                    >
                      <LocationIcon />
                    </IconButton>
                  </Tooltip>
                </CopyToClipboard>
                <Typography
                  variant="caption"
                  aria-label="Latitude / Longitude"
                  style={{ fontFamily: 'monospace', textAlign: 'right', fontSize: '0.85rem' }}
                >
                  {latitude}
                  <br />
                  {longitude}
                </Typography>
              </div>
            </div>
          </div>
          <div className={classes.siteDetailsColumn}>
            {/* State/Territory */}
            <div className={classes.siteDetail}>
              <Typography variant="subtitle2">{stateFieldTitle}</Typography>
              <Typography variant="body2">{stateName}</Typography>
            </div>
            {/* Domain */}
            <div className={classes.siteDetail}>
              <Typography variant="subtitle2">Domain</Typography>
              <Typography variant="body2">
                {`${domainCode} - ${domainName}`}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Card key={siteCode} variant="outlined" className={classes.siteCard}>
      {selectedSiteContent}
    </Card>
  );
};

const SitesSelectComponents: SelectComponentsConfig<
  SiteOptionType,
  boolean,
  GroupBase<SiteOptionType>
> = {
  Control: SitesControl,
  Option: SiteOption,
  Menu,
  ValueContainer,
  Placeholder: () => null,
  MultiValue: () => null,
  IndicatorsContainer: () => null,
};

interface SitesSelectGroup {
  label: string;
  stateCode: string;
  options: SiteOptionType[];
}

const SitesSelect: React.FC = (): React.JSX.Element => {
  const { theme } = useStyles();
  const state = SaeDataViewerContext.useSaeDataViewerContextState();
  const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { states: allStates, sites: allSites, domains: allDomains } = neonContextData;
  // Build list of selectable sites grouped by US state
  const selectableSiteCodes = state.controlsState.sites;
  let selectableSitesCount = 0;
  const selectableGroups: SitesSelectGroup[] = Object.keys(allStates)
    .map((stateCode: string): SitesSelectGroup => (
      { label: allStates[stateCode].name, stateCode, options: [] }
    ));
  const allOptions: SiteOptionType[] = [];
  state.controlsState.sites.filter((siteCode) => selectableSiteCodes.includes(siteCode))
    .forEach((siteCode) => {
      const groupIdx = selectableGroups.findIndex((group: SitesSelectGroup) => (
        allSites[siteCode] && group.stateCode === allSites[siteCode].stateCode
      ));
      if (groupIdx === -1) { return; }
      const domain = allDomains[allSites[siteCode].domainCode] || {};
      const usState = allStates[allSites[siteCode].stateCode] || {};
      const search = [
        siteCode,
        allSites[siteCode].description,
        allSites[siteCode].domainCode,
        allSites[siteCode].stateCode,
        allSites[siteCode].type,
        allSites[siteCode].terrain,
        domain.name || '',
        usState.name || '',
      ].join(' ').toLowerCase();
      const option: SiteOptionType = {
        value: siteCode,
        domainName: domain.name || null,
        ...allSites[siteCode],
        search,
      };
      selectableGroups[groupIdx].options.push(option);
      allOptions.push(option);
      selectableSitesCount += 1;
    });
  const selectedSiteOption: SiteOptionType|undefined = allOptions
    .find((option: SiteOptionType): boolean => (
      option.siteCode.localeCompare(state.site) === 0
    ));
  if (!selectableSitesCount) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return (
    <NoSsr>
      <div style={{ flex: 1 }}>
        <Select
          isSearchable
          isClearable={false}
          styles={buildSelectStyles(theme)}
          aria-label="Select Site"
          data-gtm="sae-data-viewer.select-site"
          options={selectableGroups}
          components={SitesSelectComponents}
          value={selectedSiteOption}
          controlShouldRenderValue={false}
          filterOption={
            (option: FilterOptionOption<SiteOptionType>, searchText: string): boolean => {
              if (option.data) {
                return option.data.search.includes(searchText.toLowerCase());
              }
              return false;
            }
          }
          onChange={
            (
              value: SingleValue<SiteOptionType>|MultiValue<SiteOptionType>,
              change: ActionMeta<SiteOptionType>,
            ): void => {
              if (change.action !== 'select-option') { return; }
              if (dispatch && value) {
                const singleValue = value as SingleValue<SiteOptionType>;
                if (singleValue) {
                  dispatch({ type: 'setSelectedSite', site: singleValue.siteCode });
                }
              }
            }
          }
        />
      </div>
    </NoSsr>
  );
};

const SaeDataViewerSites: React.FC = (): React.JSX.Element => {
  const { classes, theme } = useStyles();
  const state = SaeDataViewerContext.useSaeDataViewerContextState();
  const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites } = neonContextData;

  if (!state.site || !Object.keys(allSites).length) {
    return <Skeleton variant="rectangular" width="100%" height={56} />;
  }

  const selectedItems = [state.site];

  return (
    <div className={classes.root}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <SitesSelect />
        <MapSelectionButton
          selection="SITES"
          selectionLimit={[1, MAX_NUM_SITES_SELECTABLE]}
          selectedItems={selectedItems}
          validItems={state.controlsState.sites}
          buttonProps={{ style: { size: 'large', marginLeft: theme.spacing(1.5) } }}
          onSave={(newSites: Set<string>): void => {
            if (dispatch && (newSites.size > 0)) {
              dispatch({ type: 'setSelectedSite', site: newSites.values().next().value });
            }
          }}
        />
      </div>
      <div className={classes.sitesContainer}>
        {selectedItems.map((siteCode: string): React.JSX.Element => (
          <SelectedSite key={siteCode} site={siteCode} />
        ))}
      </div>
    </div>
  );
};

export default SaeDataViewerSites;
