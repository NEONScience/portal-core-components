import React, { useState } from 'react';

import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import DocumentListItem from './DocumentListItem';
import DocumentService from '../../service/DocumentService';
import DocumentViewer from './DocumentViewer';
import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { Nullable } from '../../types/core';
import { NeonDocument } from '../../types/neonApi';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';

const useStyles = makeStyles()((muiTheme: NeonTheme) => ({
  container: {
    width: '100%',
  },
  selectContainer: {
    width: '100%',
    padding: muiTheme.spacing(3, 0),
  },
  selectFormControl: {
    width: '100%',
  },
}));

export interface DocumentSelectProps {
  documents: NeonDocument[];
}

const DocumentSelect: React.FC<DocumentSelectProps> = (
  props: DocumentSelectProps,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { documents }: DocumentSelectProps = props;

  const hasDocuments: boolean = existsNonEmpty(documents);
  let initialValue: string = '';
  if (hasDocuments) {
    initialValue = documents[0].name;
  }
  const [
    selectedDoc,
    setSelectedDoc,
  ]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>(initialValue);

  if (!hasDocuments) {
    return (
      <div className={classes.container}>
        <WarningCard
          title="No Documents"
          message="No documents available to display"
        />
      </div>
    );
  }

  const renderSelectedDocument = (): React.JSX.Element => {
    const matchedDoc: Nullable<NeonDocument> = documents.find((doc: NeonDocument): boolean => (
      exists(doc)
        && isStringNonEmpty(doc.name)
        && (doc.name.localeCompare(selectedDoc) === 0)
    ));
    if (!exists(matchedDoc)) {
      return (
        <WarningCard
          title="Document Not Found"
          message="Document could not be found"
        />
      );
    }
    const coercedMatchedDoc: NeonDocument = (matchedDoc as NeonDocument);
    const fullUrlPath = DocumentService.isQuickStartGuide(coercedMatchedDoc)
      ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}`
      : `${NeonEnvironment.getFullApiPath('documents')}`;
    return (
      <DocumentViewer document={coercedMatchedDoc} width={600} fullUrlPath={fullUrlPath} />
    );
  };

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormControl variant="outlined" className={classes.selectFormControl}>
            <InputLabel htmlFor="document-select-input">
              Select Document to View
            </InputLabel>
            <Select
              fullWidth
              id="document-select"
              inputProps={{
                name: 'Select Document to View',
                id: 'document-select-input',
              }}
              label="Select Document to View"
              aria-labelledby="document-select-label"
              value={selectedDoc}
              onChange={(event: SelectChangeEvent<string>, child: React.ReactNode): void => {
                const nextDoc: Nullable<NeonDocument> = documents.find(
                  (doc: NeonDocument): boolean => (
                    doc.name.localeCompare((event.target.value as string)) === 0
                  ),
                );
                if (exists(nextDoc)) {
                  setSelectedDoc((nextDoc as NeonDocument).name);
                }
              }}
            >
              {documents.map((doc: NeonDocument, index: number): React.JSX.Element => ((
                <MenuItem key={doc.name} value={doc.name}>
                  <DocumentListItem
                    id={index}
                    document={doc}
                    makeDownloadableLink={false}
                  />
                </MenuItem>
              )))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          {renderSelectedDocument()}
        </Grid>
      </Grid>
    </div>
  );
};

const WrappedDocumentSelect = (Theme as any).getWrappedComponent(DocumentSelect);

export default WrappedDocumentSelect;
