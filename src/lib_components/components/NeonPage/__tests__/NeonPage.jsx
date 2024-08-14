import React from 'react';
import renderer from 'react-test-renderer';

import MockTheme from '../../../../__mocks__/MockTheme';
import '../../../../__mocks__/ajax';
import mockReactComponent from '../../../../__mocks__/mockReactComponent';

jest.mock('@mui/material/Backdrop', () => mockReactComponent('@mui/material/Backdrop'));
jest.mock('@mui/material/Snackbar', () => mockReactComponent('@mui/material/Snackbar'));

// eslint-disable-next-line import/first
import NeonPage, { NeonErrorPage } from '../NeonPage';

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
  test('renders a basic functional page with no props', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with a title and subtitle', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage title="Title" subtitle="Subtitle" showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with loading message', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage loading="Loading" outerPageContainerMaxWidth="3333px" showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with loading message and progress', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage loading="Loading" progress={62} showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with an error', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage error="Fail" showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with a notification', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage notification="Notification" showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with a custom header/footer', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage customHeader={<div>Header</div>} customFooter={<div>Header</div>} showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>,
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with custom sidebar content', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage sidebarContent={<div>Sidebar</div>} showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders sidebar items as skeletons when in appropriate state', () => {
    const tree = renderer.create(
      <MockTheme>
        <NeonPage sidebarContent={<div>Sidebar</div>} sidebarTitle="foo" loading="Loading" showHeaderSkeleton showFooterSkeleton>
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
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
    const tree = renderer.create(
      <MockTheme>
        <NeonPage
          sidebarLinks={sidebarLinks}
          sidebarTitle="foo"
          sidebarSubtitle="bar"
          sidebarLinksAdditionalContent={<div>More</div>}
          showHeaderSkeleton
          showFooterSkeleton
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders with sidebar links as standlone children', () => {
    const StubComponentA = () => <div>stub component A</div>;
    const StubComponentB = () => <div>stub component B</div>;
    const sidebarLinks = [
      { name: 'Section A', hash: '#sectionA', component: StubComponentA },
      { name: 'Section B', hash: '#sectionA', component: StubComponentB },
    ];
    const tree = renderer.create(
      <MockTheme>
        <NeonPage
          sidebarLinks={sidebarLinks}
          sidebarWidth={422}
          sidebarUnsticky
          sidebarContainerClassName="sidebarClassName"
          sidebarLinksAsStandaloneChildren
          showHeaderSkeleton
          showFooterSkeleton
        >
          <div>content</div>
        </NeonPage>
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('NeonErrorPage', () => {
    const error = {
      message: 'fail',
      stack: 'Disregard; this is console.error() call is expected in the NeonErrorPage test',
    };
    const tree = renderer.create(
      <MockTheme>
        <NeonErrorPage error={error} resetErrorBoundary={() => {}} />
      </MockTheme>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
