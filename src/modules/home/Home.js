import * as React from "react";
import AppFooter from "../../components/AppFooter";
import Portada from "./portada/Portada";
import Cronograma from "./cronograma/Cronograma";

import AppAppBar from "../../components/AppAppBar";

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      <Portada />
      <Cronograma />

      <AppFooter />

    </React.Fragment>
  );
}

export default Index;
