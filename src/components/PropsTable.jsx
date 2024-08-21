import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Theme, { COLORS } from '@/components/Theme/Theme';
import { resolveProps } from '@/util/defaultProps';

const useStyles = makeStyles((theme) => ({
  propTableRowGrey: {
    backgroundColor: theme.palette.grey[50],
  },
  required: {
    marginTop: theme.spacing(2),
    fontSize: '0.9em',
    fontWeight: 600,
    color: COLORS.RED[400],
  },
}));

const defaultProps = {
  fullHeight: false,
};

const PropsTable = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const { props: propRows, fullHeight } = props;
  const classes = useStyles(Theme);

  return (
    <TableContainer component={Paper} style={fullHeight ? {} : { maxHeight: '70vh' }}>
      <Table stickyHeader aria-label="props">
        <TableHead>
          <TableRow>
            <TableCell>Prop</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Default</TableCell>
            <TableCell>Examples</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {propRows.map((row, idx) => (
            <React.Fragment key={row.name}>
              <TableRow className={idx % 2 ? classes.propTableRowGrey : null}>
                <TableCell component="th" scope="row" rowSpan={2}>
                  <tt>{row.name}</tt>
                  {!row.required ? null : <div className={classes.required}>REQUIRED</div>}
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell><tt>{row.default}</tt></TableCell>
                <TableCell>{row.examples ? row.examples : '--'}</TableCell>
              </TableRow>
              <TableRow className={idx % 2 ? classes.propTableRowGrey : null}>
                <TableCell colSpan={4}>{row.description}</TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const stringOrNode = PropTypes.oneOfType([PropTypes.node, PropTypes.string]);
PropsTable.propTypes = {
  props: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: stringOrNode.isRequired,
      default: PropTypes.string,
      examples: stringOrNode,
      description: stringOrNode,
      required: PropTypes.bool,
    }),
  ).isRequired,
  fullHeight: PropTypes.bool,
};

export default PropsTable;
