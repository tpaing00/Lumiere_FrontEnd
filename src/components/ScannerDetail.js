import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StaffCheckOutModal from "./StaffCheckOutModal";
import RetailCheckOutModal from "./RetailCheckOutModal";

import {
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Box,
  Container,
  Modal,
} from "@mui/material";

const ScannerDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [productResults, setProductResults] = useState([]);
  const [retailInventory, setretailInventoryResults] = useState([]);
  const [internalInventory, setinternalInventoryResults] = useState([]);
  const [barcode, setBarcode] = useState([]);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [showRetailModal, setShowRetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [location.state]);

  const fetchData = async () => {
    const { productResults, inventoryResults, barcode } = location.state;
    setProductResults(productResults);
    setretailInventoryResults(
      inventoryResults.filter(
        (inventory) => inventory.addToInventory === "Retail"
      )
    );
    setinternalInventoryResults(
      inventoryResults.filter(
        (inventory) => inventory.addToInventory === "Internal Use"
      )
    );
    setBarcode(barcode);
  };

  const handleReloadInternalData = (latestData) => {
    if (latestData && latestData.updatedInventory) {
      const latestInventoryResults = latestData.updatedInventory[0];
      setinternalInventoryResults([latestInventoryResults]);
    }
  };

  const handleReloadRetailData = (latestData) => {
    if (latestData && latestData.updatedInventory) {
      const latestInventoryResults = latestData.updatedInventory[0];
      setretailInventoryResults([latestInventoryResults]);
    }
  };

  const handleEdit = (event) => {
    event.preventDefault();
    alert("Click On Edit");
  };

  const handleStaffCheckOut = (event) => {
    event.preventDefault();
    if (!isExpired(internalInventory[0].expiryDate)) {
      setShowInternalModal(true);
    } else {
      alert("Product is expired. Cannot check out.");
    }
  };

  const handleCloseModal = () => {
    setShowInternalModal(false); // Close the modal
  };

  const handleRetailCheckOut = (event) => {
    event.preventDefault();
    //alert("retailexp " + retailInventory[0].expiryDate);
    if (!isExpired(retailInventory[0].expiryDate)) {
      setShowRetailModal(true);
    } else {
      alert("Product is expired. Cannot check out.");
    }
  };

  const handleRetailCloseModal = () => {
    setShowRetailModal(false); // Close the modal
  };

  const handleAddRetailInventory = (event) => {
    event.preventDefault();
    navigate("/add-product", { state: { barcode, inventoryType: "Retail" } });
  };

  const handleAddInternalInventory = (event) => {
    event.preventDefault();
    navigate("/add-product", {
      state: { barcode, inventoryType: "Internal Use" },
    });
  };

  // Function to format date to display only date portion
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date to display only date portion
  };

  // Function to check if a product is expired
  const isExpired = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    // Set the time part of today's date to 00:00:00 to compare date only
    today.setHours(0, 0, 0, 0);
    return expiry < today;
  };

  return (
    <Container component="main" maxWidth="lg">
      <Typography
          component="h1"
          align="left"
          variant="h2"
        >
          Quick Scan
        </Typography>
      <Box sx={{ mt: 3 }}>        
        {internalInventory.length > 0 && (
          <div>
            <Typography variant="h3">
              {internalInventory[0].addToInventory}
            </Typography>
            <Card sx={{ borderRadius: 5, border: "1px solid #ccc" }}>
              <CardContent>
                <Grid container spacing={2}>
                  {/* Column 1 - Product Image */}
                  <Grid item xs={4}>
                    <img
                      src={productResults[0].photo[0]}
                      className="smallPhoto"
                      alt="Product Photo"
                    />
                  </Grid>
                  {/* Column 2 - Product Details */}
                  <Grid item xs={5}>
                    <Grid container direction="column" spacing={1}>
                      {/* Row 1 - Barcode Number & Category */}
                      <Grid item container xs={4} spacing={1}>
                        <Grid item>
                          <Typography>{productResults[0].barcodeNumber}</Typography>
                        </Grid>                       
                        <Grid item>
                          <Typography>{productResults[0].category}</Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs>
                          <Typography><strong>{productResults[0].productName}</strong></Typography>
                      </Grid>
                      {/* Row 2 - Stock Quantity & Unit Price */}
                      <Grid item container xs={4} spacing={1}>
                        <Grid item>
                          <Typography><strong>Stock:</strong> {internalInventory[0].stockQuantity}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography><strong>Unit Price:</strong> {productResults[0].unitPrice}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography><strong>Expiry Date:</strong> {formatDate(internalInventory[0].expiryDate)}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* Column 3 - Edit and Staff Checkout Buttons */}
                  <Grid item xs={2}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Button onClick={handleEdit} fullWidth>Edit</Button>
                      </Grid>
                      <Grid item>
                        <Button onClick={handleStaffCheckOut} disabled={internalInventory[0].stockQuantity === 0} fullWidth>Staff Checkout</Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {/* <Card sx={{ borderRadius: 5, border: "1px solid #ccc" }}>
              <CardContent>
                <img
                  src={productResults[0].photo}
                  className="smallPhoto"
                  alt="Product Photo"
                />
                <br />
                <Typography>{productResults[0].barcodeNumber}</Typography>
                <Typography>{productResults[0].productName}</Typography>
                <Typography>{productResults[0].category}</Typography>
                <strong>Stock </strong>
                <Typography>{internalInventory[0].stockQuantity}</Typography>
                <strong>unitPrice </strong>
                <Typography>{productResults[0].unitPrice}</Typography>
                <strong>Expiry Date </strong>
                <Typography>
                  {formatDate(internalInventory[0].expiryDate)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={handleEdit}>Edit</Button>
                <Button
                  onClick={handleStaffCheckOut}
                  disabled={internalInventory[0].stockQuantity === 0}
                >
                  Staff Checkout
                </Button>
              </CardActions>
            </Card> */}
          </div>
        )}
        {showInternalModal && (
          <Modal open={showInternalModal} onClose={handleCloseModal}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <StaffCheckOutModal
                  handleClose={handleCloseModal}
                  productData={productResults[0]}
                  inventoryId={internalInventory[0]._id}
                  stockQuantity={internalInventory[0].stockQuantity}
                  handleReloadInternalData={handleReloadInternalData}
                />
              </Grid>
            </Grid>
          </Modal>
        )}
        {internalInventory.length === 0 && (
          <div>
            <Typography variant="h3">Internal Use</Typography>
            <Card sx={{ borderRadius: 5, border: "1px solid #ccc" }}>
              <CardContent>
                <Typography variant="h5">
                  No Products Match Your Search
                </Typography>
                <Button onClick={handleAddInternalInventory}>
                  Register New Product
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        {retailInventory.length > 0 && (
          <div>
          <Typography variant="h3">
            {retailInventory[0].addToInventory}
          </Typography>
          <Card sx={{ borderRadius: 5, border: "1px solid #ccc" }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* Column 1 - Product Image */}
                {console.log("product photo", productResults)}
                <Grid item xs={4}>
                  <img
                    src={productResults[0].photo[0]}
                    className="smallPhoto"
                    alt="Product Photo"
                  />
                </Grid>
                {/* Column 2 - Product Details */}
                <Grid item xs={5}>
                  <Grid container direction="column" spacing={1}>
                    {/* Row 1 - Barcode Number & Category */}
                    <Grid item container xs={4} spacing={1}>
                      <Grid item>
                        <Typography>{productResults[0].barcodeNumber}</Typography>
                      </Grid>                       
                      <Grid item>
                        <Typography>{productResults[0].category}</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs>
                        <Typography><strong>{productResults[0].productName}</strong></Typography>
                    </Grid>
                    {/* Row 2 - Stock Quantity & Unit Price */}
                    <Grid item container xs={4} spacing={1}>
                      <Grid item>
                        <Typography><strong>Stock:</strong> {retailInventory[0].stockQuantity}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography><strong>Unit Price:</strong> {productResults[0].unitPrice}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography><strong>Expiry Date:</strong> {formatDate(retailInventory[0].expiryDate)}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Column 3 - Edit and Staff Checkout Buttons */}
                <Grid item xs={2}>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Button onClick={handleEdit} fullWidth>Edit</Button>
                    </Grid>
                    <Grid item>
                      <Button onClick={handleRetailCheckOut} disabled={retailInventory[0].stockQuantity === 0} fullWidth>Retail Checkout</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>          
        </div>
        )}
        {showRetailModal && (
          <Modal open={showRetailModal} onClose={handleRetailCloseModal}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <RetailCheckOutModal
                  handleClose={handleRetailCloseModal}
                  productData={productResults[0]}
                  inventoryId={retailInventory[0]._id}
                  stockQuantity={retailInventory[0].stockQuantity}
                  handleReloadRetailData={handleReloadRetailData}
                />
              </Grid>
            </Grid>
          </Modal>
        )}
        {retailInventory.length === 0 && (
          <div>
            <Typography variant="h3">Retail</Typography>
            <Card sx={{ borderRadius: 5, border: "1px solid #ccc" }}>
              <CardContent>
                <Typography variant="h5">
                  No Products Match Your Search
                </Typography>
                <Button onClick={handleAddRetailInventory}>
                  Register New Product
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Box>
    </Container>
  );
  // return (
  //   <div>
  //     <h2>Hello Lumiere</h2>
  //     {internalInventory.length > 0 && (
  //       <div>
  //         <h3>{internalInventory[0].addToInventory}</h3>
  //         <img src={productResults[0].photo} className="smallPhoto"></img>
  //         <br />
  //         <span>{productResults[0].barcodeNumber}</span>
  //         <br />
  //         <span>{productResults[0].productName}</span>
  //         <br />
  //         <span>{productResults[0].barcodeId}</span>
  //         <br />
  //         <strong>Stock </strong>
  //         <span>{internalInventory[0].stockQuantity}</span>
  //         <br />
  //         <strong>unitPrice </strong> {productResults[0].unitPrice}
  //         <br />
  //         <strong>Expiry Date </strong>{" "}
  //         {formatDate(internalInventory[0].expiryDate)}
  //         <br />
  //         <button onClick={handleEdit}>Edit</button>
  //         <button
  //           onClick={handleStaffCheckOut}
  //           disabled={internalInventory[0].stockQuantity === 0}
  //         >
  //           Staff Checkout
  //         </button>
  //       </div>
  //     )}
  //     {showInternalModal && (
  //       <StaffCheckOutModal
  //         handleClose={handleCloseModal}
  //         productData={productResults[0]}
  //         inventoryId={internalInventory[0]._id}
  //         stockQuantity={internalInventory[0].stockQuantity}
  //         handleReloadInternalData={handleReloadInternalData}
  //       />
  //     )}
  //     {internalInventory.length === 0 && (
  //       <div>
  //         <h3>Internal Use</h3>
  //         <h5>No Products Match Your Search</h5>
  //         <button onClick={handleAddInternalInventory}>
  //           Register New Product
  //         </button>
  //       </div>
  //     )}
  //     {retailInventory.length > 0 && (
  //       <div>
  //         <h3>{retailInventory[0].addToInventory}</h3>
  //         <img src={productResults[0].photo} className="smallPhoto"></img>
  //         <br />
  //         <span>{productResults[0].barcodeNumber}</span>
  //         <br />
  //         <span>{productResults[0].productName}</span>
  //         <br />
  //         <span>{productResults[0].barcodeId}</span>
  //         <br />
  //         <strong>Stock </strong>
  //         <span>{retailInventory[0].stockQuantity}</span>
  //         <br />
  //         <strong>unitPrice </strong> {productResults[0].unitPrice}
  //         <br />
  //         <strong>unitCost </strong> {productResults[0].unitCost}
  //         <br />
  //         <strong>Expiry Date </strong>{" "}
  //         {formatDate(retailInventory[0].expiryDate)}
  //         <br />
  //         <button onClick={handleEdit}>Edit</button>
  //         <button
  //           onClick={handleRetailCheckOut}
  //           disabled={retailInventory[0].stockQuantity === 0}
  //         >
  //           Retail Checkout
  //         </button>
  //       </div>
  //     )}
  //     {showRetailModal && (
  //       <RetailCheckOutModal
  //         handleClose={handleRetailCloseModal}
  //         productData={productResults[0]}
  //         inventoryId={retailInventory[0]._id}
  //         stockQuantity={retailInventory[0].stockQuantity}
  //         handleReloadRetailData={handleReloadRetailData}
  //       />
  //     )}
  //     {retailInventory.length === 0 && (
  //       <div>
  //         <h3>Retail</h3>
  //         <h5>No Products Match Your Search</h5>
  //         <button onClick={handleAddRetailInventory}>
  //           Register New Product
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ScannerDetail;
