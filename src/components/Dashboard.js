import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Grid, Box, Card, CardContent, SvgIcon, useTheme, useMediaQuery } from "@mui/material";
import DashInfoPiece from "./dashboard/DashInfoPiece";
import Bell from '../assets/icons/Bell.svg'
import CustomCardcontent from "./dashboard/CustomCardContent";
import DashOverviewPiece from "./dashboard/DashOverviewPiece";
import DashCard from "./dashboard/DashCard";
import DashboardTopTrendProducts from "./DashboardTopTrendProducts.js";
import DashboardTotalProducts from "./DashboardTotalProducts.js";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const [totalInventoryResults, setTotalInventoryResults] = useState("");
  const [totalInventoryValueResults, setTotalInventoryValueResults] =
    useState("");
  const [totalSaleResults, setTotalSaleResults] = useState("");
  const [totalInternalUseProducts, setTotalInternalUseProducts] = useState("");
  const [nearlyExpiredProducts, setNearlyExpiredProducts] = useState("");
  const [expiredProducts, setExpiredProducts] = useState("");
  const [soldByCategory, setSoldByCategory] = useState({});
  const [totalInventoryStock, setTotalInventoryStock] = useState();
  const [totalInventoryByType, setTotalInventoryByType] = useState({});

  useEffect(() => {
    axios
      .get(`https://api.lumiereapp.ca/api/v1/totalinventory`)
      .then((response) => {
        if (response.status === 200) {
          setTotalInventoryResults(response.data.totalInventory);
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
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

      axios
      .get(`https://api.lumiereapp.ca/api/v1/totalinventorybytype`)
      .then((response) => {
        if (response.status === 200) {
          let totalByCategory = {};
          response.data.forEach((item) => {
            totalByCategory[item.addToInventory] = item.totalInventory;
          });
          setTotalInventoryByType(totalByCategory);
          console.log(totalByCategory);
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
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(`https://api.lumiereapp.ca/api/v1/gettotalinventorybycategory`)
      .then((response) => {
        if (response.status === 200) {
          setTotalInventoryStock(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

      axios
      .get(`https://api.lumiereapp.ca/api/v1/soldbycategory`)
      .then((response) => {
        if (response.status === 200) {
          let totalSaleByCategory = {};
          response.data.forEach((item) => {
            totalSaleByCategory[item._id] = item.totalSoldQuantity;
          });

          setSoldByCategory(totalSaleByCategory);
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
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }, []);

  return (
    <>
     <Box sx={{ p: 4, paddingTop:"0", paddingRight: isMobile ? "20px" : undefined, paddingLeft: isMobile ? "20px" : undefined}}>
      <Typography variant="h1" sx={{  mb: '12px' }}>Dashboard</Typography>
      <Grid container alignItems="left" sx={{  pb: 0}} spacing={'24px'}>
        <Grid item xs={12} lg={8} sx={{ p: 0 }}>
          <Card sx={{ p: 0 }}>
            <CustomCardcontent className="dashboard-overview">
              <Grid container spacing={1}>

                <DashInfoPiece
                  text="Total Inventory"
                  resultsName={totalInventoryResults}
                  type="number"
                />

                <DashInfoPiece
                  text="Total Inventory Value"
                  resultsName={totalInventoryValueResults}
                  type="currency"
                />

                <DashInfoPiece
                  text="Total Sales"
                  resultsName={totalSaleResults}
                  type="number"
                />
              </Grid>

            </CustomCardcontent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4} >
          <Card className="dashboard-notification" sx={{ p: 0, display: "flex", alignItems: "center", height: '100%' }}>
            <CustomCardcontent>

              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <SvgIcon component={Bell} sx={{ width: '27.19px', height: '35px', color: theme.palette.secondary.dark, mr: '16px' }} />
                The {mostRecentNotification.productName} is almost expired
              </Typography>

            </CustomCardcontent>
          </Card>
        </Grid>

        <DashCard title="Inventory Overview">
          <DashOverviewPiece
            title="Total of Retail Products"
            variant="retail"
            resultsName={totalInventoryByType}
            xsWidth="12"
            lgWidth="6"
          />
          <DashOverviewPiece
            title="Total of In-Store Products"
            variant="inStore"
            resultsName={totalInventoryByType}
            xsWidth="12"
            lgWidth="6"
          />
          <DashOverviewPiece
            title="Nearly Expired"
            variant="nearlyExpired"
            resultsName={nearlyExpiredProducts}
            xsWidth="12"
            lgWidth="6"
          />
          <DashOverviewPiece
            title="Expired Products"
            variant="expired"
            resultsName={expiredProducts}
            xsWidth="12"
            lgWidth="6"
          />
        </DashCard>

        <DashCard title="Sales Overview">
          <DashOverviewPiece
            title="Hair Care"
            variant="hairCare"
            resultsName={soldByCategory}
            xsWidth="6"
            lgWidth="6"
          />
          <DashOverviewPiece
            title="Make-Up"
            variant="makeUp"
            resultsName={soldByCategory}
            xsWidth="6"
            lgWidth="6"
          />
          <DashOverviewPiece
            title="Skin Care"
            variant="skinCare"
            resultsName={soldByCategory}
            xsWidth="6"
            lgWidth="6"
          />
          <DashOverviewPiece
            title="Body Care"
            variant="bodyCare"
            resultsName={soldByCategory}
            xsWidth="6"
            lgWidth="6"
          />
        </DashCard>

        <DashCard title="Total Products">
          {totalInventoryStock && (<DashboardTotalProducts totalInventoryStock={totalInventoryStock} />)}
        </DashCard>

        <DashCard title="Top Trend Products">
          <DashboardTopTrendProducts />
        </DashCard>

      </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
