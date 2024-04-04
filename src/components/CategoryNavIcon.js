import React from "react";
import {
  Box,
  Grid,
  IconButton,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";

export default function CategoryNavIcon({
  backgroundRule,
  fonWeightRule,
  iconColor,
  onClick,
  bottomText,
  svgComponent,
  svgViewBox,
  svgHeight,
  svgWidth,
}) {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={onClick}
          color={iconColor}
          style={{
            background: backgroundRule,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexBasis: "auto",
            height: { xs: "36px", lg: "57px" },
            flexGrow: 0,
          }}
        >
          <SvgIcon
            component={svgComponent}
            viewBox={svgViewBox}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: svgHeight,
              width: svgWidth,
              alignSelf: "center",
              flexGrow: 0,
              flexBasis: "auto",
            }}
          />
        </IconButton>

        <Typography
          variant="body2"
          align="center"
          style={{
            fontWeight: fonWeightRule,
            fontSize: { xs: "10px", lg: "14px" },
            marginTop: "8px",
            width: "100%",
          }}
        >
          {bottomText}
        </Typography>
      </Box>
    </>
  );
}
