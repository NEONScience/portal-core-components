import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
// Build an object from state suitable for manifestUtil.buildManifestRequestUrl()
export const buildManifestConfig = (selection, defaultPackageType = 'basic', isAop = false)=>{
    const config = {
        productCode: '',
        release: '',
        sites: [],
        dateRange: [],
        documentation: false,
        packageType: '',
        provisionalData: false,
        isError: true
    };
    let manifestConfigError = null;
    if (!isAop) {
        if (!selection.productData || !selection.productData.productCode) {
            manifestConfigError = 'Invalid data product';
        } else if (!selection.sites.isValid) {
            manifestConfigError = 'Invalid site selection';
        } else if (!selection.dateRange.isValid) {
            manifestConfigError = 'Invalid date range';
        }
    }
    if (manifestConfigError) {
        config.errorMessage = manifestConfigError;
        return config;
    }
    config.isError = false;
    config.productCode = selection.productData.productCode;
    config.release = selection.release.value;
    config.sites = selection.sites.value;
    config.dateRange = selection.dateRange.value;
    config.documentation = selection.documentation.value === 'include';
    config.packageType = selection.packageType.value || defaultPackageType;
    config.provisionalData = selection.provisionalData.value === 'include';
    return config;
};
export const buildSiteCodesParams = (sites = new Array(), camelCase = false)=>{
    const param = camelCase ? 'siteCode' : 'sitecode';
    return sites.reduce((sitesString, siteCode, index)=>`${sitesString}${index === 0 ? '' : '&'}${param}=${siteCode}`, '');
};
export const buildManifestRequestUrl = (config, useBody = true)=>{
    const { productCode, sites, dateRange, packageType, documentation, provisionalData } = config;
    let url = NeonEnvironment.getFullDownloadApiPath('manifestRollup');
    if (!useBody) {
        const siteCodesParam = buildSiteCodesParams(sites);
        const productCodeParam = productCode.startsWith('NEON.DOM.SITE') ? productCode : `NEON.DOM.SITE.${productCode}`;
        const params = [
            `dpcode=${productCodeParam}`,
            `startdate=${dateRange[0]}`,
            `enddate=${dateRange[1]}`,
            `pkgtype=${packageType}`,
            `includedocs=${documentation ? 'true' : 'false'}`,
            `includeProvisional=${provisionalData ? 'true' : 'false'}`,
            siteCodesParam
        ];
        url = `${url}?${params.join('&')}`;
    }
    return url;
};
export const buildManifestRequestBody = (config)=>{
    const { productCode, release, sites, dateRange, packageType, documentation, provisionalData } = config;
    const productCodeParam = productCode.startsWith('NEON.DOM.SITE') ? productCode : `NEON.DOM.SITE.${productCode}`;
    return {
        dpCode: productCodeParam,
        siteCodes: sites,
        startDateMonth: dateRange[0],
        endDateMonth: dateRange[1],
        release,
        pkgType: packageType,
        includeDocs: documentation,
        includeProvisional: provisionalData,
        presign: true
    };
};
export const buildS3FilesRequestUrl = (productCode, site, yearMonth, release)=>{
    const productCodeDir = productCode.startsWith('NEON.DOM.SITE') ? productCode : `NEON.DOM.SITE.${productCode}`;
    const releaseParam = typeof release === 'string' && release.length > 0 ? `&release=${release}` : '';
    const root = `${NeonEnvironment.getFullApiPath('data')}/${productCodeDir}/${site}/${yearMonth}`;
    return `${root}?presign=false${releaseParam}`;
};
export const downloadManifest = (manifest)=>{
    const form = document.createElement('form');
    form.style.display = 'none';
    form.action = NeonEnvironment.getFullDownloadApiPath('downloadStream');
    form.method = 'POST';
    const input = document.createElement('input');
    input.name = 'manifest';
    input.value = JSON.stringify(manifest);
    form.appendChild(input);
    document.body.appendChild(form);
    const submit = form.submit();
    document.body.removeChild(form);
    return submit;
};
export const downloadAopManifest = (config, s3Files, documentation = 'include', provisionalData = 'exclude')=>{
    const siteCodes = [];
    const s3FileValues = s3Files.validValues;
    const manifestS3Files = s3FileValues.filter((file)=>s3Files.value.includes(file.url)).map((file)=>{
        if (!siteCodes.includes(file.site)) {
            siteCodes.push(file.site);
        }
        return {
            release: file.release,
            productCode: file.productCode,
            siteCode: file.site,
            month: file.yearMonth,
            packageType: 'basic',
            fileName: file.url.split('/').pop() || '',
            fileSizeBytes: file.size,
            checksum: file.checksum,
            checksumAlgorithm: file.checksumAlgorithm,
            uri: file.url
        };
    });
    const includeDocs = documentation === 'include';
    const includeProvisional = provisionalData === 'include';
    const productCodeParam = config.productCode.startsWith('NEON.DOM.SITE') ? config.productCode : `NEON.DOM.SITE.${config.productCode}`;
    const manifestRequest = {
        dpCode: productCodeParam,
        startDateMonth: null,
        endDateMonth: null,
        release: config.release,
        pkgType: null,
        presign: true,
        manifestFiles: manifestS3Files,
        siteCodes,
        includeDocs,
        includeProvisional
    };
    return downloadManifest(manifestRequest);
};
export const MAX_POST_BODY_SIZE = 20 * (1024 * 1024); // 20MiB
export const DOWNLOAD_SIZE_WARN = 42949672960; // 40GB
export const formatBytes = (bytes)=>{
    if (!Number.isInteger(bytes) || bytes < 0) {
        return '0.000 B';
    }
    const scales = [
        'B',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
    ];
    const log = Math.log(bytes) / Math.log(1024);
    const scale = Math.floor(log);
    const precision = Math.floor(3 - (log - scale) * 3);
    return `${(bytes / 1024 ** scale).toFixed(precision)} ${scales[scale]}`;
};
export const getSizeEstimateFromManifestResponse = (response)=>{
    if (typeof response !== 'object' || response === null || typeof response.data !== 'object' || response.data === null || !Array.isArray(response.data.manifestEntries) || !response.data.manifestEntries.length) {
        return 0;
    }
    return response.data.manifestEntries.reduce((total, entry)=>total + (parseInt(entry.fileSizeBytes, 10) || 0), 0);
};
export const getSizeEstimateFromManifestRollupResponse = (response)=>{
    if (typeof response !== 'object' || response === null || typeof response.data !== 'object' || response.data === null || typeof response.data.totalBytes !== 'number' || response.data.totalBytes === null) {
        return 0;
    }
    return response.data.totalBytes;
};
export default buildManifestRequestUrl;
