import React from 'react';
import { SvgIcon, useTheme } from '@mui/material';

export default function Search() {
    const theme = useTheme();
    const color = theme.palette.environment.white;

    return (
        <>
            <SvgIcon sx={{
                height: { lg: '56px' },
            }} inheritViewBox >

                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" transform="translate(0.922852)" fill="white" />
                    <path d="M11.9828 18.12C15.882 18.12 19.0428 14.9591 19.0428 11.06C19.0428 7.16087 15.882 4 11.9828 4C8.08372 4 4.92285 7.16087 4.92285 11.06C4.92285 14.9591 8.08372 18.12 11.9828 18.12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.1631 16.2402L20.9231 20.0002" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

            </SvgIcon>
        </>
    )
}

