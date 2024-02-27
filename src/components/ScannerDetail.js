import React from 'react';
import { useLocation } from 'react-router-dom';

const ScannerDetail = () => {
  const location = useLocation();
  const { barcode, productResults, inventoryResults } = location.state;

  return (
    <div>
      <h2>Hello Lumiere</h2>
      <p>The Barcode Id is {barcode}</p>
      
      <h3>Product Results:</h3>
      <ul>
        {productResults.map((product, index) => (
          <li key={index}>
            <strong>Product {index + 1}:</strong>
            <ul>
              {Object.entries(product).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      
      <h3>Inventory Results:</h3>
      <ul>
        {inventoryResults.map((inventory, index) => (
          <li key={index}>
            <strong>Inventory {index + 1}:</strong>
            <ul>
              {Object.entries(inventory).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ScannerDetail;