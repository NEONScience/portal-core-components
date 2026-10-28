import React, { useRef } from 'react';

import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

/**
 * Viewport range that displays the inline search box.
 */
export const SEARCH_BOX_MEDIA_QUERY = '@media (min-width:600px) and (max-width:1499.95px)';
/**
 * Viewport range that displays the search panel toggle button.
 */
export const SEARCH_TOGGLE_MEDIA_QUERY = '@media (max-width:599.95px)';
/**
 * Query parameter name used by the Drupal site search form.
 */
export const SEARCH_QUERY_PARAM = 'title';

const FONT_FAMILY = '"Inter",Helvetica,Arial,sans-serif';

// Rules are scoped beneath #header to take precedence over the element level
// rules applied to form controls by the Drupal header CSS.
const useStyles = makeStyles()((theme: NeonTheme) => {
  const { LIGHT_BLUE, NEON_BLUE, GREY } = theme.colors;
  return {
    searchBox: {
      '#header &': {
        display: 'none',
        position: 'absolute',
        top: '50%',
        right: '100%',
        transform: 'translateY(-50%)',
        alignItems: 'center',
        boxSizing: 'border-box',
        width: '220px',
        height: '36px',
        margin: '0px 20px 0px 0px',
        padding: '0px 3px 0px 0px',
        border: `1px solid ${GREY[200]}`,
        borderRadius: '3px',
        backgroundColor: GREY[50],
        textAlign: 'left',
        transition: 'width 0.25s ease, background-color 0.2s ease, '
          + 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: GREY[300],
          backgroundColor: '#ffffff',
        },
        '&:focus-within': {
          width: '260px',
          borderColor: LIGHT_BLUE[500],
          backgroundColor: '#ffffff',
          boxShadow: `0px 0px 0px 3px ${LIGHT_BLUE[500]}33`,
        },
        '& input[type=search]': {
          flex: '1 1 auto',
          minWidth: 0,
          height: '100%',
          margin: 0,
          padding: '0px 8px 0px 16px',
          border: 'none',
          borderRadius: 0,
          outline: 'none',
          boxShadow: 'none',
          background: 'transparent',
          appearance: 'none',
          color: '#141516',
          fontFamily: FONT_FAMILY,
          // 16px prevents iOS Safari from zooming the page on focus
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: 'normal',
        },
        '& input[type=search]::placeholder': {
          color: GREY[500],
          opacity: 1,
        },
        '& button[type=submit]': {
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          margin: 0,
          padding: 0,
          border: 'none',
          borderRadius: '50%',
          background: 'transparent',
          color: LIGHT_BLUE[500],
          cursor: 'pointer',
          transition: 'background-color 0.2s ease, color 0.2s ease',
        },
        '& button[type=submit]:hover': {
          backgroundColor: LIGHT_BLUE[50],
        },
        '& button[type=submit]:focus-visible': {
          outline: `2px solid ${LIGHT_BLUE[500]}`,
          outlineOffset: '1px',
        },
        // Highlight the embedded search button once there is a query to submit
        '& input[type=search]:not(:placeholder-shown) + button[type=submit]': {
          backgroundColor: LIGHT_BLUE[500],
          color: '#ffffff',
        },
        '& input[type=search]:not(:placeholder-shown) + button[type=submit]:hover': {
          backgroundColor: NEON_BLUE[700],
        },
        '@media (min-width:1100px)': {
          width: '280px',
          height: '40px',
          marginRight: '20px',
          paddingRight: '4px',
          borderRadius: '3px',
          '&:focus-within': {
            width: '320px',
          },
          '& button[type=submit]': {
            width: '32px',
            height: '32px',
          },
        },
        [SEARCH_BOX_MEDIA_QUERY]: {
          display: 'flex',
        },
      },
    },
    searchToggle: {
      '#header &': {
        display: 'none',
        position: 'absolute',
        top: '50%',
        right: '100%',
        transform: 'translateY(-50%)',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: '36px',
        height: '36px',
        margin: '0px 8px 0px 0px',
        padding: 0,
        border: 'none',
        borderRadius: '50%',
        background: 'transparent',
        color: LIGHT_BLUE[500],
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        '&:hover': {
          backgroundColor: LIGHT_BLUE[50],
        },
        '&:focus-visible': {
          outline: `2px solid ${LIGHT_BLUE[500]}`,
          outlineOffset: '1px',
        },
        '&[aria-expanded="true"]': {
          backgroundColor: LIGHT_BLUE[500],
          color: '#ffffff',
        },
        // Compact sizing to avoid overlapping the logo on the narrowest viewports
        '@media (max-width:359.95px)': {
          width: '32px',
          height: '32px',
          marginRight: '12px',
        },
        [SEARCH_TOGGLE_MEDIA_QUERY]: {
          display: 'flex',
        },
      },
    },
  };
});

const SearchIcon = (): React.JSX.Element => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="2" />
    <path d="M13.5 13.5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export interface HeaderSearchProps {
  /**
   * Fully qualified URL of the site search page.
   */
  searchAction: string;
  /**
   * ID of the header search panel element controlled by the toggle.
   */
  searchPanelId: string;
  /**
   * Whether the header search panel is currently open.
   */
  searchPanelOpen: boolean;
  /**
   * Handler for toggling the header search panel.
   */
  onToggleSearchPanel: () => void;
  /**
   * Ref to the search panel toggle button.
   */
  toggleRef?: React.Ref<HTMLButtonElement>;
}

/**
 * Renders the customized header search: an inline search box that submits
 * the site search directly, and a toggle button for opening the header
 * search panel. Each is displayed only within its viewport range.
 */
const HeaderSearch = (props: HeaderSearchProps): React.JSX.Element => {
  const {
    searchAction,
    searchPanelId,
    searchPanelOpen,
    onToggleSearchPanel,
    toggleRef,
  } = props;
  const { classes } = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>): void => {
    const input = inputRef.current;
    if (input && (input.value.trim().length <= 0)) {
      event.preventDefault();
      input.focus();
    }
  };
  return (
    <>
      <form
        role="search"
        action={searchAction}
        method="get"
        className={classes.searchBox}
        onSubmit={handleSubmit}
        data-selenium="neon-header.search-box"
      >
        <input
          ref={inputRef}
          type="search"
          name={SEARCH_QUERY_PARAM}
          placeholder="Search"
          aria-label="Search"
          title="Enter the terms you wish to search for."
          maxLength={128}
          enterKeyHint="search"
        />
        <button type="submit" aria-label="Search">
          <SearchIcon />
        </button>
      </form>
      <button
        ref={toggleRef}
        type="button"
        className={classes.searchToggle}
        aria-label="Open search"
        aria-controls={searchPanelId}
        aria-expanded={searchPanelOpen}
        onClick={onToggleSearchPanel}
        data-selenium="neon-header.search-toggle"
      >
        <SearchIcon />
      </button>
    </>
  );
};

export default HeaderSearch;
