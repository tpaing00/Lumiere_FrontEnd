import React, { useState, useEffect } from "react";
import notifyPeriodData from "./predefined_data/notifyperiod.json";
import checkoutReasonData from "./predefined_data/checkoutreason.json";
import axios from "axios"

const StaffCheckOutModal = ({ handleClose, productData, inventoryId, handleReloadInternalData }) => {
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [reason, setReason] = useState(""); // State for reason dropdown
  const [dateOfOpen, setDateOfOpen] = useState(""); // State for date of open
  const [expirationReminder, setExpirationReminder] = useState(false); // State for expiration reminder
  const [notifyPeriod, setNotifyPeriod] = useState(""); // State for notify period

  useEffect(() => {
    // Set the default value for notifyPeriod when the component mounts
    if (notifyPeriodData.length > 0) {
      setNotifyPeriod(notifyPeriodData[0].value);
    }
  }, []);

  useEffect(() => {
    // Set the default value for notifyPeriod when the component mounts
    if (checkoutReasonData.length > 0) {
      setReason(checkoutReasonData[0].value);
    }
  }, []);

  const handleProceed = () => {
 
    const periodAfterOpening = productData.periodAfterOpening;
    const [year, month, day] = dateOfOpen.split("-").map(Number);
    const afterOpenDate = new Date(year, month - 1, day);
    afterOpenDate.setMonth(afterOpenDate.getMonth() + periodAfterOpening); // Add the periodAfterOpening to the month
    const useByDate = afterOpenDate.toISOString();


    const formData = {
      userId: "user_id",
      inventoryId: inventoryId,
      barcodeNumber: productData.barcodeNumber,
      addToInventory: "Internal Use",
      quantity: quantity,
      reason: reason,
      useByDate: useByDate, // Calculate from productData.periodAfterOpening + openingDate
      checkoutDate: new Date().toISOString(),
      openingDate: dateOfOpen,
      reminderTime: notifyPeriod,
      isExpirationReminder: expirationReminder
    };

    //POST request to the API
    axios.post("https://api.lumiereapp.ca/api/v1/checkout", formData)
      .then(response => {
        alert("Checkout successful!");
        handleReloadInternalData(response.data);
        handleClose();
      })
      .catch(error => {
        // Handle error
        console.error("Error during checkout:", error);
        alert("Error during checkout. Please try again.");
        handleClose();
      });        
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={handleClose}>x</button>
        <h2>Staff Check Out</h2>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(e.target.value)}
        />
        <label htmlFor="reason">Reason:</label>
        <select
          name="reason"
          value={reason}
          className="dropdown"
          onChange={(e) => setReason(e.target.value)}
        >
          {checkoutReasonData.map((ckreason) => (
            <option key={ckreason.value} value={ckreason.value}>
              {ckreason.label}
            </option>
          ))}
        </select>
        <label htmlFor="dateOfOpen">Date of Open:</label>
        <input
          type="date"
          name="dateOfOpen"
          value={dateOfOpen}
          onChange={(e) => setDateOfOpen(e.target.value)}
        />
        <label htmlFor="expirationReminder">Expiration Reminder:</label>
        <input
          type="checkbox"
          name="expirationReminder"
          checked={expirationReminder}
          onChange={(e) => setExpirationReminder(e.target.checked)}
        />
        <label htmlFor="notifyPeriod">
          Notify when the end of Period-After-Open is*:
        </label>
        <select
          name="notifyPeriod"
          className="dropdown"
          value={notifyPeriod}
          onChange={(e) => setNotifyPeriod(e.target.value)}
        >
          {notifyPeriodData.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
        <button onClick={handleProceed}>Proceed</button>
      </div>
    </div>
  );
};

export default StaffCheckOutModal;
