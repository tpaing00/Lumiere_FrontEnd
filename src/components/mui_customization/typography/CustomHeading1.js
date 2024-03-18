import React from 'react';
import { Typography, useTheme } from '@mui/material';

export default function CustomHeading1({ text }) {
    const theme = useTheme();

    return (
        <>
            <Typography
            variant='h1'
            component='h1'
            sx={{
                marginLeft: 0,
                textAlign: 'left'
            }}
            >
                {text}
            </Typography>
        </>
    )
}

