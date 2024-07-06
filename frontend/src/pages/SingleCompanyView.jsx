import React, { useEffect, useState } from "react";

import NavBar from "../components/NavBar";
import CollapseSiderMenu from "../components/CollapseSideMenu";
import { Box, createTheme, ThemeProvider } from "@mui/material";

import ViewTable from "../components/Views/ViewTable";

import { Theme } from "../theme/main";

import Image01 from "../img/1.jpg";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import config from "../config.json";
import FinalScore from "../components/FinalScore";

export default function SingleCompanyView() {
  const [selectedFramework, setSelectedFramework] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  // Metrics and Indicators data
  const [data, setData] = useState([]);
  useEffect(() => {
    if (selectedCompany && selectedFramework) {
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: selectedCompany,
          framework: selectedFramework,
        }),
      };

      fetch(`${config.BACKEND_URL}/company_info/v3`, request)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            setData(data.Risks);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [selectedCompany, selectedFramework]);

  // Theme color
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("theme-color")
  );
  useEffect(() => {
    localStorage.setItem("theme-color", themeColor);
  }, [themeColor]);

  // Default avatar
  const [imageSrc, setImageSrc] = useState(Image01);

  const navigate = useNavigate();

  // Adding decryption logic
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode token using jwt-decode library
        setImageSrc(decodedToken.avatar_url);
      } catch (error) {
        alert("Error: Token may be expired, Please Re-Login.");
        console.error("Token Decode Error:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      alert("Error: Token not found, Please Re-Login.");
      navigate("/login");
    }
  }, []); // useEffect dependency array is empty, indicating it should run only once on component mount

  return (
    <ThemeProvider theme={createTheme(Theme(themeColor))}>
      <Box>
        <Box sx={{ m: 1 }}>
          <NavBar setThemeColor={setThemeColor} avatarImage={imageSrc} />
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box>
            <CollapseSiderMenu
              data={data}
              setData={setData}
              company_name={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              setSelectedFramework={setSelectedFramework}
            />
          </Box>

          <Box flexGrow={1} sx={{ display: "flex", flexDirection: "column" }}>
            <Box flexGrow={1} sx={{ borderRadius: 2, boxShadow: 3, m: 1, p: 1 }}>
              {data.length > 0 && <FinalScore data={data} />}
            </Box>

            <Box flexGrow={2} sx={{ borderRadius: 2, boxShadow: 3, m: 1, p: 1 }}>
              {data.length > 0 && <ViewTable data={data} />}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
