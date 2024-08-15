import React, { useRef, useState, useEffect } from 'react';
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

import Theme from '../Theme/Theme';
import { exists } from '../../util/typeUtil';
import { type NeonTheme } from '../Theme/types';

import './leaflet-grouped-layer-control.css';

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

type GroupExclusiveType = 'exclusive' | 'nonExclusive';

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
  const [open, setOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const map = useMap();
  const isPortalMode = (renderToLeafletControlContainer === true);

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
    event: React.ChangeEvent<HTMLInputElement>,
    selectedOverlay: Overlay,
    selectedGroup: string,
    exclusive: GroupExclusiveType,
  ) => {
    const targetElement = (event.target as HTMLInputElement);
    const isExclusive = (exclusive === 'exclusive');
    const newOverlays: Overlay[] = (overlays || []).map((overlay) => {
      const groupMatches = (overlay.groupTitle === selectedGroup);
      const nameMatchesSelected = (overlay.name === selectedOverlay.name);
      const determineChecked = isExclusive
        ? groupMatches
        : groupMatches && nameMatchesSelected;
      if (determineChecked) {
        const applyChecked = isExclusive
          ? nameMatchesSelected
          : (nameMatchesSelected && targetElement.checked);
        return {
          ...overlay,
          checked: applyChecked,
        };
      }
      return overlay;
    });
    if (onOverlayChange) {
      onOverlayChange(newOverlays);
    }
  };

  useEffect(() => {
    if (!divRef.current) return;
    L.DomEvent.disableClickPropagation(divRef.current);
    L.DomEvent.disableScrollPropagation(divRef.current);
    const containerRect = map.getContainer().getBoundingClientRect();
    const divRect = divRef.current.getBoundingClientRect();
    const maxHeight = `${Math.floor((containerRect.bottom - divRect.y) * 0.95)}px`;
    divRef.current.style.maxHeight = maxHeight;
  }, [map, divRef]);

  const renderBaseLayerGroup = () => ((
    <div key="baselayer" className="rlglc-group">
      <Typography key="title-baselayer" className="rlglc-groupTitle" variant="h6">
        Base Layers
      </Typography>
      <FormControl
        fullWidth
        size="small"
        margin="dense"
        style={{
          marginTop: '4px',
          marginBottom: '0px',
        }}
      >
        <RadioGroup
          name="baselayer"
          value={checkedBaseLayer}
          onChange={handleBaseLayerChange}
        >
          {baseLayers.map((baseLayer: BaseLayer) => ((
            <FormControlLabel
              value={baseLayer.name}
              control={<Radio size="small" />}
              label={baseLayer.title}
            />
          )))}
        </RadioGroup>
      </FormControl>
    </div>
  ));

  const renderOverlayGroups = () => {
    if (!overlays || (overlays.length <= 0)) { return null; }
    const groups: OverlayGroup = overlays.reduce(
      (groupAcc: OverlayGroup, overlay: Overlay): OverlayGroup => {
        const groupKey: string = overlay.groupTitle;
        if (!groupAcc[groupKey]) {
          // eslint-disable-next-line no-param-reassign
          groupAcc[groupKey] = {
            exclusive: undefined,
            groupItems: [],
          };
        }
        if (!groupAcc[groupKey].exclusive) {
          // eslint-disable-next-line no-param-reassign
          groupAcc[groupKey].exclusive = exclusiveGroups && exclusiveGroups.includes(groupKey);
        }
        groupAcc[groupKey].groupItems.push(overlay);
        return groupAcc;
      },
      {},
    );
    const groupTitles: string[] = Array.from(new Set(overlays.map((o) => o.groupTitle)));
    const renderedGroups: React.ReactNode[] = groupTitles.reduce(
      (groupNodes: React.ReactNode[], groupTitle: string): React.ReactNode[] => {
        const { groupItems } = groups[groupTitle];
        const isExclusiveGroup = exclusiveGroups && exclusiveGroups.includes(groupTitle);
        const exclusiveParam = isExclusiveGroup ? 'exclusive' : 'nonExclusive';
        let selectedOverlay: Overlay;
        const groupElements: React.ReactNode[] = groupItems.map(
          (overlay: Overlay): React.ReactNode => {
            if (isExclusiveGroup) {
              if (overlay.checked) {
                selectedOverlay = overlay;
              }
              return (
                <FormControlLabel
                  value={overlay.name}
                  control={<Radio size="small" />}
                  label={overlay.title}
                />
              );
            }
            return (
              <FormControlLabel
                label={overlay.title}
                control={(
                  <Checkbox
                    size="small"
                    checked={overlay.checked}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                      handleOverlayChanged(event, overlay, groupTitle, exclusiveParam);
                    }}
                  />
                )}
              />
            );
          },
        );
        const renderControlGroup = () => {
          if (isExclusiveGroup) {
            return (
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                style={{
                  marginTop: '4px',
                  marginBottom: '0px',
                }}
              >
                <RadioGroup
                  name={groupTitle}
                  value={selectedOverlay?.name || null}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    const nextSelected = groupItems.find((overlay: Overlay) => (
                      overlay.name === (event.target as HTMLInputElement).value
                    ));
                    if (nextSelected) {
                      handleOverlayChanged(event, nextSelected, groupTitle, exclusiveParam);
                    }
                  }}
                >
                  {groupElements}
                </RadioGroup>
              </FormControl>
            );
          }
          return (
            <FormGroup
              style={{
                marginTop: '4px',
                marginBottom: '0px',
              }}
            >
              {groupElements}
            </FormGroup>
          );
        };
        const groupContainer = (
          <div key={groupTitle} className="rlglc-group">
            <Typography key={`title-${groupTitle}`} className="rlglc-groupTitle" variant="h6">
              {groupTitle}
            </Typography>
            {renderControlGroup()}
          </div>
        );
        return [...groupNodes, groupContainer];
      },
      [],
    );
    return (
      <>
        <Divider style={{ margin: '10px 0px' }} />
        {renderedGroups}
      </>
    );
  };
  const controlPositionClass: string = getControlClassFromPosition(position);
  const containerNode = map.getContainer();
  const portalNodes: HTMLCollectionOf<Element> = containerNode.getElementsByClassName(controlPositionClass);
  const hasPortalNode = exists(portalNodes) && (portalNodes.length > 0) && exists(portalNodes[0]);
  const borderStyle = open
    ? `1px solid ${Theme.palette.grey[300]}`
    : `1px solid ${(Theme as NeonTheme).colors.LIGHT_BLUE[500]}`;
  const renderContent = (): React.ReactNode => ((
    <div className="rlglc-wrap leaflet-control">
      <div
        ref={divRef}
        className={`rlglc${open ? ' rlglc-active' : ''}`}
        style={{
          border: borderStyle,
        }}
        onMouseEnter={handleMainDivMouseEnter}
        onMouseLeave={handleMainDivMouseLeave}
      >
        {open ? null : (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link className="rlglc-a" component="button">
            <FontAwesomeIcon style={{ marginTop: '6px' }} size="2x" icon={faLayerGroup} />
          </Link>
        )}
        <div
          className={open ? 'rlglc-controls rlglc-open' : 'rlglc-controls rlglc-close'}
          style={{ padding: Theme.spacing(2) }}
        >
          {renderBaseLayerGroup()}
          {renderOverlayGroups()}
        </div>
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
