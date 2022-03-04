import * as React from "react";
import { Container, Grid, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

// function Copyright() {
//   return (
//     <React.Fragment>
//       {"© "}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{" "}
//       {new Date().getFullYear()}
//     </React.Fragment>
//   );
// }

// const iconStyle = {
//   width: 48,
//   height: 48,
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: "warning.main",
//   mr: 1,
//   "&:hover": {
//     bgcolor: "warning.dark",
//   },
// };

export default function AppFooter() {
  return (
    <Typography
      component="footer"
      sx={{ display: "flex", bgcolor: "info.dark" }}
    >
      <Container sx={{ my: 8, display: "flex" }}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              spacing={2}
              sx={{ height: 120 }}
            >
              <Grid>
                <FacebookIcon sx={{ color: "white" }} fontSize="large" />
              </Grid>
              <Grid variant="body1" gutterBottom sx={{ color: "white" }}>
                Foro Tanguero del Interior
              </Grid>
              {/* <Grid item>
                <Copyright />
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
