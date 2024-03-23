import React from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const StockQuantityChart = ({ totalInventoryStock }) => {
  const data = totalInventoryStock;
  console.log(data);
  const totalQuantity = data.reduce(
    (acc, curr) => acc + curr.totalStockQuantity,
    0
  );

  const colors = ["#F26419", "#000000", "#F5B02C", "#87BBD7"];

  const getColor = (category) => {
    const colorMap = {
      "Hair Care": "#87BBD7",
      "Skin Care": "#F26419",
      "Body Care": "#000000",
      "Make Up": "#F5B02C",
    };
    
    return colorMap[category] || "#CCCCCC";
  };


  const pieData = data.map((item, index) => ({
    name: item._id,
    value: item.totalStockQuantity,
    fill: getColor(item._id)
  }));

  return (
    <>
      {/* <Grid item xs={12} md={6} align="center"> */}
      <Grid container spacing={0}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            padding: "16px 34px 39px 16px",
            border: "1px solid black",
          }}
        >
          <Card sx={{ border: "1px solid red", width: "100%" }}>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={100}
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
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
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
                <Grid key={index} item xs={6} md={6} align="center">
                  <Card>
                    <CardContent>
                      <Typography variant="h3" align="center">
                        {item._id}
                      </Typography>
                      <PieChart width={200} height={200}>
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
                      <Typography variant="body1" align="center">
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
    </>
  );
};

export default StockQuantityChart;
