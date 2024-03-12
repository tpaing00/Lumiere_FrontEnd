import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import inventoryTypeData from "./predefined_data/inventorytype.json";
import productCategoryData from "./predefined_data/productcategory.json";
import periodAfterOpeningData from "./predefined_data/periodafteropening.json";
import expirationReminderTimeData from "./predefined_data/expirationremindertime.json";
import lowStockThresholdData from "./predefined_data/lowstockthreshold.json";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RemoveIcon from "@mui/icons-material/Remove";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { DocumentScannerOutlined } from "@mui/icons-material";
import { format, addDays } from "date-fns";

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const barcode = state && state.barcode ? state.barcode : "";
  const inventoryType = state && state.inventoryType ? state.inventoryType : "";

  const [formData, setFormData] = useState({
    addToInventory: inventoryType !== undefined && inventoryType !== "" ? inventoryType : "Internal Use",
    category: "Select",
    productName: "",
    brandName: "",
    stockQuantity: 0,
    barcodeNumber: barcode !== undefined && barcode !== "" ? barcode : "",
    unitPrice: "",
    totalValue: 0,
    expiryDate: "",
    periodAfterOpening: "Select",
    isLowStockAlert: false,
    lowStockThreshold: "Select",
    isExpirationReminder: false,
    expirationReminderTime: "Select",
    message: "",
  });

  // State to hold selected image files
  const [images, setImages] = useState([]);

  // Function to handle file input change
  const handleFileChange = (event) => {
    const files = event.target.files;
    setImages([...images, ...files]);
  };

  const [error, setError] = useState(null);

  //Fetching existing data with barcodeNumber
  const [existingProductData, setExistingProductData] = useState(null);
  const [existingInventoryData, setExistingInventoryData] = useState(null);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await axios.get(
          `https://api.lumiereapp.ca/api/v1/barcode/${formData.barcodeNumber}`
        );
        const { inventoryResults, productResults } = response.data;
        if (productResults.length > 0 && inventoryResults.length > 0) {
          const {
            productName,
            brandName,
            category,
            unitPrice,
            periodAfterOpening,
          } = productResults[0];
          //const { addToInventory, stockQuantity, expiryDate} = inventoryResults[0];
          const { stockQuantity, expiryDate } = inventoryResults[0];
          // Convert expiryDate to yyyy-MM-dd format
          const formattedExpiryDate = new Date(expiryDate)
            .toISOString()
            .split("T")[0];
          setExistingProductData({
            productName,
            brandName,
            category,
            unitPrice,
            periodAfterOpening,
          });
          setExistingInventoryData({
            stockQuantity,
            expiryDate: format(formattedExpiryDate, "yyyy-MM-dd"),
          });
        }
      } catch (error) {
        console.error("Error fetching existing product data:", error);
        setError("Error fetching existing product data");
      }
    };

    if (formData.barcodeNumber) {
      fetchExistingData();
    }
  }, [formData.barcodeNumber]);

  useEffect(() => {
    if (existingProductData && existingInventoryData) {
      const {
        productName,
        brandName,
        category,
        unitPrice,
        periodAfterOpening,
      } = existingProductData;
      const { expiryDate } =
        existingInventoryData;

      // Populate the form fields with existing data
      setFormData((prevFormData) => ({
        ...prevFormData,
        //addToInventory,
        category,
        productName,
        brandName,
        //stockQuantity,
        unitPrice,
        expiryDate,
        periodAfterOpening,
        isLowStockAlert: false,
        lowStockThreshold: "",
        isExpirationReminder: false,
        expirationReminderTime: "",
        message: "",
      }));
    }
  }, [existingProductData, existingInventoryData]);

  const validateForm = () => {
    if (!formData.expiryDate) {
      setError("Please fill in all required fields.");
      return false;
    }

    const today = new Date();
    const [year, month, day] = formData.expiryDate.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setError("Date of expiry cannot be same date or earlier than today's date.");
      return false;
    }

    if (
      formData.category === "Select" ||
      formData.productName.trim() === "" ||
      formData.brandName.trim() === "" ||
      formData.stockQuantity <= 0 ||
      formData.barcodeNumber.trim() === "" ||
      formData.unitPrice <= 0 ||
      formData.expiryDate === "" ||
      formData.periodAfterOpening === "Select" ||
      (formData.isLowStockAlert && formData.lowStockThreshold === "Select") ||
      (formData.isExpirationReminder && formData.expirationReminderTime === "Select")
    ) {
      setError("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const [isLowStockThresholdDisabled, setIsLowStockThresholdDisabled] = useState(true);
  const [isLowStockAlertChecked, setIsLowStockAlertChecked] = useState(false);

  useEffect(() => {
    setIsLowStockThresholdDisabled(!isLowStockAlertChecked);
  }, [isLowStockAlertChecked]);

  const [isExpirationReminderTimeDisabled, setIsExpirationReminderTimeDisabled] = useState(true);
  const [isExpirationReminderChecked, setIsExpirationReminderChecked] = useState(false);

  useEffect(() => {
    setIsExpirationReminderTimeDisabled(!isExpirationReminderChecked);
  }, [isExpirationReminderChecked]);

  useEffect(() => {
    const result = Number(formData.stockQuantity) * Number(formData.unitPrice);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalValue: result,
    }));
  }, [formData.stockQuantity, formData.unitPrice]);

  // updates values upon change
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // For checkboxes, the value is either "on" or undefined
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleScan = () => {
    navigate("/");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }
    const formDataToSend = new FormData();

    console.log("form data", formData);
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const response = await axios.post("https://api.lumiereapp.ca/api/v1/add-product", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      <Container component="main" maxWidth="lg" sx={{mt: 3}} >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography
            component="h1"
            align="left"
            variant="h1"
          >
            Register new Product
          </Typography>

          {error && (
            <Typography paragraph={true} sx={{ color: "red" }}>
              {" "}
              {error}{" "}
            </Typography>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            id="form-register-product"
            sx={{ mt: 3 }}
          >
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
                  <Grid container spacing={10}>
                    <Grid container item spacing={3} xs={7} className="register-product-info">
                      <Grid item xs={12}>
                        <InputLabel variant="standard" id="productName-label">
                          Product Name
                        </InputLabel>
                        <TextField
                          id="productName"
                          onChange={handleChange}
                          name="productName"
                          value={formData.productName}
                          placeholder="Product name"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <InputLabel variant="standard" id="brandName-label">
                          Brand
                        </InputLabel>
                        <TextField
                          id="brandName"
                          onChange={handleChange}
                          name="brandName"
                          value={formData.brandName}
                          placeholder="Brand"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <InputLabel variant="standard" id="stockQuantity-label">
                          Stock Quantity
                        </InputLabel>
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
                        <InputLabel variant="standard" id="barcodeNumber-label">
                          Barcode Number
                        </InputLabel>
                        <TextField
                          id="barcodeNumber"
                          onChange={handleChange}
                          name="barcodeNumber"
                          value={formData.barcodeNumber}
                          fullWidth
                          placeholder="12 digits"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleScan}
                                  style={{ transform: "rotate(90deg)" }}
                                >
                                  <DocumentScannerOutlined />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <InputLabel variant="standard" id="unitPrice-label">
                          Unit price
                        </InputLabel>
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
                        <InputLabel variant="standard" id="expiryDate-label">
                          Expiry date
                        </InputLabel>
                        <TextField
                          id="expiryDate"
                          onChange={handleChange}
                          name="expiryDate"
                          value={formData.expiryDate}
                          fullWidth
                          type="date"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <InputLabel
                          variant="standard"
                          id="periodAfterOpening-label"
                        >
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
                            <MenuItem
                              key={type.value}
                              value={type.value}
                              fullWidth
                            >
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>

                    <Grid item xs={5} className="register-product-images">
                      <Typography component="h2" align="left" variant="h3" sx={{mb: 2}} >
                        Product Images
                      </Typography>

                      <Box sx={{ border: '3px dashed lightgrey', height: '300px', display: "flex", alignItems: "center", p: 2 }}>
                        <TextField
                          type="file"
                          id="productImages"
                          name="productImages"
                          multiple
                          onChange={handleFileChange}
                        />
                      </Box>
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
                        <Typography
                          sx={{ display: "flex", alignItems: "center" }}
                        >
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
                        <InputLabel
                          variant="standard"
                          id="lowStockThreshold-label"
                        >
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
                            <MenuItem
                              key={type.value}
                              value={type.value}
                              fullWidth
                            >
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
                        <Typography
                          sx={{ display: "flex", alignItems: "center" }}
                        >
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
                                setIsExpirationReminderChecked(
                                  e.target.checked
                                );
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
                        <InputLabel
                          variant="standard"
                          id="expirationReminderTime-label"
                        >
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
                            <MenuItem
                              key={type.value}
                              value={type.value}
                              fullWidth
                            >
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

            <Box
              className="register-buttons"
              aria-label="Form options"
              sx={{ mt: 3, p: 3 }}
            >
              <Button variant="outlined" type="reset" sx={{ mr: 3 }}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Register
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Container>
    </>
  );

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
