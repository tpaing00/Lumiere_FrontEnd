import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Grid, Box, Card, CardContent } from "@mui/material";

const Dashboard = () => {
  const [totalInventoryResults, setTotalInventoryResults] = useState("");
  const [totalInventoryValueResults, setTotalInventoryValueResults] =
    useState("");
  const [totalSaleResults, setTotalSaleResults] = useState("");
  const [totalInternalUseProducts, setTotalInternalUseProducts] = useState("");
  const [nearlyExpiredProducts, setNearlyExpiredProducts] = useState("");
  const [expiredProducts, setExpiredProducts] = useState("");
  const [totalInventoryByCategory, setTotalInventoryByCategory] = useState({});

  useEffect(() => {
    axios
      .get(`https://api.lumiereapp.ca/api/v1/totalinventory`)
      .then((response) => {
        if (response.status === 200) {
          setTotalInventoryResults(response.data.totalInventory);
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/totalinventoryvalue`)
      .then((response) => {
        if (response.status === 200) {
          setTotalInventoryValueResults(response.data.totalInventoryValue);
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/totalsale`)
      .then((response) => {
        if (response.status === 200) {
          setTotalSaleResults(response.data.totalSale);
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/getnearlyexpiredinventory`)
      .then((response) => {
        if (response.status === 200) {
          setNearlyExpiredProducts(response.data.totalNearlyExpiredProducts);
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/getexpiredinventory`)
      .then((response) => {
        if (response.status === 200) {
          setExpiredProducts(response.data.totalExpiredProducts);
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/gettotalinventorybycategory`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          let totalStockByCategory = {};
          response.data.forEach((item) => {
            totalStockByCategory[item._id] = item.totalStockQuantity;
            // console.log(totalStockByCategory);
          });

          setTotalInventoryByCategory(totalStockByCategory);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/totalinstore`)
      .then((response) => {
        if (response.status === 200) {
          setTotalInternalUseProducts(response.data.totalSale);
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }, []);

  return (
    <>
      <Grid container direction="column" alignItems="left">
        <Card>
          <CardContent>
            <Typography variant="h1">Dashboard</Typography>
            <Grid container spacing={10}>
              <Grid item xs={2}>
                <Box>
                  <Typography>Total Inventory</Typography>
                  <Typography>
                    {totalInventoryResults.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <Typography>Total Inventory Value</Typography>
                  <Typography>
                    ${totalInventoryValueResults.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <Typography>Total Sales</Typography>
                  <Typography>{totalSaleResults.toLocaleString()}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h2">Inventory Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Box>
                  <Typography>Total of Retail Products</Typography>
                  <Typography>{totalSaleResults.toLocaleString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box>
                  <Typography>Total of In-Store Products</Typography>
                  {totalInternalUseProducts.toLocaleString()}
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box>
                  <Typography>Nearly Expired</Typography>
                  <Typography>
                    {nearlyExpiredProducts.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box>
                  <Typography>Expired Products</Typography>
                  <Typography>{expiredProducts.toLocaleString()}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h2">Sales Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Box>
                  <Typography>Hair Care</Typography>
                  <Typography>
                    {totalInventoryByCategory["Hair Care"]
                      ? totalInventoryByCategory["Hair Care"].toLocaleString()
                      : ""}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box>
                  <Typography>Make-Up</Typography>
                  <Typography>
                    {totalInventoryByCategory["Make Up"]
                      ? totalInventoryByCategory["Make Up"].toLocaleString()
                      : ""}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box>
                  <Typography>Skin Care</Typography>
                  <Typography>
                    {totalInventoryByCategory["Skin Care"]
                      ? totalInventoryByCategory["Skin Care"].toLocaleString()
                      : ""}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box>
                  <Typography>Body Care</Typography>
                  <Typography>
                    {totalInventoryByCategory["Body Care"]
                      ? totalInventoryByCategory["Body Care"].toLocaleString()
                      : ""}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* <h1>Dashboard</h1>
        <div>
          <div>
            <p>Total Inventory</p>
            <p>{totalInventoryResults.toLocaleString()}</p>
          </div>
          <div>
            <p>Total Inventory Value</p>
            <p>${totalInventoryValueResults.toLocaleString()}</p>
          </div>
          <div>
            <p>Total Sales</p>
            <p>{totalSaleResults.toLocaleString()}</p>
          </div>
        </div>

        <section>
          <h2>Inventory Overview</h2>
          <div>
            <p>Total of Retail Products</p>
            <p>{totalSaleResults.toLocaleString()}</p>
          </div>
          <div>
            <p>Total of In-Store Products</p>
            <p></p>
          </div>
          <div>
            <p>Nearly Expired</p>
            <p>{nearlyExpiredProducts.toLocaleString()}</p>
          </div>
          <div>
            <p>Expired Products</p>
            <p>{expiredProducts.toLocaleString()}</p>
          </div>
        </section>
        
        <section>
          <h2>Sales Overview</h2>
          <div>
            <p>Hair Care</p>
            <p>{totalInventoryByCategory["Hair Care"] ? totalInventoryByCategory["Hair Care"].toLocaleString() : ''}</p>
          </div>
          <div>
            <p>Make-Up</p>
            <p>{totalInventoryByCategory["Make Up"] ? totalInventoryByCategory["Make Up"].toLocaleString() : ''}</p>
          </div>
          <div>
            <p>Skin Care</p>
            <p>{totalInventoryByCategory["Skin Care"] ? totalInventoryByCategory["Skin Care"].toLocaleString() : ''}</p>
          </div>
          <div>
            <p>Body Care</p>
            <p>{totalInventoryByCategory["Body Care"] ? totalInventoryByCategory["Body Care"].toLocaleString() : ''}</p>
          </div>
        </section> */}
    </>
  );
};

export default Dashboard;
