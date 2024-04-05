import React from "react";
import { useState } from "react";
import { subDays, format } from "date-fns";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const ActivityHistory = ({
  inventoryResults,
  internalUseListResults,
  userListResults,
  saleResults,
  wasteProductResults,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  // const [userInventoryResults, setUserInventoryResults] = useState("");

  let combinedData;
  if (internalUseListResults !== undefined) {
    combinedData = internalUseListResults.map((internalUseRow) => {
      const found = userListResults.find(
        (user) => user._id === internalUseRow.userId
      );
      // if (found) {
      const combined = {
        ...internalUseRow,
        ...found,
      };
      return combined;
      // }
    });
  }

  let combinedUserInventoryResults;
  if (inventoryResults !== "") {
    const found = userListResults.find(
      (user) => user._id === inventoryResults.userId
    );
    // if (found) {
    combinedUserInventoryResults = {
      ...inventoryResults,
      ...found,
    };
    // setUserInventoryResults(combinedUserInventoryResults);
    // }
  }

  let combinedUserSaleData;
  if (saleResults) {
    combinedUserSaleData = saleResults.map((saleResultsRow) => {
      const found = userListResults.find(
        (user) => user._id === saleResultsRow.userId
      );
      // if (found) {
      const combined = {
        ...saleResultsRow,
        ...found,
      };
      // console.log("combined" +combined);
      return combined;
      // }
    });
  }

  return (
    <Card>
      <CardContent sx={{ pt: 0.5 }}>
        <Grid container>
          <Grid item xs={12} sx={{ padding: "10px 0 0 10px" }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Activity History
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Table>
              <TableHead sx={{ borderTop: "1px solid #ccc" }}>
                <TableRow>
                  <TableCell sx={{ display: { xs: "none", lg: "block" } }}>
                    Date
                  </TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Quantity Change</TableCell>
                  {isMobile ? null : (
                    <TableCell sx={{ display: { xs: "none", lg: "block" } }}>
                      Date of Open
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ display: { xs: "none", lg: "block" } }}>
                    <Typography>
                      {format(
                        subDays(
                          new Date(combinedUserInventoryResults.dateAdded),
                          0
                        ),
                        "MM/dd/yyyy"
                      )}
                    </Typography>
                    <Typography>
                      {format(
                        subDays(
                          new Date(combinedUserInventoryResults.dateAdded),
                          0
                        ),
                        "HH:mm"
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {combinedUserInventoryResults.firstName}
                  </TableCell>
                  <TableCell>Product Added</TableCell>
                  <TableCell>
                    +{combinedUserInventoryResults.initialStock}
                  </TableCell>
                  {isMobile ? null : <TableCell></TableCell>}
                </TableRow>
                {combinedData.map((list, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ display: { xs: "none", lg: "block" } }}>
                      <Typography>
                        {format(
                          subDays(new Date(list.checkoutDate), 0),
                          "MM/dd/yyyy"
                        )}
                      </Typography>
                      <Typography>
                        {format(
                          subDays(new Date(list.checkoutDate), 0),
                          "HH:mm"
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>{list.firstName}</TableCell>
                    <TableCell>{list.reason}</TableCell>
                    <TableCell>-{list.quantity}</TableCell>
                    {isMobile ? null : (
                      <TableCell>
                        {format(
                          subDays(new Date(list.openingDate), 0),
                          "MM/dd/yyyy"
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {combinedUserSaleData.map((list, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ display: { xs: "none", lg: "block" } }}>
                      <Typography>
                        {format(
                          subDays(new Date(list.soldDate), 0),
                          "MM/dd/yyyy"
                        )}
                      </Typography>
                      <Typography>
                        {format(subDays(new Date(list.soldDate), 0), "HH:mm")}
                      </Typography>
                    </TableCell>
                    <TableCell>{list.firstName}</TableCell>
                    <TableCell>Sold</TableCell>
                    <TableCell>-{list.soldQuantity}</TableCell>
                    {isMobile ? null : <TableCell></TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
