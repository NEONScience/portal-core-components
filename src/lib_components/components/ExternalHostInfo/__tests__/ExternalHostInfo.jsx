import React from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import ExternalHostInfo from '../ExternalHostInfo';

describe('ExternalHostInfo', () => {
  test('renders graceful failure with no valid product code', () => {
    const tree = render(<MockTheme><ExternalHostInfo productCode="BAD" /></MockTheme>);
    expect(tree).toMatchSnapshot();
  });
  test('renders with valid product code and no sites', () => {
    const treeAMERIFLUX = render(<MockTheme><ExternalHostInfo productCode="DP1.00001.001" /></MockTheme>);
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = render(<MockTheme><ExternalHostInfo productCode="DP1.10020.001" /></MockTheme>);
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = render(
      <MockTheme>
        <ExternalHostInfo productCode="DP1.00033.001" data-selenium="foo" />
      </MockTheme>
    );
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code and sites', () => {
    const treeAMERIFLUX = render(
      <MockTheme>
        <ExternalHostInfo productCode="DP1.00001.001" sites={['ABBY', 'CLBJ', 'COMO']} />
      </MockTheme>
    );
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = render(
      <MockTheme>
        <ExternalHostInfo productCode="DP1.10020.001" sites={['ABBY', 'CLBJ', 'COMO']} />
      </MockTheme>
    );
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = render(
      <MockTheme>
        <ExternalHostInfo productCode="DP1.00033.001" sites={['ABBY', 'CLBJ', 'COMO']} />
      </MockTheme>
    );
    expect(treePHENOCAM).toMatchSnapshot();
  });
  test('renders with valid product code, sites, and expandable boolean', () => {
    const treeAMERIFLUX = render(
      <MockTheme>
        <ExternalHostInfo productCode="DP1.00001.001" sites={['ABBY', 'COMO']} expandable />
      </MockTheme>
    );
    expect(treeAMERIFLUX).toMatchSnapshot();
    const treeBOLD = render(
      <MockTheme>
        <ExternalHostInfo productCode="DP1.10020.001" sites={['ABBY', 'COMO']} expandable />
      </MockTheme>
    );
    expect(treeBOLD).toMatchSnapshot();
    const treePHENOCAM = render(
      <MockTheme>
        <ExternalHostInfo productCode="DP1.00033.001" sites={['ABBY', 'COMO']} expandable />
      </MockTheme>
    );
    expect(treePHENOCAM).toMatchSnapshot();
  });
});
