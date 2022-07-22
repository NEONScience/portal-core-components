import React from 'react';

import List from '@material-ui/core/List';
import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import DocumentListItem from './DocumentListItem';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';

import { StylesHook } from '../../types/muiTypes';
import { existsNonEmpty } from '../../util/typeUtil';
import { DocumentListItemModel } from './documentTypes';
import { Nullable } from '../../types/core';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    list: {
      paddingTop: muiTheme.spacing(0),
    },
  })) as StylesHook;

export interface DocumentListProps {
  documents: DocumentListItemModel[];
  makeDownloadableLink: Nullable<boolean>;
  enableDownloadButton: Nullable<boolean>;
  fetchVariants: Nullable<boolean>;
  enableVariantChips: Nullable<boolean>;
}

const DocumentList: React.FC<DocumentListProps> = (props: DocumentListProps): JSX.Element => {
  const classes = useStyles(Theme);
  const {
    documents,
    makeDownloadableLink,
    enableDownloadButton,
    fetchVariants,
    enableVariantChips,
  }: DocumentListProps = props;
  if (!existsNonEmpty(documents)) {
    return (
      <div className={classes.container}>
        <WarningCard
          title="No Documents"
          message="No documents available to display"
        />
      </div>
    );
  }
  const renderDocuments = (): JSX.Element[] => (
    documents.map((document: DocumentListItemModel, index: number): JSX.Element => ((
      <DocumentListItem
        key={document.name}
        id={index}
        document={document}
        makeDownloadableLink={makeDownloadableLink === true}
        enableDownloadButton={enableDownloadButton}
        fetchVariants={fetchVariants}
        enableVariantChips={enableVariantChips}
      />
    )))
  );
  return (
    <div>
      <List dense className={classes.list}>
        {renderDocuments()}
      </List>
    </div>
  );
};

const WrappedDocumentList = (Theme as any).getWrappedComponent(DocumentList);

export default WrappedDocumentList;
