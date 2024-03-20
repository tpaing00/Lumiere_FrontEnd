import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { category: "Hair Care", totalWasteQuantity: 58 },
  { category: "Skin Care", totalWasteQuantity: 3 },
];
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center", // Center the content horizontally
    overflowX: "auto", // Enable horizontal scrolling
    maxWidth: "100%", // Ensure the container doesn't overflow
  },
  imageList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
    width: "auto", // Ensuring images do not resize
    height: "350px",
    "&::-webkit-scrollbar": {
      display: "none", // Hide the scrollbar
    },
  },
  image: {
    width: "150px"
  }
  
}));

const ProductWastage = () => {
  const [wasteProducts, setWasteProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const classes = useStyles();
//   /gettotalinventorybycategory

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
      <div className={classes.root}>
        <ImageList className={classes.imageList} cols={wasteProducts.length}>
          {wasteProducts.map((product) => (
            <ImageListItem key={product._id}>
              <img src={product.photo[0]} alt={product.productName} />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
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
