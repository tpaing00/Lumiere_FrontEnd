import React from "react";
import { Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const StockQuantityChartByCategory = ({
  selectedCategory,
  totalInventoryStock,
  totalInventoryStockWithData,
}) => {
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
      "Body Care": "#000000",
      "Make Up": "#F5B02C",
    };
    
    return colorMap[category] || "#CCCCCC";
  };

  const foundCategory = data.find((item) => item._id === selectedCategory);
  const otherCategoriesQuantity =
    totalQuantity - foundCategory.totalStockQuantity;
  const percentage = (foundCategory.totalStockQuantity / totalQuantity) * 100;
  const pieData = [
    { name: foundCategory._id, value: foundCategory.totalStockQuantity },
    { name: "Other", value: otherCategoriesQuantity },
    {fill: getColor(foundCategory._id)}
  ];

  const foundCategoryData = totalInventoryStockWithData.find((item) => {
    if (item._id === selectedCategory) {
      return item.data;
    }
  }).data;
  console.log(foundCategoryData);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6} lg={6} align="center">
            <PieChart width={300} height={400}>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={100}
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
                    <tspan x={cx} y={cy - 20}>{`${percentage.toFixed(
                      0
                    )}%`}</tspan>
                    <tspan x={cx} y={cy + 5} fontWeight="bold">
                      {foundCategory.totalStockQuantity}
                    </tspan>
                    <tspan x={cx} y={cy + 30}>
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
          </Grid>
          <Grid item container spacing={1} xs={6} lg={6}>
            {foundCategoryData.slice(0, 5).map((product, index) => (
              <Grid key={index} item xs={12} lg={12}>
                <Card sx={{ width: "60%", margin: "auto" }}>
                  <CardContent>
                    <Grid container spacing={1} xs={12} lg={12}>
                      <Grid item container spacing={1} xs={6} lg={6}>
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
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {product.stockQuantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Barcode Number: {product.product.barcodeNumber}
                        </Typography>
                        {/* Add more product info as needed */}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StockQuantityChartByCategory;
