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
} from "@mui/material";
import { Search } from "@mui/icons-material";

function Scanner() {
  const [barcode, setBarcode] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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

  return (
   <>
        <Typography variant="h1" sx={{ pl: '40px', mb: '12px' }}>
          Quick Scan
        </Typography>
        <Grid container justifyContent="center" sx={{ backgroundColor: "#6A6A6A", mt: 5,  pl: '10px', mb: '12px', minHeight: '80vh',  }}>
          <Grid  container justifyContent="center" item xs={12} sm={8} md={6} sx={{ pt: '40px', pb: '40px', }}>
            <Box>
              <Typography component="p" sx={{textAlign: "center", color: "white", }}>
                Scan or enter barcode to find and checkout products.
              </Typography>
              {barcode && (
                <Typography component="p" sx={{textAlign: "center", color: "white", mt: 2 }}>
                  {" "}
                  Detected Barcode: {barcode}{" "}
                </Typography>
              )}
              <Box id="barcode-scanner" sx={{mt: 5 }}></Box>
              <TextField
                type="text"
                max={15}
                min={7}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Barcode Number"
                sx={{ width: "400px", mt: 5  , background: "white"}}
                InputLabelProps={{
                  sx: { color: "gray" } // Set label color to white
                }}
                InputProps={{
                  sx: { color: "gray" },
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
