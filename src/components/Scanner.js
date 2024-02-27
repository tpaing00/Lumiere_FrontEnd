import React, { useState, useEffect } from "react";
import Quagga from "quagga";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Scanner() {
  const [barcode, setBarcode] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#barcode-scanner"), // Assuming you have a div with the id "barcode-scanner"
          constraints: {
            width: { min: 450 },
            height: { min: 300 },
            facingMode: "environment", // or "user" for front camera
            aspectRatio: { min: 1, max: 2 },
          },
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader",
          ],
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 2,
        frequency: 10,
        locate: true,
      },
      (error) => {
        if (error) {
          console.error("Failed to initialize Quagga:", error);
          setError(error);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      setBarcode(result.codeResult.code);
    });

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
      .get(`http://52.53.91.15:8080/api/v1/barcode/${barcode}`)
      .then((response) => {
        if (response.status === 200) {
          const { productResults, inventoryResults } = response.data;
          if (productResults.length > 0 && inventoryResults.length > 0) {
            navigate("/scannerdetail", {
              state: { barcode, productResults, inventoryResults },
            });
          } else {
            //navigate("/addnewproduct")
            alert("Navigate to add new product");
          }
        } else {
          //navigate("/addnewproduct")
          alert("Navigate to add new product");
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
        type="text" max={15} min={7}
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Scanner;
