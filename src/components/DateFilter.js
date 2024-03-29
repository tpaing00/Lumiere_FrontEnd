import React from "react";
import { Typography, Grid, IconButton, useTheme } from "@mui/material";

const DateFilter = ({ handleDateFilterChange, selectedDateFilter }) => {
  const theme = useTheme();
  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "-10px", marginLeft: "auto", marginRight: "auto" }}
      >
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleDateFilterChange("Today")}
              style={{
                marginTop: "10px",
                paddingLeft: "18px",
                paddingRight: "18px",
                background:
                selectedDateFilter === "Today" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px", 
                  
              }}
            >
              <Typography
              color={selectedDateFilter === "Today" ? "white" : "default"}
              variant="body2"
              align="center"
              style={{
                fontWeight:
                selectedDateFilter === "Today" ? "bold" : "normal",
              }}
            >
              Today
            </Typography>
            </IconButton>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item >
            <IconButton
              onClick={() => handleDateFilterChange("1 Month")}
              style={{
                marginTop: "10px",
                paddingLeft: "18px",
                paddingRight: "18px",
                background:
                selectedDateFilter === "1 Month" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px", 
              }}
            >
              <Typography

              variant="body2"
              align="center"
              color={selectedDateFilter === "1 Month" ? "white" : "default"}
              style={{
                fontWeight:
                selectedDateFilter === "1 Month" ? "bold" : "normal",
              }}
            >
              1 Month
            </Typography>
            </IconButton>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleDateFilterChange("1 Year")}
              style={{
                marginTop: "10px",
                paddingLeft: "18px",
                paddingRight: "18px",
                background:
                selectedDateFilter === "1 Year" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px", 
              }}
            >
              <Typography
              variant="body2"
              align="center"
              color={selectedDateFilter === "1 Year" ? "white" : "default"}
              style={{
                fontWeight:
                selectedDateFilter === "1 Year" ? "bold" : "normal",
              }}
            >
              1 Year
            </Typography>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DateFilter;
