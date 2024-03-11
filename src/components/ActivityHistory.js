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
  Box,
} from "@mui/material";

const ActivityHistory = ({ internalUseListResults, userListResults }) => {
  console.log(userListResults);
  console.log(internalUseListResults);

  const combinedData = internalUseListResults.map((internalUseRow) => {
    const found = userListResults.find(
      (user) => user._id === internalUseRow.userId
    );
    if (found) {
      const combined = {
        ...internalUseRow,
        ...found,
      };   
      console.log("combined" +combined);   
      return combined;
    }
  });
  console.log(combinedData);


  return (
    <Grid container>
      <Grid item xs={12} sx={{ padding: "20px 0 0 10px" }}>
        <Typography variant="h3">Activity History</Typography>
      </Grid>
      <Grid item xs={12}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Quantity Change</TableCell>
              <TableCell>Date of Open</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedData.map((list, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography>
                    {format(
                      subDays(new Date(list.checkoutDate), 1),
                      "MM/dd/yyyy"
                    )}
                  </Typography>
                  <Typography>
                    {format(subDays(new Date(list.checkoutDate), 1), "HH:mm")}
                  </Typography>
                </TableCell>
                <TableCell>
                  {list.firstName}
                </TableCell>
                <TableCell>{list.reason}</TableCell>
                <TableCell>-{list.quantity}</TableCell>
                <TableCell>
                  {format(subDays(new Date(list.openingDate), 1), "MM/dd/yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default ActivityHistory;
