/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/anchor-is-valid */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import DownloadDataButton from './DownloadDataButton';

import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import Theme from '../Theme/Theme';

import sampleProductData from '../../../sampleData/DP1.10017.001.json';
import sampleProductDataAeronet from '../../../sampleData/DP1.00043.001.json';
import sampleProductDataAop from '../../../sampleData/DP1.30010.001.json';
import sampleProductDataAopOSPipeline from '../../../sampleData/DP1.30012.001.json';
import sampleProductDataBold from '../../../sampleData/DP1.20105.001.json';
import sampleProductDataMGRast from '../../../sampleData/DP1.10107.001.json';
import sampleProductDataNPN from '../../../sampleData/DP1.10055.001.json';
import sampleProductDataPhenocam from '../../../sampleData/DP1.00033.001.json';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const downloadDataContextLink = (
    <Link
      href="#DownloadDataContext"
    >
      Download Data Context
    </Link>
  );

  return (
    <>

      <DocBlock>
        A button to launch the Download Data Dialog.
      </DocBlock>
      <CodeBlock>
        {`
import DownloadDataButton from 'portal-core-components/lib/components/DownloadDataButton';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        The Download Data Button depends on the {downloadDataContextLink} for all
        state. If the context has no props other than <tt>productData</tt> then
        the Download Data Button will appear clickable and the <b>Download Data Dialog</b> it
        opens when clicked will contain no selections.
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider productData={sampleProductData.data}>
          <DownloadDataButton />
        </DownloadDataContext.Provider>
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataButton from 'portal-core-components/lib/components/DownloadDataButton';
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';

const productData = {
  productCode: 'DPX.00001.001',
  productName: '2D wind speed and direction',
  siteCodes: [
    {
      "siteCode": "ABBY",
      "availableMonths": [ "2016-04", "2016-05", ... ],
    },
    {
      "siteCode": "BART",
      "availableMonths": [ "2014-10", "2014-12", ... ],
    },
    ...
  ],
  ...
};

<DownloadDataContext.Provider productData={productData}>
  <DownloadDataButton />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Custom Label</Typography>

      <DocBlock>
        Pass the <tt>label</tt> prop to customize the button text.
      </DocBlock>
      <ExampleBlock>
        <DownloadDataContext.Provider productData={sampleProductData.data}>
          <DownloadDataButton label="Fetch My Data" />
        </DownloadDataContext.Provider>
      </ExampleBlock>
      <CodeBlock>
        {`
import DownloadDataButton from 'portal-core-components/lib/components/DownloadDataButton';
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';

const productData = {...};

<DownloadDataContext.Provider productData={productData}>
  <DownloadDataButton label="Fetch My Data" />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Dynamic Download Step Generation</Typography>

      <DocBlock>
        The dialog launched by the download button has all necessary logic encapsulated within
        to determine the set of required download steps, if any, and present a meaningful
        download workflow for all types of data products. See examples below for variation
        in the download workflow.
      </DocBlock>
      <ExampleBlock>
        <div>
          <DownloadDataContext.Provider productData={sampleProductDataAop.data}>
            <DownloadDataButton label="Download AOP Data" />
          </DownloadDataContext.Provider>
          <br /><br />
          <DownloadDataContext.Provider productData={sampleProductDataAopOSPipeline.data}>
            <DownloadDataButton label="Download AOP Data (published via OS Pipeline)" />
          </DownloadDataContext.Provider>
          <br /><br />
          <DownloadDataContext.Provider productData={sampleProductDataAeronet.data}>
            <DownloadDataButton label="Download Aeronet Data" />
          </DownloadDataContext.Provider>
          <br /><br />
          <DownloadDataContext.Provider productData={sampleProductData.data}>
            <DownloadDataButton label="Download AmeriFlux Data" />
          </DownloadDataContext.Provider>
          <br /><br />
          <DownloadDataContext.Provider productData={sampleProductDataBold.data}>
            <DownloadDataButton label="Download Bold Data" />
          </DownloadDataContext.Provider>
          <br /><br />
          <DownloadDataContext.Provider productData={sampleProductDataMGRast.data}>
            <DownloadDataButton label="Download MGRast Data" />
          </DownloadDataContext.Provider>
          <br /><br />
          <DownloadDataContext.Provider productData={sampleProductDataNPN.data}>
            <DownloadDataButton label="Download NPN Data" />
          </DownloadDataContext.Provider>
          <br /><br />
          <DownloadDataContext.Provider productData={sampleProductDataPhenocam.data}>
            <DownloadDataButton label="Download Phenocam Data" />
          </DownloadDataContext.Provider>
        </div>
      </ExampleBlock>

    </>
  );
}
