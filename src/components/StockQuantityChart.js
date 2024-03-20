import React from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const data = [
  { _id: "Skin Care", totalStockQuantity: 131, unitPrice: 10 },
  { _id: "Make Up", totalStockQuantity: 75, unitPrice: 15 },
  { _id: "Hair Care", totalStockQuantity: 858, unitPrice: 8 },
  { _id: "Body Care", totalStockQuantity: 150, unitPrice: 12 },
];

const totalQuantity = data.reduce(
  (acc, curr) => acc + curr.totalStockQuantity,
  0
);

const colors = ["#F26419", "#000000", "#F5B02C", "#87BBD7"];

const pieData = data.map((item, index) => ({
  name: item._id,
  value: item.totalStockQuantity,
  fill: colors[index],
}));

const StockQuantityChart = () => {
  return (
    <>
      <Typography variant="h2">Total Products</Typography>
      <Grid container spacing={0}>
        <Grid item xs={12} md={6} align="center">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={150}
              innerRadius={110}
              startAngle={90}
              endAngle={-360}
              label={({ cx, cy }) => (
                <>
                  <text
                    x={cx}
                    y={cy - 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={28}
                  >
                    {totalQuantity}
                  </text>
                  <text
                    x={cx}
                    y={cy + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={22}
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
                ).toFixed(1);
                return `${percentage}%`;
              }}
            />
          </PieChart>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={0}>
            {data.map((item, index) => {
              const otherCategoriesQuantity =
                totalQuantity - item.totalStockQuantity;
              const percentage =
                (item.totalStockQuantity / totalQuantity) * 100;
              const pieData = [
                { name: item._id, value: item.totalStockQuantity },
                { name: "Other", value: otherCategoriesQuantity },
                { fill: colors[index] },
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
                              {`${percentage.toFixed(1)}%`}
                            </text>
                          )}
                          labelLine={false}
                        >
                          {pieData.map((entry, i) => (
                            <Cell
                              key={`cell-${i}`}
                              fill={i === 0 ? `${colors[index]}` : "#CCCCCC"}
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
