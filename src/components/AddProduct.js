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
  Card,
  CardContent,
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
  useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RemoveIcon from "@mui/icons-material/Remove";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { DocumentScannerOutlined } from "@mui/icons-material";
import { format, addDays } from "date-fns";
import CustomSelect from "./mui_customization/base_components/CustomSelect";
import { ThemeContext } from "@emotion/react";

const AddProduct = () => {

  const theme = useTheme();

  // State to hold all selected image files
  const [allImages, setAllImages] = useState([]);

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
    location: "",
  });

  // State to hold selected image files
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    // Concatenate the new images with existing ones
    setImages((prevImages) => [...prevImages, ...files]);
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
            photo,
            message,
            location,
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
            photo,
            message,
            location,
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
        message,
        location,
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
        message,
        location,
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


  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   const formDataToSend = new FormData();

  //   //console.log("form data", formData);
  //   Object.entries(formData).forEach(([key, value]) => {
  //     formDataToSend.append(key, value);
  //   });

  //   images.forEach((image, index) => {
  //     formDataToSend.append(`images`, image);
  //   });

  //   try {
  //     const response = await axios.post("https://api.lumiereapp.ca/api/v1/add-product", formDataToSend, {

  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (response.status === 201) {
  //       const { inventory, notification, product } = response.data;
  //       let inventoryId = inventory._id;
  //       let barcodeNumber = formData.barcodeNumber;
  //       navigate("/productdetail", {
  //         state: { inventoryId, barcodeNumber },
  //       });
  //       setError(null);
  //     } else {
  //       setError("Unable to register product");
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       setError(error.response.data.error);
  //     } else {
  //       console.error("Error:", error.message);
  //     }
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const formDataToSend = new FormData();
  
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
  
    // Check if there are new images uploaded
    if (images.length === 0 && existingProductData && existingProductData.photo) {
      // Append existing images
      existingProductData.photo.forEach((photo, index) => {
        formDataToSend.append(`photo`, photo);
      });
    } else {
      // Append newly uploaded images
      images.forEach((image, index) => {
        console.log("image is ", image);
        formDataToSend.append(`photo`, image);
      });
    }
  
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

      <Container component="main" maxWidth="1146px" sx={{ mt: 3 }} >
        <LocalizationProvider dateAdapter={AdapterDayjs}>

          <Typography variant="h1" sx={{ pl: '40px', mb: '12px' }}>Register New Product</Typography>

          <Card sx={{ borderRadius: '12px', m: '30px 10px 0 10px' }}>

            <CardContent sx={{ p: '28px 40px', m: 0 }}>

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
              >
                <Box className="register-inventory">
                  <Grid container spacing="24px">
                    <Grid item xs={6} lg={3}>
                    <InputLabel variant="standard" id="addToInventory-label">
                        Product Category
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
                      {/* <CustomSelect
                        id="addToInventory"
                        name="addToInventory"
                        className="dropdown"
                        value={formData.addToInventory}
                        onChange={handleChange}
                        labelText="Inventory"
                        array={inventoryTypeData}
                      /> */}
                    </Grid>

                    <Grid item xs={6} lg={3}>
                      {/* <CustomSelect
                        id="category"
                        name="category"
                        className="dropdown"
                        value={formData.category}
                        onChange={handleChange}
                        labelText="Product Category"
                        array={productCategoryData}
                      /> */}

                      <InputLabel variant="standard" id="category-label">
                        Product Category
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

                <Box className="register-product-information" sx={{ mt: '24px' }}>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<RemoveIcon />}
                      aria-controls="register-product-content"
                      id="register-product-header"
                    >
                      <Typography component="h2" align="left" variant="h3" sx={{ color: theme.palette.secondary.dark }}>
                        Product Information
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Grid container spacing="16px">
                        <Grid container item spacing={"24px"} xs={12} lg={7} className="register-product-info">
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

                          <Grid item xs={12} lg={6}>
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
                          <Grid item xs={12} lg={6}>
                            <InputLabel variant="standard" id="location-label">
                              Location
                            </InputLabel>
                            <TextField
                              id="location"
                              onChange={handleChange}
                              name="location"
                              value={formData.location}
                              placeholder="Location"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <InputLabel variant="standard" id="stockQuantity-label">
                              Stock
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
                          <Grid item xs={12}>
                            <InputLabel variant="standard" id="message-label">
                              Notes
                            </InputLabel>
                            <TextField
                              id="message"
                              onChange={handleChange}
                              name="message"
                              value={formData.message}
                              multiline
                              rows={4}
                              placeholder=""
                              fullWidth
                            />
                          </Grid>
                        </Grid>

                        <Grid item xs={12} lg={5} className="register-product-images" sx={{ mt: 1 }}>
                          <Typography component="h3" align="left" variant="body2" sx={{ mb: 2, display: { lg: 'none' }, fontSize: '16px' }}>
                            Photos
                          </Typography>

                          <Box aria-label="Add product photos" sx={{ border: '3px dashed lightgrey', height: '300px', display: "flex", alignItems: "center", p: 2, ml: { lg: '48px' }, mt: { lg: 1.5 } }}>
                            <Grid container spacing={1}>
                              {/* Render existing images */}
                              {existingProductData && existingProductData.photo && existingProductData.photo.map((image, index) => (
                                <Grid item key={index}>
                                  <img src={image} alt={`Product Image ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
                                </Grid>
                              ))}
                              {/* Render newly uploaded images */}
                              {images && images.length > 0 && Array.from(images).map((image, index) => (
                                <Grid item key={index}>
                                  <img src={URL.createObjectURL(image)} alt={`Newly Uploaded Image ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
                                </Grid>
                              ))}
                            </Grid>

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

                <Box className="register-notification-settings" sx={{ mt: '24px' }}>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<RemoveIcon />}
                      aria-controls="notification-settings-content"
                      id="notification-settings-header"
                    >
                      <Typography component="h2" align="left" variant="h3" sx={{ color: theme.palette.secondary.dark }}>
                        Notification Settings
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Grid container>
                        <Grid item xs={12} lg={7}>
                          <Box className="low-stock-settings">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <NotificationsNoneOutlinedIcon sx={{ mr: 1 }} />
                                Low Stock Alert
                              </Typography>

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

                            </Box>
                            <InputLabel
                              variant="standard"
                              id="lowStockThreshold-label"
                              sx={{ mt: '13px' }}
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

                          </Box>

                          <Box className="expiration-reminder-settings" sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <NotificationsNoneOutlinedIcon sx={{ mr: 1 }} />
                                Expiration Reminder
                              </Typography>

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
                            </Box>

                            <InputLabel
                              variant="standard"
                              id="expirationReminderTime-label"
                              sx={{ mt: '13px' }}
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

                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <Box className="register-buttons"
                    aria-label="Form options"
                    sx={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <Button variant="outlined" type="reset" sx={{ mr: 3 }}>
                      Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                      Register
                    </Button>
                  </Box>
                </Box>


              </Box>
            </CardContent>
          </Card>
        </LocalizationProvider>
      </Container>
    </>
  );
};

export default AddProduct;
