import React from 'react';
import { Box, Grid, SvgIcon, Typography, useTheme } from '@mui/material';
import Total from '../../assets/icons/Total.svg'
import Store from '../../assets/icons/Store.svg'
import NearlyExpired from '../../assets/icons/NearlyExpired.svg'
import Expired from '../../assets/icons/Expired.svg'
import HairCare from '../../assets/icons/HairCare.svg'
import MakeUp from '../../assets/icons/MakeUp.svg'
import SkinCare from '../../assets/icons/SkinCare.svg'
import BodyCare from '../../assets/icons/BodyCare.svg'

export default function DashOverviewPiece({ title, variant, resultsName, xsWidth, lgWidth }) {
    const theme = useTheme();

    let component = "";
    let design = "";
    let category = "";

    switch (variant) {
        case "retail":
            component = Total;
            design = "a";
            break;
        case "inStore":
            component = Store;
            design = "a";
            break;
        case "nearlyExpired":
            component = NearlyExpired;
            design = "a";
            break;
        case "expired":
            component = Expired;
            design = "a";
            break;
        case "hairCare":
            component = HairCare;
            design = "b";
            category = "Hair Care";
            break;
        case "makeUp":
            component = MakeUp;
            design = "b";
            category = "Make Up";
            break;
        case "skinCare":
            component = SkinCare;
            design = "b";
            category = "Skin Care";
            break;
        case "bodyCare":
            component = BodyCare;
            design = "b";
            category = "Body Care";
            break;
    }

    return (
        <>
            <Grid item xs={xsWidth} lg={lgWidth} sx={{ display: 'flex', padding: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SvgIcon component={component} sx={{ height: 31.5, width: 31.5, mr: '13.25px', ml: '5.25px' }} />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: '14px', m: 0, mb: '8px' }}>{title}</Typography>
                    <Typography sx={{ color: '#75500b', fontSize: '32px', fontFamily: 'Roboto Condensed', fontWeight: 'bold', m: 0, lineHeight: 1}} >
                        {design === "a" ? resultsName.toLocaleString() : (resultsName[category] ? resultsName[category].toLocaleString() : "")}
                    </Typography>
                </Box>
            </Grid>
        </>
    )
}