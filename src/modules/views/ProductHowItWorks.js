import * as React from "react";
import cronograma from "./../home/cronograma.json";

import {
  Box,
  List,
  Grid,
  Card,
  Container,
  Button,
  Typography,
  ListItem,
  ListItemText,
} from "@mui/material";

const item = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
};
const number = {
  fontSize: 24,
  fontFamily: "default",
  color: "secondary.main",
  fontWeight: "medium",
};

const ImgBackground = process.env.PUBLIC_URL + "/img/logo/eti-lomanegra.jpg";
function ProductHowItWorks() {
  return (
    <Box component="section" sx={{ display: "flex", overflow: "hidden" }}>
      <Container
        sx={{
          mt: 10,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
          Cronograma ETIano
        </Typography>
        <img
          src={ImgBackground}
          alt="logo"
          sx={{
            width: "100px",
            height: "100px",
          }}
        />
        {cronograma.dias.map((dia) => (
          <div>
            <Card sx={{ height: "100%" }}>
              <Box item xs={12} md={4}>
                <Grid sx={item}>
                  <Box sx={number}>{dia.dia}</Box>

                  <List>
                    {dia.actividades.map((actividad) => (
                      <ListItem>
                        <ListItemText primary={actividad} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Box>
            </Card>
          </div>
        ))}

        <Button
          color="secondary"
          size="large"
          variant="contained"
          component="a"
          href="/inscription/"
          sx={{ mt: 8 }}
        >
          Inscripción
        </Button>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;
