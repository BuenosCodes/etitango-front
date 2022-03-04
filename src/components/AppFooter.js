import * as React from "react";
import { Grid, Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";


export default function AppFooter() {
  return (
    <Grid container >
      <Grid item xs={12}>
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ bgcolor: "info.dark", paddingBottom: 5 }}
        >
          <Grid item>
            <Link href="http://facebook.com/groups/305562943758" target="_blank">
              <FacebookIcon sx={{ color: "white", fontSize: "56px" }} />
            </Link>
          </Grid>
          <Grid item variant="body1" sx={{ color: "white" }}>
            Foro Tanguero del Interior
          </Grid>
        </Grid>
      </Grid>
    </Grid>

  );
}
