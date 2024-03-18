import React from 'react';
import { SvgIcon, useTheme } from '@mui/material';

export default function IconQuickScan() {
    const theme = useTheme();
    const color = theme.palette.environment.white;

    return (
        <>
            <SvgIcon sx={{
                height: { lg: '56px' },
            }} inheritViewBox >

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.87">
                        <path d="M5 16H3V19C3 20.1 3.9 21 5 21H8V19H5V16Z" fill={color} />
                        <path d="M16 19V21H19C20.1 21 21 20.1 21 19V16H19V19H16Z" fill={color} />
                        <path d="M8 5V3H5C3.9 3 3 3.9 3 5V8H5V5H8Z" fill={color} />
                        <path d="M19 8H21V5C21 3.9 20.1 3 19 3H16V5H19V8Z" fill={color} />
                        <path d="M18 8H16V16H18V8Z" fill={color} />
                        <path d="M8 8H6V16H8V8Z" fill={color} />
                        <path d="M10 8H9V16H10V8Z" fill={color} />
                        <path d="M13 8H11V16H13V8Z" fill={color} />
                        <path d="M15 8H14V16H15V8Z" fill={color} />
                    </g>
                </svg>

            </SvgIcon>
        </>
    )
}

