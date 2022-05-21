import * as React from "react";
import AppFooter from "../../components/AppFooter";
import Portada from "./portada/Portada";
import Cronograma from "./cronograma/Cronograma";

import EtiAppBar from "../../components/EtiAppBar";

function Index() {
  return (
    <React.Fragment>
      <EtiAppBar />
      <Portada />
      <Cronograma />

      <AppFooter />

    </React.Fragment>
  );
}

export default Index;
