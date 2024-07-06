import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey
} from "@mui/material/colors";

export function ColorPalette({ setThemeColor }) {
  const colors = [
    { name: "red", color: red[500] },
    { name: "pink", color: pink[500] },
    { name: "purple", color: purple[500] },
    { name: "deepPurple", color: deepPurple[500] },
    { name: "indigo", color: indigo[500] },
    { name: "blue", color: blue[500] },
    { name: "lightBlue", color: lightBlue[500] },
    { name: "cyan", color: cyan[500] },
    { name: "teal", color: teal[500] },
    { name: "green", color: green[500] },
    { name: "lightGreen", color: lightGreen[500] },
    { name: "lime", color: lime[500] },
    { name: "yellow", color: yellow[500] },
    { name: "amber", color: amber[500] },
    { name: "orange", color: orange[500] },
    { name: "deepOrange", color: deepOrange[500] },
    { name: "brown", color: brown[500] },
    { name: "grey", color: grey[500] },
    { name: "blueGrey", color: blueGrey[500] }
  ];

  const handleColorClick = (colorName) => {
    setThemeColor(colorName);
    console.log(colorName);
  };

  return (
    <Grid container>
      {colors.map((color, index) => (
        <Grid item xs={6} key={index}>
          <ColorPaletteBox
            color={color.color}
            onClick={() => handleColorClick(color.name)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

function ColorPaletteBox({ color, onClick }) {
  const shapeStyles = {
    width: 80,
    height: 80,
    bgcolor: color,
    borderRadius: "50%",
    cursor: "pointer"
  };

  return <Box sx={shapeStyles} onClick={onClick} />;
}

ColorPaletteBox.propTypes = {
  color: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

ColorPalette.propTypes = {
  setThemeColor: PropTypes.func.isRequired
};
