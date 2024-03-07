import React, { useState, useEffect } from "react";
import axios from "axios";

const RetailCheckOutModal = ({
  handleClose,
  productData,
  inventoryId,
  stockQuantity,
  handleReloadRetailData,
}) => {
  const [quantity, setQuantity] = useState(1); // Default quantity is 1

  const validateForm = () => {
    // Validate quantity
    if (quantity <= 0 || quantity > stockQuantity) {
      alert("Please enter a valid quantity within the available stock.");
      return false;
    }    

    return true; // All validations passed
  };

  const handleProceed = () => {
    if (!validateForm()) {
      return;
    }

    const formData = {
      userId: "user_id",
      inventoryId: inventoryId,
      barcodeNumber: productData.barcodeNumber,
      addToInventory: "Retail",
      soldQuantity: quantity,
      soldDate: new Date().toISOString(),
      reason: "checkout for sale",
    };
    //POST request to the API
    axios
      .post("https://api.lumiereapp.ca/api/v1/checkout", formData)
      .then((response) => {
        alert("Checkout successful!");
        handleReloadRetailData(response.data);
        handleClose();
      })
      .catch((error) => {
        // Handle error
        console.error("Error during checkout:", error);
        alert("Error during checkout. Please try again.");
        handleClose();
      });
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={handleClose}>
          x
        </button>
        <h2>Retail Check Out</h2>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          min="1"
          max={stockQuantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button onClick={handleProceed}>Proceed</button>
      </div>
    </div>
  );
};

export default RetailCheckOutModal;
