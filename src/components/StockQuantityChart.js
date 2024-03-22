import React from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const StockQuantityChart = ({totalInventoryStock}) => {
    const data = totalInventoryStock;
    console.log(data);
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

  return (
    <>
      
        {/* <Grid item xs={12} md={6} align="center"> */}
        <Grid item xs={6} sx={{ display: 'flex', padding: '16px 34px 39px 16px', border: '1px solid black' }}>
          <Card sx={{border: '1px solid red', width:'100%'}}>
          <PieChart width={100} height={100}>
            <Pie
              width={100}
              height={100}
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
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
                              {`${percentage.toFixed(0)}%`}
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
      
    </>
  );
};

export default StockQuantityChart;
