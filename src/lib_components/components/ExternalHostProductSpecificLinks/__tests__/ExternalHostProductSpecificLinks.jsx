import React from 'react';
import renderer from 'react-test-renderer';

import '../../../../__mocks__/NeonContext';

import ExternalHostProductSpecificLinks from '../ExternalHostProductSpecificLinks';

describe('ExternalHostProductSpecificLinks', () => {
  test('renders graceful failure with no valid product code', () => {
    const tree = renderer
      .create(<ExternalHostProductSpecificLinks productCode="BAD" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with valid product code and no sites', () => {
    const treeAMERIFLUX = renderer
      .create(<ExternalHostProductSpecificLinks productCode="DP1.00001.001" />)
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(<ExternalHostProductSpecificLinks productCode="DP1.10020.001" />)
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(<ExternalHostProductSpecificLinks productCode="DP1.00033.001" data-selenium="foo" />)
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code and sites', () => {
    const treeAMERIFLUX = renderer
      .create((
        <ExternalHostProductSpecificLinks
          productCode="DP1.00001.001"
          sites={['GUAN', 'BLAN', 'PUUM', 'STER', 'RMNP', 'TALL', 'WOOD', 'UKFS']}
        />
      ))
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create((
        <ExternalHostProductSpecificLinks
          productCode="DP1.10020.001"
          sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
        />
      ))
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create((
        <ExternalHostProductSpecificLinks
          productCode="DP1.00033.001"
          sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
        />
      ))
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
    const treeNPN = renderer
      .create((
        <ExternalHostProductSpecificLinks
          productCode="DP1.10055.001"
          sites={['ABBY', 'BLUE', 'CLBJ', 'DEJU', 'FLNT', 'GUAN', 'HARV', 'JERC']}
        />
      ))
      .toJSON();
    expect(treeNPN).toMatchSnapshot();
  });
});
