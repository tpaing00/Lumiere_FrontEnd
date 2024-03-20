import React from 'react';
import { SvgIcon, useTheme, useMediaQuery, Typography } from '@mui/material';
import LogoMobile from './LogoMobile';
import LogoDesktop from './LogoDesktop';

export default function Logo() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <>
            {isMobile ? <SvgIcon component={LogoMobile} /> : <SvgIcon component={LogoDesktop} />}
        </>
    );
}
