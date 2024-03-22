import React from 'react';
import { Grid, Typography, useTheme } from '@mui/material';

export default function DashInfoPiece({ text, type, resultsName }) {
    const theme = useTheme();

    return (
        <>
            <Grid item sx={{p: 0, paddingLeft: '24px'}} xs={12} lg={4}>
                <Grid container item sx={{borderLeft: `1px solid ${theme.palette.environment.neutral}`, padding:'12px', paddingLeft: '24px', display: {xs: 'inline-block', lg: 'block'}}}>
                    <Grid item xs={6} lg={12}>
                    <Typography
                        sx={{ color: theme.palette.text.body, fontSize: '14px', display: 'inline'}}
                    >
                        {text}
                    </Typography>
                    </Grid>
                    <Grid item xs={6} lg={12}>
                    <Typography
                        sx={{ color: '#75500b', fontSize: { xs: 24, lg: 32 }, fontFamily: 'Roboto Condensed', fontWeight: 'bold', display: 'inline' }}
                    >
                        {type === 'currency' ? `$${resultsName.toLocaleString()}` : resultsName.toLocaleString()}

                    </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

