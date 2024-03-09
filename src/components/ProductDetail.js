import React from "react";
import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ActivityHistory from "./ActivityHistory";
import { Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";

const ProductDetail = () => {
  const location = useLocation();
  // const { inventoryId, barcodeNumber, wasteId } = location.state;
  const inventoryId = "65ea18258e63aee7f0022b57";
  const barcodeNumber = "4477332288811";
  const wasteId = null;
  // const wasteId = "65e98d232d41c12c98f0b5c1";
  const [productResults, setProductResults] = useState("");
  const [inventoryResults, setInventoryResults] = useState("");
  const [notificationResults, setNotificationResults] = useState("");
  const [internalUseListResults, setInternalUseListResults] = useState([]);
  const [wasteProductResults, setwasteProductResults] = useState("");
  const [showActivityHistory, setshowActivityHistory] = useState(true);
  const [formattedExpiryDate, setFormattedexpiryDate] = useState("");

  useEffect(() => {
    axios
      .get(`https://api.lumiereapp.ca/api/v1/products/${barcodeNumber}`)
      .then((response) => {
        if (response.status === 200) {
          setProductResults(response.data[0]);
          console.log(response.data[0]);
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
          if (res.data.addToInventory === "Retail") {
            setshowActivityHistory(false);
          }
          const dateString = res.data.expiryDate;
          const date = new Date(dateString);
          const adjustedDate = addDays(date, 1);
          setFormattedexpiryDate(() => {
            return format(adjustedDate, "dd MMM yyyy");
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/notification/${inventoryId}`)
      .then((resObj) => {
        if (resObj.status === 200) {
          setNotificationResults(resObj.data[0]);
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

    if (wasteId !== "" && wasteId !== undefined) {
      axios
        .get(`https://api.lumiereapp.ca/api/v1/waste/${wasteId}`)
        .then((wasteResult) => {
          if (wasteResult.status === 200) {
            setwasteProductResults(wasteResult.data);
            setshowActivityHistory(false);
            const dateString = wasteResult.data.expiryDate;
            const date = new Date(dateString);
            const adjustedDate = addDays(date, 1);
            setFormattedexpiryDate(() => {
              return format(adjustedDate, "dd MMM yyyy");
            });
            console.log(wasteResult.data);
          }
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    }
  }, []);

  return (
    <>
      <Typography variant="h1">Product Detail</Typography>
      <Typography>
        {wasteId === null
          ? inventoryResults.addToInventory
          : wasteProductResults.addToInventory}
      </Typography>
      <Typography>
        {wasteId === null
          ? productResults.category
          : wasteProductResults.category}
      </Typography>
      <Typography>{`Brand: ${
        wasteId === null
          ? productResults.brandName
          : wasteProductResults.brandName
      }`}</Typography>
      <Typography variant="h1">
        {wasteId === null
          ? productResults.productName
          : wasteProductResults.productName}
      </Typography>

      <Card>
        <CardMedia
          component="img"
          alt="product image"
          src={
            wasteId === null ? productResults.photo : wasteProductResults.photo
          }
          style={{ width: "auto", height: "auto" }}
        />
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant="h2">Product Information</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Stock</Typography>
              <Typography>
                {wasteId === null
                  ? inventoryResults.stockQuantity
                  : wasteProductResults.wasteQuantity}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Unit Price</Typography>
              <Typography>
                $
                {wasteId === null
                  ? productResults.unitPrice
                  : wasteProductResults.unitPrice}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Total Value</Typography>
              <Typography>
                {wasteId === null
                  ? inventoryResults.totalValue
                  : wasteProductResults.totalValue}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Barcode Number</Typography>
              <Typography>
                {wasteId === null
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
                {wasteId === null
                  ? productResults.periodAfterOpening
                  : wasteProductResults.periodAfterOpening}{" "}
                Months
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {showActivityHistory && (
        <ActivityHistory internalUseListResults={internalUseListResults} />
      )}
    </>
  );
};

export default ProductDetail;
