import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/NeonContext';

import ExternalHostProductSpecificLinks from '../ExternalHostProductSpecificLinks';

describe('ExternalHostProductSpecificLinks', () => {
  test('renders graceful failure with no valid product code', () => {
    const tree = render(<MockTheme><ExternalHostProductSpecificLinks productCode="BAD" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with valid product code and no sites', () => {
    const treeAMERIFLUX = render(<MockTheme><ExternalHostProductSpecificLinks productCode="DP1.00001.001" /></MockTheme>);
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = render(<MockTheme><ExternalHostProductSpecificLinks productCode="DP1.10020.001" /></MockTheme>);
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = render(<MockTheme><ExternalHostProductSpecificLinks productCode="DP1.00033.001" data-selenium="foo" /></MockTheme>);
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code and sites', () => {
    const treeAMERIFLUX = render(
      <MockTheme>
        <ExternalHostProductSpecificLinks
          productCode="DP1.00001.001"
          sites={['GUAN', 'BLAN', 'PUUM', 'STER', 'RMNP', 'TALL', 'WOOD', 'UKFS']}
        />
      </MockTheme>
    );
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = render(
      <MockTheme>
        <ExternalHostProductSpecificLinks
          productCode="DP1.10020.001"
          sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
        />
      </MockTheme>
    );
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = render(
      <MockTheme>
        <ExternalHostProductSpecificLinks
          productCode="DP1.00033.001"
          sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
        />
      </MockTheme>
    );
    expect(treePHENOCAM).toMatchSnapshot();
    const treeNPN = render(
      <MockTheme>
        <ExternalHostProductSpecificLinks
          productCode="DP1.10055.001"
          sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
        />
      </MockTheme>
    );
    expect(treeNPN).toMatchSnapshot();
  });
});
