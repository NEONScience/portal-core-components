import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
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
    const tree = render(<MockTheme><ReleaseFilter /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders in skeleton mode', () => {
    const tree = render(<MockTheme><ReleaseFilter skeleton /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders with list of releases without DOIs', () => {
    const tree = render(<MockTheme><ReleaseFilter releases={basicReleases} showGenerationDate /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders with a selected release', () => {
    const tree = render(<MockTheme><ReleaseFilter releases={basicReleases} selected="TEST-TAG-2" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders gracefully with an invalid selection', () => {
    const tree = render(<MockTheme><ReleaseFilter releases={basicReleases} selected="TEST-TAG-7" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders with list of releases with DOIs', () => {
    const tree = render(<MockTheme><ReleaseFilter releases={doiReleases} showDoi /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders with custom layouts', () => {
    const tree = render(<MockTheme><ReleaseFilter horizontal maxWidth={300} /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders with a custom title', () => {
    const tree = render(<MockTheme><ReleaseFilter title="Foo" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders with blank title', () => {
    const tree = render(<MockTheme><ReleaseFilter title="" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('Renders with product counts (using data product objects)', () => {
    const tree = render(
      <MockTheme>
        <ReleaseFilter
          releases={dataProductsReleases}
          nullReleaseProductCount={5}
          onChange={() => {}}
          showProductCount
        />
      </MockTheme>,
    );
    expect(tree).toMatchSnapshot();
  });
  test('Renders with product counts (using data product codes)', () => {
    const tree = render(
      <MockTheme>
        <ReleaseFilter
          releases={dataProductCodesReleases}
          excludeNullRelease
          showProductCount
        />
      </MockTheme>,
    );
    expect(tree).toMatchSnapshot();
  });
  test('Renders product counts without a defined null release count', () => {
    const tree = render(
      <MockTheme>
        <ReleaseFilter
          releases={dataProductCodesReleases}
          selected="TEST-TAG-2"
          showProductCount
          showGenerationDate
          showDoi
        />
      </MockTheme>,
    );
    expect(tree).toMatchSnapshot();
  });
  test('Renders nothing with no releases and an excluded null release', () => {
    const tree = render(<MockTheme><ReleaseFilter excludeNullRelease /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
});
