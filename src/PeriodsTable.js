import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { TableFooter } from "@mui/material";

export default function PeriodsTable({ periods = []}) {
  const rows = periods.map(({ name, start, end, value }) => {
    return {
      name,
      start: moment(start.date).format("D MMMM YYYY"),
      end: moment(end.date).format("D MMMM YYYY"),
      value,
    };
  });

  const total = rows.reduce((prev, curr) => prev + curr.value, 0);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 350, maxWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Quotas em falta</TableCell>
            <TableCell align="center">De&nbsp;</TableCell>
            <TableCell align="center">Até&nbsp;</TableCell>
            <TableCell align="right">Valor&nbsp;(€)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.start}</TableCell>
              <TableCell align="center">{row.end}</TableCell>
              <TableCell align="right">{row.value}€</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
