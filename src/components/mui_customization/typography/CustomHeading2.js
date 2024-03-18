import React from 'react';
import { Typography, useTheme } from '@mui/material';

export default function CustomHeading2({ text }) {
    const theme = useTheme();

    return (
        <>
            <Typography
            variant='h2'
            component='h2'
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

