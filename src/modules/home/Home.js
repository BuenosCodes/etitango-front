import * as React from "react";
import AppFooter from "../../components/AppFooter";
import Portada from "./portada/Portada";
import Cronograma from "./cronograma/Cronograma";


function Index() {
  return (
    <React.Fragment>
      <Portada />
      <Cronograma />

      <AppFooter />

    </React.Fragment>
  );
}

export default Index;
