import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import L, { type ControlPosition, type ControlOptions } from 'leaflet';
import { useMap } from 'react-leaflet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import { exists } from '../../util/typeUtil';

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

interface ListItemProps {
  groupName: string;
  item: BaseLayer|Overlay;
  type: string;
  checked: boolean;
  onClick: (event: React.MouseEvent<HTMLInputElement>, item: BaseLayer|Overlay) => void;
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

const ListItem: React.FC<ListItemProps> = (props: ListItemProps): React.JSX.Element => {
  const {
    groupName,
    item,
    type,
    checked,
    onClick,
  } = props;
  const handleOnClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    if ((type === 'radio') && !checked) {
      onClick(event, item);
    } else {
      onClick(event, item);
    }
  };
  return (
    <label htmlFor={item.name} className="rlglc-option">
      <input
        id={item.name}
        value={item.name}
        name={groupName}
        className="rlglc-input"
        type={type}
        checked={checked}
        readOnly
        onClick={handleOnClick || (() => {})}
      />
      <span className="rlglc-title">{item.title}</span>
    </label>
  );
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
  const handleBaseLayerChange = (
    event: React.MouseEvent<HTMLInputElement>,
    layer: BaseLayer,
  ): void => {
    if (onBaseLayerChange) {
      onBaseLayerChange(layer.name);
    }
  };
  const handleOverlayChanged = (
    event: React.MouseEvent<HTMLInputElement>,
    selectedOverlay: Overlay,
    exclusive: GroupExclusiveType,
  ) => {
    const targetElement = (event.target as HTMLInputElement);
    const isExclusive = (exclusive === 'exclusive');
    const newOverlays: Overlay[] = (overlays || []).map((overlay) => {
      const groupMatches = (overlay.groupTitle === targetElement.name);
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
      <span key="title-baselayer" className="rlglc-grouptitle">
        Base Layers
      </span>
      {baseLayers.map((baseLayer: BaseLayer, index: number) => ((
        <ListItem
          // eslint-disable-next-line react/no-array-index-key
          key={`${baseLayer.name}-${index}`}
          type="radio"
          groupName="baselayer"
          item={baseLayer}
          checked={(baseLayer.name === checkedBaseLayer)}
          onClick={handleBaseLayerChange}
        />
      )))}
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
        const listItemType = isExclusiveGroup ? 'radio' : 'checkbox';
        const groupElements: React.ReactNode[] = groupItems.map(
          (overlay: Overlay, index: number): React.ReactNode => ((
            <ListItem
              // eslint-disable-next-line react/no-array-index-key
              key={`${groupTitle}=${overlay.name}-${index}`}
              type={listItemType}
              groupName={groupTitle}
              item={overlay}
              checked={overlay.checked}
              onClick={(event, item) => (
                handleOverlayChanged(event, item as Overlay, exclusiveParam)
              )}
            />
          )),
        );
        const groupContainer = (
          <div key={groupTitle} className="rlglc-group">
            <span key={`title-${groupTitle}`} className="rlglc-grouptitle">
              {groupTitle}
            </span>
            {groupElements}
          </div>
        );
        return [...groupNodes, groupContainer];
      },
      [],
    );
    return (
      <>
        <div className="rlglc-seperator" />
        {renderedGroups}
      </>
    );
  };
  const controlPositionClass: string = getControlClassFromPosition(position);
  const containerNode = map.getContainer();
  const portalNodes: HTMLCollectionOf<Element> = containerNode.getElementsByClassName(controlPositionClass);
  const hasPortalNode = exists(portalNodes) && (portalNodes.length > 0) && exists(portalNodes[0]);
  const renderContent = (): React.ReactNode => ((
    <div className="rlglc-wrap leaflet-control">
      <div
        ref={divRef}
        className={`rlglc${open ? ' rlglc-active' : ''}`}
        onMouseEnter={handleMainDivMouseEnter}
        onMouseLeave={handleMainDivMouseLeave}
      >
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="rlglc-a">
          {open ? null : (
            <FontAwesomeIcon style={{ marginTop: '6px' }} size="2x" icon={faLayerGroup} />
          )}
          <div className={open ? 'rlglc-open' : 'rlglc-close'}>
            {renderBaseLayerGroup()}
            {renderOverlayGroups()}
          </div>
        </a>
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
