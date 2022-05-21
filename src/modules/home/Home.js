import * as React from "react";
import AppFooter from "../../components/AppFooter";
import Portada from "./portada/Portada";
// import Crongrama from "./cronograma/Cronograma";

import AppAppBar from "../../components/AppAppBar";

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      <Portada />
      {/*<Crongrama />*/}

      <AppFooter />

    </React.Fragment>
  );
}

export default Index;
