import { exists, resolveAny } from '../util/typeUtil';
const DocumentParser = {
    parseQuickStartGuideVersionResponse: (response)=>{
        if (!exists(response)) {
            return null;
        }
        const data = resolveAny(response, 'data');
        if (!exists(data)) {
            return null;
        }
        return {
            name: data.name,
            version: data.version,
            publishedDate: data.publishedDate,
            documents: DocumentParser.parseQuickStartGuideDocuments(data.documents)
        };
    },
    parseQuickStartGuideDocuments: (documents)=>{
        if (!Array.isArray(documents)) {
            return [];
        }
        return documents.map((document)=>DocumentParser.parseQuickStartGuideDocument(document));
    },
    parseQuickStartGuideDocument: (document)=>({
            name: document.name,
            description: document.description,
            type: document.type,
            size: document.size,
            md5: document.md5,
            generationDate: document.generationDate,
            url: document.url
        })
};
Object.freeze(DocumentParser);
export default DocumentParser;
