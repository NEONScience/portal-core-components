import React from 'react';

import Link from '@material-ui/core/Link';

import RouteService from '../../service/RouteService';
import Theme from '../Theme/Theme';
import { IDataProductLike } from '../../types/internal';

export interface IBundleContentBuilder {
  getParentProductLink: (
    dataProduct: IDataProductLike,
    release?: string,
  ) => JSX.Element;

  buildManyParentsMainContent: (
    dataProducts: IDataProductLike[],
  ) => JSX.Element;

  buildDefaultTitleContent: (
    dataProduct: IDataProductLike,
    release?: string,
  ) => JSX.Element;

  buildDefaultSplitTitleContent: (terminalChar?: string) => JSX.Element;

  buildDefaultSubTitleContent: (
    forwardAvailability: boolean,
    hasManyParents: boolean,
  ) => JSX.Element;
}

const BundleContentBuilder: IBundleContentBuilder = {
  getParentProductLink: (
    dataProduct: IDataProductLike,
    release?: string,
  ): JSX.Element => ((
    <Link
      href={RouteService.getProductDetailPath(dataProduct.productCode, release)}
      target="_blank"
    >
      {`${dataProduct.productName} (${dataProduct.productCode})`}
    </Link>
  )),

  buildManyParentsMainContent: (
    dataProducts: IDataProductLike[],
  ): JSX.Element => ((
    <ul style={{ margin: Theme.spacing(1, 0) }}>
      {dataProducts.map((dataProduct: IDataProductLike) => (
        <li key={dataProduct.productCode}>
          {BundleContentBuilder.getParentProductLink(dataProduct)}
        </li>
      ))}
    </ul>
  )),

  buildDefaultTitleContent: (
    dataProduct: IDataProductLike,
    release?: string,
  ): JSX.Element => {
    const bundleParentLink: JSX.Element = BundleContentBuilder.getParentProductLink(
      dataProduct,
      release,
    );
    return (
      <>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        This data product is bundled into {bundleParentLink}
        {/* eslint-enable react/jsx-one-expression-per-line */}
      </>
    );
  },

  buildDefaultSplitTitleContent: (terminalChar?: string): JSX.Element => ((
    <>
      {/* eslint-disable react/jsx-one-expression-per-line */}
      This data product has been split and bundled into more
      than one parent data product{`${terminalChar}`}
      {/* eslint-enable react/jsx-one-expression-per-line */}
    </>
  )),

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
          the parent {hasManyParents ? 'products' : 'product'}.
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </>
      )}
    </>
  )),
};

Object.freeze(BundleContentBuilder);

export default BundleContentBuilder;
