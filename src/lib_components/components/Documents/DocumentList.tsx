import React from 'react';

import List from '@mui/material/List';
import { makeStyles } from 'tss-react/mui';
import { Theme as MuiTheme } from '@mui/material';

import DocumentListItem, { DocumentListItemModel } from './DocumentListItem';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';

import { existsNonEmpty } from '../../util/typeUtil';
import { Nullable } from '../../types/core';

const useStyles = makeStyles()((muiTheme: MuiTheme) => ({
  list: {
    paddingTop: muiTheme.spacing(0),
  },
}));

export interface DocumentListProps {
  documents: DocumentListItemModel[];
  makeDownloadableLink: Nullable<boolean>;
  enableDownloadButton: Nullable<boolean>;
  fetchVariants: Nullable<boolean>;
  enableVariantChips: Nullable<boolean>;
}

const DocumentList: React.FC<DocumentListProps> = (props: DocumentListProps): React.JSX.Element => {
  const { classes } = useStyles();
  const {
    documents,
    makeDownloadableLink,
    enableDownloadButton,
    fetchVariants,
    enableVariantChips,
  }: DocumentListProps = props;
  if (!existsNonEmpty(documents)) {
    return (
      <div>
        <WarningCard
          title="No Documents"
          message="No documents available to display"
        />
      </div>
    );
  }
  const renderDocuments = (): React.JSX.Element[] => (
    documents.map((document: DocumentListItemModel, index: number): React.JSX.Element => ((
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
