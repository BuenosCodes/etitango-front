import { createContext } from 'react';
import { EtiEvent } from '../shared/etiEvent';

export const EtiEventContext = createContext({
  context: {} as Partial<EtiEvent>,
  // eslint-disable-next-line no-unused-vars
  setEtiEvent: (etiEvent: EtiEvent) => {}
});
EtiEventContext.displayName = 'EtiEventContext';

export interface IEtiEventContext {
  user: EtiEvent;
  // eslint-disable-next-line no-unused-vars
  setEtiEvent: (etiEvent: EtiEvent) => void;
}
