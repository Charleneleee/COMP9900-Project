import * as React from "react";
import PropTypes from "prop-types";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import CreateIndicatorAutoComplete from "./CreateIndicatorAutocomplete";
import { Grid, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

export default function CreateIndicatorDialog({
  upload,
  pillar,
  open,
  handleClose
}) {
  const [indicatorName, setIndicatorName] = React.useState("");
  const [indicatorWeight, setIndicatorWeight] = React.useState(0);
  const [indicatorDescription, setIndicatorDescription] = React.useState("");
  const [indicatorMetrics, setIndicatorMetrics] = React.useState([]);

  const handleSaveIndicator = () => {
    if (indicatorName === "") {
      alert("Please enter an indicator name");
      return;
    }

    if (indicatorDescription === "") {
      alert("Please enter an indicator description");
      return;
    }

    if (indicatorMetrics.length === 0) {
      alert("Please add at least one metric");
      return;
    }

    // Check if any metric has an empty name
    const hasEmptyName = indicatorMetrics.some(
      (metric) => metric.name.trim() === ""
    );
    if (hasEmptyName) {
      alert("Please enter a name for each metric");
      return;
    }

    // upload
    upload({
      name: indicatorName,
      weight: indicatorWeight,
      description: indicatorDescription,
      metrics: indicatorMetrics
    });

    // reset state
    setIndicatorName("");
    setIndicatorWeight(0);
    setIndicatorDescription("");
    setIndicatorMetrics([]);

    handleClose();
  };

  // update metric name
  const handleUpdateMetricName = (metricId, newName) => {
    const updatedMetrics = indicatorMetrics.map((m) => {
      if (m.id === metricId) {
        return { ...m, name: newName }; // update metric name
      }
      return m;
    });
    setIndicatorMetrics(updatedMetrics);
  };

  const handleUpdateMetricWeight = (metricId, newValue) => {
    const updatedMetrics = indicatorMetrics.map((m) => {
      if (m.id === metricId) {
        return { ...m, weight: newValue }; // update metric weight
      }
      return m;
    });
    setIndicatorMetrics(updatedMetrics);
  };

  const handleAddMetric = () => {
    const newMetric = { id: indicatorMetrics.length + 1, name: "", weight: 0 }; // create new metric object
    setIndicatorMetrics([...indicatorMetrics, newMetric]); // add new metric to state
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        {pillar == "E"
          ? "Create Environmental Indicator"
          : pillar == "S"
            ? "Create Social Indicator"
            : "Create Governmental Indicator"}
      </DialogTitle>
      <DialogContent
        sx={{
          width: 500
        }}
      >
        <Typography id="input-slider">Name:</Typography>
        <TextField
          value={indicatorName}
          onChange={(e) => setIndicatorName(e.target.value)}
          fullWidth
          focused
          margin="normal"
        />

        <Typography id="input-slider">Weight:</Typography>
        <Slider
          value={indicatorWeight}
          onChange={(e, value) => setIndicatorWeight(value)}
          valueLabelDisplay="auto"
          step={0.1}
          min={0}
          max={1}
        />

        <Typography id="input-slider">Description:</Typography>
        <TextField
          value={indicatorDescription}
          onChange={(e) => setIndicatorDescription(e.target.value)}
          fullWidth
          multiline
          focused
          margin="normal"
        />

        <Typography id="input-slider">Metrics:</Typography>
        {indicatorMetrics.map((metric) => (
          <Grid
            container
            spacing={2}
            id={`input-metric-${metric.id}`}
            alignItems="center"
            justifyContent="center"
            key={metric.id}
          >
            <Grid item xs={8}>
              <CreateIndicatorAutoComplete
                pillar={pillar}
                onSelect={(newName) =>
                  handleUpdateMetricName(metric.id, newName)
                }
              />
            </Grid>
            <Grid item xs={3}>
              <Slider
                value={metric.weight}
                onChange={(e, value) =>
                  handleUpdateMetricWeight(metric.id, value)
                }
                min={0}
                max={1} // Adjusted min and max values
                step={0.1}
                valueLabelFormat={(value) => `Metric Weight: ${value}`}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  // delete metric
                  const updatedMetrics = indicatorMetrics.filter(
                    (m) => m.id !== metric.id
                  );
                  setIndicatorMetrics(updatedMetrics);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button fullWidth variant="outlined" onClick={handleAddMetric}>
          + Add Metric
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveIndicator} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateIndicatorDialog.propTypes = {
  upload: PropTypes.func.isRequired,
  pillar: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
