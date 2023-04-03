import React from 'react';

import Link from '@material-ui/core/Link';

import RouteService from '../../service/RouteService';
import Theme from '../Theme/Theme';
import { IDataProductLike } from '../../types/internal';
import { isStringNonEmpty } from '../../util/typeUtil';
import { LATEST_AND_PROVISIONAL } from '../../service/ReleaseService';

export interface IBundleContentBuilder {
  getParentProductLink: (dataProduct: IDataProductLike, release?: string) => JSX.Element;

  getBundledLink: () => JSX.Element;

  buildManyParentsMainContent: (dataProducts: IDataProductLike[], release?: string) => JSX.Element;

  buildDefaultTitleContent: (dataProduct: IDataProductLike, release?: string) => JSX.Element;

  buildDefaultSplitTitleContent: (isRelease: boolean, terminalChar?: string) => JSX.Element;

  buildDefaultSubTitleContent: (
    forwardAvailability: boolean,
    hasManyParents: boolean,
  ) => JSX.Element;
}

const BundleContentBuilder: IBundleContentBuilder = {
  getParentProductLink: (dataProduct: IDataProductLike, release?: string): JSX.Element => {
    const isRelease = isStringNonEmpty(release) && (release !== LATEST_AND_PROVISIONAL);
    const href = RouteService.getProductDetailPath(
      dataProduct.productCode,
      isRelease ? release : undefined,
    );
    return (
      <Link
        href={href}
        target="_blank"
      >
        {`${dataProduct.productName} (${dataProduct.productCode})`}
      </Link>
    );
  },

  getBundledLink: (): JSX.Element => {
    const href = RouteService.getDataProductBundlesPath();
    return (
      <Link
        href={href}
        target="_blank"
      >
        bundled
      </Link>
    );
  },

  buildManyParentsMainContent: (
    dataProducts: IDataProductLike[],
    release?: string,
  ): JSX.Element => ((
    <ul style={{ margin: Theme.spacing(1, 0) }}>
      {dataProducts.map((dataProduct: IDataProductLike) => (
        <li key={dataProduct.productCode}>
          {BundleContentBuilder.getParentProductLink(dataProduct, release)}
        </li>
      ))}
    </ul>
  )),

  buildDefaultTitleContent: (dataProduct: IDataProductLike, release?: string): JSX.Element => {
    const isRelease = isStringNonEmpty(release) && (release !== LATEST_AND_PROVISIONAL);
    const bundleParentLink: JSX.Element = BundleContentBuilder.getParentProductLink(
      dataProduct,
      isRelease ? release : undefined,
    );
    const bundledLink: JSX.Element = BundleContentBuilder.getBundledLink();
    return (
      <>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        This data product {isRelease ? 'release ' : ''}is {bundledLink} into {bundleParentLink}
        {/* eslint-enable react/jsx-one-expression-per-line */}
      </>
    );
  },

  buildDefaultSplitTitleContent: (isRelease: boolean, terminalChar?: string): JSX.Element => {
    const bundledLink: JSX.Element = BundleContentBuilder.getBundledLink();
    return (
      <>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        This data product {isRelease ? 'release ' : ''}is {bundledLink} into the
        following data product{isRelease ? ' releases' : 's'}{`${terminalChar}`}
        {/* eslint-enable react/jsx-one-expression-per-line */}
      </>
    );
  },

  buildDefaultSubTitleContent: (
    forwardAvailability: boolean,
    hasManyParents: boolean,
  ): JSX.Element => ((
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {forwardAvailability ? (
        <>
          It is not available as a standalone download. Data availability shown
          below reflects availability of the entire bundle.
        </>
      ) : (
        <>
          {/* eslint-disable react/jsx-one-expression-per-line */}
          It is not available as a standalone download.
          Data availability information and data product download is only available through
          the bundle data {hasManyParents ? 'products' : 'product'}.
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </>
      )}
    </>
  )),
};

Object.freeze(BundleContentBuilder);

export default BundleContentBuilder;
