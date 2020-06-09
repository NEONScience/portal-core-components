"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SiteMapUtils = require("./SiteMapUtils");

var _deferredJSON;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var deferredJSON = (_deferredJSON = {}, _defineProperty(_deferredJSON, _SiteMapUtils.FEATURES.TOWER_AIRSHEDS.KEY, {
  ABBY: function ABBY() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/ABBY.json'));
    });
  },
  BARR: function BARR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/BARR.json'));
    });
  },
  BART: function BART() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/BART.json'));
    });
  },
  BLAN: function BLAN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/BLAN.json'));
    });
  },
  BONA: function BONA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/BONA.json'));
    });
  },
  CLBJ: function CLBJ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/CLBJ.json'));
    });
  },
  CPER: function CPER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/CPER.json'));
    });
  },
  DCFS: function DCFS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/DCFS.json'));
    });
  },
  DEJU: function DEJU() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/DEJU.json'));
    });
  },
  DELA: function DELA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/DELA.json'));
    });
  },
  DSNY: function DSNY() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/DSNY.json'));
    });
  },
  GRSM: function GRSM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/GRSM.json'));
    });
  },
  GUAN: function GUAN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/GUAN.json'));
    });
  },
  HARV: function HARV() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/HARV.json'));
    });
  },
  HEAL: function HEAL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/HEAL.json'));
    });
  },
  JERC: function JERC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/JERC.json'));
    });
  },
  JORN: function JORN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/JORN.json'));
    });
  },
  KONA: function KONA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/KONA.json'));
    });
  },
  KONZ: function KONZ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/KONZ.json'));
    });
  },
  LAJA: function LAJA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/LAJA.json'));
    });
  },
  LENO: function LENO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/LENO.json'));
    });
  },
  MLBS: function MLBS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/MLBS.json'));
    });
  },
  MOAB: function MOAB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/MOAB.json'));
    });
  },
  NIWO: function NIWO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/NIWO.json'));
    });
  },
  NOGP: function NOGP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/NOGP.json'));
    });
  },
  OAES: function OAES() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/OAES.json'));
    });
  },
  ONAQ: function ONAQ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/ONAQ.json'));
    });
  },
  ORNL: function ORNL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/ORNL.json'));
    });
  },
  OSBS: function OSBS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/OSBS.json'));
    });
  },
  PUUM: function PUUM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/PUUM.json'));
    });
  },
  RMNP: function RMNP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/RMNP.json'));
    });
  },
  SCBI: function SCBI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/SCBI.json'));
    });
  },
  SERC: function SERC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/SERC.json'));
    });
  },
  SJER: function SJER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/SJER.json'));
    });
  },
  SOAP: function SOAP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/SOAP.json'));
    });
  },
  SRER: function SRER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/SRER.json'));
    });
  },
  STEI: function STEI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/STEI.json'));
    });
  },
  STER: function STER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/STER.json'));
    });
  },
  TALL: function TALL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/TALL.json'));
    });
  },
  TEAK: function TEAK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/TEAK.json'));
    });
  },
  TOOL: function TOOL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/TOOL.json'));
    });
  },
  TREE: function TREE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/TREE.json'));
    });
  },
  UKFS: function UKFS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/UKFS.json'));
    });
  },
  UNDE: function UNDE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/UNDE.json'));
    });
  },
  WOOD: function WOOD() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/WOOD.json'));
    });
  },
  WREF: function WREF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/WREF.json'));
    });
  },
  YELL: function YELL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/TOWER_AIRSHEDS/YELL.json'));
    });
  }
}), _defineProperty(_deferredJSON, _SiteMapUtils.FEATURES.AQUATIC_REACHES.KEY, {
  ARIK: function ARIK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/ARIK.json'));
    });
  },
  BIGC: function BIGC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/BIGC.json'));
    });
  },
  BLDE: function BLDE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/BLDE.json'));
    });
  },
  BLUE: function BLUE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/BLUE.json'));
    });
  },
  BLWA: function BLWA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/BLWA.json'));
    });
  },
  CARI: function CARI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/CARI.json'));
    });
  },
  COMO: function COMO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/COMO.json'));
    });
  },
  CUPE: function CUPE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/CUPE.json'));
    });
  },
  FLNT: function FLNT() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/FLNT.json'));
    });
  },
  GUIL: function GUIL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/GUIL.json'));
    });
  },
  HOPB: function HOPB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/HOPB.json'));
    });
  },
  KING: function KING() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/KING.json'));
    });
  },
  LECO: function LECO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/LECO.json'));
    });
  },
  LEWI: function LEWI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/LEWI.json'));
    });
  },
  OKSR: function OKSR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/OKSR.json'));
    });
  },
  POSE: function POSE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/POSE.json'));
    });
  },
  PRIN: function PRIN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/PRIN.json'));
    });
  },
  MART: function MART() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/MART.json'));
    });
  },
  MAYF: function MAYF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/MAYF.json'));
    });
  },
  MCDI: function MCDI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/MCDI.json'));
    });
  },
  MCRA: function MCRA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/MCRA.json'));
    });
  },
  REDB: function REDB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/REDB.json'));
    });
  },
  SYCA: function SYCA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/SYCA.json'));
    });
  },
  TECR: function TECR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/TECR.json'));
    });
  },
  TOMB: function TOMB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/TOMB.json'));
    });
  },
  WALK: function WALK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/WALK.json'));
    });
  },
  WLOU: function WLOU() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/AQUATIC_REACHES/WLOU.json'));
    });
  }
}), _defineProperty(_deferredJSON, _SiteMapUtils.FEATURES.FLIGHT_BOX_BOUNDARIES.KEY, {
  ABBY: function ABBY() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/ABBY.json'));
    });
  },
  ARIK: function ARIK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/ARIK.json'));
    });
  },
  BARC: function BARC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BARC.json'));
    });
  },
  BARR: function BARR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BARR.json'));
    });
  },
  BART: function BART() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BART.json'));
    });
  },
  BIGC: function BIGC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BIGC.json'));
    });
  },
  BLAN: function BLAN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BLAN.json'));
    });
  },
  BLDE: function BLDE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BLDE.json'));
    });
  },
  BLUE: function BLUE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BLUE.json'));
    });
  },
  BLWA: function BLWA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BLWA.json'));
    });
  },
  BONA: function BONA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/BONA.json'));
    });
  },
  CARI: function CARI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/CARI.json'));
    });
  },
  CLBJ: function CLBJ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/CLBJ.json'));
    });
  },
  COMO: function COMO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/COMO.json'));
    });
  },
  CPER: function CPER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/CPER.json'));
    });
  },
  CRAM: function CRAM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/CRAM.json'));
    });
  },
  CUPE: function CUPE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/CUPE.json'));
    });
  },
  DCFS: function DCFS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/DCFS.json'));
    });
  },
  DEJU: function DEJU() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/DEJU.json'));
    });
  },
  DELA: function DELA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/DELA.json'));
    });
  },
  DSNY: function DSNY() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/DSNY.json'));
    });
  },
  FLNT: function FLNT() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/FLNT.json'));
    });
  },
  GRSM: function GRSM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/GRSM.json'));
    });
  },
  GUAN: function GUAN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/GUAN.json'));
    });
  },
  GUIL: function GUIL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/GUIL.json'));
    });
  },
  HARV: function HARV() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/HARV.json'));
    });
  },
  HEAL: function HEAL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/HEAL.json'));
    });
  },
  HOPB: function HOPB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/HOPB.json'));
    });
  },
  JERC: function JERC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/JERC.json'));
    });
  },
  JORN: function JORN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/JORN.json'));
    });
  },
  KING: function KING() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/KING.json'));
    });
  },
  KONA: function KONA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/KONA.json'));
    });
  },
  KONZ: function KONZ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/KONZ.json'));
    });
  },
  LAJA: function LAJA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/LAJA.json'));
    });
  },
  LECO: function LECO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/LECO.json'));
    });
  },
  LENO: function LENO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/LENO.json'));
    });
  },
  LEWI: function LEWI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/LEWI.json'));
    });
  },
  LIRO: function LIRO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/LIRO.json'));
    });
  },
  MART: function MART() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/MART.json'));
    });
  },
  MAYF: function MAYF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/MAYF.json'));
    });
  },
  MCDI: function MCDI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/MCDI.json'));
    });
  },
  MCRA: function MCRA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/MCRA.json'));
    });
  },
  MLBS: function MLBS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/MLBS.json'));
    });
  },
  MOAB: function MOAB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/MOAB.json'));
    });
  },
  NIWO: function NIWO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/NIWO.json'));
    });
  },
  NOGP: function NOGP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/NOGP.json'));
    });
  },
  OAES: function OAES() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/OAES.json'));
    });
  },
  OKSR: function OKSR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/OKSR.json'));
    });
  },
  ONAQ: function ONAQ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/ONAQ.json'));
    });
  },
  ORNL: function ORNL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/ORNL.json'));
    });
  },
  OSBS: function OSBS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/OSBS.json'));
    });
  },
  POSE: function POSE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/POSE.json'));
    });
  },
  PRIN: function PRIN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/PRIN.json'));
    });
  },
  PRLA: function PRLA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/PRLA.json'));
    });
  },
  PROP: function PROP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/PROP.json'));
    });
  },
  REDB: function REDB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/REDB.json'));
    });
  },
  RMNP: function RMNP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/RMNP.json'));
    });
  },
  SCBI: function SCBI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/SCBI.json'));
    });
  },
  SERC: function SERC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/SERC.json'));
    });
  },
  SJER: function SJER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/SJER.json'));
    });
  },
  SOAP: function SOAP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/SOAP.json'));
    });
  },
  SRER: function SRER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/SRER.json'));
    });
  },
  STEI: function STEI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/STEI.json'));
    });
  },
  STER: function STER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/STER.json'));
    });
  },
  SUGG: function SUGG() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/SUGG.json'));
    });
  },
  SYCA: function SYCA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/SYCA.json'));
    });
  },
  TALL: function TALL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/TALL.json'));
    });
  },
  TEAK: function TEAK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/TEAK.json'));
    });
  },
  TECR: function TECR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/TECR.json'));
    });
  },
  TOMB: function TOMB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/TOMB.json'));
    });
  },
  TOOK: function TOOK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/TOOK.json'));
    });
  },
  TOOL: function TOOL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/TOOL.json'));
    });
  },
  TREE: function TREE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/TREE.json'));
    });
  },
  UKFS: function UKFS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/UKFS.json'));
    });
  },
  UNDE: function UNDE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/UNDE.json'));
    });
  },
  WALK: function WALK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/WALK.json'));
    });
  },
  WLOU: function WLOU() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/WLOU.json'));
    });
  },
  WOOD: function WOOD() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/WOOD.json'));
    });
  },
  WREF: function WREF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/WREF.json'));
    });
  },
  YELL: function YELL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/FLIGHT_BOX_BOUNDARIES/YELL.json'));
    });
  }
}), _defineProperty(_deferredJSON, _SiteMapUtils.FEATURES.SAMPLING_BOUNDARIES.KEY, {
  ABBY: function ABBY() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/ABBY.json'));
    });
  },
  BARR: function BARR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/BARR.json'));
    });
  },
  BART: function BART() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/BART.json'));
    });
  },
  BLAN: function BLAN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/BLAN.json'));
    });
  },
  BONA: function BONA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/BONA.json'));
    });
  },
  CLBJ: function CLBJ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/CLBJ.json'));
    });
  },
  CPER: function CPER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/CPER.json'));
    });
  },
  DCFS: function DCFS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/DCFS.json'));
    });
  },
  DEJU: function DEJU() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/DEJU.json'));
    });
  },
  DELA: function DELA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/DELA.json'));
    });
  },
  DSNY: function DSNY() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/DSNY.json'));
    });
  },
  GRSM: function GRSM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/GRSM.json'));
    });
  },
  GUAN: function GUAN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/GUAN.json'));
    });
  },
  HARV: function HARV() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/HARV.json'));
    });
  },
  HEAL: function HEAL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/HEAL.json'));
    });
  },
  JERC: function JERC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/JERC.json'));
    });
  },
  JORN: function JORN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/JORN.json'));
    });
  },
  KONA: function KONA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/KONA.json'));
    });
  },
  KONZ: function KONZ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/KONZ.json'));
    });
  },
  LAJA: function LAJA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/LAJA.json'));
    });
  },
  LENO: function LENO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/LENO.json'));
    });
  },
  MLBS: function MLBS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/MLBS.json'));
    });
  },
  MOAB: function MOAB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/MOAB.json'));
    });
  },
  NIWO: function NIWO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/NIWO.json'));
    });
  },
  NOGP: function NOGP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/NOGP.json'));
    });
  },
  OAES: function OAES() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/OAES.json'));
    });
  },
  ONAQ: function ONAQ() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/ONAQ.json'));
    });
  },
  ORNL: function ORNL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/ORNL.json'));
    });
  },
  OSBS: function OSBS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/OSBS.json'));
    });
  },
  PUUM: function PUUM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/PUUM.json'));
    });
  },
  RMNP: function RMNP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/RMNP.json'));
    });
  },
  SCBI: function SCBI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/SCBI.json'));
    });
  },
  SERC: function SERC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/SERC.json'));
    });
  },
  SJER: function SJER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/SJER.json'));
    });
  },
  SOAP: function SOAP() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/SOAP.json'));
    });
  },
  SRER: function SRER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/SRER.json'));
    });
  },
  STEI: function STEI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/STEI.json'));
    });
  },
  STER: function STER() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/STER.json'));
    });
  },
  TALL: function TALL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/TALL.json'));
    });
  },
  TEAK: function TEAK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/TEAK.json'));
    });
  },
  TOOL: function TOOL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/TOOL.json'));
    });
  },
  TREE: function TREE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/TREE.json'));
    });
  },
  UKFS: function UKFS() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/UKFS.json'));
    });
  },
  UNDE: function UNDE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/UNDE.json'));
    });
  },
  WOOD: function WOOD() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/WOOD.json'));
    });
  },
  WREF: function WREF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/WREF.json'));
    });
  },
  YELL: function YELL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/SAMPLING_BOUNDARIES/YELL.json'));
    });
  }
}), _defineProperty(_deferredJSON, _SiteMapUtils.FEATURES.WATERSHED_BOUNDARIES.KEY, {
  ARIK: function ARIK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/ARIK.json'));
    });
  },
  BARC: function BARC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/BARC.json'));
    });
  },
  BIGC: function BIGC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/BIGC.json'));
    });
  },
  BLDE: function BLDE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/BLDE.json'));
    });
  },
  BLUE: function BLUE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/BLUE.json'));
    });
  },
  BLWA: function BLWA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/BLWA.json'));
    });
  },
  CARI: function CARI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/CARI.json'));
    });
  },
  COMO: function COMO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/COMO.json'));
    });
  },
  CRAM: function CRAM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/CRAM.json'));
    });
  },
  CUPE: function CUPE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/CUPE.json'));
    });
  },
  FLNT: function FLNT() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/FLNT.json'));
    });
  },
  GUIL: function GUIL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/GUIL.json'));
    });
  },
  HOPB: function HOPB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/HOPB.json'));
    });
  },
  KING: function KING() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/KING.json'));
    });
  },
  LECO: function LECO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/LECO.json'));
    });
  },
  LEWI: function LEWI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/LEWI.json'));
    });
  },
  LIRO: function LIRO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/LIRO.json'));
    });
  },
  MART: function MART() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/MART.json'));
    });
  },
  MAYF: function MAYF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/MAYF.json'));
    });
  },
  MCDI: function MCDI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/MCDI.json'));
    });
  },
  MCRA: function MCRA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/MCRA.json'));
    });
  },
  OKSR: function OKSR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/OKSR.json'));
    });
  },
  POSE: function POSE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/POSE.json'));
    });
  },
  PRIN: function PRIN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/PRIN.json'));
    });
  },
  PRLA: function PRLA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/PRLA.json'));
    });
  },
  PRPO: function PRPO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/PRPO.json'));
    });
  },
  REDB: function REDB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/REDB.json'));
    });
  },
  SUGG: function SUGG() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/SUGG.json'));
    });
  },
  SYCA: function SYCA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/SYCA.json'));
    });
  },
  TECR: function TECR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/TECR.json'));
    });
  },
  TOMB: function TOMB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/TOMB.json'));
    });
  },
  TOOK: function TOOK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/TOOK.json'));
    });
  },
  WALK: function WALK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/WALK.json'));
    });
  },
  WLOU: function WLOU() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/WATERSHED_BOUNDARIES/WLOU.json'));
    });
  }
}), _defineProperty(_deferredJSON, _SiteMapUtils.FEATURES.DRAINAGE_LINES.KEY, {
  ARIK: function ARIK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/ARIK.json'));
    });
  },
  BARC: function BARC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/BARC.json'));
    });
  },
  BIGC: function BIGC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/BIGC.json'));
    });
  },
  BLDE: function BLDE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/BLDE.json'));
    });
  },
  BLUE: function BLUE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/BLUE.json'));
    });
  },
  BLWA: function BLWA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/BLWA.json'));
    });
  },
  CARI: function CARI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/CARI.json'));
    });
  },
  COMO: function COMO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/COMO.json'));
    });
  },
  CRAM: function CRAM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/CRAM.json'));
    });
  },
  CUPE: function CUPE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/CUPE.json'));
    });
  },
  FLNT: function FLNT() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/FLNT.json'));
    });
  },
  GUIL: function GUIL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/GUIL.json'));
    });
  },
  HOPB: function HOPB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/HOPB.json'));
    });
  },
  KING: function KING() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/KING.json'));
    });
  },
  LECO: function LECO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/LECO.json'));
    });
  },
  LEWI: function LEWI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/LEWI.json'));
    });
  },
  LIRO: function LIRO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/LIRO.json'));
    });
  },
  MART: function MART() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/MART.json'));
    });
  },
  MAYF: function MAYF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/MAYF.json'));
    });
  },
  MCDI: function MCDI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/MCDI.json'));
    });
  },
  MCRA: function MCRA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/MCRA.json'));
    });
  },
  OKSR: function OKSR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/OKSR.json'));
    });
  },
  POSE: function POSE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/POSE.json'));
    });
  },
  PRIN: function PRIN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/PRIN.json'));
    });
  },
  PRLA: function PRLA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/PRLA.json'));
    });
  },
  PRPO: function PRPO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/PRPO.json'));
    });
  },
  REDB: function REDB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/REDB.json'));
    });
  },
  SUGG: function SUGG() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/SUGG.json'));
    });
  },
  SYCA: function SYCA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/SYCA.json'));
    });
  },
  TECR: function TECR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/TECR.json'));
    });
  },
  TOMB: function TOMB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/TOMB.json'));
    });
  },
  TOOK: function TOOK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/TOOK.json'));
    });
  },
  WALK: function WALK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/WALK.json'));
    });
  },
  WLOU: function WLOU() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/DRAINAGE_LINES/WLOU.json'));
    });
  }
}), _defineProperty(_deferredJSON, _SiteMapUtils.FEATURES.POUR_POINTS.KEY, {
  ARIK: function ARIK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/ARIK.json'));
    });
  },
  BARC: function BARC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/BARC.json'));
    });
  },
  BIGC: function BIGC() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/BIGC.json'));
    });
  },
  BLDE: function BLDE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/BLDE.json'));
    });
  },
  BLUE: function BLUE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/BLUE.json'));
    });
  },
  BLWA: function BLWA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/BLWA.json'));
    });
  },
  CARI: function CARI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/CARI.json'));
    });
  },
  COMO: function COMO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/COMO.json'));
    });
  },
  CRAM: function CRAM() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/CRAM.json'));
    });
  },
  CUPE: function CUPE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/CUPE.json'));
    });
  },
  FLNT: function FLNT() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/FLNT.json'));
    });
  },
  GUIL: function GUIL() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/GUIL.json'));
    });
  },
  HOPB: function HOPB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/HOPB.json'));
    });
  },
  KING: function KING() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/KING.json'));
    });
  },
  LECO: function LECO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/LECO.json'));
    });
  },
  LEWI: function LEWI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/LEWI.json'));
    });
  },
  LIRO: function LIRO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/LIRO.json'));
    });
  },
  MART: function MART() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/MART.json'));
    });
  },
  MAYF: function MAYF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/MAYF.json'));
    });
  },
  MCDI: function MCDI() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/MCDI.json'));
    });
  },
  MCRA: function MCRA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/MCRA.json'));
    });
  },
  OKSR: function OKSR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/OKSR.json'));
    });
  },
  POSE: function POSE() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/POSE.json'));
    });
  },
  PRIN: function PRIN() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/PRIN.json'));
    });
  },
  PRLA: function PRLA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/PRLA.json'));
    });
  },
  PRPO: function PRPO() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/PRPO.json'));
    });
  },
  REDB: function REDB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/REDB.json'));
    });
  },
  SUGG: function SUGG() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/SUGG.json'));
    });
  },
  SYCA: function SYCA() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/SYCA.json'));
    });
  },
  TECR: function TECR() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/TECR.json'));
    });
  },
  TOMB: function TOMB() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/TOMB.json'));
    });
  },
  TOOK: function TOOK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/TOOK.json'));
    });
  },
  WALK: function WALK() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/WALK.json'));
    });
  },
  WLOU: function WLOU() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./deferredJSON/POUR_POINTS/WLOU.json'));
    });
  }
}), _deferredJSON);

var SiteMapDeferredJson = function SiteMapDeferredJson() {
  var featureKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var siteCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var onSuccess = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var onError = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

  if (!(typeof onSuccess === 'function' && typeof onError === 'function')) {
    throw new Error('SiteMapDeferredJson requires functions for success and error handlers');
  }

  if (!deferredJSON[featureKey]) {
    onError(new Error("Feature key not supported for deferred import: ".concat(featureKey)));
    return;
  }

  if (typeof deferredJSON[featureKey][siteCode] !== 'function') {
    onError(new Error("Site code: ".concat(siteCode, " is not valid for deferred feature: ").concat(featureKey)));
    return;
  }

  deferredJSON[featureKey][siteCode]().then(function (module) {
    onSuccess(module.default);
  }).catch(onError);
};

var _default = SiteMapDeferredJson;
exports.default = _default;