import React from 'react';
import { Grid, IconButton, SvgIcon, Typography, useTheme } from '@mui/material';


export default function CategoryNavIcon({ backgroundRule, fonWeightRule, iconColor, onClick, bottomText, svgComponent, svgViewBox, svgHeight, svgWidth }) {
    const theme = useTheme();



    return (
            <Grid item container xs={1} direction="column" alignItems="center">
                <Grid item>
                    <IconButton
                        onClick={onClick}
                        color={iconColor}
                        style={{
                            background:
                                backgroundRule,
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                            display: "flex", justifyContent: "center", alignItems: "center",
                            width: '57px', height: '57px'
                        }}
                    >
                        <SvgIcon component={svgComponent} viewBox={svgViewBox} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: svgHeight, width: svgWidth, alignSelf: 'center' }} />
                    </IconButton>
                </Grid>
                <Grid item style={{ marginTop: "8px" }}>
                    <Typography
                        variant="body2"
                        align="center"
                        style={{
                            fontWeight: fonWeightRule,
                        }}
                    >
                        {bottomText}
                    </Typography>
                </Grid>
            </Grid>
    )
}