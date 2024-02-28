import React from "react";
import { useLocation } from "react-router-dom";

const ScannerDetail = () => {
  const location = useLocation();
  const { productResults, inventoryResults } = location.state;
  const retailInventory = inventoryResults.filter(
    (inventory) => inventory.addToInventory === "Retail"
  );
  const internalInventory = inventoryResults.filter(
    (inventory) => inventory.addToInventory === "Internal Use"
  );
  const handleEdit = (event) => {
    event.preventDefault();
    alert("Click On Edit");
  };

  const handleCheckOut = (event) => {
    event.preventDefault();
    alert("Click On Check Out");
  };

  const handleAddRetailInventory = (event) => {
    event.preventDefault();
    alert("Add new retail inventory");
  };

  const handleAddInternalInventory = (event) => {
    event.preventDefault();
    alert("Add new internal inventory");
  };

  return (
    <div>
      <h2>Hello Lumiere</h2>
      {internalInventory.length > 0 && (
        <div>
          <h3>{internalInventory[0].addToInventory}</h3>
          <img src={productResults[0].photo} className="smallPhoto"></img>
          <br />
          <span>{productResults[0].productName}</span>
          <br />
          <span>{productResults[0].barcodeId}</span>
          <br />
          <strong>Stock </strong>
          <span>{internalInventory[0].stockQuantity}</span>
          <br />
          <strong>unitPrice </strong> {productResults[0].unitPrice}
          <br />
          <strong>unitCost </strong> {productResults[0].unitCost}
          <br />
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleCheckOut}>Staff Checkout</button>
        </div>
      )}
      {internalInventory.length === 0 && (
        <div>
          <h3>Internal Use</h3>
          <h5>No Products Match Your Search</h5>
          <button onClick={handleAddInternalInventory}>
            Register New Product
          </button>
        </div>
      )}
      {retailInventory.length > 0 && (
        <div>
          <h3>{retailInventory[0].addToInventory}</h3>
          <img src={productResults[0].photo} className="smallPhoto"></img>
          <br />
          <span>{productResults[0].productName}</span>
          <br />
          <span>{productResults[0].barcodeId}</span>
          <br />
          <strong>Stock </strong>
          <span>{retailInventory[0].stockQuantity}</span>
          <br />
          <strong>unitPrice </strong> {productResults[0].unitPrice}
          <br />
          <strong>unitCost </strong> {productResults[0].unitCost}
          <br />
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleCheckOut}>Staff Checkout</button>
        </div>
      )}
      {retailInventory.length === 0 && (
        <div>
          <h3>Retail</h3>
          <h5>No Products Match Your Search</h5>
          <button onClick={handleAddRetailInventory}>
            Register New Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ScannerDetail;
