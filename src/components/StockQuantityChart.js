import React, { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import * as XLSX from "xlsx";

const StockQuantityChart = ({ totalInventoryStock, selectedCategory }) => {
  const data = totalInventoryStock;
  console.log(data);
  const totalQuantity = data.reduce(
    (acc, curr) => acc + curr.totalStockQuantity,
    0
  );

  const getColor = (category) => {
    const colorMap = {
      "Hair Care": "#87BBD7",
      "Skin Care": "#F26419",
      "Body Care": "#003c5c",
      "Make Up": "#F5B02C",
    };

    return colorMap[category] || "#CCCCCC";
  };

  const pieData = data.map((item, index) => ({
    name: item._id,
    value: item.totalStockQuantity,
    fill: getColor(item._id),
  }));

  const [xLabels] = useState([
    "Hair Care",
    "Skin Care",
    "Body Care",
    "Make Up",
  ]);

  const ExportReport = () => {
    const handleExport = () => {
      // Combine the data into an array of objects
      const exportData = xLabels.map((label, index) => ({
        Category: label,
        Total_Stock_Quantity: totalInventoryStock[index].totalStockQuantity,
      }));

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Total Stock Quantity");

      // Generate the XLSX file
      const fileData = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Convert the array buffer to a Blob
      const blob = new Blob([fileData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Total_Stock_Quantity.xlsx";

      // Click the anchor to trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    };

    return (
      <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={handleExport}>
          Export Report
        </Button>
      </Box>
    );
  };

  return (
    <>
      <Card sx={{ width: "100%", p: 5}}>
        <Grid container spacing={0}>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PieChart width={selectedCategory ? 500 : 300} height={selectedCategory ? 450 : 300}>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={selectedCategory ? 200 : 140}
                innerRadius={selectedCategory ? 160 : 100}
                startAngle={90}
                endAngle={-360}
                label={({ cx, cy }) => (
                  <>
                    <text
                      x={cx}
                      y={cy - 20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="24px"
                      fontWeight="bold"
                      fontFamily="Roboto Condensed"
                    >
                      {totalQuantity}
                    </text>
                    <text
                      x={cx}
                      y={cy + 20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="24px"
                      fontWeight="bold"
                      fontFamily="Roboto Condensed"
                    >
                      Products
                    </text>
                  </>
                )}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const { payload } = props;
                  const totalStockQuantity = data.reduce(
                    (acc, curr) => acc + curr.totalStockQuantity,
                    0
                  );
                  const percentage = (
                    (payload.value / totalStockQuantity) *
                    100
                  ).toFixed(0);
                  return `${percentage}%`;
                }}
              />
            </PieChart>
            {selectedCategory && <ExportReport />}
          </Grid>

          <Grid
            item
            xs={12}
            lg={6}
            sx={{ padding: 2 }}
          >
            <Grid container spacing={0}>
              {data.map((item, index) => {
                const otherCategoriesQuantity =
                  totalQuantity - item.totalStockQuantity;
                const percentage =
                  (item.totalStockQuantity / totalQuantity) * 100;
                const pieData = [
                  { name: item._id, value: item.totalStockQuantity },
                  { name: "Other", value: otherCategoriesQuantity },
                ];
                return (
                  <Grid
                    key={index}
                    item
                    xs={6}
                    md={6}
                    align="center"
                  >
                    <Card
                      sx={{
                        boxShadow: (theme) =>
                          `4px 4px 8px ${getColor(item._id)}`,
                        margin: 1,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h3" align="center">
                          {item._id}
                        </Typography>
                        <PieChart width={110} height={140}>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={50}
                            innerRadius={40}
                            startAngle={90}
                            endAngle={-360}
                            label={({ cx, cy }) => (
                              <text
                                x={cx}
                                y={cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={14}
                              >
                                {`${percentage.toFixed(0)}%`}
                              </text>
                            )}
                            labelLine={false}
                          >
                            {pieData.map((entry, i) => (
                              <Cell
                                key={`cell-${i}`}
                                fill={i === 0 ? getColor(item._id) : "#CCCCCC"}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{ fontSize: "16px" }}
                        >
                          Quantity: {item.totalStockQuantity} Products
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default StockQuantityChart;
