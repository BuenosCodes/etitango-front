import * as React from 'react';
import { useEffect, useState } from 'react';
import Cronograma from './cronograma/Cronograma';
import { storage } from '../../etiFirebase.js';
import { getDownloadURL, ref } from 'firebase/storage';

function Index() {
  const [image, setImage] = useState();

  useEffect(() => {
    async function fetch() {
      const imageUrl = await getDownloadURL(ref(storage, `events/current.jpeg`));
      setImage(imageUrl);
    }

    fetch();
  }, []);

  return (
    <React.Fragment>
      {/*<Portada />*/}
      {image && <img src={image} alt="Uploaded" width="100%" height="100%" />}
      <Cronograma />
    </React.Fragment>
  );
}

export default Index;
