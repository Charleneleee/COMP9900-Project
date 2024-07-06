import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Grid } from "@mui/material";

export default function YearsOptions() {
  return (
    <FormGroup sx={{ pl: 4 }}>
      <Grid container>
        <Grid item xs={6}>
          <FormControlLabel control={<Checkbox />} label="2022" />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel control={<Checkbox />} label="2023" />
        </Grid>
      </Grid>
    </FormGroup>
  );
}
