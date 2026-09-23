import NeonEnvironment from '../components/NeonEnvironment';
import { exists, isStringNonEmpty } from '../util/typeUtil';

export interface IDrupalAssetService {
  /**
   * Cleans the CSS of relative URLs and converts where appropriate
   * @param content The content to scrub
   * @param replaceRelativeUrlsWithRoot Option to replace relative URLs with full
   * @returns The scrubbed content
   */
  cleanCss: (content: string, replaceRelativeUrlsWithRoot?: boolean) => string;
}

const DrupalAssetService: IDrupalAssetService = {
  cleanCss: (content: string, replaceRelativeUrlsWithRoot = false): string => {
    let scrubbedContent = content;
    if (!isStringNonEmpty(scrubbedContent)) {
      return scrubbedContent;
    }
    // eslint-disable-next-line max-len, @stylistic/max-len
    const matches: RegExpMatchArray|null = scrubbedContent.match(/^(.*url\(["']((?!data|https)).*)$/mg);
    if (!exists(matches)) {
      return scrubbedContent;
    }
    (matches as RegExpMatchArray).forEach((match: string): void => {
      let shouldCommentMatch = true;
      if (replaceRelativeUrlsWithRoot) {
        // eslint-disable-next-line max-len, @stylistic/max-len
        const relativeUrlRegex = /(?<relative>url\(["'](?<relativePathSegments>\.\.\/\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/|\.\.\/)(?<path>images\/.+)["']\))/;
        const matchesRelative: RegExpExecArray|null = relativeUrlRegex.exec(match);
        if (exists(matchesRelative)
          && ((matchesRelative as RegExpExecArray).length > 0)
          && (exists((matchesRelative as RegExpExecArray).groups))
          && (isStringNonEmpty((matchesRelative as RegExpExecArray).groups?.relative))
          && (isStringNonEmpty((matchesRelative as RegExpExecArray).groups?.path))
        ) {
          const replaceRelative = (matchesRelative as RegExpExecArray).groups?.relative as string;
          const replaceRelativePath = (matchesRelative as RegExpExecArray).groups?.path as string;
          const replacePath = `${NeonEnvironment.getWebHost()}`
            + '/themes/custom/neon/'
            + `${replaceRelativePath}`;
          const replaceWith = `url("${replacePath}")`;
          scrubbedContent = scrubbedContent.replace(replaceRelative, replaceWith);
          shouldCommentMatch = false;
        }
      }
      if (shouldCommentMatch) {
        const replacement = match.endsWith('}')
          ? `/* ${match.slice(0, -1)} */ }`
          : `/* ${match} */`;
        scrubbedContent = scrubbedContent.replace(match, replacement);
      }
    });
    return scrubbedContent;
  },
};

export default DrupalAssetService;
