export interface IDrupalAssetService {
    /**
     * Cleans the CSS of relative URLs and converts where appropriate
     * @param content The content to scrub
     * @param replaceRelativeUrlsWithRoot Option to replace relative URLs with full
     * @returns The scrubbed content
     */
    cleanCss: (content: string, replaceRelativeUrlsWithRoot?: boolean) => string;
}
declare const DrupalAssetService: IDrupalAssetService;
export default DrupalAssetService;
