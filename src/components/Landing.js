import React, { useState } from 'react';
import { Box, Button, Grid, Link, List, ListItem, Typography, useTheme, IconButton, AppBar, Toolbar, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoMobile from "../assets/logo/lumiere-logo-mobile.svg";
import Hero from "../assets/features/hero.png";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
    const theme = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const renderNavbar = () => {
        const navItems = (
            <>
                <Typography component={Link} href="#features"
                    sx={{
                        color: theme.palette.secondary.dark,
                        fontSize: "24px",
                        fontWeight: "bold",
                        textDecoration: "none"
                    }}
                >
                    Features
                </Typography>
                <Typography component={Link} href="#team"
                    sx={{
                        color: theme.palette.secondary.dark,
                        fontSize: "24px",
                        fontWeight: "bold",
                        ml: "48px",
                        textDecoration: "none"
                    }}
                >
                    Team
                </Typography>
            </>
        );

        return (
            <>
                {isMobile ? (
                    <Box component="nav"
                        sx={{
                            backgroundColor: theme.palette.environment.background,
                            p: "16px",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box component={LogoMobile} sx={{ width: "100%", height: 24 }}></Box>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleMenuToggle}
                            edge="end"
                        >
                            {showMenu ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                        {showMenu && (
                            <List>
                                <ListItem
                                    role="listitem"
                                    component={Link}
                                    href="#features"
                                    onClick={handleMenuToggle}
                                    sx={{
                                        color: theme.palette.secondary.dark,
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Features
                                </ListItem>
                                <ListItem
                                    role="listitem"
                                    component={Link}
                                    href="#team"
                                    onClick={handleMenuToggle}
                                    sx={{
                                        color: theme.palette.secondary.dark,
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Team
                                </ListItem>
                            </List>
                        )}
                    </Box>
                ) : (
                    <AppBar position="static" sx={{
                        borderRadius: 0,
                        boxShadow: "none",
                        backgroundColor: theme.palette.environment.white,
                        p: "9px",
                    }}>
                        <Toolbar sx={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <Box component={LogoMobile} width="300px" height="32px"></Box>
                            <Box>{navItems}</Box>
                        </Toolbar>
                    </AppBar>
                )
                }
            </>
        )
    };


    return (
        <>
            {renderNavbar()}

            <Box className="landing_main" sx={{ p: "0 16px", maxWidth: "1100px", margin: "auto" }}>
                <Box id="hero" sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", lg: "row" },
                    justifyContent: "space-between",
                    padding: { xs: "40px 0", lg: "80px 0" },
                    width: { lg: "85%" },
                    margin: "auto",
                    borderBottom: "1px solid #dfdfdf"
                }}>
                    <Box id="left_section"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: { xs: "center", lg: "flex-start" },
                            flexWrap: "wrap",
                            justifyContent: "center",
                            width: { xs: "100%", lg: "40%" },
                            flexShrink: { lg: 0 },
                            pr: { lg: "3%" }
                        }}
                    >
                        <Typography variant="h1"
                            sx={{
                                align: "center",
                                flexShrink: "0",
                                width: "100%",
                                m: { xs: "24px 0 0 0", lg: 0 },
                                textAlign: { xs: "center", lg: "left" }
                            }}
                        >
                            Lighten Up Your Salon
                        </Typography>
                        <Typography variant="body1" align="center" flexShrink="0" width="100%"
                            sx={{
                                textAlign: { xs: "center", lg: "left" },
                                fontSize: { lg: "20px" },
                                fontWeight: 400,
                                margin: "auto",
                                width: { xs: "75%", lg: "100%" },
                                marginTop: { xs: "1rem", lg: "1.5vw" },
                                marginBottom: { xs: "2rem", lg: "2.5vw" },
                            }}
                        >
                            A web application that helps beauty salon businesses to streamline their inventory management process and reduce product wastage.
                        </Typography>

                        <Button variant="contained" href="/login"
                            sx={{
                                align: { xs: "center", lg: "left" },
                                fontWeight: 500,
                                height: "48px",
                                width: "35%",
                                borderRadius: "12px",
                                flexShrink: 0,
                                ml: { lg: 0 }
                            }}
                            onClick={navigate("/login")}
                        >
                            Visit Now
                        </Button>
                    </Box>
                    <img src={Hero} width="100%" maxWidth="840px" sx={{
                        width: { xs: "100%", lg: "60%" }
                    }} />
                </Box>

                <Box id="features" sx={{
                    borderBottom: "1px solid #dfdfdf",
                    padding: { xs: "40px 0", lg: "80px 0" },
                    width: { lg: "85%" },
                    margin: "auto"
                }}>
                    <Typography variant="h1" component="h2" className="highlight-container"
                        sx={{
                            textAlign: "center"
                        }}
                    >
                        Features
                    </Typography>
                    <Grid container spacing={2}>
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                title={feature.title}
                                image={feature.image}
                            />
                        ))}
                    </Grid>
                </Box>

                <Box id="team" sx={{
                    padding: { xs: "40px 0", lg: "80px 0" },
                    width: { lg: "85%" },
                    margin: "auto",
                }}>
                    <Typography variant="h1" component="h2"
                        sx={{
                            textAlign: "center"
                        }}
                    >
                        Team Zodiac</Typography>
                    <Grid container spacing={3}>
                        {teamMembers.map((member, index) => (
                            <TeamMember key={index} {...member} />
                        ))}
                    </Grid>
                </Box>
            </Box>
        </>
    );
}

const FeatureCard = ({ title, image }) => {
    const theme = useTheme();
    return (
        <Grid item xs={12} lg={6}>
            <Box className="card"
                sx={{
                    borderRadius: "20px",
                    backgroundColor: theme.palette.white.main,
                    padding: { xs: "4%", lg: "8%" },
                    marginBottom: "16px",
                    display: "flex",
                    gap: "8%",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Typography variant="body1"
                    sx={{
                        fontSize: { xs: "20px", lg: "24px" },
                        fontWeight: 600,
                        lineHeight: { lg: 1.3 }
                    }}
                >{title}</Typography>
                {/* <Box component={icon} sx={{ width: "100%", height: 24 }}></Box> */}
                <img src={image} alt={title} style={{ minHeight: "100px", width: "30vw", maxWidth: "160px" }} />
            </Box>
        </Grid>
    );
}

const TeamMember = ({ name, title, image, linkedin }) => {
    const theme = useTheme();
    return (
        <Grid item xs={6} lg={3}>
            <Box className="profile" >
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <img src={image} alt={`${name}'s portrait`} align="center"
                        style={{
                            width: "80%",
                            maxWidth: "200px",
                            align: "center",
                            flexShrink: 0
                        }} />
                </Box>
                <Typography component="p" className="name"
                    sx={{
                        textAlign: "center",
                        flexShrink: 0,
                        fontSize: "18px",
                        fontWeight: "bold",
                        m: "12px 0"
                    }}
                >
                    {name}
                </Typography>
                <Typography variant="body2" className="team_title"
                    sx={{
                        textAlign: "center",
                        flexShrink: 0,
                        fontSize: "16px",
                        m: "12px 0"
                    }}
                >
                    {title}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Link
                        href={linkedin}
                        target="_blank"
                        aria-label="Link to our LinkedIn"
                        sx={{
                            width: "36px",
                            height: "36px"
                        }}
                    >
                        <LinkedInIcon sx={{
                            color: theme.palette.secondary.dark,
                            fontSize: "36px",
                            align: "center"
                        }} />
                    </Link>
                </Box>
            </Box>
        </Grid>
    );
}

const teamMembers = [
    {
        name: 'Kim David Camaongay',
        title: 'PM, UI/UX Designer',
        image: require("../assets/team/kim.png").default,
        linkedin: 'https://linkedin.com/in/kim-david-camaongay'
    },
    {
        name: 'Cheuk Yan Li (Adrian)',
        title: 'UX Lead, UI/UX Designer',
        image: require("../assets/team/adrian.png").default,
        linkedin: 'https://linkedin.com/in/adrian-cheukyan-li'
    },
    {
        name: 'Natcha Phailbharamee (Nam)',
        title: 'UI Lead, UI/UX Designer',
        image: require("../assets/team/nam.png").default,
        linkedin: 'https://linkedin.com/in/nphaibharamee'
    },
    {
        name: 'Hong Ngoc Tran (Celine)',
        title: 'Product Designer',
        image: require("../assets/team/celine.png").default,
        linkedin: 'https://linkedin.com/in/hong-ngoc-tran'
    },
    {
        name: 'Harleen Kaur',
        title: 'Lead Back-end Developer',
        image: require("../assets/team/harleen.png").default,
        linkedin: 'https://linkedin.com/in/harleen-kaur'
    },
    {
        name: 'Tin Zar Paing',
        title: 'Full Stack Developer',
        image: require("../assets/team/paing.png").default,
        linkedin: 'https://linkedin.com/in/tin-zar-paing'
    },
    {
        name: 'Maria Beatriz Camargo (Bea)',
        title: 'Front-end Developer',
        image: require("../assets/team/bea.png").default,
        linkedin: 'https://www.linkedin.com/in/mbeatrizcamargo/'
    },
    {
        name: 'Greeshma Dharmapalan',
        title: 'Full Stack Developer',
        image: require("../assets/team/greeshma.png").default,
        linkedin: 'https://in.linkedin.com/in/greeshma-dharmapalan-016071108'
    }
];

const features = [
    {
        title: 'Barcode Scanning',
        image: require("../assets/features/scan.png").default,
    },
    {
        title: 'Product Analytics & Reporting',
        image: require("../assets/features/analytics.png").default,
    },
    {
        title: 'Expiration Tracking & Reminder',
        image: require("../assets/features/expiration.png").default,
    },
    {
        title: 'Low Stock Reminder',
        image: require("../assets/features/lowstock.png").default,
    }
];

export default Landing;
