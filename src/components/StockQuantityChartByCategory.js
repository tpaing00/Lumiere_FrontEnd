import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Button,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import * as XLSX from "xlsx";

const StockQuantityChartByCategory = ({
  selectedCategory,
  totalInventoryStock,
  totalInventoryStockWithData,
  selectedDateFilter,
}) => {
  const data = totalInventoryStock;
  const totalQuantity = data.reduce(
    (acc, curr) => acc + curr.totalStockQuantity,
    0
  );

  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const getColor = (category) => {
    const colorMap = {
      "Hair Care": "#87BBD7",
      "Skin Care": "#F26419",
      "Body Care": "#003c5c",
      "Make Up": "#F5B02C",
    };

    return colorMap[category] || "#CCCCCC";
  };

  const foundCategory = data.find((item) => item._id === selectedCategory);
  if (!foundCategory) {
    return (
      <Box
        sx={{
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Typography variant="body1" align="center">
          List empty
        </Typography>
      </Box>
    );
  }
  const otherCategoriesQuantity =
    totalQuantity - foundCategory.totalStockQuantity;
  const percentage = (foundCategory.totalStockQuantity / totalQuantity) * 100;
  const pieData = [
    { name: foundCategory._id, value: foundCategory.totalStockQuantity },
    { name: "Other", value: otherCategoriesQuantity },
    { fill: getColor(foundCategory._id) },
  ];

  const foundCategoryData = totalInventoryStockWithData.find((item) => {
    if (item._id === selectedCategory) {
      return item.data;
    }
  }).data;

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedDateFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = foundCategoryData.filter(
    (product) => product.stockQuantity > 0
  );

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const navigate = useNavigate();
  const handleViewDetail = (inventoryId, barcodeNumber) => {
    navigate("/productdetail", {
      state: { inventoryId, barcodeNumber },
    });
  };

  const ExportReport = () => {
    const handleExport = () => {
      // Combine the data into an array of objects
      const exportData = [
        {
          Category: selectedCategory,
          Total_Stock_Quantity: foundCategory.totalStockQuantity,
        },
        { Category: "Other", Total_Stock_Quantity: otherCategoriesQuantity },
      ];
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Total Stock By Category"
      );

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
      link.download = "Total_Stock_By_Category.xlsx";

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
      {isMobile ? (
        <Card sx={{ backgroundColor: "transparent", p: 0}}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid
                item
                xs={12}
                lg={6}
                align="center"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PieChart width={300} height={300}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    innerRadius="60%"
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
                        <tspan
                          x={cx}
                          y={cy - 40}
                          fontSize="24px"
                        >{`${percentage.toFixed(0)}%`}</tspan>
                        <tspan
                          x={cx}
                          y={cy + 5}
                          fontWeight="bold"
                          fontSize="32px"
                        >
                          {foundCategory.totalStockQuantity}
                        </tspan>
                        <tspan x={cx} y={cy + 40} fontSize="24px">
                          Products
                        </tspan>
                      </text>
                    )}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={i === 0 ? getColor(foundCategory._id) : "#CCCCCC"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
                <ExportReport />
              </Grid>
              <Grid item container spacing={1} xs={12} lg={6} mt={5}>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ margin: "auto", marginBottom: "20px" }}
                >
                  List of Products
                </Typography>
                {paginatedData.map(
                  (product, index) => (
                    <Grid key={index} item xs={12} lg={12}>
                      <Card
                        sx={{ width: "100%", margin: "auto" , boxShadow: (theme) =>
                        `2px 2px 1px #dfdfdf`, borderRadius: "35px" }}
                        onClick={() =>
                          handleViewDetail(
                            product._id,
                            product.product.barcodeNumber
                          )
                        }
                      >
                        <CardContent sx={{ padding: 0, marginBottom: 0 }}>
                          <Grid container spacing={1} xs={12} lg={12}>
                            <Grid
                              item
                              container
                              spacing={1}
                              xs={6}
                              lg={4}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Avatar
                                sx={{ width: 80, height: 80, marginRight: 2 }}
                                alt={product.product.productName}
                                src={product.product.photo[0]}
                              />
                            </Grid>
                            <Grid
                              item
                              container
                              spacing={1}
                              xs={6}
                              lg={6}
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                gutterBottom
                                variant="body1"
                                component="div"
                              >
                                {product.product.brandName}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="body1"
                                component="div"
                              >
                                {product.product.productName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Quantity: {product.stockQuantity}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {product.addToInventory}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                )}
                <Pagination
                  count={Math.ceil(foundCategoryData.length / itemsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="secondary"
                  sx={{ margin: "auto", marginTop: "20px" }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ p: 5 }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid
                item
                xs={6}
                lg={6}
                align="center"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PieChart width={500} height={450}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={220}
                    innerRadius={170}
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
                        <tspan
                          x={cx}
                          y={cy - 40}
                          fontSize="24px"
                        >{`${percentage.toFixed(0)}%`}</tspan>
                        <tspan
                          x={cx}
                          y={cy + 5}
                          fontWeight="bold"
                          fontSize="32px"
                        >
                          {foundCategory.totalStockQuantity}
                        </tspan>
                        <tspan x={cx} y={cy + 40} fontSize="24px">
                          Products
                        </tspan>
                      </text>
                    )}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={i === 0 ? getColor(foundCategory._id) : "#CCCCCC"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
                <ExportReport />
              </Grid>
              <Grid item container spacing={1} xs={6} lg={6}>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ margin: "auto", marginBottom: "20px" }}
                >
                  List of Products
                </Typography>
                {paginatedData.map(
                  (product, index) => (
                    <Grid key={index} item xs={12} lg={12}>
                      <Card
                        sx={{ width: "70%", margin: "auto", boxShadow: (theme) =>
                        `2px 2px 1px #dfdfdf`, borderRadius: "35px" }}
                        onClick={() =>
                          handleViewDetail(
                            product._id,
                            product.product.barcodeNumber
                          )
                        }
                      >
                        <CardContent sx={{ padding: 0, marginBottom: 0 }}>
                          <Grid container spacing={1} xs={12} lg={12}>
                            <Grid
                              item
                              container
                              spacing={1}
                              xs={6}
                              lg={4}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Avatar
                                sx={{ width: 80, height: 80, marginRight: 2 }}
                                alt={product.product.productName}
                                src={product.product.photo[0]}
                              />
                            </Grid>
                            <Grid
                              item
                              container
                              spacing={1}
                              xs={6}
                              lg={6}
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                gutterBottom
                                variant="body1"
                                component="div"
                              >
                                {product.product.brandName}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="body1"
                                component="div"
                              >
                                {product.product.productName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Quantity: {product.stockQuantity}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {product.addToInventory}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                )}
                <Pagination
                  count={Math.ceil(foundCategoryData.length / itemsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="secondary"
                  sx={{ margin: "auto", marginTop: "20px" }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StockQuantityChartByCategory;
