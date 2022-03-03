import * as React from "react";

import Typography from "../components/Typography";
import ProductHeroLayout from "./ProductHeroLayout";

const ImgBackground = process.env.PUBLIC_URL + "/img/h/login-background.jpg";

export default function ProductHero() {
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${ImgBackground})`,
        backgroundColor: "#7fc7d9", // Average color of the background image.
        backgroundPosition: "center",
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: "none" }}
        src={ImgBackground}
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h4">
        ETI "La vuelta" 25, 26 y 27 de Marzo - Loma Negra
      </Typography>
      {/* <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        Despues de un parate... volvemos a las pistas!{" "}
      </Typography>

      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Toda esta experiencia vivida nos hizo crecer y renovarnos, por eso te
        esperamos en esta nueva edicion del ETI, para reir, bailar y abrazarnos
        a mas no poder.
      </Typography> */}
    </ProductHeroLayout>
  );
}
