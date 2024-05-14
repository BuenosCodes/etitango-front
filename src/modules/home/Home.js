import * as React from 'react';
import { useContext } from 'react';
import Portada from './portada/Portada';
import { EtiEventContext } from 'helpers/EtiEventContext';
import Cronograma from './cronograma/Cronograma.jsx';

function Index() {
  const { etiEvent } = useContext(EtiEventContext);

  return (
    <React.Fragment>
      <Portada />
      {etiEvent?.image && (
        <img src={etiEvent.image} alt="Proximmo ETI" width="100%" height="100%" />
      )}
      {etiEvent?.id && <Cronograma />}
    </React.Fragment>
  );
}

export default Index;
