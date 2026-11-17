import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';

import DownloadProgressRegistry from '../../service/DownloadProgressRegistry';
import {
  IDownloadProgressService,
  createDownloadProgressService,
  createInitialDownloadProgressState,
} from '../../service/DownloadProgressService';
import { Nullable } from '../../types/core';
import {
  DownloadProgressActions,
  DownloadProgressPhase,
  DownloadProgressState,
} from '../../types/downloadProgress';
import { isActivePhase } from '../../util/downloadProgressUtil';

const ServiceContext = createContext<Nullable<IDownloadProgressService>>(null);

const IDLE_STATE: DownloadProgressState = createInitialDownloadProgressState();
const subscribeNone = (): () => void => () => {};
const getIdleState = (): DownloadProgressState => IDLE_STATE;
const getFalse = (): boolean => false;

export type DownloadProgressView = 'none' | 'expanded' | 'minimized';

export interface DownloadProgressProviderProps {
  children?: React.ReactNode | React.ReactNode[];
  // The service to apply, a service is created when not specified
  service?: IDownloadProgressService;
}

/**
 * Provides the tracking of a download's progress to the components within.
 * The service is created once and lives for the lifetime of the provider.
 */
const Provider: React.FC<DownloadProgressProviderProps> = (
  props: DownloadProgressProviderProps,
): React.JSX.Element => {
  const { children, service: injectedService }: DownloadProgressProviderProps = props;
  const [service] = useState<IDownloadProgressService>(() => (
    injectedService || createDownloadProgressService()
  ));
  useEffect(() => {
    service.attach();
    return () => {
      service.dispose();
    };
  }, [service]);
  return (
    <ServiceContext.Provider value={service}>
      {children}
    </ServiceContext.Provider>
  );
};

/**
 * Gets the actions for the download tracked by the provider.
 * The actions are stable, so consumers do not re-render as the progress changes.
 * @return The actions, null when not within a provider
 */
export const useDownloadProgressActions = (): Nullable<DownloadProgressActions> => {
  const service = useContext(ServiceContext);
  return service ? service.actions : null;
};

/**
 * Gets the state of the download tracked by the provider, re-rendering as it changes
 */
export const useDownloadProgressState = (): DownloadProgressState => {
  const service = useContext(ServiceContext);
  return useSyncExternalStore<DownloadProgressState>(
    service ? service.subscribe : subscribeNone,
    service ? service.getSnapshot : getIdleState,
    getIdleState,
  );
};

/**
 * Whether the provider's download is in progress, re-rendering only when this changes
 */
export const useIsDownloadProgressActive = (): boolean => {
  const service = useContext(ServiceContext);
  return useSyncExternalStore<boolean>(
    service ? service.subscribe : subscribeNone,
    () => (service ? isActivePhase(service.getSnapshot().phase) : false),
    getFalse,
  );
};

/**
 * How the provider's download is shown, re-rendering only when this changes
 */
export const useDownloadProgressView = (): DownloadProgressView => {
  const service = useContext(ServiceContext);
  return useSyncExternalStore<DownloadProgressView>(
    service ? service.subscribe : subscribeNone,
    (): DownloadProgressView => {
      if (!service) return 'none';
      const { phase, expanded } = service.getSnapshot();
      if (phase === DownloadProgressPhase.IDLE) return 'none';
      return expanded ? 'expanded' : 'minimized';
    },
    (): DownloadProgressView => 'none',
  );
};

/**
 * Whether the most downloads that may be in progress at once within the page are in progress.
 * Re-renders only when this changes. Does not require a provider.
 */
export const useIsDownloadLimitReached = (): boolean => (
  useSyncExternalStore<boolean>(
    DownloadProgressRegistry.subscribe,
    DownloadProgressRegistry.isLimitReached,
    getFalse,
  )
);

const DownloadProgressContext = {
  Provider,
  useDownloadProgressActions,
  useDownloadProgressState,
  useIsDownloadProgressActive,
  useDownloadProgressView,
  useIsDownloadLimitReached,
};

export default DownloadProgressContext;
