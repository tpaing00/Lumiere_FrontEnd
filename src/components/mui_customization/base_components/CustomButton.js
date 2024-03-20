import React from 'react';
import { Button, SvgIcon, useTheme } from '@mui/material';
import QuickScan from '../../../assets/icons/QuickScan.svg';

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
                {variant === 'floating' && <SvgIcon component={QuickScan} />}
                {text}
            </Button>

        </>
    )
}

