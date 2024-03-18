import React from 'react';
import { Button, SvgIcon, useTheme } from '@mui/material';
import IconQuickScan from '../../icons/QuickScan';

export default function CustomButton({ variant, type, text, onClick }) {
    const theme = useTheme();

    return (
        <>
            <Button
                variant={variant}
                type={type}
                onClick={onClick}
                sx={{
                    height: { lg: '56px' },
                }}
            >
               {variant === 'floating' && <IconQuickScan />}
                {text}
            </Button>

        </>
    )
}

