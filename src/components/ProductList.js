import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import inventoryTypeData from "./predefined_data/inventorytype.json";
import productCategoryData from "./predefined_data/productcategory.json";
import StaffCheckOutModal from "./StaffCheckOutModal";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import CustomSearch from "./mui_customization/base_components/CustomSearch";

const ProductList = () => {
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
  
  useEffect(() => {
    Promise.all([
      axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
      axios.get("https://api.lumiereapp.ca/api/v1/products"),
      axios.get("https://api.lumiereapp.ca/api/v1/notification"),
      axios.get("https://api.lumiereapp.ca/api/v1/waste"),
    ])
      .then((responses) => {
        const inventoryResponse = responses[0].data;
        const productsResponse = responses[1].data;
        const notificationsResponse = responses[2].data;
        const wastesResponse = responses[3].data;
        setInventoryData(inventoryResponse);
        setProductData(productsResponse);
        setNotificationData(notificationsResponse);
        setWasteData(wastesResponse);

        // Calculate total count of rows here
        const totalCount = (inventoryResponse ? inventoryResponse.length : 0) +
        (wastesResponse ? wastesResponse.length : 0);    
        setTotalRows(totalCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
  const handleSearch = async (keywords) => {
    try {
      const response = await axios.get(
        `http://api.lumiereapp.ca/api/v1/search?keywords=${encodeURIComponent(
          keywords
        )}`
      );
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const getSearchTerm = (value) => {
    setSearchTerm(value); // Update the local state
    handleSearch(value); // Call the API with the entered keywords
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
    // Reload all data from the API
    Promise.all([
      axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
      axios.get("https://api.lumiereapp.ca/api/v1/products"),
      axios.get("https://api.lumiereapp.ca/api/v1/notification"),
      axios.get("https://api.lumiereapp.ca/api/v1/waste"),
    ])
      .then((responses) => {
        const [
          inventoryResponse,
          productsResponse,
          notificationsResponse,
          wastesResponse,
        ] = responses;
        setInventoryData(inventoryResponse.data);
        setProductData(productsResponse.data);
        setNotificationData(notificationsResponse.data);
        setWasteData(wastesResponse.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderTableHeader = () => {
    // Define the keys to display in the table
    let header = [
      "Name",
      "Brand",
      "Category",
      "Date Added",
      "EXP",
      "Status",
      "Inventory",
    ];
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

    const combinedData = inventoryData.map((inventoryRow) => {
      // Find the matching product object from the productData array based on the barcodeNumber
      const matchingProduct = productData.find(
        (product) => product.barcodeNumber === inventoryRow.barcodeNumber
      );
      // Merge the properties of inventoryRow and matchingProduct into a new object
      if (matchingProduct) {
        const combined = {
          ...inventoryRow,
          ...matchingProduct,
          dateAdded: formatDate(inventoryRow.dateAdded),
          expiryDate: formatDate(inventoryRow.expiryDate),
          status: calculateStatus(inventoryRow._id),
          inventoryId: inventoryRow._id,
          productId: matchingProduct._id,
          wasteId: "",
        };

        // Remove the duplicate _id field if it exists
        delete combined._id;
        return combined;
      } else {
        return inventoryRow;
      }
    });
    // Sort the combined data based on the selected option for brandName
    let sortedData = [];
    if (wasteData.length !== 0) {
      const wasteDataWithStatus = wasteData.map((item) => ({
        ...item,
        stockQuantity: 0,
        status: "Wasted",
        wasteId: item._id,
      }));
      delete wasteDataWithStatus._id;
      delete wasteDataWithStatus.wasteQuantity;
      const combinedWithWaste = combinedData.concat(wasteDataWithStatus);
      sortedData = [...combinedWithWaste];
    } else {
      sortedData = [...combinedData];
    }

    // Sort the filtered data based on the selected option for brandName
    if (sortByBrand === "asc") {
      sortedData.sort((a, b) =>
        a.brandName && b.brandName ? a.brandName.localeCompare(b.brandName) : 0
      ); // Sort by ascending order of brandName using string comparison
    } else if (sortByBrand === "desc") {
      sortedData.sort((a, b) =>
        a.brandName && b.brandName ? b.brandName.localeCompare(a.brandName) : 0
      ); // Sort by descending order of brandName using string comparison
    }

    // Filter the combined data based on the selected options
    const filteredData = sortedData.filter((row) => {
      // Check if the row matches the filter criteria for addToInventory, category, and status
      const inventoryMatch =
        filterByInventory === "All" ||
        (row.addToInventory && row.addToInventory === filterByInventory);

      const categoryMatch =
        filterByCategory === "All" ||
        (row.category && row.category === filterByCategory);

      const statusMatch =
        filterByStatus === "All" ||
        (row.status && row.status === filterByStatus);

      // Check if searchTerm exists in productName, brandName, or category, and convert all strings to lowercase for case-insensitive matching
      const searchMatch =
        searchTerm === "" ||
        (row.productName &&
          row.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.brandName &&
          row.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.category &&
          row.category.toLowerCase().includes(searchTerm.toLowerCase()));

      // Return true if all criteria are met
      return inventoryMatch && categoryMatch && statusMatch && searchMatch;
    });
    
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const slicedData = filteredData.slice(startIndex, endIndex);
    // Render table rows
    const renderStatusStyle = (status) => {
      switch (status) {
        case "In Stock":
          return { color: "green" };
        case "Low Stock":
          return { color: "orange" };
        case "Expired":
          return { color: "red" };
        case "Out of Stock":
          return { color: "purple" };
        case "Wasted":
          return { color: "gray" };
        default:
          return {};
      }
    };

    const handleViewDetail = (inventoryId, barcodeNumber, wasteId) => {
      //alert("inventoryId " + inventoryId+  "barcodeNumber " +  barcodeNumber+  "wasteId" + wasteId)
      navigate("/productdetail", {
        state: { inventoryId, barcodeNumber, wasteId },
      });
    };

    const handleReportWasted = async (row, index) => {
      handleMenuClose(index);
      const confirmation = window.confirm(`Are you sure you want to Report ${row.productName} as Wasted?`);
      if (confirmation) {
        try {         
          const formData = {
            barcodeNumber: row.barcodeNumber,
            productName: row.productName,
            brandName: row.brandName,
            unitPrice: row.unitPrice,
            category: row.category,
            photo: row.photo,
            periodAfterOpening: row.periodAfterOpening,
            totalValue: row.totalValue,
            dateAdded: row.dateAdded,
            addToInventory: row.addToInventory,
            expiryDate: row.expiryDate,
            wasteQuantity: row.stockQuantity,
            inventoryId: row.inventoryId,
            message:
              row.message !== undefined && row.message !== "" ? row.message : "",
          };
  
          //POST request to the API
          axios
            .post("https://api.lumiereapp.ca/api/v1/waste", formData)
            .then((response) => {
              alert("Reported Waste successful!");
              handleReloadInternalData();
            })
            .catch((error) => {
              // Handle error
              console.error("Error during report:", error);
              alert("Error during report. Please try again.");
            });
        } catch (error) {
          console.error("Error fetching results:", error);
        }
      }
      
    };

    const handleDelete = async (row, index) => {
      try {
        handleMenuClose(index);
        const confirmation = window.confirm(`Are you sure you want to delete ${row.productName}?`);
        if (confirmation) {
          if (row.wasteId !== "") {
            await axios
              .delete(`https://api.lumiereapp.ca/api/v1/wastedelete`, {
                data: { wasteId: row.wasteId },
              })
              .then((response) => {
                alert("Waste Product deleted successful!");
                handleReloadInternalData();
              })
              .catch((error) => {
                // Handle error
                console.error("Error during delete:", error);
                alert("Error during deleting. Please try again.");
              });
          } else {
            await axios
              .delete(`https://api.lumiereapp.ca/api/v1/delete`, {
                data: {
                  barcodeNumber: row.barcodeNumber,
                  addToInventory: row.addToInventory,
                },
              })
              .then((response) => {
                alert("Product deleted successful!");
                handleReloadInternalData();
              })
              .catch((error) => {
                // Handle error
                console.error("Error during delete:", error);
                alert("Error during deleting. Please try again.");
              });
          }
        }
        
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    };

    return slicedData.map((row, index) => (
      <TableRow key={index}>
        <TableCell>{row.productName}</TableCell>
        <TableCell>{row.brandName}</TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{formatDate(row.dateAdded)}</TableCell>
        <TableCell>{formatDate(row.expiryDate)}</TableCell>
        <TableCell style={renderStatusStyle(row.status)}>{row.status}</TableCell>
        <TableCell>{row.addToInventory}</TableCell>
        <TableCell>
          <IconButton
            id="more"
            aria-controls={`menu-${index}`}
            aria-haspopup="true"
            aria-expanded={open[index] ? 'true' : undefined}
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
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => handleViewDetail(row.inventoryId, row.barcodeNumber, row.wasteId)}>View Detail</MenuItem>
            <MenuItem onClick={() => handleStaffCheckOut(row, index)} disabled={row.status === "Out of Stock" || row.status === "Expired" || row.status === "Wasted" || row.addToInventory === "Retail"}>Staff Check Out</MenuItem>
            <MenuItem onClick={() => handleReportWasted(row, index)} disabled={row.status !== "Expired" || row.status === "Wasted"}>Report Wasted</MenuItem>
            <MenuItem onClick={() => handleDelete(row, index)}>Delete</MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    ));
    // return filteredData.map((row, index) => (
    //   <TableRow key={index}>
    //     <TableCell>{row.productName}</TableCell>
    //     <TableCell>{row.brandName}</TableCell>
    //     <TableCell>{row.category}</TableCell>
    //     <TableCell>{formatDate(row.dateAdded)}</TableCell>
    //     <TableCell>{formatDate(row.expiryDate)}</TableCell>
    //     <TableCell style={renderStatusStyle(row.status)}>
    //       {row.status}
    //     </TableCell>
    //     <TableCell>{row.addToInventory}</TableCell>
    //     <TableCell>
    //       <IconButton
    //         id="more"
    //         aria-controls={`menu-${index}`}
    //         aria-haspopup="true"
    //         aria-expanded={open[index] ? "true" : undefined}
    //         onClick={(event) => handleMenuClick(event, index)}
    //       >
    //         <MoreVert />
    //       </IconButton>

    //       <Menu
    //         id={`menu-${index}`}
    //         anchorEl={anchorEl[index]}
    //         open={open[index]}
    //         onClose={() => handleMenuClose(index)}
    //         MenuListProps={{
    //           "aria-labelledby": "basic-button",
    //         }}
    //       >
    //         <MenuItem
    //           onClick={() =>
    //             handleViewDetail(
    //               row.inventoryId,
    //               row.barcodeNumber,
    //               row.wasteId
    //             )
    //           }
    //         >
    //           View Detail
    //         </MenuItem>
    //         <MenuItem
    //           onClick={() => handleStaffCheckOut(row, index)}
    //           disabled={
    //             row.status === "Out of Stock" ||
    //             row.status === "Expired" ||
    //             row.status === "Wasted" ||
    //             row.addToInventory === "Retail"
    //           }
    //         >
    //           Staff Check Out
    //         </MenuItem>
    //         <MenuItem
    //           onClick={() => handleReportWasted(row, index)}
    //           disabled={row.status !== "Expired" || row.status === "Wasted"}
    //         >
    //           Report Wasted
    //         </MenuItem>
    //         <MenuItem onClick={() => handleDelete(row, index)}>Delete</MenuItem>
    //       </Menu>
    //     </TableCell>
    //   </TableRow>
    // ));
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Formats the date to display only date portion
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

  return (
    <Box component="main" sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Typography component="h1" variant="h1">
            Product List
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Button onClick={handleNewProduct} variant="outlined">
            Register New Product
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ display: "flex", mt: 5, mb: 3 }}>
        <Grid item xs={2}>
          <InputLabel variant="standard" id="filterInventory-label">
            Filter by Inventory:
          </InputLabel>
          <Select
            id="filterInventory"
            name="filterInventory"
            className="dropdown"
            value={filterByInventory}
            onChange={handleInventoryChange}
            //onChange={(event) => setFilterByInventory(event.target.value)}
            fullWidth
          >
            <MenuItem value="All">All</MenuItem>
            {inventoryTypeData.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={2}>
          <InputLabel variant="standard" id="filterCategory-label">
            Filter by Category:
          </InputLabel>
          <Select
            id="filterCategory"
            name="filterCategory"
            className="dropdown"
            value={filterByCategory}
            onChange={handleCategoryChange}
            fullWidth
          >
            <MenuItem value="All">All</MenuItem>
            {productCategoryData.map((type) =>
              type.label !== "Select" ? (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ) : null
            )}
          </Select>
        </Grid>

        <Grid item xs={2}>
          <InputLabel variant="standard" id="sortByBrand-label">
            Sort by Brand:
          </InputLabel>
          <Select
            id="sortByBrand"
            name="sortByBrand"
            className="dropdown"
            value={sortByBrand}
            onChange={handleBrandChange}
            fullWidth
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={2}>
          <InputLabel variant="standard" id="filterStatus-label">
            Filter by Status:
          </InputLabel>
          <Select
            id="filterStatus"
            name="filterStatus"
            className="dropdown"
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Low Stock">Low Stock</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            <MenuItem value="Wasted">Wasted</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={4}>
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

      <Table>
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
        />
      )}
    </Box>
  );
};

export default ProductList;
