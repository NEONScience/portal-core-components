import { NeonDocument } from '../../types/neonApi';

export interface DocumentListItemModel extends NeonDocument {
  variants: NeonDocument[];
}
