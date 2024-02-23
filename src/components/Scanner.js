import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import "../style.css";

function ProductPage({ barcode }) {
  return (
    <div>
      <h2>Product Page for Barcode: {barcode}</h2>
    </div>
  );
}

function Scanner() {
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#barcode-scanner'), // Assuming you have a div with the id "barcode-scanner"
        constraints: {
          width: { "min": 450 },
          height: { "min": 300 },
          facingMode: "environment", // or "user" for front camera
          aspectRatio: { "min": 1, "max": 2 }
        }
      },
      decoder: {
        readers:[
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
          "code_93_reader"
        ]
      },
      locator: {
        patchSize: 'medium',
        halfSample: true
      },
      numOfWorkers: 2,
      frequency: 10,
      locate: true
    }, (err) => {
      if (err) {
        console.error('Failed to initialize Quagga:', err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      setBarcode(result.codeResult.code);
    });

    // Clean up Quagga when component unmounts
    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <h3>Scan a product's barcode or enter it manually</h3>
        {barcode && <p> Detected Barcode: {barcode} </p>}
        {<Link to={`/product/${barcode}`}>View Product</Link>}
        <div id="barcode-scanner"></div>
        <Routes>     
          <Route path="/product/:id" render={(props) => <ProductPage {...props} barcode={barcode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Scanner;
