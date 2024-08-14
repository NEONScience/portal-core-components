import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/NeonContext';

import ExternalHostProductSpecificLinks from '../ExternalHostProductSpecificLinks';

describe('ExternalHostProductSpecificLinks', () => {
  test('renders graceful failure with no valid product code', () => {
    const tree = renderer
      .create(<MockTheme><ExternalHostProductSpecificLinks productCode="BAD" /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with valid product code and no sites', () => {
    const treeAMERIFLUX = renderer
      .create(<MockTheme><ExternalHostProductSpecificLinks productCode="DP1.00001.001" /></MockTheme>)
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(<MockTheme><ExternalHostProductSpecificLinks productCode="DP1.10020.001" /></MockTheme>)
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(<MockTheme><ExternalHostProductSpecificLinks productCode="DP1.00033.001" data-selenium="foo" /></MockTheme>)
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code and sites', () => {
    const treeAMERIFLUX = renderer
      .create(
        <MockTheme>
          <ExternalHostProductSpecificLinks
            productCode="DP1.00001.001"
            sites={['GUAN', 'BLAN', 'PUUM', 'STER', 'RMNP', 'TALL', 'WOOD', 'UKFS']}
          />
        </MockTheme>
      )
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(
        <MockTheme>
          <ExternalHostProductSpecificLinks
            productCode="DP1.10020.001"
            sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
          />
        </MockTheme>
      )
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(
        <MockTheme>
          <ExternalHostProductSpecificLinks
            productCode="DP1.00033.001"
            sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
          />
        </MockTheme>
      )
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
    const treeNPN = renderer
      .create(
        <MockTheme>
          <ExternalHostProductSpecificLinks
            productCode="DP1.10055.001"
            sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
          />
        </MockTheme>
      )
      .toJSON();
    expect(treeNPN).toMatchSnapshot();
  });
});
