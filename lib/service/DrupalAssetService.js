import NeonEnvironment from '../components/NeonEnvironment';
import { exists, isStringNonEmpty } from '../util/typeUtil';
const DrupalAssetService = {
    cleanCss: (content, replaceRelativeUrlsWithRoot = false)=>{
        let scrubbedContent = content;
        if (!isStringNonEmpty(scrubbedContent)) {
            return scrubbedContent;
        }
        const matches = scrubbedContent.match(/^(.*url\(["']((?!data|https)).*)$/mg);
        if (!exists(matches)) {
            return scrubbedContent;
        }
        matches.forEach((match)=>{
            let shouldCommentMatch = true;
            if (replaceRelativeUrlsWithRoot) {
                const relativeUrlRegex = /(?<relative>url\(["'](?<relativePathSegments>\.\.\/\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/|\.\.\/)(?<path>images\/.+)["']\))/;
                const matchesRelative = relativeUrlRegex.exec(match);
                if (exists(matchesRelative) && matchesRelative.length > 0 && exists(matchesRelative.groups) && isStringNonEmpty(matchesRelative.groups?.relative) && isStringNonEmpty(matchesRelative.groups?.path)) {
                    const replaceRelative = matchesRelative.groups?.relative;
                    const replaceRelativePath = matchesRelative.groups?.path;
                    const replaceWith = `url("${NeonEnvironment.getWebHost()}/themes/custom/neon/${replaceRelativePath}")`;
                    scrubbedContent = scrubbedContent.replace(replaceRelative, replaceWith);
                    shouldCommentMatch = false;
                }
            }
            if (shouldCommentMatch) {
                const replacement = match.endsWith('}') ? `/* ${match.slice(0, -1)} */ }` : `/* ${match} */`;
                scrubbedContent = scrubbedContent.replace(match, replacement);
            }
        });
        return scrubbedContent;
    }
};
export default DrupalAssetService;
