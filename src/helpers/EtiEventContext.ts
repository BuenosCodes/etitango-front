import { createContext } from 'react';
import { EtiEvent } from '../shared/etiEvent';

export const EtiEventContext = createContext({
  etiEvent: {} as EtiEvent,
  // eslint-disable-next-line no-unused-vars
  setEtiEvent: (etiEvent: EtiEvent) => {}
});
EtiEventContext.displayName = 'EtiEventContext';

export interface IEtiEventContext {
  etiEvent: EtiEvent;
  // eslint-disable-next-line no-unused-vars
  setEtiEvent: (etiEvent: EtiEvent) => void;
}
