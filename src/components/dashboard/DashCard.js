import React from 'react';
import { Card, CardContent, Grid, Typography, useTheme} from '@mui/material';

export default function DashCard({ title, children }) {
    const theme = useTheme();

    return (
        <>
            <Grid item xs={12} lg={6} >
                <Card sx={{borderRadius: '16px'}}>
                    <CardContent sx={{ pt: '12px', pr: '12px', pb: '12px', pl: '12px', display: 'flex' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h2">{title}</Typography>
                            </Grid>
                            {children}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </>
    )
}

