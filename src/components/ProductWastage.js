import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { category: "Hair Care", totalWasteQuantity: 58 },
  { category: "Skin Care", totalWasteQuantity: 3 },
];

const RootContainer = styled("div")({
    display: "flex",
    justifyContent: "center",
    overflowX: "auto",
    maxWidth: "100%",
  });
  
  const StyledImageList = styled(ImageList)({
    flexWrap: "nowrap",
    transform: "translateZ(0)",
    width: "auto",
    scrollbarWidth: "none", // For Firefox
    "&::-webkit-scrollbar": {
      display: "none",
    },
  });
  
  const StyledImage = styled("img")({
    width: "250px",
    height: "350px",
  });

const ProductWastage = () => {
  const [wasteProducts, setWasteProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get(
          "https://api.lumiereapp.ca/api/v1/gettotalinventorybycategory"
        );
        if (response.status === 200) {
          console.log(response.data);
                   
          //setInventory(products);
        } else {
          console.error("Failed to fetch data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInventoryData();
}, []);

  useEffect(() => {
    const fetchWastageData = async () => {
      try {
        const response = await axios.get(
          "https://api.lumiereapp.ca/api/v1/wastetop5bycategory"
        );
        if (response.status === 200) {
          console.log(response.data);
          const products = response.data.flatMap(
            (category) => category.top5Waste
          );
          setWasteProducts(products);
        } else {
          console.error("Failed to fetch data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWastageData();
  }, []);

  return (
    <>
      <RootContainer>
      <StyledImageList cols={wasteProducts.length}>
        {wasteProducts.map((product) => (
          <ImageListItem key={product._id}>
            <StyledImage src={product.photo[0]} alt={product.productName} />
          </ImageListItem>
        ))}
      </StyledImageList>
    </RootContainer>
      <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.map((item, index) => (
          <Bar
            key={index}
            dataKey="totalWasteQuantity"
            fill="#8884d8"
            barSize={30}
            radius={[10, 10, 0, 0]}
            name={item.category}
          />
        ))}
      </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ProductWastage;
