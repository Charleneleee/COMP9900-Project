import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import CollapseCompareSiderMenu from "../components/CollapseCompareSideMenu";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import CompareTable from "../components/Views/CompareTable";
import { Theme } from "../theme/main";
import Image01 from "../img/1.jpg";
import { jwtDecode } from "jwt-decode"; // Assuming it's `jwt-decode` library
import { useNavigate } from "react-router-dom";
import config from "../config.json";
import FinalScore from "../components/FinalCompareScore";

export default function MultiConpanyView() {
  // State for selected framework and companies, and data received from API
  const [selectedFramework, setSelectedFramework] = useState("");
  const [selectedCompany_1, setSelectedCompany1] = useState("");
  const [selectedCompany_2, setSelectedCompany2] = useState("");
  const [data, setData] = useState([]);

  // Fetch data from backend when selections change
  useEffect(() => {
    if (selectedCompany_1 && selectedCompany_2 && selectedFramework) {
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_1_name: selectedCompany_1,
          company_2_name: selectedCompany_2,
          framework: selectedFramework
        })
      };

      fetch(`${config.BACKEND_URL}/compare_company_info/v3`, request)
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
  }, [selectedCompany_1, selectedCompany_2, selectedFramework]);

  // State for theme color and image source
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("theme-color")
  );
  useEffect(() => {
    localStorage.setItem("theme-color", themeColor);
  }, [themeColor]);

  const [imageSrc, setImageSrc] = useState(Image01);

  const navigate = useNavigate();

  // Decryption logic for avatar image
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
  }, []); // useEffect with an empty dependency array runs once on component mount

  return (
    <ThemeProvider theme={createTheme(Theme(themeColor))}>
      <Box>
        <Box sx={{ m: 1 }}>
          <NavBar setThemeColor={setThemeColor} avatarImage={imageSrc} />
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box>
            <CollapseCompareSiderMenu
              data={data}
              setData={setData}
              setSelectedCompany1={setSelectedCompany1}
              setSelectedCompany2={setSelectedCompany2}
              setSelectedFramework={setSelectedFramework}
            />
          </Box>

          <Box flexGrow={1} sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              flexGrow={1}
              sx={{ borderRadius: 2, boxShadow: 3, m: 1, p: 1 }}
            >
              {data.length > 0 && <FinalScore data={data} />}
            </Box>

            <Box
              flexGrow={2}
              sx={{ borderRadius: 2, boxShadow: 3, m: 1, p: 1 }}
            >
              {data.length > 0 && <CompareTable data={data} />}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
