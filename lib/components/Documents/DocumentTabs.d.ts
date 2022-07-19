import React from 'react';
import { NeonDocument } from '../../types/neonApi';
export interface DocumentTabsProps {
    documents: NeonDocument[];
}
declare const DocumentTabs: React.FC<DocumentTabsProps>;
export default DocumentTabs;
