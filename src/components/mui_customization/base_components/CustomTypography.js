import React from 'react';
import { Typography, useTheme } from '@mui/material';

export default function CustomTypography({ text, variant }) {
    const theme = useTheme();

    return (
        <>
            <Typography
            variant={variant}
            component={variant}
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

