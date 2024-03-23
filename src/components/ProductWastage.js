import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, CardContent, Typography, Box, Button, Grid, Avatar} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import * as XLSX from "xlsx";
import CategoryNav from "./CategoryNav";

const StyledImage = styled("img")({
  width: "200px",
  height: "200px",
  background: "white",
  borderRadius: "30px",
  objectFit: "cover",
  margin: '10px'
});

const ProductWastage = () => {
  const [wasteProducts, setWasteProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [totalStockQuantities, setTotalStockQuantities] = useState(null);
  const [totalWasteQuantities, setTotalWasteQuantities] = useState(null);
  const [xLabels, setXLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredWasteProducts, setFilteredWasteProducts] = useState([]);

  const ExportReport = () => {
    const handleExport = () => {
      // Combine the data into an array of objects
      const exportData = xLabels.map((label, index) => ({
        category: label,
        totalStockQuantity: totalStockQuantities[index],
        totalWasteQuantity: totalWasteQuantities[index],
      }));
    
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
    
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
    
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Waste Report');
    
      // Generate the XLSX file
      const fileData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
      // Convert the array buffer to a Blob
      const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'waste_report.xlsx';
    
      // Click the anchor to trigger the download
      document.body.appendChild(link);
      link.click();
    
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    };
    // const handleExport = () => {
    //   const wb = XLSX.utils.book_new();
    //   wb.SheetNames.push("Product Wastage");
    //   const wsData = [
    //     ["Category", "Total Stock Quantity", "Total Waste Quantity"],
    //     ...data.map(({ category, totalStockQuantity, totalWasteQuantity }) => [
    //       category,
    //       totalStockQuantity,
    //       totalWasteQuantity,
    //     ]),
    //   ];
    //   const ws = XLSX.utils.aoa_to_sheet(wsData);
    //   wb.Sheets["Product Wastage"] = ws;
    //   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    //   const filename = "product_wastage_report.xlsx";
    //   const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    //   saveAs(blob, filename);
    // };
  
    // const s2ab = (s) => {
    //   const buf = new ArrayBuffer(s.length);
    //   const view = new Uint8Array(buf);
    //   for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    //   return buf;
    // };
  
    // const saveAs = (blob, filename) => {
    //   const link = document.createElement("a");
    //   if (typeof link.download === "string") {
    //     document.body.appendChild(link);
    //     link.download = filename;
    //     link.href = URL.createObjectURL(blob);
    //     link.click();
    //     document.body.removeChild(link);
    //   } else {
    //     window.open(URL.createObjectURL(blob), "_blank");
    //   }
    // };
  
    return (
      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" onClick={handleExport}>
            Export Report
          </Button>
          </Box>
    );
  };

  useEffect(() => {
    setFilteredWasteProducts(wasteProducts.filter(product => product.category === selectedCategory));
  }, [selectedCategory, wasteProducts]);

  useEffect(() => {
    const fetchWastageData = async () => {
      try {
        const response = await axios.get(
          "https://api.lumiereapp.ca/api/v1/wastetop5bycategory"
        );
        if (response.status === 200) {
          const top5Waste = response.data.flatMap(
            (category) => category.top5Waste
          );
          setWasteProducts(top5Waste);
        } else {
          console.error("Failed to fetch data:", response.status);
        }

        const inventoryResponse = await axios.get(
          "https://api.lumiereapp.ca/api/v1/gettotalinventorybycategory"
        );
        const wasteResponse = await axios.get(
          "https://api.lumiereapp.ca/api/v1/wastetop5bycategory"
        );

        if (inventoryResponse.status === 200 && wasteResponse.status === 200) {
         
          // Combine inventory and wastage data
          const combinedData = wasteResponse.data.map((wasteItem) => {
            const correspondingInventoryItem = inventoryResponse.data.find(
              (inventoryItem) => wasteItem.category === inventoryItem._id
            );

            // Check if correspondingWasteItem exists and its category matches
            if (
              correspondingInventoryItem &&
              correspondingInventoryItem._id === wasteItem.category
            ) {
              return {
                category: correspondingInventoryItem._id,
                totalStockQuantity:
                  correspondingInventoryItem.totalStockQuantity,
                totalWasteQuantity: wasteItem.totalWasteQuantity,
              };
            }
          });

          const totalStockQuantities = combinedData.map(
            (item) => item.totalStockQuantity
          );
          const totalWasteQuantities = combinedData.map(
            (item) => item.totalWasteQuantity
          );
          const xLabels = combinedData.map((item) => item.category);
          const series = combinedData.flatMap((item) => [
            {
              type: "bar",
              data: [item.totalStockQuantity],
              label: `Total Product - ${item.category}`,
              stack: `total-${item.category}`,
            },
            {
              type: "bar",
              data: [item.totalWasteQuantity],
              label: `Wasted - ${item.category}`,
              stack: `total-${item.category}`,
            },
          ]);

          setInventory(combinedData);
          setTotalStockQuantities(totalStockQuantities);
          setTotalWasteQuantities(totalWasteQuantities);
          setXLabels(xLabels);
          setSeries(series);
          
        } else {
          console.error("Failed to fetch data:", inventoryResponse.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchWastageData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

const handleViewDetail = (inventoryId, barcodeNumber) => {
  navigate("/productdetail", {
    state: { inventoryId, barcodeNumber },
  });
};

  return (
    <>
      <Typography variant="h1">Product Wastage</Typography>
      <Box sx={{ width: "100%", mb: 10, }}>
        <Tabs variant="scrollable" scrollButtons="auto" value={0}>
          {wasteProducts.map((product, index) => (
            <Tab
              key={index}
              icon={
                <StyledImage src={product.photo[0]} alt={product.productName} />
              }
            />
          ))}
        </Tabs>
      </Box>
      <div style={{ marginTop: '30px', margin:'auto', backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px' }}>
      <Box sx={{ mb: 5, mt: -0}} >
            <CategoryNav
                handleCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
            />

      </Box>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          {selectedCategory === "All" && totalStockQuantities && totalWasteQuantities && xLabels && series && (
              <>
              <BarChart
                width={800}
                height={300}
                series={[
                  {
                    data: totalWasteQuantities,
                    label: "Wasted",
                    stack: "total",
                    color: "#AA230E",
                  },
                  {
                    data: totalStockQuantities,
                    label: "Total Product",
                    stack: "total",
                    color: "#CCCCCC",
                  },
                ]}
                yAxis={[{ data: xLabels, scaleType: "band" }]} // X-axis now takes the category labels
                layout="horizontal" // Setting layout to horizontal
                margin={{ top: 50, right: 30, left: 60, bottom: 20 }} // Adjusting margins
              />
               <ExportReport />
              </>
            )}
            {selectedCategory !== "All" && (
            <>
            <Typography variant="h5" gutterBottom>
                    Most 5 Wastage Products
                </Typography>
                <Grid container spacing={1} sx={{ justifyContent:"center" }}>
            {filteredWasteProducts.slice(0, 5).map((product, index) => { // Limit to first 5 products                
                   
                if (product) {
                    const inventoryId = inventory[product.barcodeNumber];

                    return (
                        <Grid key={index} item xs={12} sm={6} md={5} lg={5} >
                            <Card
                                onClick={() => handleViewDetail(inventoryId, product.barcodeNumber)}
                                style={{
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow
                                    cursor: 'pointer', 
                                    margin: '8px',
                                }}
                            >
                                <CardContent sx={{ display: 'flex' }}>
                                    <Avatar
                                        sx={{ width: 80, height: 80, marginRight: 2 }}
                                        alt={product.productName}
                                        src={product.photo[0]}
                                    />
                                    <div>
                                        <Typography gutterBottom variant="body1" component="div">
                                            {product.productName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {product.category}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Barcode Number: {product.barcodeNumber}
                                        </Typography>
                                        {/* Add more product info as needed */}
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                } else {
                    return null;
                }
            })}
        </Grid>
            </>
            )}
        </CardContent>
      </Card>
      </div>
      
    </>
  );
};

export default ProductWastage;
