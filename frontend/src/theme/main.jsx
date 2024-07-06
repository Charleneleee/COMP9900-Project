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

export const Theme = (mode) => {
  // Create a theme object with a default primary color of lightGreen
  const theme = {
    palette: {
      primary: {
        main: lightGreen[500] // Default to using lightGreen
      }
    }
  };

  // Check the mode parameter and update the primary color accordingly
  if (mode === "red") {
    theme.palette.primary.main = red[500];
  } else if (mode === "pink") {
    theme.palette.primary.main = pink[500];
  } else if (mode === "purple") {
    theme.palette.primary.main = purple[500];
  } else if (mode === "deepPurple") {
    theme.palette.primary.main = deepPurple[500];
  } else if (mode === "indigo") {
    theme.palette.primary.main = indigo[500];
  } else if (mode === "blue") {
    theme.palette.primary.main = blue[500];
  } else if (mode === "lightBlue") {
    theme.palette.primary.main = lightBlue[500];
  } else if (mode === "cyan") {
    theme.palette.primary.main = cyan[500];
  } else if (mode === "teal") {
    theme.palette.primary.main = teal[500];
  } else if (mode === "green") {
    theme.palette.primary.main = green[500];
  } else if (mode === "lightGreen") {
    theme.palette.primary.main = lightGreen[500];
  } else if (mode === "lime") {
    theme.palette.primary.main = lime[500];
  } else if (mode === "yellow") {
    theme.palette.primary.main = yellow[500];
  } else if (mode === "amber") {
    theme.palette.primary.main = amber[500];
  } else if (mode === "orange") {
    theme.palette.primary.main = orange[500];
  } else if (mode === "deepOrange") {
    theme.palette.primary.main = deepOrange[500];
  } else if (mode === "brown") {
    theme.palette.primary.main = brown[500];
  } else if (mode === "grey") {
    theme.palette.primary.main = grey[500];
  } else if (mode === "blueGrey") {
    theme.palette.primary.main = blueGrey[500];
  }

  return theme;
};
