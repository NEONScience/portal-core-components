import React from 'react';

import Button from '@material-ui/core/Button';
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

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';

import DocumentService, { DocumentTypeListItemDef } from '../../service/DocumentService';
import { StylesHook } from '../../types/muiTypes';
import { NeonDocument } from '../../types/neonApi';
import { isStringNonEmpty } from '../../util/typeUtil';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    listItem: {
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
  })) as StylesHook;

export interface DocumentListItemProps {
  id: number;
  document: NeonDocument;
  makeDownloadableLink: boolean;
}

const DocumentListItem: React.FC<DocumentListItemProps> = (
  props: DocumentListItemProps,
): JSX.Element|null => {
  const classes = useStyles(Theme);
  const atXs = useMediaQuery(Theme.breakpoints.down('xs'));
  const { id, document, makeDownloadableLink }: DocumentListItemProps = props;
  if (!document) {
    return null;
  }
  const apiPath = DocumentService.isQuickStartGuide(document)
    ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}/${document.name}`
    : `${NeonEnvironment.getFullApiPath('documents')}/${document.name}`;
  let documentType: DocumentTypeListItemDef = DocumentService.getDefaultDocumentTypeListItemDef();
  if (typeof document.type === 'string') {
    const matchKey = DocumentService.getDocumentTypeListItemDefKeys()
      .find((key) => DocumentService.getDocumentTypeListItemDefs()[key].match(document.type));
    if (matchKey) {
      documentType = DocumentService.getDocumentTypeListItemDefs()[matchKey];
    }
  }
  const { title: typeTitle, Icon: TypeIcon }: DocumentTypeListItemDef = documentType;
  const typeTitleString = typeTitle(document.type);
  const primary = isStringNonEmpty(document.description)
    ? document.description
    : <i>No description</i>;
  const spacer = <span className={classes.listItemSecondarySpacer}>|</span>;
  const typeAndSize = (
    <>
      <span title={`file type: ${typeTitleString}`}>{typeTitleString}</span>
      {!document.size ? null : (
        <>
          {spacer}
          <span title={`file size: ${DocumentService.formatBytes(document.size)}`}>
            {DocumentService.formatBytes(document.size)}
          </span>
        </>
      )}
    </>
  );
  const fileNumber = (
    <span title={`file number: ${document.name}`}>{document.name}</span>
  );
  const secondary = atXs ? (
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
      <ListItemText primary={primary} secondary={secondary} />
      {!makeDownloadableLink ? <></> : (
        <ListItemSecondaryAction>
          <Button
            variant="outlined"
            onClick={(): void => { window.location.href = apiPath; }}
          >
            Download
          </Button>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default DocumentListItem;
