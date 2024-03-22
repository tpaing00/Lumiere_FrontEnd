import React from 'react';
import { CardContent, useTheme } from '@mui/material';

export default function CustomCardcontent({children}) {
    const theme = useTheme();

    return (
        <>
         <CardContent sx={{ pt: '12px', pr: '12px', pb: '12px', pl: '12px', display: 'flex' }}>
            {children}
         </CardContent>
        </>
    )
}