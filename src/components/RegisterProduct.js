import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const RegisterProduct = () => {

    const [formData, setFormData] = useState(
        {
            inventoryId: 'Select',
            category: 'Select',
            productName: '',
            brandName: '',
            stockQuantity: 0,
            barcodeId: '',
            unitPrice: '',
            totalValue: '',
            expirationDate: '',
            periodAfterOpening: 'Select',
            setLowStock: false,
            lowStockQuantity: 'Select',
            setDayInAdvance: false,
            dayInAdvance: 'Select'
        }
    );

    const [error, setError] = useState(null);

    const [totalValue, setTotalValue] = useState(0)

    const handleChange = (event) => {

        // setTotalValue(formData => {
        //     { unitPrice, stockQuantity } = formData;
        //     return unitPrice * stockQuantity;
        // })

        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value,
                // totalValue: totalValue
            }
        })
    }

    
    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(formData)

        // axios.post('http://localhost:8080/api/v1/add-product', {
        //     inventoryId: formData.inventoryId,
        //     category: formData.category,
        //     productName: formData.productName,
        //     brandName: formData.brandName,
        //     stockQuantity: formData.stockQuantity,
        //     barcodeId: formData.barcodeId,
        //     unitPrice: formData.unitPrice,
        //     totalValue: formData.totalValue,
        //     expirationDate: formData.expirationDate,
        //     periodAfterOpening: formData.periodAfterOpening,
        //     lowStockBool: formData.lowStockBool,
        //     lowStockQuantity: formData.lowStockQuantity,
        //     dayInAdvanceBool: formData.dayInAdvanceBool,
        //     dayInAdvance: formData.dayInAdvance
        // })
        // ==============================================================================
        //     .then(response => {
        //         if (response.status === 200) {
        //             console.log(response);
        //             setError(null);
        //         } else {
        //             setError('Unable to register product');
        //         }
        //     })
        //     .catch(error => {
        //         if (error.response) {
        //             setError(error.response.data.error);
        //         } else {
        //             console.error('Error:', error.message);
        //         }
        //     });
    }

    return (
        <>
            <h1>Register New Product</h1>

            <form id='form-register-product' onSubmit={handleSubmit}>
                <div className='register-inventory'>

                    <label htmlFor="inventoryId">Add to Inventory</label>
                    <select onChange={handleChange} name='inventoryId' value={formData.inventoryId}>
                        <option value='Select' disabled>Select</option>
                        <option value='internal'>Internal Use</option>
                        <option value='sales'>Sales</option>
                    </select>

                    <label htmlFor="category">Add Product Category</label>
                    <select onChange={handleChange} name='category' value={formData.category}>
                        <option value='Select' disabled>Select</option>
                        <option value='hair'>Hair Care</option>
                        <option value='skin'>Skin Care</option>
                        <option value='body'>Body Care</option>
                        <option value='makeup'>Make Up</option>
                    </select>

                </div>

                <div className='register-product-information'>

                    <h2>Product Information</h2>

                    <label htmlFor="productName">Product Name</label>
                    <input type="text" onChange={handleChange} name="productName" value={formData.productName} />

                    <label htmlFor="brandName">Brand</label>
                    <input type="text" onChange={handleChange} name="brandName" value={formData.brandName} />

                    <label htmlFor="stockQuantity">Stock</label>
                    <input type="number" min="0" onChange={handleChange} name="stockQuantity" value={formData.stockQuantity} />

                    <label htmlFor="barcodeId">Barcode Number</label>
                    <input type="text" min="0" onChange={handleChange} name="barcodeId" value={formData.barcodeId} />

                    <label htmlFor="unitPrice">Unit price</label>
                    <input type="number" min="0" onChange={handleChange} name="unitPrice" value={formData.unitPrice} placeholder="$" />

                    <label htmlFor="totalValue">Total Value</label>
                    <input type="number" min="0" onChange={handleChange} name="totalValue" value={formData.totalValue} placeholder="$" disabled />

                    <label htmlFor="expirationDate">Expiry Date</label>
                    <input type="date" onChange={handleChange} name="expirationDate" value={formData.expirationDate} />

                    <label htmlFor="pao">Period After Opening (PAO)</label>
                    <select onChange={handleChange} name='periodAfterOpening' value={formData.periodAfterOpening}>
                        <option value='Select' disabled>Select</option>
                        <option value='6'>6 Months</option>
                        <option value='12'>12 Months</option>
                    </select>

                </div>

                <div className='register-notification-settings'>

                    <h2>Notification Settings</h2>

                    <label htmlFor='lowStockBool'>Low Stock Alert</label>
                    <input type='checkbox' onChange={handleChange} name='lowStockBool' value={formData.setLowStock} />

                    <label htmlFor="lowStockQuantity">Notify when stock is below</label>
                    <select onChange={handleChange} name='lowStockQuantity' value={formData.lowStockQuantity}>
                        <option value='Select' disabled>Select</option>
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                        <option value='15'>15</option>
                    </select>

                    <label htmlFor='dayInAdvanceBool'>Low Stock Alert</label>
                    <input type='checkbox' onChange={handleChange} name='dayInAdvanceBool' value={formData.setDayInAdvance} />

                    <label htmlFor="dayInAdvance">Notify when expiry date is</label>
                    <select onChange={handleChange} name='dayInAdvance' value={formData.dayInAdvance}>
                        <option value='Select' disabled>Select</option>
                        <option value='5'>5 days away</option>
                        <option value='10'>10 days away</option>
                        <option value='15'>15 days away</option>
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

export default RegisterProduct