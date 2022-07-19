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
import { NeonDocument } from '../../types/neonApi';
import { existsNonEmpty } from '../../util/typeUtil';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    list: {
      paddingTop: muiTheme.spacing(0),
    },
  })) as StylesHook;

export interface DocumentListProps {
  documents: NeonDocument[];
}

const DocumentList: React.FC<DocumentListProps> = (props: DocumentListProps): JSX.Element => {
  const classes = useStyles(Theme);
  const { documents }: DocumentListProps = props;
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
    documents.map((document: NeonDocument, index: number): JSX.Element => ((
      <DocumentListItem
        key={document.name}
        makeDownloadableLink
        id={index}
        document={document}
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

export default DocumentList;
