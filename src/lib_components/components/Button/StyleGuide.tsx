/* eslint react/jsx-one-expression-per-line: 0 */
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

import SplitButton from './SplitButton';
import Theme from '../Theme/Theme';
// import { exists } from '../../util/typeUtil';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  title: {
    fontWeight: 500,
    marginBottom: '8px',
  },
}));

const state = {
  states: [true, false, 'invalid'],
};
const options = ['Option 1', 'Option 2', 'Yet another option!'];

const CustomButtonDemo = (): JSX.Element => {
  const classes = useStyles(Theme);
  const [selectedSize, setSelectedSize] = useState(false);
  const [selectedVal, setSelectedVal] = useState(options[0]);
  const [inputText, setInputText] = useState('color: #ff00ff; padding: 36px 0px');
  const handleChange = (event: any) => {
    setSelectedSize(event.target.value);
  };
  const handleTextChange = (event: any) => {
    const newValue = event.target.value;
    setInputText(newValue);
  };

  function parseCssString(styleString: string): React.CSSProperties {
    const styleObj: Record<string, string> = {};

    styleString.split(';').forEach((declaration) => {
      const [property, value] = declaration.split(':').map((s) => s.trim());
      if (property && value) {
        // Convert kebab-case to camelCase
        const camelCaseProp = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[camelCaseProp] = value;
      }
    });

    return styleObj as React.CSSProperties;
  }

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            id="full-width-select-label"
            className={classes.title}
          >
            Is Full Width
          </Typography>
          <Select
            id="split-button-width-select"
            aria-labelledby="full-width-select-label"
            variant="outlined"
            value={selectedSize}
            onChange={handleChange}
            style={{ width: 'fit-content' }}
          >
            {state.states.map((val: any) => ((
              <MenuItem key={val} value={val}>
                {`${val}`}
              </MenuItem>
            )))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            id="style-overrides-label"
            className={classes.title}
          >
            Style Overrides
          </Typography>
          <TextField
            id="style-override"
            aria-labelledby="style-overrides-label"
            variant="outlined"
            value={inputText}
            onChange={handleTextChange}
            style={{ width: '100%', marginBottom: '32px' }}
          />
        </Grid>
        <Grid item xs={12}>
          <SplitButton
            styleOverrides={parseCssString(inputText)}
            // styleOverrides={{ padding: '16px 0px' }}
            isFullWidth={selectedSize}
            name="split-button-demo"
            selectedOption={selectedVal}
            onChange={(option: string) => (
              setSelectedVal(option)
            )}
            selectedOptionDisplayCallback={(selOption:string) => (
              selOption
            )}
            onClick={() => (
              // eslint-disable-next-line no-alert
              alert(`You chose ${selectedVal}`)
            )}
            options={options}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default function StyleGuide() {
  const classes = useStyles(Theme);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <>
      <DocBlock>
        The SplitButton
      </DocBlock>
      <CodeBlock>
        {`
import SplitButton from 'portal-core-components/lib/components/Button/SplitButton';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        The split button presents multiple options where each one is a clickable button.
        The button can be set to take up full width. Also since the other buttons have
        icons with a hight of 20px and the split button icon is 24x24 its style can be
        overriden to provide a consistent hieght or any other desired changes.
      </DocBlock>
      <ExampleBlock>
        <SplitButton
          isFullWidth={false}
          styleOverrides={{ padding: '6px 0px' }}
          options={['Option 1', 'Option 2', 'Yet another option!']}
          selectedOption={selectedOption}
          onChange={(option: string) => (
            setSelectedOption(option)
          )}
          onClick={() => (
            // eslint-disable-next-line no-alert
            alert(`You chose ${selectedOption}`)
          )}
          selectedOptionDisplayCallback={(selOption:string) => (
            selOption
          )}
        />
      </ExampleBlock>
      <CodeBlock>
        {`
const [selectedOption, setSelectedOption] = useState('Option 1');
<SplitButton
  isFullWidth={false}
  styleOverrides={{ padding: '6px 0px' }}
  options={['Option 1', 'Option 2', 'Yet another option!']}
  selectedOption={selectedOption}
  onChange={(option: string) => (
    setSelectedOption(option)
  )}
  onClick={() => (
    // eslint-disable-next-line no-alert
    alert(\`You chose ${selectedOption}\`)
  )}
  selectedOptionDisplayCallback={(selOption:string) => (
    selOption
  )}
/>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h5" component="h3" gutterBottom>Demo</Typography>
      <ExampleBlock>
        <CustomButtonDemo />
      </ExampleBlock>

      <Divider className={classes.divider} />
      <Typography variant="h6" component="h4" gutterBottom>Failure State</Typography>

      <DocBlock>
        { /* @ts-ignore */ }
        Any invalid paramaters to the component are ignored so failures only happen
        when events like OnChange not correctly hooked up.
      </DocBlock>
    </>
  );
}
