/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

import { useErrorBoundary } from 'react-error-boundary';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import PropsTable from '../../../components/PropsTable';

import NeonPage from './NeonPage';
import Theme from '../Theme/Theme';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  exampleContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  example: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    border: `1px dotted ${theme.palette.primary.main}`,
  },
  propTableRowGrey: {
    backgroundColor: theme.palette.grey[50],
  },
}));

const propRows = [
  // breadcrumbHomeHref
  {
    name: 'breadcrumbHomeHref',
    type: 'string',
    default: '"/"',
    examples: '"https://www.neonscience.org"',
    description: (
      <p>
        The <tt>href</tt> for the home breadcrumb that is automatically included when providing an
        array of <tt>breadcrumbs</tt>. Useful if a NeonPage instance needs to refer to a different
        root home page in breadcrumbs than the current URL root.
      </p>
    ),
  },
  // breadcrumbs
  {
    name: 'breadcrumbs',
    type: 'array of objects',
    default: 'null',
    examples: (
      <CodeBlock>
        {`
[
  { name: 'Foo', href: '/foo' },
  { name: 'Bar', href: '/foo/bar' },
  { name: 'Current Page' },
]
        `}
      </CodeBlock>
    ),
    description: (
      <p>
        Array of objects describing the chain of breadcrumb links to show at the top of the page,
        above the title. Each object in the array must have a <tt>name</tt> string, and may
        optionally have an <tt>href</tt> string. When the <tt>href</tt> is not present the
        breadcrumb will appear as static text, not a link (this is usually intended for the last
        crumb in the chain representing the current page).
      </p>
    ),
  },
  // customFooter
  {
    name: 'customFooter',
    type: 'jsx',
    default: 'null',
    examples: (
      <CodeBlock>
        {`
<div>
  footer content
</div>
        `}
      </CodeBlock>
    ),
    description: (
      <p>
        A JSX nodeto be used as the page footer in place of the stock NEON Data Portal footer.
      </p>
    ),
  },
  // customHeader
  {
    name: 'customHeader',
    type: 'jsx',
    default: 'null',
    examples: (
      <CodeBlock>
        {`
<div>
  header content
</div>
        `}
      </CodeBlock>
    ),
    description: (
      <p>
        A JSX node to be used as the page header in place of the stock NEON Data Portal header.
      </p>
    ),
  },
  // error
  {
    name: 'error',
    type: 'string',
    default: 'null',
    examples: '"Error message"',
    description: (
      <p>
        An error message to be shown as a non-dismissable overlay over the page.
      </p>
    ),
  },
  // loading
  {
    name: 'loading',
    type: 'string',
    default: 'null',
    examples: '"Loading page..."',
    description: (
      <p>
        A loading message to be shown as a non-dismissable overlay with an indeterminate
        circular progress indicator over the page. If <tt>progress</tt> prop is set then the
        indicator will be determinate and specific.
      </p>
    ),
  },
  // notification
  {
    name: 'notification',
    type: 'string',
    default: 'null',
    examples: '"This page has been updated!"',
    description: (
      <p>
        A message to show in a dismissable notification element at the bottom right corner of the
        page (in addition to any LifeRay notifcations that may be loaded).
      </p>
    ),
  },
  // outerPageContainerMaxWidth
  {
    name: 'outerPageContainerMaxWidth',
    type: 'string',
    default: '"2000px"',
    description: (
      <p>
        CSS <tt>maxWidth</tt> setting to be applied to the outermost content container of the page.
        By default, at 2000px, the content on any NeonPage will not exceed that width. Override with
        a discrete pixel value or set to <tt>null</tt> to allow for arbitrarily wide content.
      </p>
    ),
  },
  // progress
  {
    name: 'progress',
    type: 'number',
    default: 'null',
    description: (
      <p>
        An integer between <tt>0</tt> and <tt>100</tt> indicating the quantified progress of loading
        the page. Must be combined with the <tt>loading</tt> prop to be visible.
      </p>
    ),
  },
  // resetStateAfterRuntimeError
  {
    name: 'resetStateAfterRuntimeError',
    type: 'function',
    default: 'no-op',
    description: (
      <p>
        A function that fires when there is a run-time error, triggering the generic NEON Error
        Page, and the user click the reset button. If not defined the default is action is to reload
        the page. Define this if certain state reset operations are worth doing when hitting a
        run-time error.
      </p>
    ),
  },
  // sidebarContent
  {
    name: 'sidebarContent',
    type: 'children (arbitrary jsx)',
    default: 'null',
    description: (
      <p>
        When the <tt>sidebarLinks</tt> behavior is too prescriptive and arbitrary content needs to
        be presented in the standard sidebar layout use this prop. Content will appear in the
        sidebar with presentation of the sidebar itself, relative to viewport size, consistent with
        the standard link-based sidebar. If <tt>sidebarLinks</tt> and <tt>sidebarContent</tt> are
        both defined then <tt>sidebarContent</tt> will override <tt>sidebarLinks</tt> entirely.
      </p>
    ),
  },
  // sidebarContentResponsive
  {
    name: 'sidebarContentResponsive',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        When the <tt>sidebarContent</tt> is set and the responsive behavior of the sidebar
        is desired, set this property to true. Otherwise, by default, the behavior
        of the sidebar is up to the implementation of the <tt>sidebarContent</tt>.
      </p>
    ),
  },
  // sidebarContainerClassName
  {
    name: 'sidebarContainerClassName',
    type: 'string (that maps to a className generated by useStyles)',
    default: 'null',
    description: (
      <p>
        This prop may be supplied to override CSS behavior of the outermost element for the
        rendered sidebar. This className will be <i>appended</i> to the default className, allowing
        for fine-grain overrides / extensions.
      </p>
    ),
  },
  // sidebarLinks
  {
    name: 'sidebarLinks',
    type: 'array of objects',
    default: 'null',
    examples: (
      <CodeBlock>
        {`
import FooIcon from '@material-ui/icons/Foo';
import MyComponent from './MyComponent';

const sidebarLinks = [
  { name: 'Section A' },
  { name: 'Section B', pageTitle: 'This is B', hash: '#sectionB' },
  { name: 'Section C', hash: '#sectionC', icon: FooIcon },
  { name: 'Section D', hash: '#sectionD', component: MyComponent },
];
        `}
      </CodeBlock>
    ),
    description: (
      <>
        <p>
          Array of objects describing links to appear in the page sidebar navigation.
        </p>
        <p>
          Each object requires a <tt>name</tt> string, which is what appears visually in the
          sidebar. The optional <tt>hash</tt> string is used to route internally around the page to
          elements by id (if not supplied then defaults to <tt>&apos;#&apos;</tt>).
        </p>
        <p>
          Supply an icon component to the optional <tt>icon</tt> property to show an icon with the
          name of the link in the sidebar. Finally, the <tt>component</tt> attribute can take an
          arbitrary React component to override the default behavior of standard HTML named-anchor
          linking and instead replace all page content with the associated component. This latter
          approach is how this Portal Core Components documentation functions.
        </p>
        <p>
          Finally, when <tt>sidebarLinksAsStandaloneChildren</tt> is <tt>true</tt>, the title of
          the page can be overridden on a per-sidebar-link basis by setting a <tt>pageTitle</tt>.
        </p>
      </>
    ),
  },
  // sidebarLinksAdditionalContent
  {
    name: 'sidebarLinksAdditionalContent',
    type: 'children (arbitrary jsx)',
    default: 'null',
    description: (
      <p>
        When wanting to use the regular pattern of <tt>sidebarLinks</tt> but some additional UI is
        needed in the sidebar this prop can be used to inject arbitrary content between the
        sidebar title/subtitle and the links container, flanked by dividers.
      </p>
    ),
  },
  // sidebarLinksAsStandaloneChildren
  {
    name: 'sidebarLinksAsStandaloneChildren',
    type: 'boolean',
    default: 'false',
    description: (
      <p>
        Set to <tt>true</tt> to have the NeonPage override any children supplied to it and instead
        render only the current component in <tt>sidebarLinks</tt> at a time. This behavior is
        exhibited here in the Portal Core Components documentation. When using this mode it is still
        necessary to provide the default component as a child to the NeonPage instance, in addition
        to providing a non-empty <tt>sidebarLinks</tt> prop where every object in the array has a
        defined <tt>component</tt>.
      </p>
    ),
  },
  // sidebarSubtitle
  {
    name: 'sidebarSubtitle',
    type: 'number',
    default: 'null',
    examples: '"Additional Info"',
    description: (
      <p>
        An optional smaller title to show below the title of the of the sidebar.
      </p>
    ),
  },
  // sidebarTitle
  {
    name: 'sidebarTitle',
    type: 'number',
    default: 'null',
    examples: '"Page Links"',
    description: (
      <p>
        When <tt>sidebarLinks</tt> are defined the sidebar will feature a title at the top to
        maintain context. By default the <tt>title</tt> prop is used. Define this prop when the
        title that should appear in the sidebar should differ from the one used for the NeonPage.
      </p>
    ),
  },
  // sidebarUnsticky
  {
    name: 'sidebarUnsticky',
    type: 'boolean',
    default: 'false',
    description: (
      <>
        <p>
          When a sidebar has enough links or content the sticky positioning can become a hinderance.
          This is especially true when used on a page with very tall content or infinitely tall
          content (requiring a user to scroll to the footer to see the bottom of the sidebar
          content, which may not be possible in an infinite-scroll situation).
        </p>
        <p>
          Add the <tt>sidebarUnsticky</tt> boolean prop to disable stickiness. The resulting sidebar
          will not have sticky behavior and instead scroll with the rest of the page. The difference
          in behavior is only visible at and above the medium breakpoint.
        </p>
      </>
    ),
  },
  // sidebarWidth
  {
    name: 'sidebarWidth',
    type: 'number',
    default: '300',
    examples: (
      <tt>200, 400</tt>
    ),
    description: (
      <p>
        Width of the sidebar for viewports at or above the medium breakpoint (960 pixels wide).
        Override with any pixel value when the content to appear in the sidebar for a given page is
        known to require more or less horizontal space. Does not affect width at or below the small
        breakpoint (&lt;960 pixels) as the sidebar width at that viewport size is always 100%.
      </p>
    ),
  },
  // subtitle
  {
    name: 'subtitle',
    type: 'string',
    default: 'null',
    description: (
      <p>
        Optional page-level title to appear below the main title (set by the <tt>title</tt>) prop.
      </p>
    ),
  },
  // title
  {
    name: 'title',
    type: 'string',
    default: 'null',
    description: (
      <p>
        Optional page-level title to appear prominently at the top of the page.
      </p>
    ),
  },
];

export default function StyleGuide() {
  const classes = useStyles(Theme);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lifecycleRunTimeError, setLifecycleRunTimeError] = useState(false);
  const { showBoundary } = useErrorBoundary();

  const breadcrumbs = [
    { name: 'Breadcrumb 1', href: '/bc1' },
    { name: 'Breadcrumb 2', href: '/bc2' },
    { name: 'My Neon Page' },
  ];

  const notification = 'Here is a sample NeonPage notification with a <a href="https://github.com/NEONScience/portal-core-components/">link</a>.';

  const skeletionGrid = (
    <Grid item xs={4}>
      <Skeleton variant="rect" width="100%" height={100} />
      <br />
      <Skeleton variant="rect" width="100%" height={16} />
      <br />
      <Skeleton variant="rect" width="60%" height={16} />
    </Grid>
  );

  const buttonProps = {
    variant: 'contained',
    style: { zIndex: 10000 },
  };

  const skeletonsLink = (
    <Link href="https://material-ui.com/components/skeleton/">Material UI Skeletons</Link>
  );

  const reactErrorBoundaryLink = (
    <Link href="https://www.npmjs.com/package/react-error-boundary">
      react-error-boundary
    </Link>
  );
  const useErrorBoundaryLink = (
    <Link href="https://www.npmjs.com/package/react-error-boundary#useerrorhandlererror-error">
      useErrorBoundary()
    </Link>
  );

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

  return (
    <>

      <DocBlock>
        The standard component for generating a page on the Data Portal with a consistent header,
        footer, and page styles.
      </DocBlock>
      <DocBlock>
        NeonPage encapsulates the <Link href="#Theme">NEON Material UI Theme</Link>, eliminating
        the need to put ThemeProvider and CssBaseline boilerplate in individual pages. It also
        affords props for universal page features like titles, breadcrumbs, and sidebar navigation.
      </DocBlock>
      <CodeBlock>
        {`
import NeonPage from 'portal-core-components/lib/components/NeonPage';
        `}
      </CodeBlock>

      <Typography variant="h4" component="h2" gutterBottom>Props</Typography>

      <DocBlock>
        <PropsTable props={propRows} />
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Usage</Typography>

      <DocBlock>
        A NeonPage can be invoked with no props at all, containing only child node(s) for content.
      </DocBlock>
      <ExampleBlock>
        <div className={classes.example}>
          <NeonPage>
            <Typography>Content</Typography>
            <Typography>More content</Typography>
            <a href="#">Link (a tag)</a>
            <br />
            <Link href="#">Link (component)</Link>
          </NeonPage>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
<NeonPage>
  <Typography>Content</Typography>
  <Typography>More content</Typography>
  <a href="#">Link (a tag)</a>
  <br />
  <Link href="#">Link (component)</Link>
</NeonPage>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Title</Typography>

      <DocBlock>
        Use the <tt>title</tt> prop to set a page title consistent with the
        common theme.
      </DocBlock>
      <ExampleBlock>
        <div className={classes.example}>
          <NeonPage title="My Neon Page">
            <Typography>Content</Typography>
          </NeonPage>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
<NeonPage title="My Neon Page">
  <Typography>Content</Typography>
</NeonPage>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Sidebar Content</Typography>

      <DocBlock>
        Use the <tt>sidebarContent</tt> prop to set custom sidebar content.
      </DocBlock>
      <ExampleBlock>
        <div className={classes.example}>
          <NeonPage
            title="My Neon Page"
            sidebarTitle="Sidebar Title"
            sidebarSubtitle="Sidebar Subtitle"
            sidebarContent={(<Typography>Sidebar Content</Typography>)}
            sidebarContentResponsive
          >
            <Typography>Content</Typography>
          </NeonPage>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
<NeonPage
  title="My Neon Page"
  sidebarTitle="Sidebar Title"
  sidebarSubtitle="Sidebar Subtitle"
  sidebarContent={(<Typography>Sidebar Content</Typography>)}
  sidebarContentResponsive
>
  <Typography>Content</Typography>
</NeonPage>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Breadcrumbs</Typography>

      <DocBlock>
        Use the <tt>breadcrumbs</tt> prop to set a breadcrumbs nav element above
        the page title in a manner consistent with the common theme and other pages.
      </DocBlock>
      <DocBlock>
        This prop is defined as an array of objects, each containing
        a <tt>name</tt> string. All but the last element in the array also
        must contain an <tt>href</tt> string.
      </DocBlock>
      <DocBlock>
        Note that the initial <i>Home</i> breadcrumb link is automatically generated and does not
        need to be defined in <tt>breadcrumbs</tt>. The home breadcrumb will, by default, have an
        href of <tt>/</tt>. This can be overridden using the <tt>breadcrumbHomeHref</tt> prop.
      </DocBlock>
      <ExampleBlock>
        <div className={classes.example}>
          <NeonPage
            title="My Neon Page"
            breadcrumbs={breadcrumbs}
            breadcrumbHomeHref="https://www.neonscience.org/"
          >
            <Typography>Content</Typography>
          </NeonPage>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
const breadcrumbs = [
  { name: 'Breadcrumb 1', href: '/bc1' },
  { name: 'Breadcrumb 2', href: '/bc2' },
  { name: 'My Neon Page' },
];

export default function MyNeonPage() {
  return (
    <NeonPage
      title="My Neon Page"
      breadcrumbs={breadcrumbs}
      breadcrumbHomeHref="https://www.neonscience.org/"
    >
      <Typography>Content</Typography>
    </NeonPage>
  );
}
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Loading</Typography>

      <DocBlock>
        Use the <tt>loading</tt> prop to show a generic common full-page loading
        state with a custom message. Note this takes the place of the title element,
        so a defined <tt>title</tt> prop will not be shown. Children will also not
        be rendered while <tt>loading</tt> is defined. Breadcrumbs will be rendered,
        however, if defined.
      </DocBlock>
      <ExampleBlock>
        <div className={classes.exampleContainer}>
          <Button {...buttonProps} onClick={() => setIsLoading(!isLoading)}>
            {`${isLoading ? 'Hide' : 'Show'} Loading`}
          </Button>
          <div className={classes.example} style={{ marginTop: '24px' }}>
            <NeonPage
              title="My Neon Page"
              breadcrumbs={breadcrumbs}
              loading={isLoading ? 'Loading My Neon Page...' : null}
            >
              <Typography>Content</Typography>
            </NeonPage>
          </div>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
const breadcrumbs = [
  { name: 'Breadcrumb 1', href: '/bc1' },
  { name: 'Breadcrumb 2', href: '/bc2' },
  { name: 'My Neon Page' },
];

export default function MyNeonPage() {
  return (
    <NeonPage
      title="My Neon Page"
      breadcrumbs={breadcrumbs}
      loading="Loading My Neon Page..."
    >
      <Typography>Content</Typography>
    </NeonPage>
  );
}
        `}
      </CodeBlock>

      <DocBlock>
        A <tt>loading</tt> prop on its own will show an indeterminate spinner. If
        quantifiable progress is available it can also be fed to the page using
        the <tt>progress</tt> prop. This maps directly to the <tt>value</tt> prop
        on the Matrial UI CircularProgress component, and therefore should be a
        number ranging from 0 to 100.
      </DocBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Error</Typography>

      <DocBlock>
        Use the <tt>error</tt> prop to show a generic common full-page error
        state with a custom message. Note this takes the place of the title element,
        so a defined <tt>title</tt> prop will not be shown. Children will also not
        be rendered while <tt>error</tt> is defined. Breadcrumbs will be rendered,
        however, if defined.
      </DocBlock>
      <ExampleBlock>
        <div className={classes.exampleContainer}>
          <Button {...buttonProps} onClick={() => setIsError(!isError)}>
            {`${isError ? 'Hide' : 'Show'} Error`}
          </Button>
          <div className={classes.example} style={{ marginTop: '24px' }}>
            <NeonPage
              title="My Neon Page"
              breadcrumbs={breadcrumbs}
              error={isError ? 'Page failed to load' : null}
            >
              <Typography>Content</Typography>
            </NeonPage>
          </div>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
const breadcrumbs = [
  { name: 'Breadcrumb 1', href: '/bc1' },
  { name: 'Breadcrumb 2', href: '/bc2' },
  { name: 'My Neon Page' },
];

export default function MyNeonPage() {
  return (
    <NeonPage
      title="My Neon Page"
      breadcrumbs={breadcrumbs}
      error="Page failed to load"
    >
      <Typography>Content</Typography>
    </NeonPage>
  );
}
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Notifications</Typography>

      <DocBlock>
        Any NeonPage instance will, upon loading, query the notifications endpoint for any
        site-wide notifications. These will be displayed together in a single element at the lower
        right corner of the page. An active notification can be closed, and closed notifications
        can be reshown using the bell icon in the menu (which only appears when notifications are
        present).
      </DocBlock>
      <DocBlock>
        Notifications can also be injected directly using the <tt>notification</tt> prop.
        If this prop is set then the fetch for site-wide notifications will not fire.
        A notification can contain HTML but should be a string, not JSX.
      </DocBlock>
      <ExampleBlock>
        <div className={classes.example}>
          <NeonPage notification={notification}>
            <Typography>Content</Typography>
          </NeonPage>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
const notification = 'Here is a sample NeonPage notification with a <a href="https://github.com/NEONScience/portal-core-components/">link</a>.';

<NeonPage notification={notification}>
  <Typography>Content</Typography>
</NeonPage>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Headers and Footers</Typography>
      <DocBlock>
        By default NeonPage will pull Header and Footer content from the NeonScience.org Drupal
        site. If the fetch fails then core components has a cached copy to use instead.
      </DocBlock>
      <DocBlock>
        NeonPage can also optionally render an entirely custom header or footer using
        the <tt>customHeader</tt> and <tt>customFooter</tt> props. These props are independent of
        one another, so for example using the core or drupal footer with a custom header is
        supported.
      </DocBlock>
      <ExampleBlock>
        <div className={classes.example}>
          <NeonPage
            title="My Neon Page"
            customHeader={customHeader}
            customFooter={customFooter}
          >
            <Typography>Content</Typography>
          </NeonPage>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
export default function MyNeonPage() {
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
  return (
    <NeonPage
      title="My Neon Page"
      customHeader={customHeader}
      customFooter={customFooter}
    >
      <Typography>Content</Typography>
    </NeonPage>
  );
}
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Loading With Skeletons</Typography>

      <DocBlock>
        The NeonPage is designed to show its content, whatever it is, regardless of the loading
        or error states. One way to take advantage of this is to provide  content composed
        of {skeletonsLink} until loaded. The example below shows what this might look like during
        a loading state.
      </DocBlock>
      <DocBlock>
        The title will automatically render as a skeleton if either the <tt>loading</tt> or
        <tt>error</tt> props are truthy and the <tt>title</tt> prop is falsey (i.e. not defined).
      </DocBlock>
      <ExampleBlock>
        <div className={classes.example} style={{ maxHeight: '600px', overflowY: 'scroll' }}>
          <NeonPage breadcrumbs={breadcrumbs}>
            <Grid container spacing={3}>
              {skeletionGrid}
              {skeletionGrid}
              {skeletionGrid}
            </Grid>
            <br />
            <br />
            <Grid container spacing={3}>
              {skeletionGrid}
              {skeletionGrid}
            </Grid>
          </NeonPage>
        </div>
      </ExampleBlock>
      <CodeBlock>
        {`
const breadcrumbs = [
  { name: 'Breadcrumb 1', href: '/bc1' },
  { name: 'Breadcrumb 2', href: '/bc2' },
  { name: 'My Neon Page' },
];

const skeletionGrid = (
  <Grid item xs={4}>
    <Skeleton variant="rect" width="100%" height={100} />
    <br />
    <Skeleton variant="rect" width="100%" height={16} />
    <br />
    <Skeleton variant="rect" width="60%" height={16} />
  </Grid>
);

export default function MyNeonPage() {
  return (
    <NeonPage
      breadcrumbs={breadcrumbs}
    >
      <Grid container spacing={3}>
        {skeletionGrid}
        {skeletionGrid}
        {skeletionGrid}
      </Grid>
      <br />
      <br />
      <Grid container spacing={3}>
        {skeletionGrid}
        {skeletionGrid}
      </Grid>
    </NeonPage>
  );
}
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Run-Time Error Handling</Typography>
      <DocBlock>
        All NeonPage instances are wrapped in an error boundary to catch any run-time errors. If
        a run-time error is caught the user will see a generic NEON error page with the option
        to reset it and try again.
      </DocBlock>
      <DocBlock>
        Use the <tt>resetStateAfterRuntimeError</tt> prop to fire additional logic when the reset
        button is pressed (e.g. to modify state).
      </DocBlock>
      <DocBlock>
        Click the buttons below to see contrived examples of run-time errors. Note that there are
        limitations to what types of errors can be caught by the general error boundary and how.
      </DocBlock>
      <DocBlock>
        First, reference the {reactErrorBoundaryLink} npm library; this is what is used to make the
        the error boundary work. Just by using a NeonPage all <b>React lifecycle errors</b> will be
        caught (e.g. errors when rendering). Errors from events, async functions, and other sources
        require using the react-error-boundary {useErrorBoundaryLink} hook as an error handler.
      </DocBlock>
      <ExampleBlock>
        <Button
          variant="outlined"
          onClick={() => { setLifecycleRunTimeError(true); }}
        >
          Trigger Run-Time Error (React Lifecycle)
          {!lifecycleRunTimeError ? null : lifecycleRunTimeError.triggered()}
        </Button>
        <Button
          variant="outlined"
          onClick={() => { showBoundary(new Error('Event run-time error triggered!')); }}
        >
          Trigger Run-Time Error (Event)
        </Button>
      </ExampleBlock>
      <CodeBlock>
        {`
import React, { useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import Button from '@material-ui/core/Button';

export default function TriggerRunTimeErrorButtons() {
  const [lifecycleRunTimeError, setLifecycleRunTimeError] = useState(false);
  const { showBoundary } = useErrorBoundary();
  return (
    <div>

      <Button onClick={() => { setLifecycleRunTimeError(true); }}>
        Trigger Run-Time Error (React Lifecycle)
        {!lifecycleRunTimeError ? null : lifecycleRunTimeError.triggered()}
      </Button>

      <Button onClick={() => { showBoundary(new Error('Event run-time error triggered!')); }}>
        Trigger Run-Time Error (Event)
      </Button>

    </div>
  );
}
        `}
      </CodeBlock>

    </>
  );
}
