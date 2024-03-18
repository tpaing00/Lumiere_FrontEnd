import React from 'react';
import { SvgIcon, useTheme, useMediaQuery, Typography } from '@mui/material';
import LogoMobile from '../../logo/LogoMobile';
import LogoDesktop from '../../logo/LogoMobile';

export default function Logo() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <>
            {/* {isMobile ? <SvgIcon component={LogoMobile} /> : <SvgIcon component={LogoDesktop} />} */}
            {isMobile ? <Typography>Mobile</Typography> : <Typography>desktop</Typography>}
            {/* <SvgIcon component={LogoMobile} /> */}
            <SvgIcon component={LogoDesktop} />
        </>
    );
}
