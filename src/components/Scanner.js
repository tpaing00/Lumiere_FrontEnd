import React, { useState, useEffect } from "react";
import Quagga from "quagga";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "./predefined_data/scanner.json";

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
    <div>
      <h1>Quick Scan</h1>
      <h4>Scan a product's barcode or enter it manually</h4>
      {barcode && <p> Detected Barcode: {barcode} </p>}
      <div id="barcode-scanner"></div>
      <input
        type="text"
        max={15}
        min={7}
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Scanner;
