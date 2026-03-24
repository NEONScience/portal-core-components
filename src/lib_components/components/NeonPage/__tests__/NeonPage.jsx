import React, { act } from 'react';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/ajax';
import mockReactComponent from '../../../../__mocks__/mockReactComponent';

jest.mock('@mui/material/Backdrop', () => mockReactComponent('@mui/material/Backdrop'));
jest.mock('@mui/material/Snackbar', () => mockReactComponent('@mui/material/Snackbar'));

// eslint-disable-next-line import/first
import NeonPage, { NeonErrorPage } from '../NeonPage';

const customStyles = {
  width: '100%',
  height: '100px',
  fontSize: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const customHeader = (
  <div style={{ backgroundColor: 'green', ...customStyles }}>
    <span>Custom Header</span>
  </div>
);
const customFooter = (
  <div style={{ backgroundColor: 'purple', ...customStyles }}>
    <span>Custom Footer</span>
  </div>
);

describe('NeonPage', () => {
  beforeAll(() => {
    console.error = jest.fn();
    fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
      })
    );
  });
  afterEach(() => {
    console.error.mockReset();
  });
  afterAll(() => {
    console.error.mockRestore();
  });
  test('renders a basic functional page with no props', async () => {
    let tree;
    await act(async () => {
      tree = render(
        <MockTheme>
          <NeonPage
            showHeaderSkeleton
            showFooterSkeleton
            customHeader={customHeader}
            customFooter={customFooter}
          >
            <div>content</div>
          </NeonPage>
        </MockTheme>
      );
    });
    expect(tree).toMatchSnapshot();
  });
  test('renders with a title and subtitle', () => {
    const tree = render(
      <MockTheme>
        <NeonPage
          title="Title"
          subtitle="Subtitle"
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with loading message', () => {
    const tree = render(
      <MockTheme>
        <NeonPage
          loading="Loading"
          outerPageContainerMaxWidth="3333px"
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with loading message and progress', () => {
    const tree = render(
      <MockTheme>
        <NeonPage
          loading="Loading"
          progress={62}
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with an error', () => {
    const tree = render(
      <MockTheme>
        <NeonPage
          error="Fail"
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with a notification', () => {
    const tree = render(
      <MockTheme>
        <NeonPage
          notification="Notification"
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with a custom header/footer', () => {
    const tree = render(
      <MockTheme>
        <NeonPage
          customHeader={<div>Header</div>}
          customFooter={<div>Header</div>}
          showHeaderSkeleton
          showFooterSkeleton
        >
          <div>content</div>
        </NeonPage>,
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with custom sidebar content', () => {
    const tree = render(
      <MockTheme>
        <NeonPage
          sidebarContent={<div>Sidebar</div>}
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders sidebar items as skeletons when in appropriate state', () => {
    const tree = render(
      <MockTheme>
        <NeonPage
          sidebarContent={<div>Sidebar</div>}
          sidebarTitle="foo"
          loading="Loading"
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with sidebar links', () => {
    const StubIcon = () => <div>stub icon</div>;
    const StubComponent = () => <div>stub component</div>;
    const sidebarLinks = [
      { name: 'Section A' },
      { name: 'Section B', pageTitle: 'This is B', hash: '#sectionB' },
      { name: 'Section C', hash: '#sectionC', icon: StubIcon },
      { name: 'Section D', hash: '#sectionD', component: StubComponent },
    ];
    const tree = render(
      <MockTheme>
        <NeonPage
          sidebarLinks={sidebarLinks}
          sidebarTitle="foo"
          sidebarSubtitle="bar"
          sidebarLinksAdditionalContent={<div>More</div>}
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('renders with sidebar links as standlone children', () => {
    const StubComponentA = () => <div>stub component A</div>;
    const StubComponentB = () => <div>stub component B</div>;
    const sidebarLinks = [
      { name: 'Section A', hash: '#sectionA', component: StubComponentA },
      { name: 'Section B', hash: '#sectionA', component: StubComponentB },
    ];
    const tree = render(
      <MockTheme>
        <NeonPage
          sidebarLinks={sidebarLinks}
          sidebarWidth={422}
          sidebarUnsticky
          sidebarContainerClassName="sidebarClassName"
          sidebarLinksAsStandaloneChildren
          showHeaderSkeleton
          showFooterSkeleton
          customHeader={customHeader}
          customFooter={customFooter}
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
  test('NeonErrorPage', async () => {
    const error = {
      message: 'fail',
      stack: 'Disregard; this is console.error() call is expected in the NeonErrorPage test',
    };
    const tree = render(
      <MockTheme>
        <NeonErrorPage error={error} resetErrorBoundary={() => {}} />
      </MockTheme>
    );
    expect(tree).toMatchSnapshot();
  });
});
