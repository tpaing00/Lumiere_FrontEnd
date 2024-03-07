import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material/';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Link } from 'react-router-dom';

const NavBar = () => {

  return (
    <>
      <Box component='nav'>
        <List>
          <ListItem component={Link} to='/'>
            <ListItemButton>
              <ListItemIcon>
                <InboxOutlinedIcon />
              </ListItemIcon>
              <ListItemText secondary='Dashboard' />
            </ListItemButton>
          </ListItem>

          <ListItem component={Link} to='/inventory'>
            <ListItemButton>
              <ListItemIcon>
                <Inventory2OutlinedIcon />
              </ListItemIcon>
              <ListItemText secondary='Inventory' />
            </ListItemButton>
          </ListItem>

          <ListItem component={Link} to='/analytics'>
            <ListItemButton>
              <ListItemIcon>
                <InsertChartOutlinedIcon />
              </ListItemIcon>
              <ListItemText secondary='Analytics' />
            </ListItemButton>
          </ListItem>

          <ListItem component={Link} to='/add-product'>
            <ListItemButton>
              <ListItemIcon>
                <AddBoxOutlinedIcon />
              </ListItemIcon>
              <ListItemText secondary='Register Product' />
            </ListItemButton>
          </ListItem>

          <ListItem component={Link} to='/scanner'>
            <ListItemButton>
              <ListItemIcon>
                <CropFreeOutlinedIcon />
              </ListItemIcon>
              <ListItemText secondary='Quick Scan' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
    //     <nav>
    //     <ul>
    //         <li><Link to="/">Home</Link></li>
    //         <li><Link to="/inventory">Inventory</Link></li>
    //         <li><Link to="/add-product">Register product</Link></li>
    //         <li><Link to="/scanner">Quick Scan</Link></li>
    //     </ul>
    // </nav>  
  );

  // return (
  //   <>
  //     <Box component='nav'>
  //       <List>
  //         <ListItem component='a' href='http://lumiereapp.ca/'>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               <InboxOutlinedIcon />
  //             </ListItemIcon>
  //             <ListItemText secondary='Home' />
  //           </ListItemButton>
  //         </ListItem>

  //         <ListItem component='a' href='http://lumiereapp.ca/inventory'>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               <Inventory2OutlinedIcon />
  //             </ListItemIcon>
  //             <ListItemText secondary='Inventory' />
  //           </ListItemButton>
  //         </ListItem>

  //         <ListItem component='a' href='http://lumiereapp.ca/analytics'>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               <InsertChartOutlinedIcon />
  //             </ListItemIcon>
  //             <ListItemText secondary='Analytics' />
  //           </ListItemButton>
  //         </ListItem>

  //         <ListItem component='a' href='http://lumiereapp.ca/add-product'>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               <AddBoxOutlinedIcon />
  //             </ListItemIcon>
  //             <ListItemText secondary='Register Product' />
  //           </ListItemButton>
  //         </ListItem>

  //         <ListItem component='a' href='http://lumiereapp.ca/scanner'>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               <CropFreeOutlinedIcon />
  //             </ListItemIcon>
  //             <ListItemText secondary='Quick Scan' />
  //           </ListItemButton>
  //         </ListItem>
  //       </List>
  //     </Box>
  //   </>
  //   //     <nav>
  //   //     <ul>
  //   //         <li><Link to="/">Home</Link></li>
  //   //         <li><Link to="/inventory">Inventory</Link></li>
  //   //         <li><Link to="/add-product">Register product</Link></li>
  //   //         <li><Link to="/scanner">Quick Scan</Link></li>
  //   //     </ul>
  //   // </nav>  
  // );
};

export default NavBar;