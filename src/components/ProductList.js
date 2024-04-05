import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import inventoryTypeData from "./predefined_data/inventorytype.json";
import productCategoryData from "./predefined_data/productcategory.json";
import StaffCheckOutModal from "./StaffCheckOutModal";
import { subDays, format } from "date-fns";
import {
  InputLabel,
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Card,
  CardContent,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import CustomSearch from "./mui_customization/base_components/CustomSearch";

const ProductList = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState(null);
  const [filterByStatus, setFilterByStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByInventory, setFilterByInventory] = useState("All");
  const [filterByCategory, setFilterByCategory] = useState("All");
  const [sortByBrand, setSortByBrand] = useState("None");
  const [anchorEl, setAnchorEl] = useState([]);
  const [open, setOpen] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(null);
  const [productNameToDelete, setProductNameToDelete] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportProduct, setReportProduct] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          inventoryResponse,
          productsResponse,
          notificationsResponse,
          wastesResponse,
        ] = await Promise.all([
          axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
          axios.get("https://api.lumiereapp.ca/api/v1/products"),
          axios.get("https://api.lumiereapp.ca/api/v1/notification"),
          axios.get("https://api.lumiereapp.ca/api/v1/waste"),
        ]);

        setInventoryData(inventoryResponse.data);
        setProductData(productsResponse.data);
        setNotificationData(notificationsResponse.data);
        setWasteData(wastesResponse.data);

        // Calculate total count of rows here
        // const totalCount = (inventoryResponse.data ? inventoryResponse.data.length : 0) +
        //   (wastesResponse.data ? wastesResponse.data.length : 0);
        // setTotalRows(totalCount);
        const filteredData = applyFilters(
          inventoryResponse.data,
          wastesResponse.data
        );
        setTotalRows(filteredData.length);
        // Reset page to 0 whenever any of the filters change
        setPage(0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [
    filterByInventory,
    filterByCategory,
    sortByBrand,
    searchTerm,
    filterByStatus,
  ]);

  const applyFilters = (inventoryResponse, wastesResponse) => {
    // Apply filters to inventory data
    const combinedData = inventoryResponse.map((inventoryRow) => {
      const matchingProduct = productData.find(
        (product) => product.barcodeNumber === inventoryRow.barcodeNumber
      );
      if (matchingProduct) {
        const combined = {
          ...inventoryRow,
          ...matchingProduct,
          dateAdded: inventoryRow.dateAdded,
          expiryDate: inventoryRow.expiryDate,
          status: calculateStatus(inventoryRow._id),
          inventoryId: inventoryRow._id,
          productId: matchingProduct._id,
          wasteId: "",
        };
        delete combined._id;
        return combined;
      } else {
        return inventoryRow;
      }
    });

    // Merge waste data with inventory data
    const wasteDataWithStatus = wastesResponse.map((item) => ({
      ...item,
      stockQuantity: 0,
      status: "Wasted",
      wasteId: item._id,
    }));
    const combinedWithWaste = combinedData.concat(wasteDataWithStatus);

    // Apply sorting based on brand name
    let sortedData = [...combinedWithWaste];
    if (sortByBrand === "asc") {
      sortedData.sort((a, b) =>
        a.brandName && b.brandName ? a.brandName.localeCompare(b.brandName) : 0
      );
    } else if (sortByBrand === "desc") {
      sortedData.sort((a, b) =>
        a.brandName && b.brandName ? b.brandName.localeCompare(a.brandName) : 0
      );
    }

    // Apply filters based on current filter values
    const filteredData = sortedData.filter((row) => {
      const inventoryMatch =
        filterByInventory === "All" ||
        (row.addToInventory && row.addToInventory === filterByInventory);
      const categoryMatch =
        filterByCategory === "All" ||
        (row.category && row.category === filterByCategory);
      const statusMatch =
        filterByStatus === "All" ||
        (row.status && row.status === filterByStatus);
      const searchMatch =
        searchTerm === "" ||
        (row.productName &&
          row.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.brandName &&
          row.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.category &&
          row.category.toLowerCase().includes(searchTerm.toLowerCase()));
      return inventoryMatch && categoryMatch && statusMatch && searchMatch;
    });

    return filteredData;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Kebab menu:
  const handleMenuClick = (event, index) => {
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = event.currentTarget;
      return newAnchorEl;
    });
    setOpen((prevOpen) => {
      const newOpen = [...prevOpen];
      newOpen[index] = true;
      return newOpen;
    });
  };

  const handleMenuClose = (index) => {
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = null;
      return newAnchorEl;
    });
    setOpen((prevOpen) => {
      const newOpen = [...prevOpen];
      newOpen[index] = false;
      return newOpen;
    });
  };

  const handleCloseModal = () => {
    setShowInternalModal(false); // Close the modal
  };

  const handleStaffCheckOut = (row, index) => {
    if (row.status == "In Stock" || row.status === "Low Stock") {
      if (row.addToInventory !== "Retail") {
        setSelectedInventoryProduct(row);
        setShowInternalModal(true);
        handleMenuClose(index);
      }
    }
  };

  const handleReloadInternalData = () => {
    // Fetch filtered data from the API
    const fetchFilteredData = async () => {
      try {
        const [
          inventoryResponse,
          productsResponse,
          notificationsResponse,
          wastesResponse,
        ] = await Promise.all([
          axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
          axios.get("https://api.lumiereapp.ca/api/v1/products"),
          axios.get("https://api.lumiereapp.ca/api/v1/notification"),
          axios.get("https://api.lumiereapp.ca/api/v1/waste"),
        ]);

        // Apply filters to the data
        const combinedData = applyFilters(
          inventoryResponse.data,
          wastesResponse.data
        );

        // Update totalRows state with the length of the filtered data
        setTotalRows(combinedData.length);
        // Update inventory, product, notification, and waste data states
        setInventoryData(inventoryResponse.data);
        setProductData(productsResponse.data);
        setNotificationData(notificationsResponse.data);
        setWasteData(wastesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFilteredData();
  };

  const renderTableHeader = () => {
    // Define the keys to display in the table
    let header = [];
    if (isMobile){
      header = [
        "Name",       
        "Status",
        "Inventory",
      ];
    }else {
      header = [
        "Name",
        "Brand",
        "Category",
        "Date Added",
        "EXP",
        "Status",
        "Inventory",
      ];
      
    }
    // let header = [
    //   "Name",
    //   "Brand",
    //   "Category",
    //   "Date Added",
    //   "EXP",
    //   "Status",
    //   "Inventory",
    // ];
    return header.map((key, index) => {
      return <TableCell key={index}>{key}</TableCell>;
    });
  };

  const renderTableData = () => {
    // Check if both inventoryData and productData are available
    if (
      inventoryData.length === 0 ||
      productData.length === 0 ||
      notificationData.length === 0
      //wasteData.length === 0
    ) {
      return null; // Return null if either array is empty
    }

    const combinedData = applyFilters(inventoryData, wasteData);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const slicedData = combinedData.slice(startIndex, endIndex);

    const renderStatusStyle = (status) => {
      switch (status) {
        case "In Stock":
          return { color: "#277C5E" };
        case "Low Stock":
          return { color: "#75500B" };
        case "Expired":
          return { color: "#292929" };
        case "Out of Stock":
          return { color: "#AA230E" };
        case "Wasted":
          return { color: "#6A6A6A" };
        default:
          return {};
      }
    };

    const handleViewDetail = (inventoryId, barcodeNumber, wasteId) => {
      navigate("/productdetail", {
        state: { inventoryId, barcodeNumber, wasteId },
      });
    };

    const handleOpenReportDialog = (product) => {
      setReportProduct(product);
      setIsReportDialogOpen(true);
    };
    
    const handleCloseReportDialog = () => {
      setIsReportDialogOpen(false);
    };
    
    const handleConfirmedReport = async () => {
      handleCloseReportDialog();
      try {
        const formData = {
          barcodeNumber: reportProduct.barcodeNumber,
          productName: reportProduct.productName,
          brandName: reportProduct.brandName,
          unitPrice: reportProduct.unitPrice,
          category: reportProduct.category,
          photo: reportProduct.photo,
          periodAfterOpening: reportProduct.periodAfterOpening,
          totalValue: reportProduct.totalValue,
          dateAdded: reportProduct.dateAdded,
          addToInventory: reportProduct.addToInventory,
          expiryDate: reportProduct.expiryDate,
          wasteQuantity: reportProduct.stockQuantity,
          inventoryId: reportProduct.inventoryId,
          message: reportProduct.message !== undefined && reportProduct.message !== "" ? reportProduct.message : "",
        };
    
        // POST request to report the product as wasted
        const response = await axios.post("https://api.lumiereapp.ca/api/v1/waste", formData);        
        handleReloadInternalData(); // Reload internal data after reporting
        setIsSnackbarOpen(true);
        setSnackbarMessage('Reported Waste successfully!');
      } catch (error) {
        console.error("Error during report:", error);
      }
    };
    
    // Inside renderTableData function
    
    const handleReportWasted = (row, index) => {
      handleMenuClose(index);
      setReportProduct(row); // Store the product to be reported
      setIsReportDialogOpen(true); // Open the report dialog
    };    

    const handleOpenConfirmation = (index, productName) => {
      setDeleteRowIndex(index);
      setProductNameToDelete(productName);
      setIsConfirmationOpen(true);
    };

    const handleCloseConfirmation = () => {
      setIsConfirmationOpen(false);
      setDeleteRowIndex(null);
    };

    const handleConfirmedDelete = async () => {
      const row = slicedData[deleteRowIndex]; // Assuming 'rows' is the array of data
      handleCloseConfirmation();

      try {
        if (row.wasteId !== "") {
          await axios.delete(`https://api.lumiereapp.ca/api/v1/wastedelete`, {
            data: { wasteId: row.wasteId },
          });
        } else {
          await axios.delete(`https://api.lumiereapp.ca/api/v1/delete`, {
            data: {
              barcodeNumber: row.barcodeNumber,
              addToInventory: row.addToInventory,
            },
          });
        }
        //alert("Product deleted successfully!");
        handleReloadInternalData(); // Reload internal data after deletion
        setIsSnackbarOpen(true);
        setSnackbarMessage('Product deleted successfully!');
      } catch (error) {
        console.error("Error during delete:", error);
      }
    };

    const handleDelete = async (row, index) => {
      handleMenuClose(index);
      handleOpenConfirmation(index, row.productName);
    };

    return slicedData.map((row, index) => (
      <>
        <TableRow key={index}>
          <TableCell>{row.productName}</TableCell>
          {!isMobile && <TableCell>{row.brandName}</TableCell>}
          {!isMobile && <TableCell>{row.category}</TableCell>}
          {!isMobile && <TableCell>{format(subDays(new Date(row.dateAdded),0),"yyyy-MM-dd")}</TableCell>}
          {!isMobile && <TableCell>{format(subDays(new Date(row.expiryDate),0),"yyyy-MM-dd")}</TableCell>}
          {/* <TableCell>{row.brandName}</TableCell>
          <TableCell>{row.category}</TableCell>
          <TableCell>{row.dateAdded}</TableCell>
          <TableCell>{row.expiryDate}</TableCell>
          <TableCell style={renderStatusStyle(row.status)}>
            {row.status}
          </TableCell>*/}
          <TableCell style={renderStatusStyle(row.status)}>
            {row.status}
          </TableCell>
          <TableCell>{row.addToInventory}</TableCell>
          <TableCell>
            <IconButton
              id="more"
              aria-controls={`menu-${index}`}
              aria-haspopup="true"
              aria-expanded={open[index] ? "true" : undefined}
              onClick={(event) => handleMenuClick(event, index)}
            >
              <MoreVert />
            </IconButton>

            <Menu
              id={`menu-${index}`}
              anchorEl={anchorEl[index]}
              open={open[index]}
              onClose={() => handleMenuClose(index)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() =>
                  handleViewDetail(
                    row.inventoryId,
                    row.barcodeNumber,
                    row.wasteId
                  )
                }
              >
                View Detail
              </MenuItem>
              <MenuItem
                onClick={() => handleStaffCheckOut(row, index)}
                disabled={
                  row.status === "Out of Stock" ||
                  row.status === "Expired" ||
                  row.status === "Wasted" ||
                  row.addToInventory === "Retail"
                }
              >
                Staff Check Out
              </MenuItem>
              <MenuItem
                onClick={() => handleReportWasted(row, index)}
                disabled={row.status !== "Expired" || row.status === "Wasted"}
              >
                Report Wasted
              </MenuItem>
              <MenuItem onClick={() => handleDelete(row, index)}>
                <Typography component="div" color={"#AA230E"}>
                  Delete
                </Typography>
              </MenuItem>
            </Menu>
          </TableCell>
        </TableRow>
        <Dialog
          open={isConfirmationOpen}
          onClose={handleCloseConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen={isMobile} 
          fullWidth
          maxWidth="sm" 
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: width,
            height: height,
            zIndex: 1000, // Adjust z-index as needed
          }}
          PaperProps={{
            sx: {
              backgroundColor: "white",
              color: "black", // Set the color of the text
              padding: "16px", // Add padding to ensure text is spaced properly
              boxShadow: "0 8px 20px 0 rgba(199, 191, 165, 0.15)",
            },
          }}
          // Use slotProps.backdrop instead of BackdropProps
          slotProps={{
            backdrop: {
              sx: { backgroundColor: "rgba(0, 0,0, 0)" }, // Change the color and opacity here
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h3" component="div">
              Delete?
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete{" "}
              <strong>{productNameToDelete}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>           
            <Button
              onClick={handleConfirmedDelete}
              variant="contained"
              sx={{
                backgroundColor: "#AA230E",
                color: "white", // Set text color to white for better contrast
                "&:hover": {
                  backgroundColor: "#8a1c10", // Darken the color on hover if needed
                },
              }}
              autoFocus
            >
              Delete
            </Button>
            <Button variant="outlined" onClick={handleCloseConfirmation}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isReportDialogOpen}
          onClose={handleCloseReportDialog}
          aria-labelledby="report-dialog-title"
          aria-describedby="report-dialog-description"
          fullScreen={isMobile} 
          fullWidth
          maxWidth="sm" 
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: width,
            height: height,
            zIndex: 1000, // Adjust z-index as needed
          }}
          PaperProps={{
            sx: {
              backgroundColor: "white",
              color: "black", // Set the color of the text
              padding: "16px", // Add padding to ensure text is spaced properly
              boxShadow: "0 8px 20px 0 rgba(199, 191, 165, 0.15)",
            },
          }}
          // Use slotProps.backdrop instead of BackdropProps
          slotProps={{
            backdrop: {
              sx: { backgroundColor: "rgba(0, 0,0, 0)" }, // Change the color and opacity here
            },
          }}
        >
          <DialogTitle id="report-dialog-title">
            <Typography variant="h3" component="div">
              Confirm?
            </Typography>
            </DialogTitle>
          <DialogContent>
            <DialogContentText id="report-dialog-description">
              Are you sure you want to Report <strong>{reportProduct && reportProduct.productName}</strong> as Wasted?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReportDialog}  variant="outlined" >
              Cancel
            </Button>
            <Button onClick={handleConfirmedReport} variant="contained" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={2000} // Adjust the duration as needed
          onClose={() => setIsSnackbarOpen(false)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
            <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
          
        </Snackbar>
      </>
    ));
  };

  // Handle the change of the dropdown value for addToInventory
  const handleInventoryChange = (event) => {
    setFilterByInventory(event.target.value);
  };

  // Handle the change of the dropdown value for category
  const handleCategoryChange = (event) => {
    setFilterByCategory(event.target.value);
  };

  // Handle the change of the dropdown value for brandName
  const handleBrandChange = (event) => {
    setSortByBrand(event.target.value);
  };

  const handleNewProduct = () => {
    navigate("/add-product");
  };

  const calculateStatus = (inventoryId) => {
    const notification = notificationData.find(
      (notification) => notification.inventoryId === inventoryId
    );

    const inventory = inventoryData.find(
      (inventory) => inventory._id === inventoryId
    );

    const currentDate = new Date();
    const expiryDate = new Date(inventory.expiryDate);

    if (expiryDate < currentDate) return "Expired";
    if (inventory.stockQuantity <= 0) return "Out of Stock";
    if (notification) {
      const lowStockThreshold = notification.lowStockThreshold;
      if (inventory.stockQuantity <= lowStockThreshold) return "Low Stock";
    }
    if (inventory.stockQuantity > 0) return "In Stock";
    return "In Stock";
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const height = isMobile ? "35vh" : 500;
  const width = isMobile ? "60vw" : "30vw";

  return (
    <>
      {/* <Box component="main" sx={{ mt: 3 }}> */}
      <Box sx={{ p: 4, paddingTop:"0", paddingRight: isMobile ? "20px" : undefined, paddingLeft: isMobile ? "20px" : undefined}}>
        <Typography variant="h1" sx={{ mb: "12px" }}>
          Inventory
        </Typography>

        <Card sx={{ borderRadius: "20px"}}>
          <CardContent sx={{ p: "24px", m: 0 }}>
          {isMobile && (
              <Button
                onClick={handleNewProduct}
                variant="outlined"
                sx={{ ml: 0, mb: 2, width:'100%' }}
                
              >
                Register New Product
              </Button>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: "15px",
              }}
              fullWidth
            >
               <Typography variant="h2" sx={{ m: 0 }}>
                Product List
              </Typography>
              {!isMobile && (
                <Button
                  onClick={handleNewProduct}
                  variant="outlined"
                  sx={{ m: 0 }}
                >
                  Register New Product
                </Button>
              )}             
            </Box>
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: "15px",
              }}
              fullWidth
            >
              <Typography variant="h2" sx={{ m: 0 }}>
                Product List
              </Typography>
              <Button
                onClick={handleNewProduct}
                variant="outlined"
                sx={{ m: 0 }}
              >
                Register New Product
              </Button>
            </Box> */}

            <Grid container spacing={4} fullWidth>
              <Grid container item spacing="16px" xs={12} lg={7}>
              {!isMobile && (
                <>
                <Grid item xs={3}>                  
                  <Select
                    id="filterInventory"
                    name="filterInventory"
                    className="dropdown"
                    aria-label="Filter by Inventory"
                    value={filterByInventory}
                    onChange={handleInventoryChange}
                    //onChange={(event) => setFilterByInventory(event.target.value)}
                    fullWidth
                  >
                    <MenuItem sx={{color:'lightgray'}} value="All">Inventory</MenuItem>
                    {inventoryTypeData.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={3}>                  
                  <Select
                    id="filterCategory"
                    name="filterCategory"
                    className="dropdown"
                    aria-label="Filter by Category"
                    value={filterByCategory}
                    onChange={handleCategoryChange}
                    fullWidth
                  >
                    <MenuItem sx={{color:'lightgray'}} value="All">Category</MenuItem>
                    {productCategoryData.map((type) =>
                      type.label !== "Select" ? (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </Grid>

                <Grid item xs={3}>                  
                  <Select
                    id="sortByBrand"
                    name="sortByBrand"
                    className="dropdown"
                    aria-label="Sort by Brand"
                    value={sortByBrand}
                    onChange={handleBrandChange}
                    fullWidth
                  >
                    <MenuItem sx={{color:'lightgray'}} value="None">Brand</MenuItem>
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </Grid>
                </>
              )}
                <Grid item id="testDivSelect" xs={isMobile ? 12 : 3} sx={{ display: "flex", justifyContent: isMobile ? 'right' : 'left' }} width={'100%'}>                  
                  <Select
                    id="filterStatus"
                    name="filterStatus"
                    className="dropdown"
                    aria-label="Filter by Status"
                    value={filterByStatus}
                    onChange={(e) => setFilterByStatus(e.target.value)}
                    fullWidth
                  >
                    <MenuItem sx={{color:'lightgray'}} value="All">Status</MenuItem>
                    <MenuItem value="In Stock">In Stock</MenuItem>
                    <MenuItem value="Low Stock">Low Stock</MenuItem>
                    <MenuItem value="Expired">Expired</MenuItem>
                    <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                    <MenuItem value="Wasted">Wasted</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Grid item xs={isMobile ? 12 : 5}>                
                <CustomSearch
                  id="searchInventory"
                  name="searchInventory"
                  labelText="Search"
                  type="text"
                  value={searchTerm}
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
            </Grid>

            <Table sx={{ mt: "32px" }} size="small">
              <TableHead>
                <TableRow>{renderTableHeader()}</TableRow>
              </TableHead>
              <TableBody>{renderTableData()}</TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {showInternalModal && (
              <StaffCheckOutModal
                handleClose={handleCloseModal}
                productData={selectedInventoryProduct}
                inventoryId={selectedInventoryProduct.inventoryId}
                stockQuantity={selectedInventoryProduct.stockQuantity}
                handleReloadInternalData={handleReloadInternalData}
                setIsSnackbarOpen={setIsSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage} 
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ProductList;
