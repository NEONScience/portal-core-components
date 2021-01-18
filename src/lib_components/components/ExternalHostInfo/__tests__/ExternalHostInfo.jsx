import React from 'react';
import renderer from 'react-test-renderer';

import ExternalHostInfo from '../ExternalHostInfo';

describe('ExternalHostInfo', () => {
  test('renders graceful failure with no valid product code', () => {
    const tree = renderer
      .create(<ExternalHostInfo productCode="BAD" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with valid product code and no sites', () => {
    const treeAMERIFLUX = renderer
      .create(<ExternalHostInfo productCode="DP1.00001.001" />)
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(<ExternalHostInfo productCode="DP1.10020.001" />)
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(<ExternalHostInfo productCode="DP1.00033.001" data-selenium="foo" />)
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code and sites', () => {
    const treeAMERIFLUX = renderer
      .create(<ExternalHostInfo productCode="DP1.00001.001" sites={['ABBY', 'CLBJ', 'COMO']} />)
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(<ExternalHostInfo productCode="DP1.10020.001" sites={['ABBY', 'CLBJ', 'COMO']} />)
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(<ExternalHostInfo productCode="DP1.00033.001" sites={['ABBY', 'CLBJ', 'COMO']} />)
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code, sites, and expandable boolean', () => {
    const treeAMERIFLUX = renderer
      .create(<ExternalHostInfo productCode="DP1.00001.001" sites={['ABBY', 'COMO']} expandable />)
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(<ExternalHostInfo productCode="DP1.10020.001" sites={['ABBY', 'COMO']} expandable />)
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(<ExternalHostInfo productCode="DP1.00033.001" sites={['ABBY', 'COMO']} expandable />)
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
  });
});
