import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";

export default function RegisterProduct() {

    // const [inventory, setInventory] = React.useState('')
    // const [category, setCategory] = React.useState('')

    // const handleChange = (event) => {
    //     setInventory(event.target.value)
    // }


    return (
        <>
            <Paper>

                <Box>
                    <Grid container>
                        <Grid container item sm={6} spacing={3}>

                            <Grid item sm={6}>
                                <InputLabel id="add-to-inventory-label">Add to Inventory</InputLabel>
                                <Select
                                    labelId="add-to-inventory-label"
                                    id="add-to-inventory"
                                    // value={inventory}
                                    // onChange={handleChange}
                                    sx={{ width: '100%' }}
                                >
                                    <MenuItem value={'internal'}>Internal Use</MenuItem>
                                    <MenuItem value={'sales'}>Sales</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item sm={6}>
                                <InputLabel id="add-to-category-label">Add to Category</InputLabel>
                                <Select
                                    labelId="add-to-category-label"
                                    id="add-to-category"
                                    // value={category}
                                    // onChange={handleChange}
                                    sx={{ width: '100%' }}
                                >
                                    <MenuItem value={'hair'}>Hair Care</MenuItem>
                                    <MenuItem value={'skin'}>Skin Care</MenuItem>
                                    <MenuItem value={'body'}>Body Care</MenuItem>
                                    <MenuItem value={'makeup'}>Makeup</MenuItem>
                                </Select>
                            </Grid>

                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <Grid container>
                        <Grid container item sm={6} spacing={3}>

                            <Grid item sm={12}>
                                <Typography variant="h3" component="h2">
                                    Product information
                                </Typography>
                            </Grid>

                            <Grid item sm={12}>
                                <InputLabel id="product-name-label">Product Name</InputLabel>
                                <TextField id='product-name' labelId='product-name-label' sx={{ width: '100%' }}></TextField>
                            </Grid>

                            <Grid item sm={12}>
                                <InputLabel id="brand-label">Brand</InputLabel>
                                <TextField id='brand' labelId='brand-label' sx={{ width: '100%' }}></TextField>
                            </Grid>

                            <Grid item sm={6}>
                                <InputLabel id="stock-label">Stock</InputLabel>
                                <TextField id='stock' labelId='stock-label' type="number" min="0" sx={{ width: '100%' }}></TextField>
                            </Grid>

                            <Grid item sm={6}>
                                <InputLabel id="barcode-label">Barcode Number</InputLabel>
                                <TextField id='barcode' labelId='barcode-label' sx={{ width: '100%' }}></TextField>
                            </Grid>

                            <Grid item sm={6}>
                                <InputLabel id="unit-price-label">Unit Price</InputLabel>
                                <TextField id='unit-price' labelId='unit-price-label' label='$' sx={{ width: '100%' }}></TextField>
                            </Grid>

                            <Grid item sm={6}>
                                <InputLabel id="total-price-label">Total Price</InputLabel>
                                <TextField id='total-price' labelId='total-price-label' label='$' sx={{ width: '100%' }}></TextField>
                            </Grid>

                            <Grid item sm={6}>
                                <InputLabel id="expiry-date-label">Expiry Date</InputLabel>
                                <TextField id='expiry-date' labelId='expiry-date-label' type="date" sx={{ width: '100%' }}></TextField>
                            </Grid>

                            <Grid item sm={6}>
                                <InputLabel id="pao-label">Period After Opening (PAO)</InputLabel>
                                <Select
                                    labelId="pao-label"
                                    id="pao"
                                    // value={category}
                                    // onChange={handleChange}
                                    sx={{ width: '100%' }}
                                >
                                    <MenuItem value={1}>1 Month</MenuItem>
                                    <MenuItem value={2}>2 Months</MenuItem>
                                    <MenuItem value={3}>3 Months</MenuItem>
                                    <MenuItem value={4}>4 Months</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <Grid container>
                        <Grid container item sm={6} spacing={3}>

                            <Grid item sm={12}>
                                <Typography variant="h3" component="h2">
                                    Notification Settings
                                </Typography>
                            </Grid>

                            <Grid item sm={12} container>
                                <InputLabel id="low-stock-label" sx={{ width: '90%' }}>Low Stock Alert</InputLabel>
                                <Switch
                                    // onChange={handleChange}
                                    inputProps={{ 'aria-label': 'low stock alert' }}
                                />
                                <Typography component="p" sx={{ width: '100%' }}>
                                    Notify when stock is below
                                </Typography>
                                <Select
                                    labelId="low-stock-label"
                                    id="low-stock"
                                    // value={category}
                                    // onChange={handleChange}
                                    sx={{ width: '100%' }}
                                >
                                    <MenuItem value={5}>5 days away</MenuItem>
                                    <MenuItem value={10}>10 days away</MenuItem>
                                    <MenuItem value={15}>15 days away</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item sm={12} container>
                                <InputLabel id="expiration-label" sx={{ width: '90%' }}>Expiration Reminder</InputLabel>
                                <Switch
                                    // onChange={handleChange}
                                    inputProps={{ 'aria-label': 'low stock alert' }}
                                />
                                <Typography component="p" sx={{ width: '100%' }}>
                                    Notify when expiry date is
                                </Typography>
                                <Select
                                    labelId="expiration-label"
                                    id="expiration"
                                    // value={category}
                                    // onChange={handleChange}
                                    sx={{ width: '100%' }}
                                >
                                    <MenuItem value={5}>5 days away</MenuItem>
                                    <MenuItem value={10}>10 days away</MenuItem>
                                    <MenuItem value={15}>15 days away</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item>
                                <Button></Button>
                            </Grid>

                        </Grid>

                        <Grid container item sm={6} spacing={3}>

                            <Grid item sm={6}>
                                <Button>Cancel</Button>
                            </Grid>

                            <Grid item sm={6}>
                                <Button>Register</Button>
                            </Grid>

                        </Grid>
                    </Grid>

                </Box>


            </Paper>
        </>
    )
}