import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {

    const [formData, setFormData] = useState(
        {
            addToInventory: 'Select',
            category: 'Select',
            productName: '',
            brandName: '',
            stockQuantity: 0,
            barcodeNumber: '',
            unitPrice: '',
            totalValue: 0,
            expiryDate: '',
            periodAfterOpening: 'Select',
            isLowStockAlert: false,
            lowStockThreshold: 'Select',
            isExpirationReminder: false,
            expirationReminderTime: 'Select'
        }
    );

    const [error, setError] = useState(null)

    // Conditional enable/disable the low stock threshold based on the checked state of the checkbox
    const [isLowStockThresholdDisabled, setIsLowStockThresholdDisabled] = useState(true);
    const [isLowStockAlertChecked, setIsLowStockAlertChecked] = useState(false);

    useEffect(() => {
        setIsLowStockThresholdDisabled(!isLowStockAlertChecked);
    }, [isLowStockAlertChecked]);

    // Conditional enable/disable the low stock threshold based on the checked state of the checkbox
    const [isExpirationReminderTimeDisabled, setIsExpirationReminderTimeDisabled] = useState(true);
    const [isExpirationReminderChecked, setIsExpirationReminderChecked] = useState(false);

    useEffect(() => {
        setIsExpirationReminderTimeDisabled(!isExpirationReminderChecked);
    }, [isExpirationReminderChecked]);

    // calculates the total value based on the multiplication of unit price and stock
    useEffect(() => {
        const result = Number(formData.stockQuantity) * Number(formData.unitPrice);
        setFormData(prevFormData => ({
            ...prevFormData,
            totalValue: result
        }));
    }, [formData.stockQuantity, formData.unitPrice]);

    // updates values upon change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    // handles the submit of the form using axios to pass the data to the backend
    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(formData)

        axios.post('http://52.53.91.15:8080/api/v1/add-product', {
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
            expirationReminderTime: formData.expirationReminderTime
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    setError(null);
                } else {
                    setError('Unable to register product');
                }
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    console.error('Error:', error.message);
                }
            });
    }

    return (
        <>
            <h1>Register New Product</h1>

            <form id='form-register-product' onSubmit={handleSubmit}>
                <div className='register-inventory'>

                    <label htmlFor="addToInventory">Add to Inventory</label>
                    <select onChange={handleChange} name='addToInventory' value={formData.addToInventory}>
                        <option value='Select' disabled>Select</option>
                        <option value='Internal Use'>Internal Use</option>
                        <option value='Retail'>Retail</option>
                    </select>

                    <label htmlFor="category">Add Product Category</label>
                    <select onChange={handleChange} name='category' value={formData.category}>
                        <option value='Select' disabled>Select</option>
                        <option value='Hair Care'>Hair Care</option>
                        <option value='Skin Care'>Skin Care</option>
                        <option value='Body Care'>Body Care</option>
                        <option value='Make Up'>Make Up</option>
                    </select>

                </div>

                <div className='register-product-information'>

                    <h2>Product Information</h2>

                    <label htmlFor="productName">Product Name</label>
                    <input type="text" onChange={handleChange} name="productName" value={formData.productName} />

                    <label htmlFor="brandName">Brand</label>
                    <input type="text" onChange={handleChange} name="brandName" value={formData.brandName} disabled />

                    <label htmlFor="stockQuantity">Stock</label>
                    <input type="number" min="0" onChange={handleChange} name="stockQuantity" value={formData.stockQuantity} />

                    <label htmlFor="barcodeNumber">Barcode Number</label>
                    <input type="text" min="0" onChange={handleChange} name="barcodeNumber" value={formData.barcodeNumber} />

                    <label htmlFor="unitPrice">Unit price</label>
                    <input type="number" min="0" onChange={handleChange} name="unitPrice" value={formData.unitPrice} placeholder="$" />

                    <label htmlFor="totalValue">Total Value</label>
                    <input type="number" min="0" onChange={handleChange} name="totalValue" value={formData.totalValue} placeholder="$" disabled />

                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input type="date" onChange={handleChange} name="expiryDate" value={formData.expiryDate} />

                    <label htmlFor="periodAfterOpening">Period After Opening (PAO)</label>
                    <select onChange={handleChange} name='periodAfterOpening' value={formData.periodAfterOpening}>
                        <option value='Select' disabled>Select</option>
                        <option value='6'>6 Months</option>
                        <option value='12'>12 Months</option>
                    </select>

                </div>

                <div className='register-notification-settings'>

                    <h2>Notification Settings</h2>

                    <label htmlFor='isLowStockAlert'>Low Stock Alert</label>
                    <input type='checkbox' onChange={(e) => { handleChange(e); setIsLowStockAlertChecked(e.target.checked) }} name='isLowStockAlert' value={formData.isLowStockAlert} />

                    <label htmlFor="lowStockThreshold">Notify when stock is below</label>
                    <select onChange={handleChange} name='lowStockThreshold' value={formData.lowStockThreshold} disabled={isLowStockThresholdDisabled}>
                        <option value='Select' disabled>Select</option>
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                        <option value='15'>15</option>
                    </select>

                    <label htmlFor='isExpirationReminder'>Low Stock Alert</label>
                    <input type='checkbox' onChange={(e) => { handleChange(e); setIsExpirationReminderChecked(e.target.checked) }} name='isExpirationReminder' value={formData.isExpirationReminder} />

                    {/* conditional on the boolean above - useReducer */}
                    <label htmlFor="expirationReminderTime">Notify when expiry date is</label>
                    <select onChange={handleChange} name='expirationReminderTime' value={formData.expirationReminderTime} disabled={isExpirationReminderTimeDisabled}>
                        <option value='Select' disabled>Select</option>
                        <option value='5'>5 days away</option>
                        <option value='10'>10 days away</option>
                        <option value='15'>15 days away</option>
                        <option value='20'>20 days away</option>
                    </select>

                </div>

                <div className='register-buttons'>

                    <button type="reset">CANCEL</button>
                    <button type="submit">REGISTER</button>

                </div>

            </form>
        </>
    )

}

export default AddProduct
