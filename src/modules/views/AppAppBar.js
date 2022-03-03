import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import AppBar from "../components/AppBar";
import Toolbar from "../components/Toolbar";
import { Button, Avatar } from "@mui/material";
// import Link from 'react-router-dom'

function AppAppBar() {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar
          sx={{ justifyContent: "space-evenly", backgroundColor: "white" }}
        >
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <Avatar
              src="/img/icon/ETI_logo_1.png"
              alt="increase priority"
              sx={{
                width: "100px",
                height: "100px",
              }}
            />
          </Box>
          <Box
            sx={{ flex: 1, display: "flex", justifyContent: "space-between" }}
          >
            <Link
              variant="h6"
              underline="none"
              color="black"
              href="/"
              sx={{ fontSize: 14 }}
            >
              {"Historia del ETI"}
            </Link>
            <Link
              variant="h6"
              underline="none"
              color="black"
              href="/"
              sx={{ fontSize: 14 }}
            >
              {"Manifiesto ETIano"}
            </Link>
            {/* <Link
              CODIGO QUE SERVIRÁ PARA MAS ADELANTE
              variant="h6"
              underline="none"
              color="black"
              href="/"
              sx={{ fontSize: 12 }}
            >
              {"Comisión de Género"}
            </Link> */}
          </Box>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <Button
              color="secondary"
              variant="contained"
              underline="none"
              href="/inscription/"
              sx={{ fontSize: 12, align: "center" }}
            >
              {"iNSCRIPCIÓN "}
            </Button>
            {/*
              CODIGO QUE SERVIRÁ PARA MAS ADELANTE
            <Button
              variant="contained"
              underline="none"
              href="/signup/"
              sx={{ fontSize: 12, align: "center" }}
            >
              {"Crear Usuario"}
            </Button>
            */}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;
