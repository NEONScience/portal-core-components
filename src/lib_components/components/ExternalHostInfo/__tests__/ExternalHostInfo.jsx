import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../../../__mocks__/MockTheme';
import ExternalHostInfo from '../ExternalHostInfo';

describe('ExternalHostInfo', () => {
  test('renders graceful failure with no valid product code', () => {
    const tree = renderer
      .create(<MockTheme><ExternalHostInfo productCode="BAD" /></MockTheme>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with valid product code and no sites', () => {
    const treeAMERIFLUX = renderer
      .create(<MockTheme><ExternalHostInfo productCode="DP1.00001.001" /></MockTheme>)
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(<MockTheme><ExternalHostInfo productCode="DP1.10020.001" /></MockTheme>)
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(
        <MockTheme>
          <ExternalHostInfo productCode="DP1.00033.001" data-selenium="foo" />
        </MockTheme>
      )
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code and sites', () => {
    const treeAMERIFLUX = renderer
      .create(
        <MockTheme>
          <ExternalHostInfo productCode="DP1.00001.001" sites={['ABBY', 'CLBJ', 'COMO']} />
        </MockTheme>
      )
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(
        <MockTheme>
          <ExternalHostInfo productCode="DP1.10020.001" sites={['ABBY', 'CLBJ', 'COMO']} />
        </MockTheme>
      )
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(
        <MockTheme>
          <ExternalHostInfo productCode="DP1.00033.001" sites={['ABBY', 'CLBJ', 'COMO']} />
        </MockTheme>
      )
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code, sites, and expandable boolean', () => {
    const treeAMERIFLUX = renderer
      .create(
        <MockTheme>
          <ExternalHostInfo productCode="DP1.00001.001" sites={['ABBY', 'COMO']} expandable />
        </MockTheme>
      )
      .toJSON();
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = renderer
      .create(
        <MockTheme>
          <ExternalHostInfo productCode="DP1.10020.001" sites={['ABBY', 'COMO']} expandable />
        </MockTheme>
      )
      .toJSON();
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = renderer
      .create(
        <MockTheme>
          <ExternalHostInfo productCode="DP1.00033.001" sites={['ABBY', 'COMO']} expandable />
        </MockTheme>
      )
      .toJSON();
    expect(treePHENOCAM).toMatchSnapshot();
  });
});
