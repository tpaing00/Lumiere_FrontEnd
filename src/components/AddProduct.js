import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import inventoryTypeData from "./predefined_data/inventorytype.json";
import productCategoryData from "./predefined_data/productcategory.json";
import periodAfterOpeningData from "./predefined_data/periodafteropening.json";
import expirationReminderTimeData from "./predefined_data/expirationremindertime.json"
import lowStockThresholdData from "./predefined_data/lowstockthreshold.json"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Switch, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RemoveIcon from '@mui/icons-material/Remove';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { DocumentScannerOutlined } from "@mui/icons-material";

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { barcode } = location.state ? location.state : "";
  const [formData, setFormData] = useState({
    addToInventory: "Internal Use",
    category: "Select",
    productName: "",
    brandName: "",
    stockQuantity: 0,
    barcodeNumber: barcode != "" ? barcode : "",
    unitPrice: "",
    totalValue: 0,
    expiryDate: "",
    periodAfterOpening: "Select",
    isLowStockAlert: false,
    lowStockThreshold: "Select",
    isExpirationReminder: false,
    expirationReminderTime: "Select",
  });

  const [error, setError] = useState(null);

  // Validation function
  const validateForm = () => {
    if (
      formData.productName.trim() === "" ||
      formData.brandName.trim() === "" ||
      formData.barcodeNumber.trim() === "" ||
      formData.stockQuantity <= 0 ||
      formData.unitPrice <= 0 ||
      formData.expiryDate === "" ||
      (formData.isLowStockAlert && formData.lowStockThreshold === "Select") ||
      (formData.isExpirationReminder &&
        formData.expirationReminderTime === "Select")
    ) {
      setError("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  // Conditional enable/disable the low stock threshold based on the checked state of the checkbox isLowStockAlert
  const [isLowStockThresholdDisabled, setIsLowStockThresholdDisabled] =
    useState(true);
  const [isLowStockAlertChecked, setIsLowStockAlertChecked] = useState(false);

  useEffect(() => {
    setIsLowStockThresholdDisabled(!isLowStockAlertChecked);
  }, [isLowStockAlertChecked]);

  // Conditional enable/disable the low stock threshold based on the checked state of the checkbox isExpirationReminder
  const [
    isExpirationReminderTimeDisabled,
    setIsExpirationReminderTimeDisabled,
  ] = useState(true);
  const [isExpirationReminderChecked, setIsExpirationReminderChecked] =
    useState(false);

  useEffect(() => {
    setIsExpirationReminderTimeDisabled(!isExpirationReminderChecked);
  }, [isExpirationReminderChecked]);

  // calculates the total value based on the multiplication of unit price and stock
  useEffect(() => {
    const result = Number(formData.stockQuantity) * Number(formData.unitPrice);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalValue: result,
    }));
  }, [formData.stockQuantity, formData.unitPrice]);

  // updates values upon change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleScan = () => {
    navigate("/scanner");
  };

  // handles the submit of the form using axios to pass the data to the backend
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }
    axios
      .post("https://api.lumiereapp.ca/api/v1/add-product", {
        addToInventory: formData.addToInventory,
        category: formData.category,
        productName: formData.productName,
        brandName: formData.brandName,
        stockQuantity: formData.stockQuantity,
        barcodeNumber: formData.barcodeNumber,
        unitPrice: formData.unitPrice,
        totalValue: formData.totalValue,
        expiryDate: formData.expiryDate,
        periodAfterOpening: formData.periodAfterOpening,
        isLowStockAlert: formData.isLowStockAlert,
        lowStockThreshold: formData.lowStockThreshold,
        isExpirationReminder: formData.isExpirationReminder,
        expirationReminderTime: formData.expirationReminderTime,
      })
      .then((response) => {
        if (response.status === 201) {
          const { inventory, notification, product } = response.data;
          let inventoryId = inventory._id;
          let barcodeNumber = formData.barcodeNumber;
          navigate("/productdetail", {
            state: { inventoryId, barcodeNumber },
          });
          setError(null);
        } else {
          setError("Unable to register product");
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
    <>
      <Container component='main' maxWidth='lg'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography component="h1" align="left" variant="h2" color="accent.main">
            Register new Product
          </Typography>

          {error && <Typography paragraph={true} sx={{ color: 'red' }}> {error} </Typography>}

          <Box component='form' onSubmit={handleSubmit} id='form-register-product' sx={{ mt: 3 }}>

            <Box className="register-inventory">

              <Grid container spacing={3}>

                <Grid item xs={6}>
                  <InputLabel variant="standard" id="addToInventory-label">
                    Add to Inventory
                  </InputLabel>
                  <Select
                    id="addToInventory"
                    name="addToInventory"
                    className="dropdown"
                    value={formData.addToInventory}
                    onChange={handleChange}
                    fullWidth
                  >
                    {inventoryTypeData.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={6}>
                  <InputLabel variant="standard" id="category-label">
                    Add Product Category
                  </InputLabel>
                  <Select
                    id="category"
                    name="category"
                    className="dropdown"
                    value={formData.category}
                    onChange={handleChange}
                    fullWidth
                  >
                    {productCategoryData.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Box>

            <Box className="register-product-information">

              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<RemoveIcon />}
                  aria-controls="register-product-content"
                  id="register-product-header"
                >
                  <Typography component="h2" align="left" variant="h3">
                    Product Information
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        id="productName"
                        onChange={handleChange}
                        name="productName"
                        value={formData.productName}
                        label="Product Name"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        id="brandName"
                        onChange={handleChange}
                        name="brandName"
                        value={formData.brandName}
                        label="Brand"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        type="number"
                        id="stockQuantity"
                        onChange={handleChange}
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        id="barcodeNumber"
                        onChange={handleChange}
                        name="barcodeNumber"
                        value={formData.barcodeNumber}
                        label="Barcode Number"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleScan} style={{transform: 'rotate(90deg)'}}>
                                <DocumentScannerOutlined />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        id="unitPrice"
                        type="number"
                        onChange={handleChange}
                        name="unitPrice"
                        value={formData.unitPrice}
                        placeholder="$"
                        label="Unit price"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <DatePicker
                        id="expiryDate"
                        onChange={handleChange}
                        name="expiryDate"
                        value={formData.expiryDate}
                        label="Expiry Date"
                        slotProps={{ textField: { fullWidth: true } }}

                      />
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel variant="standard" id="periodAfterOpening-label">
                        Period After Opening (PAO)
                      </InputLabel>
                      <Select
                        id="periodAfterOpening"
                        name="periodAfterOpening"
                        className="dropdown"
                        value={formData.periodAfterOpening}
                        onChange={handleChange}
                        fullWidth
                      >
                        {periodAfterOpeningData.map((type) => (
                          <MenuItem key={type.value} value={type.value} fullWidth>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box className="register-notification-settings">
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<RemoveIcon />}
                  aria-controls="notification-settings-content"
                  id="notification-settings-header"
                >
                  <Typography component="h2" align="left" variant="h3">
                    Notification Settings
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Box className="low-stock-settings">

                    <Grid container item xs={12} spacing={1}>
                      <Grid item xs={6}>
                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                          <NotificationsNoneOutlinedIcon sx={{ mr: 1 }} />
                          Low Stock Alert
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={(e) => {
                                handleChange(e);
                                setIsLowStockAlertChecked(e.target.checked);
                              }}
                              name="isLowStockAlert"
                              value={formData.isLowStockAlert}
                              id="isLowStockAlert"
                            />
                          }
                          aria-label="Set Low Stock Alert"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel variant="standard" id="lowStockThreshold-label">
                          Notify when stock is below
                        </InputLabel>
                        <Select
                          id="lowStockThreshold"
                          name="lowStockThreshold"
                          className="dropdown"
                          value={formData.lowStockThreshold}
                          onChange={handleChange}
                          disabled={isLowStockThresholdDisabled}
                          fullWidth
                        >
                          {lowStockThresholdData.map((type) => (
                            <MenuItem key={type.value} value={type.value} fullWidth>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>

                  </Box>

                  <Box className="expiration-reminder-settings" sx={{ mt: 3 }}>

                    <Grid container item xs={12} spacing={1}>
                      <Grid item xs={6}>
                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                          <NotificationsNoneOutlinedIcon sx={{ mr: 1 }} />
                          Expiration Reminder
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={(e) => {
                                handleChange(e);
                                setIsExpirationReminderChecked(e.target.checked);
                              }}
                              name="isExpirationReminder"
                              value={formData.isExpirationReminder}
                              id="isExpirationReminder"
                            />
                          }
                          aria-label="Set Expiration Reminder"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel variant="standard" id="expirationReminderTime-label">
                          Notify when expiry date is
                        </InputLabel>
                        <Select
                          id="expirationReminderTime"
                          name="expirationReminderTime"
                          className="dropdown"
                          value={formData.expirationReminderTime}
                          onChange={handleChange}
                          disabled={isExpirationReminderTimeDisabled}
                          fullWidth
                        >
                          {expirationReminderTimeData.map((type) => (
                            <MenuItem key={type.value} value={type.value} fullWidth>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>

                  </Box>

                </AccordionDetails>
              </Accordion>
            </Box>

            <Box className="register-buttons" aria-label="Form options" sx={{ mt: 3, p: 3 }}>
              <Button variant='outlined' type="reset" sx={{ mr: 3 }} >
                Cancel
              </Button>
              <Button variant='contained' type="submit">
                Register
              </Button>

            </Box>



          </Box>


        </LocalizationProvider>
      </Container>
    </>
  )

  // return (
  //   <>
  //     <h1>Register New Product</h1>
  //     {error && <p style={{ color: "red" }}>{error}</p>}
  //     <form id="form-register-product" onSubmit={handleSubmit}>
  //       <div className="register-inventory">
  //         <label htmlFor="addToInventory">Add to Inventory</label>
  //         <select
  //           name="addToInventory"
  //           className="dropdown"
  //           value={formData.addToInventory}
  //           onChange={handleChange}
  //         >
  //           {inventoryTypeData.map((type) => (
  //             <option key={type.value} value={type.value}>
  //               {type.label}
  //             </option>
  //           ))}
  //         </select>
  //         <label htmlFor="category">Add Product Category</label>
  //         <select
  //           name="category"
  //           className="dropdown"
  //           value={formData.category}
  //           onChange={handleChange}
  //         >
  //           {productCategoryData.map((type) => (
  //             <option key={type.value} value={type.value}>
  //               {type.label}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       <div className="register-product-information">
  //         <h2>Product Information</h2>

  //         <label htmlFor="productName">Product Name</label>
  //         <input
  //           type="text"
  //           onChange={handleChange}
  //           name="productName"
  //           value={formData.productName}
  //         />

  //         <label htmlFor="brandName">Brand</label>
  //         <input
  //           type="text"
  //           onChange={handleChange}
  //           name="brandName"
  //           value={formData.brandName}
  //         />

  //         <label htmlFor="stockQuantity">Stock</label>
  //         <input
  //           type="number"
  //           min="0"
  //           onChange={handleChange}
  //           name="stockQuantity"
  //           value={formData.stockQuantity}
  //         />

  //         <label htmlFor="barcodeNumber">Barcode Number</label>
  //         <input
  //           type="text"
  //           min="0"
  //           onChange={handleChange}
  //           name="barcodeNumber"
  //           value={formData.barcodeNumber}
  //         />
  //         <button onClick={handleScan}>Scan</button>
  //         <label htmlFor="unitPrice">Unit price</label>
  //         <input
  //           type="number"
  //           min="0"
  //           onChange={handleChange}
  //           name="unitPrice"
  //           value={formData.unitPrice}
  //           placeholder="$"
  //         />

  //         {/* <label htmlFor="totalValue">Total Value</label>
  //                   <input type="number" min="0" onChange={handleChange} name="totalValue" value={formData.totalValue} placeholder="$" disabled /> */}

  //         <label htmlFor="expiryDate">Expiry Date</label>
  //         <input
  //           type="date"
  //           onChange={handleChange}
  //           name="expiryDate"
  //           value={formData.expiryDate}
  //         />

  //         <label htmlFor="periodAfterOpening">Period After Opening (PAO)</label>
  //         <select
  //           name="periodAfterOpening"
  //           className="dropdown"
  //           value={formData.periodAfterOpening}
  //           onChange={handleChange}
  //         >
  //           {periodAfterOpeningData.map((type) => (
  //             <option key={type.value} value={type.value}>
  //               {type.label}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       <div className="register-notification-settings">
  //         <h2>Notification Settings</h2>

  //         <label htmlFor="isLowStockAlert">Low Stock Alert</label>
  //         <input
  //           type="checkbox"
  //           onChange={(e) => {
  //             handleChange(e);
  //             setIsLowStockAlertChecked(e.target.checked);
  //           }}
  //           name="isLowStockAlert"
  //           value={formData.isLowStockAlert}
  //         />

  //         <label htmlFor="lowStockThreshold">Notify when stock is below</label>
  //         <select
  //           name="lowStockThreshold"
  //           className="dropdown"
  //           value={formData.lowStockThreshold}
  //           onChange={handleChange}
  //           disabled={isLowStockThresholdDisabled}
  //         >
  //           {lowStockThresholdData.map((type) => (
  //             <option key={type.value} value={type.value}>
  //               {type.label}
  //             </option>
  //           ))}
  //         </select>

  //         <label htmlFor="isExpirationReminder">Low Stock Alert</label>
  //         <input
  //           type="checkbox"
  //           onChange={(e) => {
  //             handleChange(e);
  //             setIsExpirationReminderChecked(e.target.checked);
  //           }}
  //           name="isExpirationReminder"
  //           value={formData.isExpirationReminder}
  //         />

  //         {/* conditional on the boolean above - useReducer */}
  //         <label htmlFor="expirationReminderTime">
  //           Notify when expiry date is
  //         </label>
  //         <select
  //           name="expirationReminderTime"
  //           className="dropdown"
  //           value={formData.expirationReminderTime}
  //           onChange={handleChange}
  //           disabled={isExpirationReminderTimeDisabled}
  //         >
  //           {expirationReminderTimeData.map((type) => (
  //             <option key={type.value} value={type.value}>
  //               {type.label}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
  //       <div className="register-buttons">
  //         <button type="reset">CANCEL</button>
  //         <button type="submit">REGISTER</button>
  //       </div>
  //     </form>
  //   </>
  // );
};

export default AddProduct;
