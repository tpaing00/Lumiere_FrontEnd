import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIcon, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import DashboardSecondaryDark from '../../assets/icons/DashboardSecondaryDark.svg'
import InventorySecondaryDark from '../../assets/icons/InventorySecondaryDark.svg'
import AnalyticsSecondaryDark from '../../assets/icons/AnalyticsSecondaryDark.svg'
import DashboardActive from '../../assets/icons/DashboardActive.svg'
import InventoryActive from '../../assets/icons/InventoryActive.svg'
import AnalyticsActive from '../../assets/icons/AnalyticsActive.svg'

export default function CustomListItem({ variant, endpoint, isSelected, handleItemClick }) {
    const theme = useTheme();

    let text = "";
    switch (variant) {
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
                role="listitem"
                component={Link}
                to={endpoint}
                sx={{
                    p: '16px 30px',
                    m: 0,
                    borderLeft: isSelected ? '5px solid #75500b' : theme.palette,
                    color: isSelected ? '#75500b' : 'none',
                }}
                selected={isSelected}
                onClick={() => handleItemClick(variant)}
            >
                {variant === 'dashboard' && <SvgIcon component={isSelected ? DashboardActive : DashboardSecondaryDark} sx={{ mr: '8px' }} />}
                {variant === 'inventory' && <SvgIcon component={isSelected ? InventoryActive : InventorySecondaryDark} sx={{ mr: '8px' }} />}
                {variant === 'analytics' && <SvgIcon component={isSelected ? AnalyticsActive : AnalyticsSecondaryDark} sx={{ mr: '8px' }} />}
                <Typography sx={{
                    fontSize: '20px',
                    color: isSelected ? '#75500b' : theme.palette.secondary.dark,
                    p: 0
                }}
                >
                    {text}</Typography>

            </ListItem>
        </>
    )
}