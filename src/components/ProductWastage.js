import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from  '@mui/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';


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
      '&::-webkit-scrollbar': {
        display: 'none', // Hide the scrollbar
      },
    },
    image: {
      width: '150px', // Fixed width for images
      height: 'auto',
    }
  }));

const ProductWastage = () => {
    const [wasteProducts, setWasteProducts] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        const fetchWastageData = async () => {
          try {
            const response = await axios.get(
              "https://api.lumiereapp.ca/api/v1/wastetop5bycategory"
            );
            if (response.status === 200) {
                const products = response.data.flatMap(category => category.top5Waste);
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
            <div className={classes.root}>
            <ImageList className={classes.imageList} cols={wasteProducts.length} >
                {wasteProducts.map((product) => (
                <ImageListItem key={product._id} >
                    <img src={product.photo[0]} alt={product.productName} />                
                </ImageListItem>
                ))}
            </ImageList>
            </div>        
      );
};

export default ProductWastage;
