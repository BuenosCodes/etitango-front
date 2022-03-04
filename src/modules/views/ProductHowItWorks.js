import * as React from "react";
import cronograma from "./../home/cronograma.json";

import {
  Box,
  List,
  Grid,
  Container,
  Button,
  Typography,
  ListItem,
  ListItemText,
} from "@mui/material";

const number = {
  fontSize: 24,
  fontFamily: "default",
  color: "secondary.main",
  fontWeight: "medium",
  paddingLeft: 2,
};

const ImgBackground = process.env.PUBLIC_URL + "/img/logo/eti-lomanegra.jpg";
function ProductHowItWorks() {
  return (
    <Box component="section" sx={{ display: "flex", overflow: "hidden" }}>
      <Container
        sx={{
          mt: 10,
          me: 10,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" marked="center" component="h2">
          Cronograma ETIano
        </Typography>
        <img src={ImgBackground} alt="logo" />
        <Grid container spacing={3}>
          {cronograma.dias.map((dia) => (
            <Grid itemxs={12} md={4}>
              <Box sx={number}>{dia.dia}</Box>

              <List>
                {dia.actividades.map((actividad) => (
                  <ListItem>
                    <ListItemText primary={actividad} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>

        <Button
          color="secondary"
          size="large"
          variant="contained"
          component="a"
          href="/inscripcion/"
          sx={{ my: 20 }}
        >
          Inscripción
        </Button>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;
