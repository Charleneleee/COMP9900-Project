import React, { useEffect, useState } from "react";
import {
  Box,
  createTheme,
  ThemeProvider,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import ResultTable from "../components/Views/ResultTable";
import FinalScore from "../components/FinalHistoryScore";

import { Theme } from "../theme/main";

import Image01 from "../img/1.jpg";

import config from "../config.json";

export default function UserHistory() {
  const [analysis_data, setAnalysisData] = useState(null);
  useEffect(() => {
    fetch(`${config.BACKEND_URL}/list/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: localStorage.getItem("token")
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          console.log(data.analysis_histories);
          setAnalysisData(data.analysis_histories);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    if (analysis_data) {
      // Process analysis_data and add data to datas and timestamps
      const updatedDatas = [];
      const updatedTimestamps = [];

      analysis_data.forEach((item) => {
        // Process data and add to updatedDatas
        updatedDatas.push(item.data);
        // Add timestamp to updatedTimestamps
        updatedTimestamps.push(item.timestamp);
      });

      // Update data in state
      setDatas(updatedDatas);
      setTimestamps(updatedTimestamps);
    }
  }, [analysis_data]);

  const [selected_timestamp, setSelectedTimestamp] = useState("");
  const [selected_data, setSelectedData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [datas, setDatas] = useState([]);

  const handleListItemClick = (index) => {
    setSelectedTimestamp(timestamps[index]);
    setSelectedData(datas[index]);
  };

  const handleDeleteClick = () => {
    fetch(`${config.BACKEND_URL}/delete/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        timestamp: selected_timestamp,
        data: selected_data
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Remove selected_data from datas
    const updatedDatas = datas.filter((dataItem) => dataItem !== selected_data);
    setDatas(updatedDatas);

    // Remove selected_timestamp from timestamps
    const updatedTimestamps = timestamps.filter(
      (timestampItem) => timestampItem !== selected_timestamp
    );
    setTimestamps(updatedTimestamps);

    // Clear selected_data and selected_timestamp
    setSelectedData([]);
    setSelectedTimestamp("");
  };

  // Theme color
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("theme-color")
  );
  useEffect(() => {
    localStorage.setItem("theme-color", themeColor);
  }, [themeColor]);

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
      <Box sx={{ m: 1 }}>
        <NavBar setThemeColor={setThemeColor} avatarImage={imageSrc} />
      </Box>

      <Box display="flex" sx={{ m: 1 }}>
        {/* Sidebar */}
        {timestamps.length > 0 && (
          <Box
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              m: 1
            }}
          >
            <List component="nav" aria-label="mailbox folders">
              {timestamps.map((timestamp, index) => (
                <React.Fragment key={timestamp}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => handleListItemClick(index)}
                    sx={{
                      bgcolor: selected_timestamp === timestamp && "green"
                    }}
                  >
                    <ListItemText primary={timestamp} />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
        {/* Main Content Area */}
        <Box
          flexGrow={1}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            m: 1,
            p: 1
          }}
        >
          <Box flexGrow={1} sx={{ display: "flex", flexDirection: "column" }}>
          <Box
              flexGrow={1}
              sx={{ borderRadius: 2, boxShadow: 3, m: 1, p: 1 }}
            >
              {selected_data.length > 0 && <FinalScore data={selected_data} />}
            </Box>

            <Box
              flexGrow={1}
              sx={{ borderRadius: 2, boxShadow: 3, m: 1, p: 1 }}
            >
              {selected_data.length > 0 && (
                <ResultTable
                  data={selected_data}
                  onDelete={handleDeleteClick}
                />
              )}
              {timestamps.length === 0 && datas.length === 0 && (
                <Typography variant="h5">No Analysis History Data</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
