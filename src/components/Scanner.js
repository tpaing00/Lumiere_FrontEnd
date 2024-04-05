import React, { useState, useEffect } from "react";
import Quagga from "quagga";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "./predefined_data/scanner.json";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Grid,
  useTheme, 
  useMediaQuery
} from "@mui/material";
import { Search } from "@mui/icons-material";

function Scanner() {
  const [barcode, setBarcode] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  useEffect(() => {
    Quagga.init(config, (error) => {
      if (error) {
        console.error("Failed to initialize Quagga:", error);
        setError(error);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      setBarcode(result.codeResult.code);
    }, []);

    // Clean up Quagga when component unmounts
    return () => {
      Quagga.stop();
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!barcode) {
      // Barcode not detected
      return;
    }
    axios
      .get(`https://api.lumiereapp.ca/api/v1/barcode/${barcode}`)
      .then((response) => {
        if (response.status === 200) {
          const { productResults, inventoryResults } = response.data;
          if (productResults.length > 0 && inventoryResults.length > 0) {
            navigate("/scannerdetail", {
              state: { productResults, inventoryResults, barcode },
            });
          } else {
            navigate("/add-product", { state: { barcode } });
          }
        } else {
          navigate("/add-product", { state: { barcode } });
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.error);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  const handleDashBoard = () => {
      navigate("/dashboard");
  };

  return (
   <>
      <Box sx={{ p: 4, paddingTop:"0", paddingBottom:"0", paddingRight: isMobile ? "20px" : undefined, paddingLeft: isMobile ? "20px" : undefined}}>
        <Box sx={{ pt: 4}}>
          <Typography component="body1" align="left" variant="body1">
              <span onClick={handleDashBoard} style={{ cursor: "pointer" }}>Lumiere</span> &gt;{" "}
              <strong>Quick Scan</strong>
          </Typography>
        </Box>
        <Typography variant="h1">
          Quick Scan
        </Typography>
        </Box>
        <Grid container justifyContent="center" sx={{ backgroundColor: "#6A6A6A", mt: 0,  mb: '12px', minHeight: '80vh'}}>
          <Grid  container justifyContent="center" item xs={12} sm={8} md={6} sx={{ pt: '40px', pb: '40px', pl:0, pr:0}}>
            <Box sx={{justifyContent:'center', textAlign:'center'}}>
              <Typography component="p" sx={{textAlign: "center", color: "white !important", mb: 2}}>
                Scan or enter barcode to find and checkout products.
              </Typography>
              {barcode && (
                <Typography component="p" sx={{textAlign: "center", color: "white !important", mt: 2, mb: 2 }}>
                  {" "}
                  Detected Barcode: {barcode}{" "}
                </Typography>
              )}
              <Box id="barcode-scanner" sx={{mt: 5, margin:0, padding:0}}></Box>
              <TextField
                type="text"
                max={15}
                min={7}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Barcode Number"
                sx={{ width: "400px", mt: 5  , background: "white"}}
                InputLabelProps={{
                  sx: { color: "black" } // Set label color to white
                }}
                InputProps={{
                  sx: { color: "black" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
        </Grid>
        
        </> 
  );
}

export default Scanner;
