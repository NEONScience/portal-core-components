"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PROVISIONAL_RELEASE = exports.LATEST_AND_PROVISIONAL = void 0;

var _NeonContextService = _interopRequireDefault(require("./NeonContextService"));

var _typeUtil = require("../util/typeUtil");

var _internal = require("../types/internal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var LATEST_AND_PROVISIONAL = 'LATEST_AND_PROVISIONAL';
exports.LATEST_AND_PROVISIONAL = LATEST_AND_PROVISIONAL;
var PROVISIONAL_RELEASE = 'provisional';
exports.PROVISIONAL_RELEASE = PROVISIONAL_RELEASE;
var ReleaseService = {
  // eslint-disable-next-line prefer-regex-literals
  getProvReleaseRegex: function getProvReleaseRegex() {
    return new RegExp(/^[A-Z]+$/);
  },
  isLatestNonProv: function isLatestNonProv(releaseTag) {
    var matches = ReleaseService.getProvReleaseRegex().exec(releaseTag);
    return (0, _typeUtil.exists)(matches) && matches.length > 0;
  },
  isInternalReleaseLike: function isInternalReleaseLike(release) {
    var isLike = true;

    for (var p in _internal.ReleaseProps) {
      if (Object.prototype.hasOwnProperty.call(_internal.ReleaseProps, p)) {
        if (!(p in release)) {
          isLike = false;
          break;
        }
      }
    }

    return isLike;
  },
  sortReleases: function sortReleases(unsortedReleases) {
    var releases = _toConsumableArray(unsortedReleases);

    if ((0, _typeUtil.existsNonEmpty)(releases) && releases.length > 1) {
      releases.sort(function (a, b) {
        return a.generationDate < b.generationDate ? 1 : -1;
      });
    }

    return releases;
  },
  getMostRecentReleaseTag: function getMostRecentReleaseTag(releases) {
    if (!(0, _typeUtil.existsNonEmpty)(releases)) {
      return null;
    }

    var sorted = ReleaseService.sortReleases(releases).filter(function (releaseLike) {
      return !ReleaseService.isLatestNonProv(releaseLike.release) && !(LATEST_AND_PROVISIONAL.localeCompare(releaseLike.release) === 0) && !(PROVISIONAL_RELEASE.localeCompare(releaseLike.release) === 0);
    });

    if (!(0, _typeUtil.existsNonEmpty)(sorted)) {
      return null;
    }

    return sorted[0].release;
  },
  applyUserReleases: function applyUserReleases(neonContextState, currentReleases) {
    var userReleases = _NeonContextService.default.getContextUserReleases(neonContextState);

    if (!Array.isArray(currentReleases) || !Array.isArray(userReleases)) {
      return [];
    }

    var combinedReleases = [];
    currentReleases.forEach(function (release) {
      var r; // Ensure we don't override any current releases that have been
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
    userReleases.forEach(function (userRelease) {
      var hasRelease = currentReleases.some(function (value) {
        return (0, _typeUtil.exists)(value) && (0, _typeUtil.isStringNonEmpty)(value.release) && (0, _typeUtil.isStringNonEmpty)(userRelease.releaseTag) && value.release.localeCompare(userRelease.releaseTag) === 0;
      });

      if (!hasRelease) {
        var r = _extends({}, userRelease, {
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
  }
};
var _default = ReleaseService;
exports.default = _default;