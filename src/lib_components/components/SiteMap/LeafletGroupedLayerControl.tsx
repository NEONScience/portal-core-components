/** @jsxImportSource @emotion/react */
import React, {
  useRef,
  useState,
  useEffect,
  type RefObject,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { createPortal } from 'react-dom';

import L, { type ControlPosition, type ControlOptions } from 'leaflet';
import { useMap } from 'react-leaflet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Link from '@mui/material/Link';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';

import { css, useTheme } from '@mui/material/styles';
import type { SerializedStyles } from '@emotion/react';

import { exists } from '../../util/typeUtil';
import { type NeonTheme } from '../Theme/types';

type StylesHookType = (theme: NeonTheme, open: boolean) => Record<string, SerializedStyles>;
const useStyles: StylesHookType = (
  theme: NeonTheme,
  open: boolean,
): Record<string, SerializedStyles> => ({
  leafletControlContainer: css({
    zIndex: 801,
    boxShadow: 'unset',
    margin: '0px !important',
    left: '8px',
    top: '8px',
    fontFamily: theme.typography.fontFamily,
  }),
  controlContainer: css({
    backgroundColor: '#ffffff',
    cursor: 'default',
    borderRadius: '2px',
    display: 'flex',
    zIndex: 802,
    border: open
      ? `1px solid ${theme.palette.grey[300]}`
      : `1px solid ${(theme as NeonTheme).colors.LIGHT_BLUE[500]}`,
  }),
  controlIconContainer: css({
    width: '36px !important',
    height: '36px !important',
  }),
  controlIcon: css({
    verticalAlign: 'center',
  }),
  controls: css({
    padding: theme.spacing(2),
    overflowY: 'auto',
  }),
  formGroupControl: css({
    marginTop: '4px',
    marginBottom: '0px',
  }),
  controlGroupDivider: css({
    margin: '10px 0px',
  }),
  groupTitle: css({
    fontWeight: 600,
  }),
});

export interface BaseLayer {
  name: string;
  title: string;
}
export interface Overlay {
  checked: boolean;
  groupTitle: string;
  name: string;
  title: string;
}
interface OverlayGroupExt {
  exclusive: boolean|undefined;
  groupItems: Overlay[];
}
interface OverlayGroup {
  [key: string]: OverlayGroupExt;
}

enum OverlayGroupType {
  EXCLUSIVE = 'EXCLUSIVE',
  NON_EXCLUSIVE = 'NON_EXCLUSIVE',
}

export interface LeafletGroupedLayerControlProps extends ControlOptions {
  baseLayers: BaseLayer[];
  checkedBaseLayer: string;
  exclusiveGroups?: string[];
  overlays?: Overlay[];
  renderToLeafletControlContainer?: boolean;
  onBaseLayerChange?: (id: string) => void;
  onOverlayChange?: (newOverlays: Overlay[]) => void;
}

interface LeafletPositionClasses {
  bottomleft: string;
  bottomright: string;
  topleft: string;
  topright: string;
}
const POSITION_CLASSES: LeafletPositionClasses = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};
const getControlClassFromPosition = (position?: ControlPosition): string => {
  if (!exists(position)) {
    return POSITION_CLASSES.topright;
  }
  return POSITION_CLASSES[position as ControlPosition];
};

const LeafletGroupedLayerControl: React.FC<LeafletGroupedLayerControlProps> = (
  props: LeafletGroupedLayerControlProps,
): React.JSX.Element => {
  const {
    position,
    baseLayers,
    checkedBaseLayer,
    exclusiveGroups,
    overlays,
    renderToLeafletControlContainer,
    onBaseLayerChange,
    onOverlayChange,
  } = props;
  const [open, setOpen]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const theme: NeonTheme = useTheme();
  const classes: Record<string, SerializedStyles> = useStyles(theme, open);
  const divRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const map: L.Map = useMap();
  const isPortalMode: boolean = (renderToLeafletControlContainer === true);
  const controlPositionClass: string = getControlClassFromPosition(position);
  const containerNode: HTMLElement = map.getContainer();
  const portalNodes: HTMLCollectionOf<Element> = containerNode.getElementsByClassName(controlPositionClass);
  const hasPortalNode: boolean = exists(portalNodes) && (portalNodes.length > 0) && exists(portalNodes[0]);

  const handleMainDivMouseEnter = () => {
    if (!open) {
      setOpen(true);
    }
  };
  const handleMainDivMouseLeave = () => {
    setOpen(false);
  };
  const handleBaseLayerChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (onBaseLayerChange) {
      onBaseLayerChange((event.target as HTMLInputElement).value);
    }
  };
  const handleOverlayChanged = (
    eventOverlay: Overlay,
    isSelected: boolean,
    eventGroup: string,
    groupType: OverlayGroupType,
  ): void => {
    const isExclusive: boolean = (groupType === OverlayGroupType.EXCLUSIVE);
    const newOverlays: Overlay[] = (overlays || []).map((overlay: Overlay) => {
      const groupMatches: boolean = (overlay.groupTitle === eventGroup);
      if (!groupMatches) {
        return overlay;
      }
      const nameMatchesSelected: boolean = (overlay.name === eventOverlay.name);
      if (isExclusive) {
        // When radio selection, apply checked to matched name,
        // not checked to all others.
        return {
          ...overlay,
          checked: nameMatchesSelected,
        };
      }
      if (nameMatchesSelected) {
        // When checkbox selection and on the selected
        // overlay, apply opposite of selected overlay checked state.
        return {
          ...overlay,
          checked: !isSelected,
        };
      }
      // When checkbox selection and not on the selected
      // overlay, do not modify.
      return overlay;
    });
    if (onOverlayChange) {
      onOverlayChange(newOverlays);
    }
  };

  useEffect(() => {
    if (!divRef.current) { return; }
    L.DomEvent.disableClickPropagation(divRef.current);
    L.DomEvent.disableScrollPropagation(divRef.current);
    const containerRect: DOMRect = map.getContainer().getBoundingClientRect();
    const divRect: DOMRect = divRef.current.getBoundingClientRect();
    const maxHeight: string = `${Math.floor((containerRect.bottom - divRect.y) * 0.95)}px`;
    divRef.current.style.maxHeight = maxHeight;
  }, [map, divRef]);

  const renderBaseLayerGroup = (): React.JSX.Element => ((
    <div key="baselayer">
      <Typography key="title-baselayer" css={classes.groupTitle} variant="h6">
        Base Layers
      </Typography>
      <FormControl
        fullWidth
        size="small"
        margin="dense"
        css={classes.formGroupControl}
      >
        <RadioGroup
          name="baselayer"
          value={checkedBaseLayer}
          onChange={handleBaseLayerChange}
        >
          {baseLayers.map((baseLayer: BaseLayer) => ((
            <FormControlLabel
              key={`baselayer-${baseLayer.name}`}
              value={baseLayer.name}
              control={<Radio size="small" />}
              label={baseLayer.title}
            />
          )))}
        </RadioGroup>
      </FormControl>
    </div>
  ));

  const renderOverlayGroups = (): React.JSX.Element|null => {
    if (!overlays || (overlays.length <= 0)) { return null; }
    const groups: OverlayGroup = overlays.reduce(
      (groupAcc: OverlayGroup, overlay: Overlay): OverlayGroup => {
        const groupKey: string = overlay.groupTitle;
        if (!groupAcc[groupKey]) {
          // eslint-disable-next-line no-param-reassign
          groupAcc[groupKey] = {
            exclusive: exclusiveGroups && exclusiveGroups.includes(groupKey),
            groupItems: [],
          };
        }
        groupAcc[groupKey].groupItems.push(overlay);
        return groupAcc;
      },
      {},
    );
    const groupTitles: string[] = Array.from(new Set(overlays.map((o) => o.groupTitle)));
    const renderedGroups: React.ReactNode[] = groupTitles.map(
      (groupTitle: string): React.ReactNode => {
        const { groupItems, exclusive } = groups[groupTitle];
        const isExclusiveGroup: boolean = (exclusive === true);
        const exclusiveParam: OverlayGroupType = isExclusiveGroup
          ? OverlayGroupType.EXCLUSIVE
          : OverlayGroupType.NON_EXCLUSIVE;
        let selectedOverlay: Overlay;
        const groupElements: React.ReactNode[] = groupItems.map(
          (overlay: Overlay): React.ReactNode => {
            if (isExclusiveGroup && overlay.checked) {
              selectedOverlay = overlay;
            }
            return (
              <FormControlLabel
                key={`${groupTitle}-${overlay.name}`}
                value={isExclusiveGroup ? overlay.name : undefined}
                label={overlay.title}
                control={isExclusiveGroup ? (<Radio size="small" />) : (
                  <Checkbox
                    size="small"
                    checked={overlay.checked}
                    onChange={(): void => {
                      handleOverlayChanged(overlay, overlay.checked, groupTitle, exclusiveParam);
                    }}
                  />
                )}
              />
            );
          },
        );
        const renderControlGroup = () => {
          if (!isExclusiveGroup) {
            return (
              <FormGroup css={classes.formGroupControl}>
                {groupElements}
              </FormGroup>
            );
          }
          return (
            <FormControl
              fullWidth
              size="small"
              margin="dense"
              css={classes.formGroupControl}
            >
              <RadioGroup
                name={groupTitle}
                value={selectedOverlay?.name || null}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                  const nextSelected = groupItems.find((overlay: Overlay) => (
                    overlay.name === (event.target as HTMLInputElement).value
                  ));
                  if (nextSelected) {
                    let isSelected = false;
                    const currentSelectedName = selectedOverlay?.name || null;
                    if (currentSelectedName) {
                      isSelected = currentSelectedName === nextSelected.name;
                    }
                    handleOverlayChanged(nextSelected, isSelected, groupTitle, exclusiveParam);
                  }
                }}
              >
                {groupElements}
              </RadioGroup>
            </FormControl>
          );
        };
        return (
          <div key={groupTitle}>
            <Typography css={classes.groupTitle} variant="h6">
              {groupTitle}
            </Typography>
            {renderControlGroup()}
          </div>
        );
      },
    );
    return (
      <>
        <Divider css={classes.controlGroupDivider} />
        {renderedGroups}
      </>
    );
  };
  const renderContent = (): React.ReactNode => ((
    <div className="leaflet-control" css={classes.leafletControlContainer}>
      <div
        ref={divRef}
        css={classes.controlContainer}
        onMouseEnter={handleMainDivMouseEnter}
        onMouseLeave={handleMainDivMouseLeave}
      >
        {!open ? (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link css={classes.controlIconContainer} component="button">
            <FontAwesomeIcon css={classes.controlIcon} size="2x" icon={faLayerGroup} />
          </Link>
        ) : (
          <div css={classes.controls}>
            {renderBaseLayerGroup()}
            {renderOverlayGroups()}
          </div>
        )}
      </div>
    </div>
  ));
  const render = () => {
    if (isPortalMode && hasPortalNode) {
      return createPortal(renderContent(), portalNodes[0]);
    }
    return (
      <div className={controlPositionClass}>
        {renderContent()}
      </div>
    );
  };
  return render();
};

export default LeafletGroupedLayerControl;
