import React from 'react';
import { SvgIcon, useTheme, useMediaQuery } from '@mui/material';
import LogoDesktop from '../../assets/logo/LogoDesktop.svg';
import LogoMobile from '../../assets/logo/LogoMobile.svg';

export default function Logo() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    let width = "0px";
    let height = "0px";

    if (!isMobile) {
        width = "126px";
        height = "140.76px";
    } else {
        width = "100px";
        height = "100px";
    }

    return (
        <>
            {isMobile ? <SvgIcon component={LogoMobile} height={height} width={width} /> : <SvgIcon component={LogoDesktop} height={height} width={width} />}
        </>
    );
}

