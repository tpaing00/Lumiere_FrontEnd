import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const RegisterProduct = () => {

    const [formData, setFormData] = useState(
        {
            inventoryId: "",
            categoryId: ""
            // productName: "",
            // productBrand: "",
            // stockQuantity: 0,
            // barcodeId: "",
            // unitPrice: 0
        }
    );

    // const [totalValue, setTotalValue] = useState(0)

    // const handleTotalValue = (event) => {
    //     setTotalValue(prevTotalValue => {
    //         return {
    //             stockQuantity * unitPrice
    //         }
    //     })
    // }

    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();


        axios.post('http://localhost:3000/api/v1/register', {

            inventoryId: formData.inventoryId,
            categoryId: formData.categoryId
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    setError(null);
                    //  alert('Successfully logged in');
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
            <form id='form-register-product' onSubmit={handleSubmit}>
                <div className='register-inventory'>

                    <label htmlFor="inventory-id">Add to Inventory</label>
                    <select onChange={handleChange} name='inventory-id' value={formData.inventoryId}>
                        {/* <option value='' selected disabled>Select</option> */}
                        <option value='internal'>Internal Use</option>
                        <option value='sales'>Sales</option>
                    </select>

                    <label htmlFor="category-id">Add Product Category</label>
                    <select onChange={handleChange} name='category-id' value={formData.categoryId}>
                        {/* <option value='' selected disabled>Select</option> */}
                        <option value='hair'>Hair Care</option>
                        <option value='skin'>Skin Care</option>
                        <option value='body'>Body Care</option>
                        <option value='makeup'>Make Up</option>
                    </select>

                </div>

                <div className='register-product-information'>

                    <h2>Product Information</h2>

                    <label htmlFor="product-name">Product Name</label>
                    <input type="text" onChange={handleChange} name="product-name" value={formData.productName} />

                    <label htmlFor="product-brand">Brand</label>
                    <input type="text" onChange={handleChange} name="product-brand" value={formData.productBrand} />

                    <label htmlFor="stock-quantity">Stock</label>
                    <input type="number" min="0" onChange={handleChange} name="stock-quantity" value={formData.stockQuantity} />

                    <label htmlFor="barcode-id">Barcode Number</label>
                    <input type="number" min="0" onChange={handleChange} name="barcode-id" value={formData.barcodeId} />

                    <label htmlFor="unit-price">Unit price</label>
                    <input type="number" min="0" onChange={handleChange} name="unit-price" value={formData.unitPrice} placeholder="$" />

                    <label htmlFor="total-value">Total Value</label>
                    <input type="number" min="0" onChange={handleChange} name="total-value" value={formData.totalValue} placeholder="$" disabled />

                    <label htmlFor="expiry-date">Expiry Date</label>
                    <input type="date" onChange={handleChange} name="expiry-date" value={formData.expirationDate} />

                    <label htmlFor="pao">Period After Opening (PAO)</label>
                    <select onChange={handleChange} name='pao' value={formData.categoryId}>
                        {/* <option value='' selected disabled>Select</option> */}
                        <option value='6'>6 Months</option>
                        <option value='12'>12 Months</option>
                    </select>

                </div>

                <div className='register-notification-settings'>

                    <h2>Notification Settings</h2>

                    <label htmlFor="low-stock-alert">Low Stock Alert</label>
                    <select onChange={handleChange} name='low-stock-alert' value={formData.lowStockAlert}>
                        {/* <option value='' selected disabled>Select</option> */}
                        <option value='5'>5 days away</option>
                        <option value='10'>10 days away</option>
                        <option value='15'>15 days away</option>
                    </select>

                    <label htmlFor="expiration-reminder">Low Stock Alert</label>
                    <select onChange={handleChange} name='expiration-reminder' value={formData.expirationReminder}>
                        {/* <option value='' selected disabled>Select</option> */}
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