import React, { useEffect, useState } from "react";
import axios from "axios";

import { makeStyles } from  '@mui/styles';
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';


const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    imageList: {
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
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
            <div className={classes.root} style={{ width: "80%", border:'5px solid purple' }}>
            <ImageList className={classes.imageList} cols={2.5} >
                {wasteProducts.map((product) => (
                <ImageListItem key={product._id} style={{ width: 'auto', height: '250px'}}>
                    <img style={{ width: '150px' }} src={product.photo[0]} alt={product.productName} />                
                </ImageListItem>
                ))}
            </ImageList>
            </div>        
      );
};

export default ProductWastage;
