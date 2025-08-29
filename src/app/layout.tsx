/* eslint-disable @next/next/no-css-tags */
/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-danger */
/* eslint-disable react/self-closing-comp */
/* eslint-disable quotes */

import React from 'react';
import type { Metadata } from 'next';

import './assets/css/drupal-fonts.css';

// DO NOT REMOVE OR EDIT THIS LINE WITHOUT UPDATING
// scripts/lib-cache-remote-assets.js
// This hash will be updated whenever fresh cached
// assets are fetched.
// -----------------------------------------------------------------------------
const DRUPAL_THEME_CSS_ASSET_HASH = 'c12ee9878c2546595e186d8f3917da9c';
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'NEON | Portal Core Components',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/core-components-next/manifest.json" />
        <link rel="shortcut icon" href="/core-components-next/favicon.ico?v=201912" />
        <link rel="preconnect" href="https://www.neonscience.org" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          data-meta="drupal-theme"
          href={`/core-components-next/assets/css/drupal-theme.${DRUPAL_THEME_CSS_ASSET_HASH}.min.css`}
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <script
          src="https://code.jquery.com/jquery-3.5.0.min.js"
          integrity="sha256-xNzN2a4ltkB44Mc/Jz3pT4iU1cmeR0FkXs4pru/JxaQ="
          crossOrigin="anonymous"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.gtmDataLayer = [{ page_category: "Core Components" }];`,
          }}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function (w, d, s, l, i) {
              w[l] = w[l] || [];
              w[l].push({
                "gtm.start": new Date().getTime(),
                event: "gtm.js",
              });
              var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
              j.async = true;
              j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
              f.parentNode.insertBefore(j, f);
            })(window, document, "script", "gtmDataLayer", "GTM-K4S83R2");
          `,
          }}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.NEON_SERVER_DATA = "__NEON_SERVER_DATA__";`,
          }}
        ></script>
      </head>
      <body>
        <noscript> You need to enable JavaScript to run this app. </noscript>
        <noscript>
          <iframe
            title="GTM JavaScript Required"
            src="https://www.googletagmanager.com/ns.html?id=GTM-K4S83R2"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          ></iframe>
        </noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
