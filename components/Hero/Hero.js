import { Container, Box, Typography } from "@mui/material";
import PillButton from "../PillButton/PillButton";

import Image from "next/image";

const Hero = () => {
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          mx: 4,
          my: { xs: 4, sm: 18 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-around",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Box>
          <Typography
            variant="h1"
            fontFamily="Outfit"
            fontWeight={700}
            fontSize={54}
            maxWidth={450}
            lineHeight={1.1}
          >
            Discover And Collect Rare NFTs
          </Typography>
          <Typography fontSize={14} sx={{ pt: 2 }}>
            The most secure marketplace for buying and selling unique crypto
            assets.
          </Typography>
          <Box
            sx={{
              my: 6,
              display: "flex",
              gap: 2,
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <PillButton variant="contained" href="/create">
              Create
            </PillButton>
            <PillButton variant="outlined" href="/view">
              View
            </PillButton>
          </Box>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Image
            src="/imgs/hero-img.svg"
            alt="Hero Image"
            width={350}
            height={350}
            style={{ position: "relative", left: 50, top: -40 }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Hero;
