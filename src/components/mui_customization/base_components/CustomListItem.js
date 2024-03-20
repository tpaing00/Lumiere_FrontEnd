import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIcon, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import QuickScan from '../../../assets/icons/QuickScan.svg'
import Dashboard from '../../../assets/icons/Dashboard.svg'
import Inventory from '../../../assets/icons/Inventory.svg'
import Analytics from '../../../assets/icons/Analytics.svg'

export default function CustomListItem({ variant, endpoint, onClick }) {
    const theme = useTheme();

    let text = "";
    switch (variant) {
        case "quickscan": text = "Quick Scan";
            break;
        case "dashboard": text = "Dashboard";
            break;
        case "inventory": text = "Inventory";
            break;
        case "analytics": text = "Analytics";
            break;
        default: text = "";
    }

    return (
        <>
            <ListItem
                aria-label={text}
                component={Link}
                to={endpoint}
            >
                <ListItemButton onClick={onClick}>
                    <ListItemIcon>
                        {variant === 'quickscan' && <SvgIcon component={QuickScan} />}
                        {variant === 'dashboard' && <SvgIcon component={Dashboard} />}
                        {variant === 'inventory' && <SvgIcon component={Inventory} />}
                        {variant === 'analytics' && <SvgIcon component={Analytics} />}
                    </ListItemIcon>
                    <ListItemText secondary={text} />
                </ListItemButton>
            </ListItem>
        </>
    )
}