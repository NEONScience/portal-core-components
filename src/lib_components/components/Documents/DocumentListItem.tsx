import React, {
  useReducer,
  useEffect,
  useCallback,
  Dispatch,
} from 'react';

import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import NeonApi from '../NeonApi';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import SplitButton from '../Button/SplitButton';
import Theme from '../Theme/Theme';

import DocumentParser from '../../parser/DocumentParser';
import DocumentService, { DocumentTypeListItemDef, ParsedQsgNameResult } from '../../service/DocumentService';
import { StylesHook } from '../../types/muiTypes';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
import { AnyAction, Nullable, UnknownRecord } from '../../types/core';
import { DocumentListItemModel } from './documentTypes';
import { NeonDocument, QuickStartGuideDocument, QuickStartGuideVersion } from '../../types/neonApi';

const useStyles = (
  enableDownloadButton: boolean,
): StylesHook => makeStyles((muiTheme: MuiTheme) => createStyles({
  listItem: {
    wordBreak: 'break-word',
    paddingLeft: muiTheme.spacing(1),
    paddingRight: enableDownloadButton ? muiTheme.spacing(18) : 'unset',
    [muiTheme.breakpoints.down('xs')]: {
      paddingRight: 'unset',
    },
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
})) as StylesHook;

enum ActionTypes {
  FETCH_VARIANTS_STARTED = 'FETCH_VARIANTS_STARTED',
  FETCH_VARIANTS_FAILED = 'FETCH_VARIANTS_FAILED',
  FETCH_VARIANTS_SUCCEEDED = 'FETCH_VARIANTS_SUCCEEDED',

  SET_SELECTED_VARIANT = 'SET_SELECTED_VARIANT',
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

type DocumentListItemActionTypes = (
  FetchVariantsStartedAction
  | FetchVariantsFailedAction
  | FetchVariantsSucceededAction
  | SetSelectedVariantAction
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
}

const DEFAULT_STATE: DocumentListItemState = {
  fetchVariants: {
    status: FetchStatus.IDLE,
    error: null,
  },
  variants: [],
  selectedVariant: null,
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
    default:
      return newState;
  }
};

export interface DocumentListItemProps {
  id: number;
  document: DocumentListItemModel;
  makeDownloadableLink: boolean;
  enableDownloadButton: Nullable<boolean>;
  fetchVariants: Nullable<boolean>;
  enableVariantChips: Nullable<boolean>;
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
  }: DocumentListItemProps = props;
  const classes = useStyles(enableDownloadButton === true)(Theme);
  const atXs = useMediaQuery(Theme.breakpoints.down('xs'));
  // eslint-disable-next-line max-len
  const [state, dispatch]: [DocumentListItemState, Dispatch<DocumentListItemActionTypes>] = useReducer(
    documentListItemReducer,
    cloneDeep(DEFAULT_STATE),
  );
  const {
    fetchVariants: {
      status: fetchVariantStatus,
    },
    variants: stateVariants,
    selectedVariant: stateSelectedVariant,
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

  if (!hasDocument) {
    return null;
  }
  const appliedDocument: NeonDocument = exists(stateSelectedVariant)
    ? stateSelectedVariant as NeonDocument
    : document;
  const appliedVariants: NeonDocument[] = appliedFetchVariants
    ? stateVariants
    : document.variants;
  const hasAppliedVariants = existsNonEmpty(appliedVariants);

  const apiPath = DocumentService.isQuickStartGuide(appliedDocument)
    ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}/${appliedDocument.name}`
    : `${NeonEnvironment.getFullApiPath('documents')}/${appliedDocument.name}`;
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
    const typeAndSize = (
      <>
        {renderTypes()}
        {!appliedDocument.size ? null : (
          <>
            {spacer}
            <span title={`file size: ${DocumentService.formatBytes(appliedDocument.size)}`}>
              {DocumentService.formatBytes(appliedDocument.size)}
            </span>
          </>
        )}
      </>
    );
    const fileNumber = (
      <span title={`file number: ${appliedDocument.name}`}>{appliedDocument.name}</span>
    );
    return atXs ? (
      <span>
        {fileNumber}
        <br />
        {typeAndSize}
      </span>
    ) : (
      <span>
        {typeAndSize}
        {spacer}
        {fileNumber}
      </span>
    );
  };
  const renderAction = (): JSX.Element|null => {
    if (!(enableDownloadButton === true)) return null;
    if (atXs) return null;
    const button = !hasAppliedVariants
      ? (
        <Button
          variant="outlined"
          onClick={(): void => { window.location.href = apiPath; }}
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
              const downloadPath = DocumentService.isQuickStartGuide(coercedDownloadVariant)
                ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}/${coercedDownloadVariant.name}`
                : `${NeonEnvironment.getFullApiPath('documents')}/${coercedDownloadVariant.name}`;
              window.location.href = downloadPath;
            }
          }}
          onChange={(option: string) => {
            const nextSelectedVariant: Nullable<NeonDocument> = DocumentService
              .findFirstByDocumentTypeTitle(appliedVariants, option);
            if (exists(nextSelectedVariant)) {
              handleSelectedVariantChanged(nextSelectedVariant as NeonDocument);
            }
          }}
          buttonGroupProps={{ size: 'small', variant: 'outlined', color: 'primary' }}
          buttonProps={{ size: 'small', color: 'primary' }}
        />
      );
    return (
      <ListItemSecondaryAction>
        {button}
      </ListItemSecondaryAction>
    );
  };
  return (
    <ListItem
      key={id}
      className={classes.listItem}
      component={makeDownloadableLink ? 'a' : 'div'}
      href={makeDownloadableLink ? apiPath : undefined}
      title={makeDownloadableLink ? `Click to download ${document.name}` : `${document.name}`}
      // @ts-ignore
      button={makeDownloadableLink}
    >
      <ListItemIcon className={classes.listItemIcon}>
        {/* @ts-ignore */}
        <TypeIcon />
      </ListItemIcon>
      <ListItemText primary={primary} secondary={renderSecondaryItem()} />
      {renderAction()}
    </ListItem>
  );
};

const WrappedDocumentListItem = (Theme as any).getWrappedComponent(DocumentListItem);

export default WrappedDocumentListItem;
