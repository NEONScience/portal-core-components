import React from 'react';
import { NeonDocument } from '../../types/neonApi';
export interface DocumentSelectProps {
    documents: NeonDocument[];
}
declare const DocumentSelect: React.FC<DocumentSelectProps>;
export default DocumentSelect;
