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
    <Box sx={{ mt: 3 }}>
      <Typography component="h1" align="left" variant="h2">
        Quick Scan
      </Typography>
      <Grid container justifyContent="center" sx={{ backgroundColor: '#f0f0f0' }}>
        <Grid item xs={12} sm={8} md={6}>
          <Box>
            <Typography component="p">
              Scan or enter barcode to find and checkout products.
            </Typography>
            {barcode && (
              <Typography component="p">
                {" "}
                Detected Barcode: {barcode}{" "}
              </Typography>
            )}
            <Box id="barcode-scanner"></Box>
            <TextField
              type="text"
              max={15}
              min={7}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              label="Barcode Number"
              sx={{ width: '400px' }}
              InputProps={{
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
    </Box>
  );
}

export default Scanner;
