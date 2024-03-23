import React from "react";
import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ActivityHistory from "./ActivityHistory";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Pagination,
} from "@mui/material";

const ProductDetail = () => {
  const location = useLocation();
  const { inventoryId, barcodeNumber, wasteId } = location.state;
  // console.log("inId :" +inventoryId);
  // console.log("barcodeId :" +barcodeNumber);
  console.log("wasteId :" + wasteId);
  const [productResults, setProductResults] = useState("");
  const [inventoryResults, setInventoryResults] = useState("");
  // const [notificationResults, setNotificationResults] = useState("");
  const [internalUseListResults, setInternalUseListResults] = useState("");
  const [wasteProductResults, setwasteProductResults] = useState("");
  const [userListResults, setUserListResults] = useState("");
  const [saleResults, setSaleResults] = useState("");
  // const [showActivityHistory, setshowActivityHistory] = useState(true);
  const [formattedExpiryDate, setFormattedexpiryDate] = useState("");

  // To set pagination for image
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  useEffect(() => {
    axios
      .get(`https://api.lumiereapp.ca/api/v1/products/${barcodeNumber}`)
      .then((response) => {
        if (response.status === 200) {
          setProductResults(response.data[0]);
          // console.log(response.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/inventory/${inventoryId}`)
      .then((res) => {
        if (res.status === 200) {
          setInventoryResults(res.data);
          // console.log(res.data);
          // if (res.data.addToInventory === "Retail") {
          //   setshowActivityHistory(false);
          // }
          const dateString = res.data.expiryDate;
          const date = new Date(dateString);
          const adjustedDate = addDays(date, 1);
          if (wasteId === "" || wasteId === undefined) {
            setFormattedexpiryDate(() => {
              return format(adjustedDate, "dd MMM yyyy");
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    // axios
    //   .get(`https://api.lumiereapp.ca/api/v1/notification/${inventoryId}`)
    //   .then((resObj) => {
    //     if (resObj.status === 200) {
    //       setNotificationResults(resObj.data[0]);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error.message);
    //   });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/sale/${inventoryId}`)
      .then((resSaleObj) => {
        if (resSaleObj.status === 200) {
          setSaleResults(resSaleObj.data);
          console.log(resSaleObj.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/internalUseList/${inventoryId}`)
      .then((result) => {
        if (result.status === 200) {
          setInternalUseListResults(result.data.InternalUseListResults);
          // console.log(result.data.InternalUseListResults);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/user`)
      .then((userResult) => {
        if (userResult.status === 200) {
          setUserListResults(userResult.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    if (wasteId !== "" && wasteId !== undefined) {
      axios
        .get(`https://api.lumiereapp.ca/api/v1/waste/${wasteId}`)
        .then((wasteResult) => {
          if (wasteResult.status === 200) {
            setwasteProductResults(wasteResult.data);
            // setshowActivityHistory(false);
            const dateString = wasteResult.data.expiryDate;
            const date = new Date(dateString);
            const adjustedDate = addDays(date, 1);
            setFormattedexpiryDate(() => {
              return format(adjustedDate, "dd MMM yyyy");
            });
            // console.log(wasteResult.data);
          }
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    }
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visiblePhoto =
    (wasteId === undefined || wasteId === ""
      ? productResults.photo
      : wasteProductResults.photo) || [];

  return (
    <>
      <Box sx={{ p: 4 }}>
        {/* <Typography variant="h1" sx={{ padding: "10px 0 10px 0" }}>
        Product Detail
      </Typography> */}
        <Typography
          sx={{
            backgroundColor: "#DAEDF5",
            display: "inline-block",
            marginRight: "20px",
            padding: "11px",
            borderRadius: "100px",
          }}
        >
          {wasteId === undefined || wasteId === ""
            ? inventoryResults.addToInventory
            : wasteProductResults.addToInventory}
        </Typography>
        <Typography
          sx={{
            backgroundColor: "#DAEDF5",
            display: "inline-block",
            padding: "11px",
            borderRadius: "100px",
          }}
        >
          {wasteId === undefined || wasteId === ""
            ? productResults.category
            : wasteProductResults.category}
        </Typography>
        <Typography sx={{ padding: "10px 0 10px 0" }}>
          {`Brand: ${
            wasteId === undefined || wasteId === ""
              ? productResults.brandName
              : wasteProductResults.brandName
          }`}
        </Typography>
        <Typography variant="h2">
          {wasteId === undefined || wasteId === ""
            ? productResults.productName
            : wasteProductResults.productName}
        </Typography>

        <Box
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={1} justifyContent="center">
            {visiblePhoto.slice(startIndex, endIndex).map((photoUrl, index) => (
              <Grid item key={index}>
                <img
                  src={photoUrl}
                  alt={`Product Image ${startIndex + index + 1}`}
                  style={{ width: "288px", height: "300px" }}
                />
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={visiblePhoto.length}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

        <Card>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{ padding: "20px 0 0 0" }}>
                <Typography variant="h2">Product Information</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: "14px" }}>Stock</Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  {wasteId === undefined || wasteId === ""
                    ? inventoryResults.stockQuantity
                    : wasteProductResults.wasteQuantity}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: "14px" }}>Unit Price</Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  $
                  {wasteId === undefined || wasteId === ""
                    ? productResults.unitPrice
                    : wasteProductResults.unitPrice}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: "14px" }}>Total Value</Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  $
                  {wasteId === undefined || wasteId === ""
                    ? inventoryResults.totalValue
                    : wasteProductResults.totalValue}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ padding: "20px 0 0 0" }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography sx={{ fontSize: "14px" }}>
                      Barcode Number
                    </Typography>
                    <Typography>
                      {wasteId === undefined || wasteId === ""
                        ? inventoryResults.barcodeNumber
                        : wasteProductResults.barcodeNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography sx={{ fontSize: "14px" }}>
                      Expiry Date
                    </Typography>
                    <Typography>{formattedExpiryDate}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography sx={{ fontSize: "14px" }}>
                      Period After Opening
                    </Typography>
                    <Typography>
                      {wasteId === undefined || wasteId === ""
                        ? productResults.periodAfterOpening
                        : wasteProductResults.periodAfterOpening}
                      M
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: "14px" }}>Notes</Typography>
                <Typography>
                  {wasteId === undefined || wasteId === ""
                    ? productResults.message
                    : wasteProductResults.message}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {userListResults &&
          inventoryResults &&
          internalUseListResults &&
          saleResults && (
            <ActivityHistory
              inventoryResults={inventoryResults}
              internalUseListResults={internalUseListResults}
              userListResults={userListResults}
              saleResults={saleResults}
            />
          )}
      </Box>
    </>
  );
};

export default ProductDetail;
