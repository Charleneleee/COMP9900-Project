import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Button } from "@mui/material";

export default function ResultTable({ data, onDelete }) {
  const [columns, setColumns] = useState([
    "indicator_name",
    "indicator_weight",
    "metric_name",
    "metric_weight",
  ]);

  useEffect(() => {
    let newColumns = [
      "indicator_name",
      "indicator_weight",
      "metric_name",
      "metric_weight",
    ];

    let hasScore = true;
    for (let risks of data) {
      for (let indicator of risks.indicators) {
        for (let metric of indicator.metrics) {
          if (!Object.prototype.hasOwnProperty.call(metric, "score")) {
            hasScore = false;
            break;
          }
        }
        if (!hasScore) {
          break;
        }
      }
      if (!hasScore) {
        break;
      }
    }

    if (hasScore) {
      newColumns.push("metric_score");
    } else {
      newColumns.push("score_1", "score_2");
    }

    setColumns(newColumns);
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.flatMap((risks) =>
            risks.indicators.flatMap((indicator) =>
              indicator.metrics
                .filter((metric) => metric.checked)
                .map((metric) => (
                  <TableRow
                    key={`${risks.name}-${indicator.name}-${metric.name}`}
                  >
                    <TableCell>
                      {indicator.name}
                      <Tooltip title={indicator.description}>
                        <IconButton>
                          <ErrorOutlineOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {
                        risks.indicators.find(
                          (item) => item.name === indicator.name
                        ).weight
                      }
                    </TableCell>
                    <TableCell>{metric.name}</TableCell>
                    <TableCell>{metric.weight}</TableCell>
                    {columns.includes("metric_score") ? (
                      <TableCell>{metric.score}</TableCell>
                    ) : (
                      <>
                        <TableCell>{metric.score_1}</TableCell>
                        <TableCell>{metric.score_2}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))
            )
          )}
        </TableBody>
      </Table>

      <Button fullWidth variant="contained" color="error" onClick={onDelete}>
        Delete This Analysis Result
      </Button>
    </TableContainer>
  );
}

ResultTable.propTypes = {
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
};
