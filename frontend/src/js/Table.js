import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const SsbTable = (data) => (
    <div className="column">
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        {data.header.map(value => (
                            <TableCell>{value}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.data.map(el => (
                        <TableRow key={el.id}>
                            {Object.entries(el).map(el => <TableCell>{el[1]}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    </div>
);
Table.propTypes = {
  data: PropTypes.array.isRequired
};
export default SsbTable;