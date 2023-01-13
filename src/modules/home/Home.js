import * as React from 'react';
import Portada from './portada/Portada';
import Cronograma from './cronograma/Cronograma';

function Index() {
  return (
    <React.Fragment>
      <Portada />
      <Cronograma />
    </React.Fragment>
  );
}

export default Index;
