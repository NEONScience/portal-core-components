import React, {
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  useState,
  Dispatch,
} from 'react';

import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import DownloadIcon from '@material-ui/icons/SaveAlt';

import NeonApi from '../NeonApi';
import SplitButton from '../Button/SplitButton';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';

import DocumentParser from '../../parser/DocumentParser';
import DocumentService, {
  DocumentTypeListItemDef,
  ParsedQsgNameResult,
} from '../../service/DocumentService';
import { StylesHook } from '../../types/muiTypes';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
import {
  AnyAction,
  Nullable,
  Undef,
  UnknownRecord,
} from '../../types/core';
import {
  NeonDocument,
  QuickStartGuideDocument,
  QuickStartGuideVersion,
} from '../../types/neonApi';

const COMPONENT_XS_UPPER = 480;
const COMPONENT_SM_UPPER = 805;

const useStyles = makeStyles((muiTheme: MuiTheme) => createStyles({
  listItemContainer: {
    display: 'flex',
  },
  listItem: {
    display: 'flex',
    wordBreak: 'break-word',
    paddingLeft: muiTheme.spacing(1),
    '& p': {
      marginTop: muiTheme.spacing(0.5),
      '& > span > span': {
        whiteSpace: 'nowrap',
      },
    },
  },
  listItemSecondarySpacer: {
    margin: muiTheme.spacing(0, 2),
    color: muiTheme.palette.grey[200],
  },
  listItemIcon: {
    minWidth: muiTheme.spacing(4),
    marginRight: muiTheme.spacing(1),
  },
  fileTypeChip: {
    marginRight: '5px',
    '&:last-child': {
      marginRight: '0px',
    },
  },
  fileTypeChipSelected: {
    marginRight: '5px',
    fontWeight: 500,
  },
  variantFetchingLabel: {
    lineHeight: '24px',
  },
  variantFetchingProgress: {
    marginRight: '36px',
    marginLeft: '36px',
  },
  downloadErrorContainer: {
    marginTop: muiTheme.spacing(2),
  },
})) as StylesHook;

const useListItemSecondaryActionStyles = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      position: 'unset',
      transform: 'unset',
      top: 'unset',
      right: 'unset',
      whiteSpace: 'nowrap',
    },
  })) as StylesHook;

enum ActionTypes {
  FETCH_VARIANTS_STARTED = 'FETCH_VARIANTS_STARTED',
  FETCH_VARIANTS_FAILED = 'FETCH_VARIANTS_FAILED',
  FETCH_VARIANTS_SUCCEEDED = 'FETCH_VARIANTS_SUCCEEDED',

  SET_SELECTED_VARIANT = 'SET_SELECTED_VARIANT',

  DOWNLOAD_IDLE = 'DOWNLOAD_IDLE',
  DOWNLOAD_STARTED = 'DOWNLOAD_STARTED',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
}

interface FetchVariantsStartedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_VARIANTS_STARTED;
}
interface FetchVariantsFailedAction extends AnyAction {
  type: typeof ActionTypes.FETCH_VARIANTS_FAILED;
  error: Nullable<UnknownRecord|string>;
}
interface FetchVariantsSucceededAction extends AnyAction {
  type: typeof ActionTypes.FETCH_VARIANTS_SUCCEEDED;
  variants: NeonDocument[];
}
interface SetSelectedVariantAction extends AnyAction {
  type: typeof ActionTypes.SET_SELECTED_VARIANT;
  variant: NeonDocument;
}
interface DownloadIdleAction extends AnyAction {
  type: typeof ActionTypes.DOWNLOAD_IDLE;
}
interface DownloadStartedAction extends AnyAction {
  type: typeof ActionTypes.DOWNLOAD_STARTED;
}
interface DownloadFailedAction extends AnyAction {
  type: typeof ActionTypes.DOWNLOAD_FAILED;
}

type DocumentListItemActionTypes = (
  FetchVariantsStartedAction
  | FetchVariantsFailedAction
  | FetchVariantsSucceededAction
  | SetSelectedVariantAction
  | DownloadIdleAction
  | DownloadStartedAction
  | DownloadFailedAction
);

const ActionCreator = {
  fetchVariantsStarted: (): FetchVariantsStartedAction => ({
    type: ActionTypes.FETCH_VARIANTS_STARTED,
  }),
  fetchVariantsFailed: (error: Nullable<UnknownRecord|string>): FetchVariantsFailedAction => ({
    type: ActionTypes.FETCH_VARIANTS_FAILED,
    error,
  }),
  fetchVariantsSucceeded: (variants: NeonDocument[]): FetchVariantsSucceededAction => ({
    type: ActionTypes.FETCH_VARIANTS_SUCCEEDED,
    variants,
  }),
  setSelectedVariant: (variant: NeonDocument): SetSelectedVariantAction => ({
    type: ActionTypes.SET_SELECTED_VARIANT,
    variant,
  }),
  downloadIdle: (): DownloadIdleAction => ({
    type: ActionTypes.DOWNLOAD_IDLE,
  }),
  downloadStarted: (): DownloadStartedAction => ({
    type: ActionTypes.DOWNLOAD_STARTED,
  }),
  downloadFailed: (): DownloadFailedAction => ({
    type: ActionTypes.DOWNLOAD_FAILED,
  }),
};

enum FetchStatus {
  AWAITING_CALL = 'AWAITING_CALL',
  FETCHING = 'FETCHING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  IDLE = 'IDLE',
}

interface FetchStatusState {
  status: FetchStatus,
  error?: Nullable<UnknownRecord|string>,
}

interface DocumentListItemState {
  fetchVariants: FetchStatusState;
  variants: NeonDocument[];
  selectedVariant: Nullable<NeonDocument>;
  downloadStatus: FetchStatus;
}

const DEFAULT_STATE: DocumentListItemState = {
  fetchVariants: {
    status: FetchStatus.IDLE,
    error: null,
  },
  variants: [],
  selectedVariant: null,
  downloadStatus: FetchStatus.IDLE,
};

const documentListItemReducer = (
  state: DocumentListItemState,
  action: DocumentListItemActionTypes,
): DocumentListItemState => {
  const newState: DocumentListItemState = { ...state };
  let fetchVariantFailedAction: FetchVariantsFailedAction;
  let fetchVariantSucceededAction: FetchVariantsSucceededAction;
  let setSelectedVariantAction: SetSelectedVariantAction;
  switch (action.type) {
    case ActionTypes.FETCH_VARIANTS_STARTED:
      newState.fetchVariants.status = FetchStatus.FETCHING;
      return newState;
    case ActionTypes.FETCH_VARIANTS_FAILED:
      fetchVariantFailedAction = (action as FetchVariantsFailedAction);
      newState.fetchVariants.status = FetchStatus.ERROR;
      newState.fetchVariants.error = fetchVariantFailedAction.error;
      return newState;
    case ActionTypes.FETCH_VARIANTS_SUCCEEDED:
      fetchVariantSucceededAction = (action as FetchVariantsSucceededAction);
      newState.fetchVariants.status = FetchStatus.SUCCESS;
      newState.variants = fetchVariantSucceededAction.variants;
      if (!exists(newState.selectedVariant) && existsNonEmpty(newState.variants)) {
        // eslint-disable-next-line prefer-destructuring
        newState.selectedVariant = newState.variants[0];
      }
      return newState;
    case ActionTypes.SET_SELECTED_VARIANT:
      setSelectedVariantAction = (action as SetSelectedVariantAction);
      newState.selectedVariant = setSelectedVariantAction.variant;
      return newState;
    case ActionTypes.DOWNLOAD_IDLE:
      newState.downloadStatus = FetchStatus.IDLE;
      return newState;
    case ActionTypes.DOWNLOAD_STARTED:
      newState.downloadStatus = FetchStatus.FETCHING;
      return newState;
    case ActionTypes.DOWNLOAD_FAILED:
      newState.downloadStatus = FetchStatus.ERROR;
      return newState;
    default:
      return newState;
  }
};

export interface DocumentListItemModel extends NeonDocument {
  variants: NeonDocument[];
}

export interface DocumentListItemProps {
  id: number;
  document: DocumentListItemModel;
  makeDownloadableLink: boolean;
  enableDownloadButton: Nullable<boolean>;
  fetchVariants: Nullable<boolean>;
  enableVariantChips: Nullable<boolean>;
  containerComponent: Undef<React.ElementType<React.HTMLAttributes<HTMLDivElement>>>;
}

const DocumentListItem: React.FC<DocumentListItemProps> = (
  props: DocumentListItemProps,
): JSX.Element|null => {
  const {
    id,
    document,
    makeDownloadableLink,
    enableDownloadButton,
    fetchVariants,
    enableVariantChips,
    containerComponent,
  }: DocumentListItemProps = props;
  const classes = useStyles(Theme);
  const listItemSecondaryActionClasses = useListItemSecondaryActionStyles(Theme);
  const containerRef: React.MutableRefObject<HTMLDivElement|HTMLAnchorElement|undefined> = useRef();
  const [
    componentWidth,
    setComponentWidth,
  ]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  let atComponentXs = false;
  let atComponentSm = false;
  if (componentWidth > 0) {
    atComponentXs = (componentWidth <= COMPONENT_XS_UPPER);
    atComponentSm = (componentWidth >= COMPONENT_XS_UPPER) && (componentWidth < COMPONENT_SM_UPPER);
  }
  const [
    state,
    dispatch,
  ]: [DocumentListItemState, Dispatch<DocumentListItemActionTypes>] = useReducer(
    documentListItemReducer,
    cloneDeep(DEFAULT_STATE),
  );
  const {
    fetchVariants: {
      status: fetchVariantStatus,
    },
    variants: stateVariants,
    selectedVariant: stateSelectedVariant,
    downloadStatus,
  }: DocumentListItemState = state;
  const hasDocument = exists(document);
  const hasProvidedVariants = hasDocument && existsNonEmpty(document.variants);
  const isQsg = DocumentService.isQuickStartGuide(document);
  const appliedFetchVariants = !hasProvidedVariants && (fetchVariants === true);
  const requireVariantFetch = isQsg
    && appliedFetchVariants
    && (fetchVariantStatus === FetchStatus.IDLE);
  useEffect(() => {
    if (!hasDocument || !requireVariantFetch) {
      return;
    }
    const qsgParsedName: Nullable<ParsedQsgNameResult> = DocumentService.parseQuickStartGuideName(
      document.name,
    );
    if (!exists(qsgParsedName)) {
      return;
    }
    const coercedParsedName: ParsedQsgNameResult = (qsgParsedName as ParsedQsgNameResult);
    const variantObs = (NeonApi.getQuickStartGuideDetailObservable(
      coercedParsedName.matchedName,
      coercedParsedName.matchedVersion,
    ) as Observable<UnknownRecord>).pipe(
      map((response: UnknownRecord): Observable<boolean> => {
        if (!exists(response) || !exists(response.data)) {
          dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
          return of(false);
        }
        const qsgResponse: Nullable<QuickStartGuideVersion> = DocumentParser
          .parseQuickStartGuideVersionResponse(response);
        if (!exists(qsgResponse)) {
          dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
          return of(false);
        }
        const coercedQsgDocumentResponse = (qsgResponse as QuickStartGuideVersion);
        const qsgDocuments: QuickStartGuideDocument[] = coercedQsgDocumentResponse.documents;
        const variantDocuments: NeonDocument[] = DocumentService.transformQuickStartGuideDocuments(
          qsgDocuments,
        );
        if (!existsNonEmpty(variantDocuments)) {
          dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
          return of(false);
        }
        dispatch(ActionCreator.fetchVariantsSucceeded(variantDocuments));
        return of(true);
      }),
      catchError((error: UnknownRecord|string): Observable<boolean> => {
        dispatch(ActionCreator.fetchVariantsFailed(error));
        return of(false);
      }),
    );
    dispatch(ActionCreator.fetchVariantsStarted());
    variantObs.subscribe();
  }, [hasDocument, requireVariantFetch, document]);

  const handleSelectedVariantChanged = useCallback((selectedVariantCb: NeonDocument): void => {
    dispatch(ActionCreator.setSelectedVariant(selectedVariantCb));
  }, [dispatch]);
  const handleDownloadIdle = useCallback((): void => {
    dispatch(ActionCreator.downloadIdle());
  }, [dispatch]);
  const handleDownloadStarted = useCallback((): void => {
    dispatch(ActionCreator.downloadStarted());
  }, [dispatch]);
  const handleDownloadFailed = useCallback((): void => {
    dispatch(ActionCreator.downloadFailed());
  }, [dispatch]);

  const handleResizeCb = useCallback((): void => {
    const container: HTMLDivElement|HTMLAnchorElement|undefined = containerRef.current;
    if (!container) { return; }
    if (container.clientWidth === componentWidth) { return; }
    setComponentWidth(container.clientWidth);
  }, [containerRef, componentWidth, setComponentWidth]);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) { return () => {}; }
    handleResizeCb();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return () => {
        window.removeEventListener('resize', handleResizeCb);
      };
    }
    let resizeObserver: ResizeObserver|null = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(element);
    return () => {
      if (!resizeObserver) { return; }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [containerRef, handleResizeCb]);

  if (!hasDocument) {
    return null;
  }
  const isFetchingVariants = (fetchVariantStatus === FetchStatus.FETCHING);
  const appliedDocument: NeonDocument = exists(stateSelectedVariant)
    ? stateSelectedVariant as NeonDocument
    : document;
  const appliedVariants: NeonDocument[] = appliedFetchVariants
    ? stateVariants
    : document.variants;
  const hasAppliedVariants = existsNonEmpty(appliedVariants);

  const isDownloading = (downloadStatus === FetchStatus.FETCHING);
  const isDownloadError = (downloadStatus === FetchStatus.ERROR);

  const documentType: DocumentTypeListItemDef = DocumentService.resolveDocumentType(
    appliedDocument,
  );
  const { title: typeTitle, Icon: TypeIcon }: DocumentTypeListItemDef = documentType;
  const typeTitleString = typeTitle(appliedDocument.type);
  const primary = isStringNonEmpty(appliedDocument.description)
    ? appliedDocument.description
    : <i>No description</i>;
  const spacer = <span className={classes.listItemSecondarySpacer}>|</span>;
  const renderTypes = (): JSX.Element => {
    if (!(enableVariantChips === true)) {
      return (<span title={`file type: ${typeTitleString}`}>{typeTitleString}</span>);
    }
    if (isFetchingVariants) {
      return (
        <Typography variant="caption" className={classes.variantFetchingLabel}>
          Determining variants...
        </Typography>
      );
    }
    if (!hasAppliedVariants) {
      return (
        <Chip
          key={appliedDocument.name}
          variant={undefined}
          className={classes.fileTypeChipSelected}
          style={{ marginRight: '0px' }}
          component="span"
          size="small"
          label={typeTitleString}
        />
      );
    }
    return (
      <>
        {appliedVariants.map((variant: NeonDocument, index: number): JSX.Element => {
          const variantTypeTitleString = DocumentService.getDocumentTypeTitle(variant);
          const isSelected = (appliedDocument.name === variant.name);
          const isLast = (index === (appliedVariants.length - 1));
          return (
            <Chip
              key={variant.name}
              variant={isSelected ? undefined : 'outlined'}
              className={isSelected ? classes.fileTypeChipSelected : classes.fileTypeChip}
              style={{ marginRight: isLast ? '0px' : undefined }}
              component="span"
              size="small"
              label={variantTypeTitleString}
              disabled={isDownloading || isDownloadError}
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                handleSelectedVariantChanged(variant);
              }}
            />
          );
        })}
      </>
    );
  };
  const renderSecondaryItem = (): JSX.Element => {
    let sizeDisplay = (<span><i>n/a</i></span>);
    if (appliedDocument.size) {
      sizeDisplay = (
        <span title={`file size: ${DocumentService.formatBytes(appliedDocument.size)}`}>
          {DocumentService.formatBytes(appliedDocument.size)}
        </span>
      );
    }
    const fileNumber = (
      <span
        style={{ whiteSpace: 'break-spaces' }}
        title={`file number: ${appliedDocument.name}`}
      >
        {appliedDocument.name}
      </span>
    );
    if (atComponentSm || atComponentXs) {
      if (hasAppliedVariants) {
        return (
          <span>
            {fileNumber}
            <span style={{ height: '5px', display: 'block' }} />
            {renderTypes()}
            <span style={{ height: '5px', display: 'block' }} />
            {sizeDisplay}
          </span>
        );
      }
      return (
        <span>
          {fileNumber}
          <span style={{ height: '5px', display: 'block' }} />
          {renderTypes()}
          {spacer}
          {sizeDisplay}
        </span>
      );
    }
    return (
      <span>
        {renderTypes()}
        {spacer}
        {sizeDisplay}
        {spacer}
        {fileNumber}
      </span>
    );
  };
  const renderAction = (): JSX.Element|null => {
    if (!(enableDownloadButton === true)) return null;
    if (isFetchingVariants) {
      return (
        <ListItemSecondaryAction classes={listItemSecondaryActionClasses}>
          <CircularProgress size={36} className={classes.variantFetchingProgress} />
        </ListItemSecondaryAction>
      );
    }
    if (atComponentXs) {
      return (
        <ListItemSecondaryAction classes={listItemSecondaryActionClasses}>
          <Tooltip
            placement="top"
            title={`Download ${appliedDocument.name}`}
          >
            <div>
              <IconButton
                color="primary"
                disabled={isDownloading || isDownloadError}
                onClick={(): void => {
                  handleDownloadStarted();
                  DocumentService.downloadDocument(
                    appliedDocument,
                    (downloadDoc: NeonDocument): void => handleDownloadIdle(),
                    (downloadDoc: NeonDocument): void => handleDownloadFailed(),
                  );
                }}
              >
                {isDownloading
                  ? <CircularProgress size={18} />
                  : <DownloadIcon fontSize="small" />}
              </IconButton>
            </div>
          </Tooltip>
        </ListItemSecondaryAction>
      );
    }
    const button = !hasAppliedVariants
      ? (
        <Button
          variant="outlined"
          disabled={isDownloading || isDownloadError}
          startIcon={isDownloading
            ? <CircularProgress size={18} />
            : <DownloadIcon fontSize="small" />}
          onClick={(): void => {
            handleDownloadStarted();
            DocumentService.downloadDocument(
              appliedDocument,
              (downloadDoc: NeonDocument): void => handleDownloadIdle(),
              (downloadDoc: NeonDocument): void => handleDownloadFailed(),
            );
          }}
        >
          Download
        </Button>
      ) : (
        <SplitButton
          name={`${appliedDocument.name}-document-list-item-download-split-button`}
          selectedOption={`${typeTitleString}`}
          selectedOptionDisplayCallback={(selectedOption: string): string => (
            `Download ${selectedOption}`
          )}
          options={appliedVariants.map((variant: NeonDocument): string => (
            DocumentService.getDocumentTypeTitle(variant)
          ))}
          onClick={(option: string) => {
            const nextSelectedVariant: Nullable<NeonDocument> = DocumentService
              .findFirstByDocumentTypeTitle(appliedVariants, option);
            if (exists(nextSelectedVariant)) {
              const coercedDownloadVariant = nextSelectedVariant as NeonDocument;
              handleDownloadStarted();
              DocumentService.downloadDocument(
                coercedDownloadVariant,
                (downloadDoc: NeonDocument): void => handleDownloadIdle(),
                (downloadDoc: NeonDocument): void => handleDownloadFailed(),
              );
            }
          }}
          onChange={(option: string) => {
            const nextSelectedVariant: Nullable<NeonDocument> = DocumentService
              .findFirstByDocumentTypeTitle(appliedVariants, option);
            if (exists(nextSelectedVariant)) {
              handleSelectedVariantChanged(nextSelectedVariant as NeonDocument);
            }
          }}
          buttonGroupProps={{
            size: 'small',
            variant: 'outlined',
            color: 'primary',
          }}
          buttonMenuProps={{
            size: 'small',
            color: 'primary',
            disabled: isDownloading || isDownloadError,
          }}
          buttonProps={{
            size: 'small',
            color: 'primary',
            disabled: isDownloading || isDownloadError,
            startIcon: isDownloading
              ? <CircularProgress size={18} />
              : <DownloadIcon fontSize="small" />,
          }}
        />
      );
    return (
      <ListItemSecondaryAction classes={listItemSecondaryActionClasses}>
        {button}
      </ListItemSecondaryAction>
    );
  };
  const renderDownloadError = (): JSX.Element|null => {
    if (!isDownloadError) return null;
    return (
      <div className={classes.downloadErrorContainer}>
        <WarningCard
          title={`Document download is currently unavailable for "${appliedDocument.name}."`}
          onActionClick={() => handleDownloadIdle()}
        />
      </div>
    );
  };
  return (
    <>
      <ListItem
        ref={containerRef as never}
        key={id}
        className={classes.listItem}
        component="div"
        ContainerComponent={containerComponent}
        ContainerProps={{ className: classes.listItemContainer }}
        title={makeDownloadableLink ? `Click to download ${document.name}` : undefined}
        // @ts-ignore
        button={makeDownloadableLink}
        onClick={!makeDownloadableLink ? undefined : (): void => {
          handleDownloadStarted();
          DocumentService.downloadDocument(
            appliedDocument,
            (downloadDoc: NeonDocument): void => handleDownloadIdle(),
            (downloadDoc: NeonDocument): void => handleDownloadFailed(),
          );
        }}
      >
        <ListItemIcon className={classes.listItemIcon}>
          {/* @ts-ignore */}
          <TypeIcon />
        </ListItemIcon>
        <ListItemText
          primary={primary}
          secondary={renderSecondaryItem()}
        />
        {renderAction()}
      </ListItem>
      {renderDownloadError()}
    </>
  );
};

const WrappedDocumentListItem = (Theme as any).getWrappedComponent(DocumentListItem);

export default WrappedDocumentListItem;
