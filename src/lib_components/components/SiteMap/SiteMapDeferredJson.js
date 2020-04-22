import { FEATURES } from './SiteMapUtils';

const deferredJSON = {
  [FEATURES.TOWER_AIRSHEDS.KEY]: {
  },
  [FEATURES.AQUATIC_REACHES.KEY]: {
    ARIK: () => import('./deferredJSON/AQUATIC_REACHES/ARIK.json'),
    BIGC: () => import('./deferredJSON/AQUATIC_REACHES/BIGC.json'),
    BLDE: () => import('./deferredJSON/AQUATIC_REACHES/BLDE.json'),
    BLUE: () => import('./deferredJSON/AQUATIC_REACHES/BLUE.json'),
    BLWA: () => import('./deferredJSON/AQUATIC_REACHES/BLWA.json'),
    CARI: () => import('./deferredJSON/AQUATIC_REACHES/CARI.json'),
    COMO: () => import('./deferredJSON/AQUATIC_REACHES/COMO.json'),
    CUPE: () => import('./deferredJSON/AQUATIC_REACHES/CUPE.json'),
    FLNT: () => import('./deferredJSON/AQUATIC_REACHES/FLNT.json'),
    GUIL: () => import('./deferredJSON/AQUATIC_REACHES/GUIL.json'),
    HOPB: () => import('./deferredJSON/AQUATIC_REACHES/HOPB.json'),
    KING: () => import('./deferredJSON/AQUATIC_REACHES/KING.json'),
    LECO: () => import('./deferredJSON/AQUATIC_REACHES/LECO.json'),
    LEWI: () => import('./deferredJSON/AQUATIC_REACHES/LEWI.json'),
    OKSR: () => import('./deferredJSON/AQUATIC_REACHES/OKSR.json'),
    POSE: () => import('./deferredJSON/AQUATIC_REACHES/POSE.json'),
    PRIN: () => import('./deferredJSON/AQUATIC_REACHES/PRIN.json'),
    MART: () => import('./deferredJSON/AQUATIC_REACHES/MART.json'),
    MAYF: () => import('./deferredJSON/AQUATIC_REACHES/MAYF.json'),
    MCDI: () => import('./deferredJSON/AQUATIC_REACHES/MCDI.json'),
    MCRA: () => import('./deferredJSON/AQUATIC_REACHES/MCRA.json'),
    REDB: () => import('./deferredJSON/AQUATIC_REACHES/REDB.json'),
    SYCA: () => import('./deferredJSON/AQUATIC_REACHES/SYCA.json'),
    TECR: () => import('./deferredJSON/AQUATIC_REACHES/TECR.json'),
    TOMB: () => import('./deferredJSON/AQUATIC_REACHES/TOMB.json'),
    WALK: () => import('./deferredJSON/AQUATIC_REACHES/WALK.json'),
    WLOU: () => import('./deferredJSON/AQUATIC_REACHES/WLOU.json'),
  },
  [FEATURES.FLIGHT_BOX_BOUNDARIES.KEY]: {
  },
  [FEATURES.SAMPLING_BOUNDARIES.KEY]: {
    ABBY: () => import('./deferredJSON/SAMPLING_BOUNDARIES/ABBY.json'),
    BARR: () => import('./deferredJSON/SAMPLING_BOUNDARIES/BARR.json'),
    BART: () => import('./deferredJSON/SAMPLING_BOUNDARIES/BART.json'),
    BLAN: () => import('./deferredJSON/SAMPLING_BOUNDARIES/BLAN.json'),
    BONA: () => import('./deferredJSON/SAMPLING_BOUNDARIES/BONA.json'),
    CLBJ: () => import('./deferredJSON/SAMPLING_BOUNDARIES/CLBJ.json'),
    CPER: () => import('./deferredJSON/SAMPLING_BOUNDARIES/CPER.json'),
    DCFS: () => import('./deferredJSON/SAMPLING_BOUNDARIES/DCFS.json'),
    DEJU: () => import('./deferredJSON/SAMPLING_BOUNDARIES/DEJU.json'),
    DELA: () => import('./deferredJSON/SAMPLING_BOUNDARIES/DELA.json'),
    DSNY: () => import('./deferredJSON/SAMPLING_BOUNDARIES/DSNY.json'),
    GRSM: () => import('./deferredJSON/SAMPLING_BOUNDARIES/GRSM.json'),
    GUAN: () => import('./deferredJSON/SAMPLING_BOUNDARIES/GUAN.json'),
    HARV: () => import('./deferredJSON/SAMPLING_BOUNDARIES/HARV.json'),
    HEAL: () => import('./deferredJSON/SAMPLING_BOUNDARIES/HEAL.json'),
    JERC: () => import('./deferredJSON/SAMPLING_BOUNDARIES/JERC.json'),
    JORN: () => import('./deferredJSON/SAMPLING_BOUNDARIES/JORN.json'),
    KONA: () => import('./deferredJSON/SAMPLING_BOUNDARIES/KONA.json'),
    KONZ: () => import('./deferredJSON/SAMPLING_BOUNDARIES/KONZ.json'),
    LAJA: () => import('./deferredJSON/SAMPLING_BOUNDARIES/LAJA.json'),
    LENO: () => import('./deferredJSON/SAMPLING_BOUNDARIES/LENO.json'),
    MLBS: () => import('./deferredJSON/SAMPLING_BOUNDARIES/MLBS.json'),
    MOAB: () => import('./deferredJSON/SAMPLING_BOUNDARIES/MOAB.json'),
    NIWO: () => import('./deferredJSON/SAMPLING_BOUNDARIES/NIWO.json'),
    NOGP: () => import('./deferredJSON/SAMPLING_BOUNDARIES/NOGP.json'),
    OAES: () => import('./deferredJSON/SAMPLING_BOUNDARIES/OAES.json'),
    ONAQ: () => import('./deferredJSON/SAMPLING_BOUNDARIES/ONAQ.json'),
    ORNL: () => import('./deferredJSON/SAMPLING_BOUNDARIES/ORNL.json'),
    OSBS: () => import('./deferredJSON/SAMPLING_BOUNDARIES/OSBS.json'),
    PUUM: () => import('./deferredJSON/SAMPLING_BOUNDARIES/PUUM.json'),
    RMNP: () => import('./deferredJSON/SAMPLING_BOUNDARIES/RMNP.json'),
    SCBI: () => import('./deferredJSON/SAMPLING_BOUNDARIES/SCBI.json'),
    SERC: () => import('./deferredJSON/SAMPLING_BOUNDARIES/SERC.json'),
    SJER: () => import('./deferredJSON/SAMPLING_BOUNDARIES/SJER.json'),
    SOAP: () => import('./deferredJSON/SAMPLING_BOUNDARIES/SOAP.json'),
    SRER: () => import('./deferredJSON/SAMPLING_BOUNDARIES/SRER.json'),
    STEI: () => import('./deferredJSON/SAMPLING_BOUNDARIES/STEI.json'),
    STER: () => import('./deferredJSON/SAMPLING_BOUNDARIES/STER.json'),
    TALL: () => import('./deferredJSON/SAMPLING_BOUNDARIES/TALL.json'),
    TEAK: () => import('./deferredJSON/SAMPLING_BOUNDARIES/TEAK.json'),
    TOOL: () => import('./deferredJSON/SAMPLING_BOUNDARIES/TOOL.json'),
    TREE: () => import('./deferredJSON/SAMPLING_BOUNDARIES/TREE.json'),
    UKFS: () => import('./deferredJSON/SAMPLING_BOUNDARIES/UKFS.json'),
    UNDE: () => import('./deferredJSON/SAMPLING_BOUNDARIES/UNDE.json'),
    WOOD: () => import('./deferredJSON/SAMPLING_BOUNDARIES/WOOD.json'),
    WREF: () => import('./deferredJSON/SAMPLING_BOUNDARIES/WREF.json'),
    YELL: () => import('./deferredJSON/SAMPLING_BOUNDARIES/YELL.json'),
  },
  [FEATURES.WATERSHED_BOUNDARIES.KEY]: {
  },
};

/**
   importMapJSON(
     FEATURES.AQUATIC_REACHES.KEY,
     'HARV',
     (data) => { console.log('DYNAMIC JSON SUCCESS:', data); },
     (err) => { console.log('DYNAMIC JSON FAILED:', err); },
  );
*/
const SiteMapDeferredJson = (
  featureKey = '',
  siteCode = '',
  onSuccess = () => {},
  onError = () => {},
) => {
  if (!(typeof onSuccess === 'function' && typeof onError === 'function')) {
    throw new Error('SiteMapDeferredJson requires functions for success and error handlers');
  }
  if (!deferredJSON[featureKey]) {
    onError(new Error(`Feature key not supported for deferred import: ${featureKey}`));
    return;
  }
  if (typeof deferredJSON[featureKey][siteCode] !== 'function') {
    onError(new Error(`Site code: ${siteCode} is not valid for deferred feature: ${featureKey}`));
    return;
  }
  deferredJSON[featureKey][siteCode]()
    .then((module) => { onSuccess(module.default); })
    .catch(onError);
};

export default SiteMapDeferredJson;
