"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PROVISIONAL_RELEASE = exports.LATEST_AND_PROVISIONAL = void 0;
var _NeonContextService = _interopRequireDefault(require("./NeonContextService"));
var _typeUtil = require("../util/typeUtil");
var _internal = require("../types/internal");
var _neonApi = require("../types/neonApi");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LATEST_AND_PROVISIONAL = exports.LATEST_AND_PROVISIONAL = 'LATEST_AND_PROVISIONAL';
const PROVISIONAL_RELEASE = exports.PROVISIONAL_RELEASE = 'provisional';
const ReleaseService = {
  // eslint-disable-next-line prefer-regex-literals
  getProvReleaseRegex: () => new RegExp(/^[A-Z]+$/),
  isLatestNonProv: releaseTag => {
    const matches = ReleaseService.getProvReleaseRegex().exec(releaseTag);
    return (0, _typeUtil.exists)(matches) && matches.length > 0;
  },
  isNonRelease: releaseTag => {
    // eslint-disable-next-line prefer-regex-literals
    const regexLatestProv = new RegExp("^".concat(LATEST_AND_PROVISIONAL, "$"), 'i');
    // eslint-disable-next-line prefer-regex-literals
    const regexProv = new RegExp("^".concat(PROVISIONAL_RELEASE, "$"), 'i');
    const matchesLatestProv = regexLatestProv.exec(releaseTag);
    const matchesProv = regexProv.exec(releaseTag);
    const isLatestProv = (0, _typeUtil.exists)(matchesLatestProv) && matchesLatestProv.length > 0;
    const isProv = (0, _typeUtil.exists)(matchesProv) && matchesProv.length > 0;
    return isLatestProv || isProv;
  },
  isProv: releaseTag => {
    if (!(0, _typeUtil.isStringNonEmpty)(releaseTag)) {
      return true;
    }
    // eslint-disable-next-line prefer-regex-literals
    const regexProv = new RegExp("^".concat(PROVISIONAL_RELEASE, "$"), 'i');
    const matchesProv = regexProv.exec(releaseTag);
    return (0, _typeUtil.exists)(matchesProv) && matchesProv.length > 0;
  },
  isInternalReleaseLike: release => {
    let isLike = true;
    for (const p in _internal.ReleaseProps) {
      if (Object.prototype.hasOwnProperty.call(_internal.ReleaseProps, p)) {
        if (!(p in release)) {
          isLike = false;
          break;
        }
      }
    }
    return isLike;
  },
  sortReleases: unsortedReleases => {
    const releases = [...unsortedReleases];
    if ((0, _typeUtil.existsNonEmpty)(releases) && releases.length > 1) {
      releases.sort((a, b) => a.generationDate < b.generationDate ? 1 : -1);
    }
    return releases;
  },
  getMostRecentReleaseTag: releases => {
    if (!(0, _typeUtil.existsNonEmpty)(releases)) {
      return null;
    }
    const sorted = ReleaseService.sortReleases(releases).filter(releaseLike => !ReleaseService.isLatestNonProv(releaseLike.release) && !(LATEST_AND_PROVISIONAL.localeCompare(releaseLike.release) === 0) && !(PROVISIONAL_RELEASE.localeCompare(releaseLike.release) === 0));
    if (!(0, _typeUtil.existsNonEmpty)(sorted)) {
      return null;
    }
    return sorted[0].release;
  },
  applyUserReleases: (neonContextState, currentReleases) => {
    const userReleases = _NeonContextService.default.getContextUserReleases(neonContextState);
    if (!Array.isArray(currentReleases) || !Array.isArray(userReleases)) {
      return [];
    }
    const combinedReleases = [];
    currentReleases.forEach(release => {
      let r;
      // Ensure we don't override any current releases that have been
      // initialized as internal release representations.
      if (ReleaseService.isInternalReleaseLike(release)) {
        r = _extends({}, release, {
          release: release.release,
          generationDate: (0, _typeUtil.exists)(release.generationDate) ? new Date(release.generationDate).toISOString() : new Date().toISOString()
        });
      } else {
        r = _extends({}, release, {
          release: release.release,
          description: release.release,
          generationDate: (0, _typeUtil.exists)(release.generationDate) ? new Date(release.generationDate).toISOString() : new Date().toISOString(),
          showCitation: true,
          showDoi: true,
          showViz: true
        });
      }
      combinedReleases.push(r);
    });
    userReleases.forEach(userRelease => {
      const hasRelease = currentReleases.some(value => (0, _typeUtil.exists)(value) && (0, _typeUtil.isStringNonEmpty)(value.release) && (0, _typeUtil.isStringNonEmpty)(userRelease.releaseTag) && value.release.localeCompare(userRelease.releaseTag) === 0);
      if (!hasRelease) {
        const r = _extends({}, userRelease, {
          release: userRelease.releaseTag,
          description: userRelease.description,
          generationDate: (0, _typeUtil.exists)(userRelease.generationDate) ? new Date(userRelease.generationDate).toISOString() : new Date().toISOString(),
          showCitation: false,
          showDoi: false,
          showViz: true
        });
        combinedReleases.push(r);
      }
    });
    return combinedReleases;
  },
  transformDoiStatusRelease: doiStatus => {
    if (!(0, _typeUtil.exists)(doiStatus)) {
      return null;
    }
    const appliedDoiStatus = doiStatus;
    const transformed = {
      url: '',
      productDoi: {
        url: appliedDoiStatus.url,
        generationDate: appliedDoiStatus.generationDate
      },
      release: appliedDoiStatus.release,
      generationDate: appliedDoiStatus.releaseGenerationDate,
      description: appliedDoiStatus.release,
      showCitation: true,
      showDoi: true,
      showViz: (0, _typeUtil.exists)(appliedDoiStatus.status) && appliedDoiStatus.status === _neonApi.DoiStatusType.FINDABLE
    };
    return transformed;
  },
  determineDelineateAvaRelease: releaseTag => !(0, _typeUtil.isStringNonEmpty)(releaseTag) || releaseTag === LATEST_AND_PROVISIONAL || ReleaseService.isLatestNonProv(releaseTag)
};
var _default = exports.default = ReleaseService;