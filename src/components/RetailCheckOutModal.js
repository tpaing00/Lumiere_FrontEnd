import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

const RetailCheckOutModal = ({
  handleClose,
  productData,
  inventoryId,
  stockQuantity,
  handleReloadRetailData,
}) => {
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [error, setError] = useState(null); // Define error state

  const validateForm = () => {
    // Validate quantity
    if (quantity <= 0 || quantity > stockQuantity) {
      setError("Please enter a valid quantity within the available stock.");
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
    <>
      <Box className="overlay">
        <Box className="overlay-content">
          <Typography
            component="h2"
            variant="h2"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Retail Checkout
            <Close className="close-button" onClick={handleClose} />
          </Typography>

          {error && <Typography sx={{ color: "warning" }}>{error}</Typography>}

          <TextField
            type="number"
            name="quantity"
            value={quantity}
            inputProps={{ min: 1, max: stockQuantity }}
            onChange={(e) => setQuantity(e.target.value)}
            label="Quantity:"
            fullWidth
          />

          <Box className="form-control" sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              type="reset"
              sx={{ mr: 3 }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleProceed}>
              Proceed
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RetailCheckOutModal;
