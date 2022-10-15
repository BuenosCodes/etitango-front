import React, { useContext } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Translation } from 'react-i18next';

import { Signup, SignupStatus } from 'shared/signup';
import { SCOPES } from 'helpers/constants/i18n';
import { UserContext } from '../../helpers/UserContext';
import { UserRoles } from 'shared/User';

type SignupField = keyof Signup;

export function SignupListTable(props: { signups: Signup[] }) {
  const { user } = useContext(UserContext);
  const { signups } = props;
  const publicFields: SignupField[] = [
    'nameFirst',
    'nameLast',
    'country',
    'province',
    'city',
    'status'
  ];
  const privateFields: SignupField[] = [
    'dateArrival',
    'dateDeparture',
    'email',
    'dniNumber',
    'helpWith',
    'food',
    'isCeliac'
  ];

  function getSignupElement(signup: Signup, fieldName: SignupField) {
    const value = signup[fieldName];
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return value;
  }

  const getFields = () => {
    // @ts-ignore
    const isAdmin = user?.data?.roles && !!user?.data?.roles[UserRoles.ADMIN];
    return isAdmin ? [...publicFields, ...privateFields] : publicFields;
  };

  return (
    <Translation ns={[SCOPES.MODULES.SIGN_UP_LIST, SCOPES.COMMON.FORM]} useSuspense={false}>
      {(t) => (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {getFields().map((fieldName) => (
                <TableCell key={fieldName}>{t(fieldName)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {signups.map((signup) => (
              <TableRow
                key={signup.nameFirst}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                style={{ background: getBackgroundColor(signup.status) }}
              >
                {getFields().map((fieldName) => (
                  <TableCell key={fieldName}>{getSignupElement(signup, fieldName)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Translation>
  );
}

function getBackgroundColor(status?: SignupStatus) {
  const colorYellow = 'rgba(255,242,0,0.5)';
  const colorOrange = 'rgba(255,124,0,0.5)';
  const colorRed = 'rgba(255,0,20,0.4)';
  const colorBeige = '#ffe4c4';
  const colorGreen = 'rgba(85,204,0,0.5)';
  switch (status) {
    case SignupStatus.CONFIRMED:
      return colorGreen;
    case SignupStatus.WAITLIST: // lista de espera
      return colorBeige;
    case SignupStatus.PAYMENT_PENDING: // Pendiente de Aprobación
      return colorYellow;
    case SignupStatus.CANCELLED: // Cancelado
      return colorRed;
    case SignupStatus.PAYMENT_DELAYED: //Pago demorado
      return colorOrange;
    default:
      return 'white';
  }
}
