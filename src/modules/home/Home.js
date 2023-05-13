import * as React from 'react';
import Portada from './portada/Portada';
import Cronograma from './cronograma/Cronograma';

const ImgBackground = 'img/logo/eti-currentEvent.png';
function Index() {
  return (
    <React.Fragment>
      <Portada />
      <img src={ImgBackground} alt="logo" width="100%" height={'100%'} />
      <Cronograma />
    </React.Fragment>
  );
}

export default Index;
