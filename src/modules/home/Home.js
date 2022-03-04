import * as React from "react";
//import ProductCategories from "../views/ProductCategories";
// import ProductSmokingHero from "../views/ProductSmokingHero";
import AppFooter from "../views/AppFooter";
import ProductHero from "../views/ProductHero";
//import ProductValues from "../views/ProductValues";
import ProductHowItWorks from "../views/ProductHowItWorks";
// import ProductCTA from "../views/ProductCTA";

// import withRoot from "../../components/withRoot";
import AppAppBar from "../views/AppAppBar";

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      <ProductHero />
      <ProductHowItWorks />
      {/* <ProductValues /> */}
      {/* <ProductCategories /> */}
      <AppFooter />
      {/* <ProductCTA />
      <ProductSmokingHero /> */}
    </React.Fragment>
  );
}

export default Index;
