import React from "react";
import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ActivityHistory from "./ActivityHistory";
import { Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";

const ProductDetail = () => {
  const location = useLocation();
  const { inventoryId, barcodeNumber, wasteId } = location.state;
  // console.log("inId :" +inventoryId);
  // console.log("barcodeId :" +barcodeNumber);
  console.log("wasteId :" +wasteId);
  const [productResults, setProductResults] = useState("");
  const [inventoryResults, setInventoryResults] = useState("");
  // const [notificationResults, setNotificationResults] = useState("");
  const [internalUseListResults, setInternalUseListResults] = useState("");
  const [wasteProductResults, setwasteProductResults] = useState("");
  const [userListResults, setUserListResults] = useState("");
  // const [showActivityHistory, setshowActivityHistory] = useState(true);
  const [formattedExpiryDate, setFormattedexpiryDate] = useState("");

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
          if(wasteId === "" || wasteId === undefined){
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

  return (
    <>
      <Typography variant="h1" sx={{ padding: "10px 0 10px 0" }}>
        Product Detail
      </Typography>
      <Typography
        sx={{
          backgroundColor: "#DAEDF5",
          display: "inline-block",
          marginRight: "20px",
          padding: "10px",
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
          padding: "10px",
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
      <Typography variant="h1">
        {wasteId === undefined || wasteId === ""
          ? productResults.productName
          : wasteProductResults.productName}
      </Typography>


      <Card>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sx={{padding : '20px 0 0 0'}}>
              <Typography variant="h2">Product Information</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {productResults.photo && productResults.photo.map((photoUrl, index) => (
                  <Grid item key={index}>
                    <img src={photoUrl} alt={`Product Image ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Typography>Stock</Typography>
              <Typography>
                {wasteId === undefined || wasteId === ""
                  ? inventoryResults.stockQuantity
                  : wasteProductResults.wasteQuantity}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Unit Price</Typography>
              <Typography>
                $
                {wasteId === undefined || wasteId === ""
                  ? productResults.unitPrice
                  : wasteProductResults.unitPrice}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Total Value</Typography>
              <Typography>
                $
                {wasteId === undefined || wasteId === ""
                  ? inventoryResults.totalValue
                  : wasteProductResults.totalValue}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Barcode Number</Typography>
              <Typography>
                {wasteId === undefined || wasteId === ""
                  ? inventoryResults.barcodeNumber
                  : wasteProductResults.barcodeNumber}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Expiry Date</Typography>
              <Typography>{formattedExpiryDate}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Period After Opening</Typography>
              <Typography>
                {wasteId === undefined || wasteId === ""
                  ? productResults.periodAfterOpening
                  : wasteProductResults.periodAfterOpening}{" "}
                M
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      { userListResults && inventoryResults && internalUseListResults &&(
        <ActivityHistory inventoryResults = {inventoryResults} internalUseListResults={internalUseListResults} userListResults={userListResults}/>
      )}
    </>
  );
};

export default ProductDetail;
