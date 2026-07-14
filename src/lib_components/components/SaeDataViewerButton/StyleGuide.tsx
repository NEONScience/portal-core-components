import React, { useState } from 'react';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import moment from 'moment';

import SaeDataViewerButton from '@/components/SaeDataViewerButton/SaeDataViewerButton';
// import Theme from '@/components/Theme/Theme';
import { makeStyles } from '@/components/Theme/makeStyles';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';
import NeonContext from '../NeonContext/NeonContext';
import saeDataProductsJSON from '../../staticJSON/saeDataProducts.json';

const useStyles = makeStyles()((theme) => ({
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

const SaeViewerDemo = (): React.JSX.Element => {
  const { classes } = useStyles();
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const {
    sites,
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
  const handleChangeDatePicker = (rangeIndex: number, event: any) => {
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
    return sitesArray.filter((site: any) => (site.terrain === 'TERRESTRIAL')).map((site: any) => ((
      <MenuItem key={site.siteCode} value={site.siteCode}>
        {`${site.siteCode}`}
      </MenuItem>
    )));
  }
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
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
            {renderSiteList()}
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
            {saeDataProducts.map((val: any) => ((
              <MenuItem key={val} value={val}>
                {`${val}`}
              </MenuItem>
            )))}
          </Select>
          {/* <Typography
            variant="h5"
            component="h3"
            id="full-width-select-label"
            className={classes.title}
          >
            Date Range
          </Typography>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              data-selenium="date-range.start-input"
              disableFuture
              format="YYYY-mm-DD"
              label="From"
              minDate={moment(moment().subtract(5, 'years').format('YYYY-MM-dd'))}
              maxDate={moment(moment().subtract(1, 'day').format('YYYY-MM-dd'))}
              orientation="portrait"
              onChange={(value) => handleChangeDatePicker(0, value)}
              value={startDate}
              views={['day']}
              openTo="day"
            />
            <DatePicker
              data-selenium="date-range.end-input"
              disableFuture
              format="YYYY-mm-DD"
              label="Through"
              minDate={moment(moment().subtract(5, 'years').format('YYYY-MM-dd'))}
              maxDate={moment(moment().subtract(1, 'day').format('YYYY-MM-dd'))}
              orientation="portrait"
              onChange={(value) => handleChangeDatePicker(1, value)}
              value={endDate}
              views={['day']}
              openTo="day"
            />
          </LocalizationProvider> */}
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
        <Grid size={{ xs: 12 }}>
          <SaeDataViewerButton
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
  const { classes } = useStyles();

  return (
    <>
      <DocBlock>
        Button to launch visualization of SAE data in a new window or tab.
      </DocBlock>
      <CodeBlock>
        {`
import SaeDataViewerButton from 'portal-core-components/lib/components/SaeDataViewerButton';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        The SAE Data Viewer button defaults to taking up the full width unless
        isFullWidth is set to false in which case it fits contents.
      </DocBlock>
      <ExampleBlock>
        <SaeDataViewerButton isFullWidth={false} />
      </ExampleBlock>
      <CodeBlock>
        {`
<SaeDataViewerButton isFullWidth={false} />
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
        Any invalid paramaters to the component are ignored. Invalid parameters can be passed to
        the SAE data viewer.
      </DocBlock>
    </>
  );
}
