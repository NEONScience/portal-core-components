import React from 'react';
import renderer from 'react-test-renderer';

import ReleaseFilter from '../ReleaseFilter';

const basicReleases = [
  {
    release: 'TEST-TAG-1',
  },
  {
    release: 'TEST-TAG-2',
    generationDate: '2021-01-15T18:27:10Z',
  },
];

const doiReleases = [
  {
    release: 'TEST-TAG-2',
    generationDate: '2021-01-15T18:27:10Z',
    productDoi: {
      generationDate: '2021-01-18T15:27:10Z',
      url: 'http://data.cite/bar',
    },
  },
  {
    release: 'TEST-TAG-1',
    generationDate: '2021-01-12T15:27:10Z',
    productDoi: {
      generationDate: '2021-01-13T15:27:10Z',
      url: 'http://data.cite/foo',
    },
  },
];

const dataProductsReleases = [
  {
    release: 'TEST-TAG-1',
    generationDate: '2021-01-15T18:27:10Z',
    dataProducts: [{}, {}, {}],
  },
  {
    release: 'TEST-TAG-2',
    generationDate: '2021-01-18T18:27:10Z',
    dataProducts: [{}, {}],
  },
];

const dataProductCodesReleases = [
  {
    release: 'TEST-TAG-1',
    dataProductCodes: ['A', 'B', 'C'],
  },
  {
    release: 'TEST-TAG-2',
    generationDate: '2021-01-15T18:27:10Z',
    dataProductCodes: ['A', 'C'],
    productDoi: {
      generationDate: '2021-01-18T15:27:10Z',
      url: 'http://data.cite/bar',
    },
  },
  {
    release: 'TEST-TAG-3',
  },
];

describe('ReleaseFilter', () => {
  test('Renders with no props', () => {
    const tree = renderer
      .create(<ReleaseFilter />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders in skeleton mode', () => {
    const tree = renderer
      .create(<ReleaseFilter skeleton />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with list of releases without DOIs', () => {
    const tree = renderer
      .create(<ReleaseFilter releases={basicReleases} showGenerationDate />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with a selected release', () => {
    const tree = renderer
      .create(<ReleaseFilter releases={basicReleases} selected="TEST-TAG-2" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders gracefully with an invalid selection', () => {
    const tree = renderer
      .create(<ReleaseFilter releases={basicReleases} selected="TEST-TAG-7" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with list of releases with DOIs', () => {
    const tree = renderer
      .create(<ReleaseFilter releases={doiReleases} showDoi />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with custom layouts', () => {
    const tree = renderer
      .create(<ReleaseFilter horizontal maxWidth={300} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with a custom title', () => {
    const tree = renderer
      .create(<ReleaseFilter title="Foo" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with blank title', () => {
    const tree = renderer
      .create(<ReleaseFilter title="" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with product counts (using data product objects)', () => {
    const tree = renderer
      .create(
        <ReleaseFilter
          releases={dataProductsReleases}
          nullReleaseProductCount={5}
          onChange={() => {}}
          showProductCount
        />,
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders with product counts (using data product codes)', () => {
    const tree = renderer
      .create(
        <ReleaseFilter
          releases={dataProductCodesReleases}
          excludeNullRelease
          showProductCount
        />,
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders product counts without a defined null release count', () => {
    const tree = renderer
      .create(
        <ReleaseFilter
          releases={dataProductCodesReleases}
          selected="TEST-TAG-2"
          showProductCount
          showGenerationDate
          showDoi
        />,
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Renders nothing with no releases and an excluded null release', () => {
    const tree = renderer
      .create(<ReleaseFilter excludeNullRelease />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
