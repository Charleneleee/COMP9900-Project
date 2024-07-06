import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Link
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";

import config from "../config.json";
import CoverImage from "../img/cover.webp";
import { useNavigate } from "react-router-dom";

function PasswordReset() {
  const initial_timer = 10;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpassword, setNewPassword] = useState("");

  // loading and timer for resend
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // dialog config
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  // visibility config
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [passwordshow, setPasswordShow] = useState(false);
  const [submitshow, setSubmitShow] = useState(false);

  const navigate = useNavigate();

  // shadow config
  const [boxShadow, setBoxShadow] = useState(3);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1); // 每秒减1
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      setLoading(false);
    }
  }, [timer]);

  useEffect(() => {
    if (otp.length === 6) {
      setSubmitShow(true);
    } else {
      setSubmitShow(false);
    }
  }, [otp]);

  const handleOTPSubmit = () => {
    fetch(`${config.BACKEND_URL}/reset_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: parseInt(otp),
        email,
        new_password: newpassword
      })
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Network response was not ok");
          return response.json();
        }
        return response.json(); // 这里移到下一个then中
      })
      .then((data) => {
        if (data.error) {
          // check if there is any error message
          setDialogContent(data.error);
          setOpenDialog(true);
        } else {
          setDialogContent(data.message);
          setOpenDialog(true);

          setTimeout(() => {
            navigate("/main/single");
          }, 1500);
        }
      })
      .catch((error) => {
        alert(
          "Error: OTP submit to server failed, Please check server status."
        );
        console.error("Error:", error);
      });
  };

  const handleSendVerificationCode = () => {
    fetch(`${config.BACKEND_URL}/request_reset_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email
      })
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Network response was not ok");
          return response.json();
        }
        return response.json(); // 这里移到下一个then中
      })
      .then((data) => {
        if (data.error) {
          // check if there is any error message
          setDialogContent(data.error);
          setOpenDialog(true);
        } else {
          setDialogContent(data.message);
          setOpenDialog(true);

          setEmailDisabled(true);
          setPasswordShow(true);

          setTimer(initial_timer);
          setLoading(true);
        }
      })
      .catch((error) => {
        alert(
          "Error: Send verification code to server failed, Please check server status."
        );
        console.error("Error:", error);
      });
  };

  return (
    <Grid container width={"100vw"} height={"100vh"}>
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
          position: "relative", // 相对定位，用于覆盖在虚化背景上面
          zIndex: 1, // 提高层级，使得表单内容在虚化背景上方
          backgroundColor: "rgba(255, 255, 255, 0.8)", // 添加半透明背景
          padding: "20px" // 增加内边距
        }}
      >
        <Box
          boxShadow={boxShadow}
          sx={{
            borderRadius: 4,
            p: 4,
            width: "80%",
            transition: "box-shadow 0.5s ease" // 添加过渡效果
          }}
          onMouseEnter={() => {
            setBoxShadow(24);

            const coverImg = document.getElementById("cover-img");
            if (coverImg) {
              coverImg.style.filter = "blur(8px)"; // 让Cover Image 虚化
            }
          }}
          onMouseLeave={() => {
            setBoxShadow(3);

            const coverImg = document.getElementById("cover-img");
            if (coverImg) {
              coverImg.style.filter = "none"; // 恢复 Cover Image 正常显示
            }
          }}
        >
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            {/* Welcome Message */}
            <Grid item id="form-title" marginBottom={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h1" sx={{ fontSize: "2.5rem" }}>
                  Welcome!
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.25rem" }}>
                  Please confirm your email address to reset your password.
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
              {/* Password Reset Form */}
              <Grid item xs={12}>
                <TextField
                  required
                  id="reset-email"
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailDisabled}
                  sx={{ width: "100%", marginBottom: "10px" }}
                />
                {!emailDisabled && (
                  <Typography variant="body2">
                    Remember your password?{" "}
                    <Link href="/login">Login here</Link>
                  </Typography>
                )}
                {!emailDisabled && (
                  <Typography variant="body2">
                    Don&apos;t have an account?{" "}
                    <Link href="/register">Register here</Link>
                  </Typography>
                )}
              </Grid>

              {/* Show verification code TextField only when email is disabled */}
              {emailDisabled && (
                <Grid item xs={12}>
                  <MuiOtpInput
                    value={otp}
                    TextFieldsProps={{ placeholder: "-" }}
                    onChange={handleChange}
                    length={6}
                  />
                </Grid>
              )}

              {/* Password Reset Form */}
              {passwordshow && (
                <Grid item xs={12}>
                  <TextField
                    required
                    id="new-password"
                    label="New Password"
                    variant="outlined"
                    type="password"
                    value={newpassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ width: "100%", marginBottom: "10px" }}
                  />
                </Grid>
              )}

              {/* Send Verification Code Button */}
              <Grid item xs={12}>
                {!submitshow && (
                  <Button
                    style={{ textTransform: "none" }}
                    variant="contained"
                    sx={{ width: "100%" }}
                    disabled={loading || timer > 0}
                    onClick={handleSendVerificationCode}
                  >
                    {loading ? (
                      <>
                        <CircularProgress
                          size={24}
                          variant="determinate"
                          value={
                            ((initial_timer - timer) / initial_timer) * 100
                          }
                        />
                        `Resend in {timer}s`
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                )}

                {submitshow && (
                  <Button
                    color="success"
                    style={{ textTransform: "none" }}
                    variant="contained"
                    sx={{ width: "100%" }}
                    onClick={handleOTPSubmit}
                  >
                    Submit && Reset
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      {/* Dialog for displaying password reset result */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Password Reset Result</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default PasswordReset;
