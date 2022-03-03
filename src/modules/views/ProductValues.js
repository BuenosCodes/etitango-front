import * as React from "react";
import Button from "../components/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "../components/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import ListItemText from "@mui/material/ListItemText";

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));
const item = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
};

function ProductValues() {
  const [dense, setDense] = React.useState(false);

  return (
    <Box
      component="section"
      sx={{ display: "flex", overflow: "hidden", bgcolor: "secondary.light" }}
    >
      <Container sx={{ mt: 15, mb: 30, display: "flex", position: "relative" }}>
        <Box sx={{ pointerEvents: "none", position: "absolute", top: -180 }} />

        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box sx={{ height: 55 }}>
                <Typography variant="h6" sx={{ my: 5 }}>
                  Viernes 25 de marzo
                </Typography>
                <Typography variant="h5">Acreditación 10hs</Typography>
                <Typography variant="h5">
                  Almuerzo a la canasta 13 hs
                </Typography>
                <Typography variant="h5">Baile hasta las 16:45hs</Typography>
                <Typography variant="h5">
                  Asamblea desde las 17 hs hasta las 19 hs
                </Typography>
                <Typography variant="h5">
                  Milonga de Bienvenida “Tu remera favorita” desde 21 y 30hs a
                  4hs
                </Typography>
                <Typography variant="h5">After </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box sx={{ height: 55 }}>
                <Typography variant="h6" sx={{ my: 5 }}>
                  Sabado 26 de marzo
                </Typography>
                <Typography variant="h5">
                  Desayuno y almuerzo a la canasta
                </Typography>

                <Typography variant="h5">Baile hasta las 16:45hs</Typography>
                <Typography variant="h5">
                  Asamblea desde las 17 hs hasta las 19 hs
                </Typography>
                <Typography variant="h5">
                  Milonga de Gala desde 21 y 30hs a 4hs
                </Typography>
                <Typography variant="h5">After</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box sx={{ height: 55 }}>
                <Typography variant="h6" sx={{ my: 5 }}>
                  Domingo 27 de marzo
                </Typography>
                <Typography variant="h5">
                  Asado Milonguero, incluye comida, bebida , vegetarianos,
                  veganos
                </Typography>
                <Typography variant="h5">Cambio de bandera</Typography>
                <Typography variant="h5">
                  Milonga de despedida hasta las 0hs
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box>
              <Button
                color="secondary"
                variant="contained"
                size="large"
                component="a"
                href="/signup/"
                sx={item}
              >
                Registrate
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductValues;
