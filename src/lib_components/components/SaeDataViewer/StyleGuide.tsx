/* eslint react/jsx-one-expression-per-line: 0 */
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import NeonContext from '../NeonContext/NeonContext';
import saeDataProductsJSON from '../../staticJSON/saeDataProducts.json';

import SaeDataViewer from './SaeDataViewer';
import Theme from '../Theme/Theme';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  title: {
    fontWeight: 500,
    marginBottom: '8px',
  },
}));

const buttonFullWidthState = {
  states: [true, false, 'bogus'],
};

const SaeViewerDemo = (): JSX.Element => {
  const classes = useStyles(Theme);
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const {
    sites,
    // saeDataproducts: saeDataProductsJSON = { productCodes: [] },
  } = neonContextData;
  const { productCodes: saeDataProducts } = saeDataProductsJSON;
  const [isFullWidth, setFullWidth] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(1, 'year'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'day'));
  const [product, setProduct] = useState('DP1.00003.001');
  const [selectedSite, setSelectedSite] = useState('ABBY');
  const handleChange = (event: any) => {
    setFullWidth(event.target.value);
  };
  const handleChangeDatePicker = (rangeIndex: Number, event: any) => {
    if (rangeIndex === 0) {
      setStartDate(event);
    } else {
      setEndDate(event);
    }
  };
  const handleChangeProduct = (event: any) => {
    setProduct(event.target.value);
  };
  const handleChangeSite = (event: any) => {
    setSelectedSite(event.target.value);
  };
  function renderSiteList() {
    const sitesArray = Object.values(sites);
    // if (sitesArray !== undefined && sitesArray.length > 0) {
    //   const firstSite = (sitesArray[0] as any).siteCode;
    //   if (selectedSite === undefined) {
    //     setSelectedSite(firstSite);
    //   }
    // }
    return sitesArray.filter((site: any) => (site.terrain === 'TERRESTRIAL')).map((site: any) => ((
      <MenuItem key={site.siteCode} value={site.siteCode}>
        {`${site.siteCode}`}
      </MenuItem>
    )));
  }
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            id="site-select-label"
            className={classes.title}
          >
            NEON Site
          </Typography>
          <Select
            id="all-sites-select"
            aria-labelledby="site-select-label"
            margin="dense"
            variant="outlined"
            value={selectedSite}
            onChange={handleChangeSite}
            style={{ width: 'fit-content', marginBottom: '32px' }}
          >
            { renderSiteList() }
          </Select>
          <Typography
            variant="h5"
            component="h3"
            id="sae-product-select-label"
            className={classes.title}
          >
            Data Product
          </Typography>
          <Select
            id="all-sae-products-select"
            aria-labelledby="sae-product-select-label"
            margin="dense"
            variant="outlined"
            value={product}
            onChange={handleChangeProduct}
            style={{ width: 'fit-content', marginBottom: '32px' }}
          >
            { saeDataProducts.map((val: any) => ((
              <MenuItem key={val} value={val}>
                {`${val}`}
              </MenuItem>
            )))}
          </Select>
          <Typography
            variant="h5"
            component="h3"
            id="full-width-select-label"
            className={classes.title}
          >
            Date Range
          </Typography>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              data-selenium="date-range.start-input"
              disableFuture
              format="YYYY-mm-DD"
              inputVariant="outlined"
              label="From"
              minDate={moment().subtract(5, 'years')}
              maxDate={moment().subtract(1, 'day')}
              margin="dense"
              orientation="portrait"
              onChange={(value) => handleChangeDatePicker(0, value)}
              style={{ width: 'fit-content', marginBottom: Theme.spacing(2) }}
              value={startDate}
              views={['year', 'month', 'date']}
            />
            <DatePicker
              data-selenium="date-range.end-input"
              disableFuture
              format="YYYY-mm-DD"
              inputVariant="outlined"
              label="Through"
              minDate={moment().subtract(5, 'years')}
              maxDate={moment().subtract(1, 'day')}
              margin="dense"
              orientation="portrait"
              onChange={(value) => handleChangeDatePicker(1, value)}
              style={{ width: 'fit-content' }}
              value={endDate}
              views={['year', 'month', 'date']}
            />
          </MuiPickersUtilsProvider>
          <Typography
            variant="h5"
            component="h3"
            id="full-width-select-label"
            className={classes.title}
          >
            Is Full Width
          </Typography>
          <Select
            id="sae-viewer-width-select"
            aria-labelledby="full-width-select-label"
            margin="dense"
            variant="outlined"
            value={isFullWidth}
            onChange={handleChange}
            style={{ width: 'fit-content' }}
          >
            {buttonFullWidthState.states.map((val: any) => ((
              <MenuItem key={val} value={val}>
                {`${val}`}
              </MenuItem>
            )))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <SaeDataViewer
            isFullWidth={isFullWidth}
            site={selectedSite}
            product={product}
            startDate={startDate.format('YYYY-MM-DD')}
            endDate={endDate.format('YYYY-MM-DD')}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default function StyleGuide() {
  const classes = useStyles(Theme);

  return (
    <>
      <DocBlock>
        Button to launch visualization of SAE data in a new window or tab.
      </DocBlock>
      <CodeBlock>
        {`
import SaeDataViewer from 'portal-core-components/lib/components/SaeDataViewer';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        The SAE Data Viewer button defaults to taking up the full width unless
        isFullWidth is set to false in which case it fits contents.
      </DocBlock>
      <ExampleBlock>
        <SaeDataViewer isFullWidth={false} />
      </ExampleBlock>
      <CodeBlock>
        {`
<SaeDataViewer isFullWidth={false} />
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Demo</Typography>
      <ExampleBlock>
        <SaeViewerDemo />
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Failure State</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        Any invalid paramaters to the component are ignored. Invalid parameters can be passed to
        the SAE data viewer.
      </DocBlock>
    </>
  );
}
