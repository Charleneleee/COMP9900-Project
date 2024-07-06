import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  FormHelperText,
  OutlinedInput,
} from "@mui/material";

import { LoginSocialGoogle, LoginSocialMicrosoft } from "reactjs-social-login";
import {
  GoogleLoginButton,
  MicrosoftLoginButton,
} from "react-social-login-buttons";

import PasswordStrengthBar from "react-password-strength-bar";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorIcon from "@mui/icons-material/Cancel";
import CorrectIcon from "@mui/icons-material/CheckCircle";

import CoverImage from "../img/cover.webp";
import config from "../config.json";
import { useNavigate } from "react-router-dom";

import { green } from "@mui/material/colors";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // navigate config
  const navigate = useNavigate();

  // shadow config
  const [boxShadow, setBoxShadow] = useState(3);

  // dialog config
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  // password visibility config
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // error/helperText config
  const [EmailError, setEmailError] = useState(false);
  const [EmailMessage, setEmailMessage] = useState("");

  const [PasswordLenError, setPasswordLenError] = useState(false);
  const PasswordLenMessage = "Length is 8-16 characters.";

  const [PasswordLowError, setPasswordLowError] = useState(false);
  const PasswordLowMessage = "At least one lowercase letter.";

  const [PasswordUpperError, setPasswordUpperError] = useState(false);
  const PasswordUpperMessage = "At least one uppercase letter.";

  const [PasswordSpecialError, setPasswordSpecialError] = useState(false);
  const PasswordSpecialMessage = "At least one special character.";

  const [ConfirmPasswordError, setConfirmPasswordError] = useState(false);
  const [ConfirmPasswordMessage, setConfirmPasswordMessage] = useState("");

  useEffect(() => {
    if (validateEmail(email)) {
      setEmailError(false);
      setEmailMessage("");

      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      };
      fetch(`${config.BACKEND_URL}/register_check/email`, request)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setEmailError(true);
            setEmailMessage(data.error);
          } else {
            setEmailError(false);
            setEmailMessage(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setEmailError(true);
      setEmailMessage("Invalid Email format!");
    }
  }, [email]);

  useEffect(() => {
    if (validatePasswordLen(password)) {
      setPasswordLenError(false);
    } else {
      setPasswordLenError(true);
    }

    if (validatePasswordLow(password)) {
      setPasswordLowError(false);
    } else {
      setPasswordLowError(true);
    }

    if (validatePasswordUpper(password)) {
      setPasswordUpperError(false);
    } else {
      setPasswordUpperError(true);
    }

    if (validatePasswordSpecial(password)) {
      setPasswordSpecialError(false);
    } else {
      setPasswordSpecialError(true);
    }
  }, [password]);

  useEffect(() => {
    if (validateConfirmPassword(password, confirmPassword)) {
      setConfirmPasswordError(false);
      setConfirmPasswordMessage("");
    } else {
      setConfirmPasswordError(true);
      setConfirmPasswordMessage("Password mismatch!");
    }
  }, [password, confirmPassword]);

  // OAuth
  const [GoogleProfile, setGoogleProfile] = useState([]);
  const [MicrosoftProfile, setMicrosoftProfile] = useState([]);
  useEffect(() => {
    if (GoogleProfile.length !== 0) {
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: GoogleProfile.name,
          email: GoogleProfile.email,
          password: "",
          google_id: GoogleProfile.sub,
          microsoft_id: "",
          token: "",
        }),
      };
      handleRegister(request);
    } else if (MicrosoftProfile.length !== 0) {
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: MicrosoftProfile.displayName,
          email: MicrosoftProfile.mail,
          password: "",
          google_id: "",
          microsoft_id: MicrosoftProfile.id,
          token: "",
        }),
      };
      handleRegister(request);
    }
  }, [GoogleProfile, MicrosoftProfile]);

  const handleNormalRegister = () => {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        google_id: "",
        microsoft_id: "",
        token: "",
      }),
    };

    if (name === "" || email === "" || password === "") {
      setDialogContent("Check if you filled in all the required fields.");
      setOpenDialog(true);
      return;
    }

    if (
      !EmailError &&
      !PasswordLenError &&
      !PasswordLowError &&
      !PasswordUpperError &&
      !PasswordSpecialError &&
      !ConfirmPasswordError
    ) {
      handleRegister(request);
    } else {
      setDialogContent(
        "Check your register form if there is any error message."
      );
      setOpenDialog(true);
    }
  };

  const handleRegister = (request) => {
    fetch(`${config.BACKEND_URL}/register`, request)
      .then((response) => {
        if (!response.ok) {
          console.error("Network response was not ok");
          return response.json();
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          // check if there is any error message
          setDialogContent(data.error);
          setOpenDialog(true);
        } else {
          localStorage.setItem("token", data.token);
          console.log(data.token);

          setDialogContent(data.message);
          setOpenDialog(true);
          setTimeout(() => {
            navigate("/main/single");
          }, 1500);
        }
      })
      .catch((error) => {
        alert("Error: Register to server failed, Please check server status.");
        console.error("Error:", error);
      });
  };

  return (
    <Grid
      container
      width={"100vw"}
      height={"100vh"}
      justifyContent="center"
      alignItems="center"
    >
      {/* Cover Image */}
      <Grid
        item
        id="cover-img"
        xs={0}
        md={8}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        <img src={CoverImage} alt="Login" style={{ maxWidth: "100%" }} />
      </Grid>

      {/* Form */}
      <Grid
        item
        id="form-section"
        xs={12}
        md={4}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative", // Relative positioning, used to overlay on blurred background
          zIndex: 1, // Increase the layer to display form content above the blurred background
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Add a semi-transparent background
          padding: "20px", // Add padding
        }}
      >
        <Box
          boxShadow={boxShadow}
          sx={{
            borderRadius: 4,
            p: 4,
            width: "80%",
            transition: "box-shadow 0.5s ease", // Add transition effect
          }}
          onMouseEnter={() => {
            setBoxShadow(24);

            const coverImg = document.getElementById("cover-img");
            if (coverImg) {
              coverImg.style.filter = "blur(8px)"; // Blur the Cover Image
            }
          }}
          onMouseLeave={() => {
            setBoxShadow(3);

            const coverImg = document.getElementById("cover-img");
            if (coverImg) {
              coverImg.style.filter = "none"; // Restore the Cover Image to normal
            }
          }}
        >
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {/* Welcome Message */}
            <Grid item id="form-title" marginBottom={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h1" sx={{ fontSize: "2.5rem" }}>
                  Welcome!
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.25rem" }}>
                  Sign up to access your dashboard
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              container
              rowSpacing={2}
              id="form-inputs"
              sx={{ display: "flex", justifyContent: "center", width: "70%" }}
            >
              {/* Sign Up with Microsoft account */}
              <Grid item xs={12}>
                <LoginSocialMicrosoft
                  client_id={config.MICROSOFT_CLIENTID}
                  redirect_uri={window.location.href}
                  scope={"openid profile User.Read email"}
                  onResolve={({ provider, data }) => {
                    console.log(provider);
                    console.log(data);
                    setMicrosoftProfile(data);
                  }}
                  onReject={(err) => {
                    console.log(err);
                  }}
                >
                  <MicrosoftLoginButton>
                    Sign up with Microsoft account
                  </MicrosoftLoginButton>
                </LoginSocialMicrosoft>
              </Grid>

              {/* Sign Up with Google account */}
              <Grid item xs={12}>
                <LoginSocialGoogle
                  client_id={config.GOOGLE_CLIENTID}
                  redirect_uri={window.location.href}
                  onResolve={({ provider, data }) => {
                    console.log(provider);
                    console.log(data);
                    setGoogleProfile(data);
                  }}
                  onReject={(err) => {
                    console.log(err);
                  }}
                >
                  <GoogleLoginButton>
                    Sign up with Google account
                  </GoogleLoginButton>
                </LoginSocialGoogle>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Register Form */}
              <Grid item xs={12}>
                <TextField
                  required
                  id="register-name"
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ width: "100%", marginBottom: "10px" }}
                />

                <TextField
                  required
                  id="register-email"
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={EmailError}
                  helperText={
                    EmailError ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon fontSize="small" /> {EmailMessage}
                      </Box>
                    ) : email !== "" ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: green[500],
                        }}
                      >
                        <CorrectIcon fontSize="small" /> {EmailMessage}
                      </Box>
                    ) : (
                      ""
                    )
                  }
                  sx={{ width: "100%", marginBottom: "10px" }}
                />

                <FormControl
                  variant="outlined"
                  sx={{ width: "100%", marginBottom: "10px" }}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password *
                  </InputLabel>
                  <OutlinedInput
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password *"
                  />
                  <FormHelperText
                    error={
                      PasswordLenError ||
                      PasswordLowError ||
                      PasswordUpperError ||
                      PasswordSpecialError
                    }
                  >
                    {password === "" ? (
                      ""
                    ) : (
                      <Box>
                        {PasswordLenError ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ErrorIcon fontSize="small" /> {PasswordLenMessage}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: green[500],
                            }}
                          >
                            <CorrectIcon fontSize="small" />{" "}
                            {PasswordLenMessage}
                          </Box>
                        )}
                        {PasswordLowError ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ErrorIcon fontSize="small" /> {PasswordLowMessage}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: green[500],
                            }}
                          >
                            <CorrectIcon fontSize="small" />{" "}
                            {PasswordLowMessage}
                          </Box>
                        )}
                        {PasswordUpperError ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ErrorIcon fontSize="small" />{" "}
                            {PasswordUpperMessage}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: green[500],
                            }}
                          >
                            <CorrectIcon fontSize="small" />{" "}
                            {PasswordUpperMessage}
                          </Box>
                        )}
                        {PasswordSpecialError ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ErrorIcon fontSize="small" />{" "}
                            {PasswordSpecialMessage}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: green[500],
                            }}
                          >
                            <CorrectIcon fontSize="small" />{" "}
                            {PasswordSpecialMessage}
                          </Box>
                        )}
                      </Box>
                    )}
                  </FormHelperText>
                </FormControl>

                {password !== "" && <PasswordStrengthBar password={password} />}

                <FormControl
                  variant="outlined"
                  sx={{ width: "100%", marginBottom: "10px" }}
                >
                  <InputLabel htmlFor="outlined-adornment-confirm-password">
                    Confirm Password *
                  </InputLabel>
                  <OutlinedInput
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={ConfirmPasswordError}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password *"
                  />
                  <FormHelperText error={ConfirmPasswordError}>
                    {ConfirmPasswordError ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon fontSize="small" /> {ConfirmPasswordMessage}
                      </Box>
                    ) : (
                      ""
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Sign Up Button */}
              <Grid item xs={12}>
                <Button
                  style={{ textTransform: "none" }}
                  variant="contained"
                  sx={{ width: "100%" }}
                  onClick={handleNormalRegister}
                >
                  Sign Up
                </Button>
              </Grid>

              {/* Already have an account */}
              <Grid item xs={12} textAlign={"center"}>
                Already have an account? <Link href="/login">Login here</Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      {/* Dialog for displaying login result */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Register Result</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

// Validate Email
function validateEmail(email) {
  if (email === "") {
    return true;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Password
function validatePasswordLen(password) {
  // Length is 8-16 characters
  const lengthRegex = /^.{8,16}$/;
  if (!lengthRegex.test(password)) {
    return false;
  }

  return true;
}

function validatePasswordLow(password) {
  // At least one lowercase letter
  const lowercaseRegex = /[a-z]/;
  if (!lowercaseRegex.test(password)) {
    return false;
  }

  return true;
}

function validatePasswordUpper(password) {
  // At least one uppercase letter
  const uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(password)) {
    return false;
  }

  return true;
}

function validatePasswordSpecial(password) {
  // At least one special character
  const specialRegex = /[!@#$%^&*()_+{}[\]:";'<>?,./|\\`~=-]/;
  return specialRegex.test(password);
}


// Validate Confirm Password
function validateConfirmPassword(password, confirmPassword) {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
}

export default Register;
