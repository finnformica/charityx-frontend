import { useState, useEffect } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Container,
  Menu,
  MenuItem,
  Link,
} from "@mui/material";

import { FaHands } from "react-icons/fa";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import Image from "next/image";

import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

import { pages } from "../../constants/pages";

const Header = () => {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [connected, setConnected] = useState(false);

  const [anchorElNav, setAnchorElNav] = useState(null);

  const { activate, active, library: provider } = useWeb3React();
  const ethereum = new InjectedConnector();

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);

      window.ethereum.on("accountsChanged", function (accounts) {
        setConnected(false);
      });
    }
  }, []);

  async function connect() {
    try {
      await activate(ethereum);
      setConnected(true);
    } catch (e) {
      console.log(e);
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box>
      <AppBar
        position="static"
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              href="/"
              fontFamily="Outfit"
              fontWeight={700}
              sx={{
                mr: 2,
                display: { xs: "none", sm: "flex" },
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                justifyContent: "center",
              }}
            >
              {/* <FaHands size="1.8rem" style={{ marginRight: 10 }} /> */}
              <Image
                src="/imgs/blockchange-logo-white.svg"
                color="#FFF"
                alt="logo"
                width={30}
                height={30}
                style={{ marginRight: 10 }}
              />
              BlockChange
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu icon"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <HiOutlineMenuAlt1 />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", sm: "none" },
                }}
              >
                {["Home"].concat(pages).map((page) => (
                  <MenuItem
                    key={page}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href={page !== "Home" ? `/${page.toLowerCase()}` : "/"}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", sm: "none" },
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {/* <FaHands size="1.8rem" style={{ marginRight: 10 }} /> */}
              <Image
                src="/imgs/blockchange-logo-white.svg"
                color="#FFF"
                alt="logo"
                width={30}
                height={30}
                style={{ marginRight: 10 }}
              />
              BlockChange
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                  variant="a"
                  href={`/${page.toLowerCase()}`}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {hasMetamask ? (
                <Button
                  variant="contained"
                  color={connected ? "success" : "error"}
                  sx={{ display: { xs: "none", sm: "flex" }, flexGrow: 1 }}
                  startIcon={
                    <Image
                      src="/metamask.svg"
                      alt="Metamask Logo"
                      width={20}
                      height={20}
                    />
                  }
                  onClick={() => connect()}
                >
                  Connect{connected ? "ed" : ""}
                </Button>
              ) : (
                "Please install Metamask"
              )}

              {hasMetamask ? (
                <Button
                  variant="contained"
                  color={connected ? "success" : "error"}
                  sx={{ display: { xs: "flex", sm: "none" }, flexGrow: 1 }}
                  onClick={() => connect()}
                >
                  <Image
                    src="/metamask.svg"
                    alt="Metamask Logo"
                    width={20}
                    height={20}
                  />
                </Button>
              ) : (
                "Please install Metamask"
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
