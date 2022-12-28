import React from 'react';
import { Signup } from 'shared/signup';
import { Paper } from '@mui/material';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../helpers/constants/i18n';

type SignupField = keyof Signup;

export function SignupListTable(props: {
  signups: Signup[];
  isAdmin: boolean;
  // eslint-disable-next-line no-unused-vars
  setSelectedRows: (selection: string[]) => void;
  isLoading: boolean;
}) {
  const { signups, setSelectedRows, isAdmin, isLoading } = props;

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

  const getFields = () => (isAdmin ? [...publicFields, ...privateFields] : publicFields);

  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP_LIST], {
    useSuspense: false
  });
  const columns: GridColDef[] = getFields().map((fieldName) => ({
    field: fieldName,
    headerName: t(fieldName),
    width: fieldName === 'email' ? 300 : 150
  }));

  const getSignupValues = (signup: Signup) => {
    let output: any = { ...signup };
    const dateFields: (keyof Signup)[] = ['dateArrival', 'dateDeparture'];
    dateFields.forEach((field) => {
      if (signup[field]) {
        output[field] = (signup[field]! as Date).toLocaleDateString()!;
      }
    });
    const translatableFields: ('helpWith' | 'food' | 'status')[] = ['helpWith', 'food', 'status'];
    translatableFields.forEach((field) => {
      if (signup[field]) {
        output[field] = t(signup[field] as string);
      }
    });
    if (!signup.isCeliac) {
      delete output.isCeliac;
    } else {
      output.isCeliac = t('yes');
    }

    return output;
  };

  function selectionChanged(selection: GridSelectionModel) {
    setSelectedRows(selection.map((id) => id as string));
  }

  return (
    <>
      <Paper style={{ height: '100vh' }}>
        <DataGrid
          rows={signups.map(getSignupValues)}
          columns={columns}
          checkboxSelection={isAdmin}
          onSelectionModelChange={selectionChanged}
          loading={isLoading}
        />
      </Paper>
    </>
  );
}

// function getBackgroundColor(status?: SignupStatus) {
//   const colorYellow = 'rgba(255,242,0,0.5)';
//   const colorOrange = 'rgba(255,124,0,0.5)';
//   const colorRed = 'rgba(255,0,20,0.4)';
//   const colorBeige = '#ffe4c4';
//   const colorGreen = 'rgba(85,204,0,0.5)';
//   switch (status) {
//     case SignupStatus.CONFIRMED:
//       return colorGreen;
//     case SignupStatus.WAITLIST: // lista de espera
//       return colorBeige;
//     case SignupStatus.PAYMENT_PENDING: // Pendiente de Aprobación
//       return colorYellow;
//     case SignupStatus.CANCELLED: // Cancelado
//       return colorRed;
//     case SignupStatus.PAYMENT_DELAYED: //Pago demorado
//       return colorOrange;
//     default:
//       return 'white';
//   }
// }
