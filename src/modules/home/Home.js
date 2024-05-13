import * as React from 'react';
import { useContext } from 'react';
import Cronograma from './cronograma/Cronograma';
import Portada from './portada/Portada';
import { EtiEventContext } from 'helpers/EtiEventContext';

function Index() {
  const { etiEvent } = useContext(EtiEventContext);

  return (
    <React.Fragment>
      <Portada />
      {etiEvent?.image && <img src={etiEvent.image} alt="Uploaded" width="100%" height="100%" />}
      <Cronograma />
    </React.Fragment>
  );
}

export default Index;
