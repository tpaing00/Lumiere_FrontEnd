import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import inventoryTypeData from "./predefined_data/inventorytype.json";
import productCategoryData from "./predefined_data/productcategory.json";
import periodAfterOpeningData  from "./predefined_data/periodafteropening.json";
import expirationReminderTimeData from "./predefined_data/expirationremindertime.json"
import lowStockThresholdData from "./predefined_data/lowstockthreshold.json"

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const barcode = state && state.barcode ? state.barcode : "";
  const inventoryType = state && state.inventoryType ? state.inventoryType : "";

  const [formData, setFormData] = useState({
    //addToInventory: "Internal Use",
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
  });

  const [error, setError] = useState(null);

  //Fetching existing data with barcodeNumber
  const [existingProductData, setExistingProductData] = useState(null);
  const [existingInventoryData, setExistingInventoryData] = useState(null);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await axios.get(`https://api.lumiereapp.ca/api/v1/barcode/${formData.barcodeNumber}`);
        const { inventoryResults, productResults } = response.data;
        if (productResults.length > 0 && inventoryResults.length > 0) {
          const { productName, brandName, category, unitPrice, periodAfterOpening  } = productResults[0];
          //const { addToInventory, stockQuantity, expiryDate} = inventoryResults[0];
          const { stockQuantity, expiryDate} = inventoryResults[0];
          // Convert expiryDate to yyyy-MM-dd format
          const formattedExpiryDate = new Date(expiryDate).toISOString().split('T')[0];

          setExistingProductData({ productName, brandName, category, unitPrice, periodAfterOpening });
          //setExistingInventoryData({ addToInventory, stockQuantity, expiryDate: formattedExpiryDate });
          setExistingInventoryData({ stockQuantity, expiryDate: formattedExpiryDate });
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
      const { productName, brandName, category, unitPrice, periodAfterOpening  } = existingProductData;
      const { addToInventory, stockQuantity, expiryDate} = existingInventoryData;
      
      // Populate the form fields with existing data
      setFormData(prevFormData => ({
        ...prevFormData,
        addToInventory,
        category,
        productName,
        brandName,
        stockQuantity,
        unitPrice,
        expiryDate,
        periodAfterOpening,
        isLowStockAlert: false,
        lowStockThreshold: "Select",
        isExpirationReminder: false,
        expirationReminderTime: "Select",
      }));
    }
  }, [existingProductData, existingInventoryData]);

  // Validation function
  const validateForm = () => {
    if (!formData.expiryDate) {
      setError("Please fill in all required fields.");
      return false;
    }

    const today = new Date();
    const [year, month, day] = formData.expiryDate.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);

    // Set the time part of today's date to 00:00:00 to compare date only
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
    const { name, value, type, checked } = event.target;

    // For checkboxes, the value is either "on" or undefined
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
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
      <h1>Register New Product</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form id="form-register-product" onSubmit={handleSubmit}>
        <div className="register-inventory">
          <label htmlFor="addToInventory">Add to Inventory</label>
          <select
            name="addToInventory"
            className="dropdown"
            value={formData.addToInventory}
            onChange={handleChange}
          >
            {inventoryTypeData.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <label htmlFor="category">Add Product Category</label>
          <select
            name="category"
            className="dropdown"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {productCategoryData.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="register-product-information">
          <h2>Product Information</h2>

          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            onChange={handleChange}
            name="productName"
            value={formData.productName}
          />

          <label htmlFor="brandName">Brand</label>
          <input
            type="text"
            onChange={handleChange}
            name="brandName"
            value={formData.brandName}
          />

          <label htmlFor="stockQuantity">Stock</label>
          <input
            type="number"
            min="0"
            onChange={handleChange}
            name="stockQuantity"
            value={formData.stockQuantity}
          />

          <label htmlFor="barcodeNumber">Barcode Number</label>
          <input
            type="text"
            min="0"
            onChange={handleChange}
            name="barcodeNumber"
            value={formData.barcodeNumber}
          />
          <button onClick={handleScan}>Scan</button>
          <label htmlFor="unitPrice">Unit price</label>
          <input
            type="number"
            min="0"
            onChange={handleChange}
            name="unitPrice"
            value={formData.unitPrice}
            placeholder="$"
          />

          {/* <label htmlFor="totalValue">Total Value</label>
                    <input type="number" min="0" onChange={handleChange} name="totalValue" value={formData.totalValue} placeholder="$" disabled /> */}

          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="date"
            onChange={handleChange}
            name="expiryDate"
            value={formData.expiryDate}
          />

          <label htmlFor="periodAfterOpening">Period After Opening (PAO)</label>
          <select
            name="periodAfterOpening"
            className="dropdown"
            value={formData.periodAfterOpening}
            onChange={handleChange}
          >
            {periodAfterOpeningData.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="register-notification-settings">
          <h2>Notification Settings</h2>

          <label htmlFor="isLowStockAlert">Low Stock Alert</label>
          <input
            type="checkbox"
            onChange={(e) => {
              handleChange(e);
              setIsLowStockAlertChecked(e.target.checked);
            }}
            name="isLowStockAlert"
            value={formData.isLowStockAlert}
          />

          <label htmlFor="lowStockThreshold">Notify when stock is below</label>
          <select
            name="lowStockThreshold"
            className="dropdown"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            disabled={isLowStockThresholdDisabled}
          >
            {lowStockThresholdData.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <label htmlFor="isExpirationReminder">Expiration Reminder</label>
          <input
            type="checkbox"
            onChange={(e) => {
              handleChange(e);
              setIsExpirationReminderChecked(e.target.checked);
            }}
            name="isExpirationReminder"
            value={formData.isExpirationReminder}
          />

          {/* conditional on the boolean above - useReducer */}
          <label htmlFor="expirationReminderTime">
            Notify when expiry date is
          </label>
          <select
            name="expirationReminderTime"
            className="dropdown"
            value={formData.expirationReminderTime}
            onChange={handleChange}
            disabled={isExpirationReminderTimeDisabled}
          >
            {expirationReminderTimeData.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="register-buttons">
          <button type="reset">CANCEL</button>
          <button type="submit">REGISTER</button>
        </div>
      </form>
    </>
  );
};

export default AddProduct;
