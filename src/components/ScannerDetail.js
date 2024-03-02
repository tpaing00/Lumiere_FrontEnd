import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import StaffCheckOutModal from "./StaffCheckOut";

const ScannerDetail = () => {
  const location = useLocation();
  //const { productResults, inventoryResults } = location.state;
  const [productResults, setProductResults] = useState([]);
  const [retailInventory, setretailInventoryResults] = useState([]);
  const [internalInventory, setinternalInventoryResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // const retailInventory = inventoryResults.filter(
  //   (inventory) => inventory.addToInventory === "Retail"
  // );
  // const internalInventory = inventoryResults.filter(
  //   (inventory) => inventory.addToInventory === "Internal Use"
  // );

  useEffect(() => {
    fetchData();
  }, [location.state]);

  const fetchData = async () => {
    const { productResults, inventoryResults } = location.state;
    setProductResults(productResults);
    setretailInventoryResults(inventoryResults.filter((inventory) => inventory.addToInventory === "Retail"));
    setinternalInventoryResults(inventoryResults.filter((inventory) => inventory.addToInventory === "Internal Use"));
  }; 

  const handleReloadInternalData = (latestData) => {
    if (latestData && latestData.updatedInventory){
      const latestInventoryResults = latestData.updatedInventory[0];
       setinternalInventoryResults([latestInventoryResults]);
    }    
  };

  const handleEdit = (event) => {
    event.preventDefault();
    alert("Click On Edit");
  };

  const handleStaffCheckOut = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleRetailCheckOut = (event) => {
    event.preventDefault();
    alert("Click On Retail Check Out");
  };

  const handleAddRetailInventory = (event) => {
    event.preventDefault();
    alert("Add new retail inventory");
  };

  const handleAddInternalInventory = (event) => {
    event.preventDefault();
    alert("Add new internal inventory");
  };

  // Function to format date to display only date portion
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date to display only date portion
  };

  return (
    <div>
      <h2>Hello Lumiere</h2>
      {internalInventory.length > 0 && (
        <div>
          <h3>{internalInventory[0].addToInventory}</h3>
          <img src={productResults[0].photo} className="smallPhoto"></img>
          <br />
          <span>{productResults[0].barcodeNumber}</span>
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
          <strong>Expiry Date </strong>{" "}
          {formatDate(internalInventory[0].expiryDate)}
          <br />
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleStaffCheckOut}>Staff Checkout</button>
        </div>
      )}
      {showModal && <StaffCheckOutModal handleClose={handleCloseModal} productData={productResults[0]} inventoryId={internalInventory[0]._id} handleReloadInternalData={handleReloadInternalData} />}
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
          <span>{productResults[0].barcodeNumber}</span>
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
          <strong>Expiry Date </strong> {formatDate(retailInventory[0].expiryDate)}
          <br />
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleRetailCheckOut}>Retail Checkout</button>
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
