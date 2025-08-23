import { createContext } from 'react';
import { EtiEvent } from '../shared/etiEvent';

export interface IEtiEventContext {
  etiEvent: EtiEvent | undefined;
  // eslint-disable-next-line no-unused-vars
  setEtiEvent: (etiEvent: EtiEvent) => void;
}

export const EtiEventContext = createContext<IEtiEventContext>({
  etiEvent: undefined,
  // eslint-disable-next-line no-unused-vars
  setEtiEvent: (etiEvent: EtiEvent) => {}
});
EtiEventContext.displayName = 'EtiEventContext';
