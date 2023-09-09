import React, { useState } from 'react';
import { Signup } from 'shared/signup';
import { Button, Checkbox, Paper } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterItem,
  GridRenderCellParams,
  GridSelectionModel
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../helpers/constants/i18n';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App';
import { SearchBar } from '../../components/searchBar/SearchBar';
import { intersection } from 'lodash';
import { Alert } from '../../components/alert/Alert';

export type SignupField = keyof Signup;

export function SignupListTable(props: {
  signups: Signup[];
  isAdmin: boolean;
  // eslint-disable-next-line no-unused-vars
  setSelectedRows: (selection: string[]) => void;
  isLoading: boolean;
  isAttendance: boolean;
  // eslint-disable-next-line no-unused-vars
  markAttendance: (signup: Signup) => void;
  disabled: boolean;
}) {
  const { signups, setSelectedRows, isAdmin, isLoading, isAttendance, markAttendance } = props;
  const navigate = useNavigate();
  const [filteredRows, setFilteredRows] = useState<GridFilterItem[]>([]);
  const [attendanceConfirmationAlertVisible, setAttendanceConfirmationAlertVisible] =
    useState<boolean>(false);
  const [attendanceConfirmationRow, setAttendanceConfirmationRow] = useState<Signup | null>(null);

  const filterRows = (value: string, columnField: string) => {
    setFilteredRows([
      {
        columnField,
        operatorValue: 'contains',
        value
      }
    ]);
  };

  const attendanceFields: SignupField[] = [
    'nameFirst',
    'nameLast',
    'dniNumber',
    'food',
    'isCeliac'
  ];

  const publicFields: SignupField[] = [
    'orderNumber',
    'nameFirst',
    'nameLast',
    'country',
    'province',
    'city',
    'status',
    'lastModifiedAt'
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

  const searchableFields: SignupField[] = [
    'nameFirst',
    'nameLast',
    'country',
    'province',
    'city',
    'status',
    'dniNumber'
  ];

  function getFields() {
    if (isAttendance) {
      return attendanceFields;
    }

    return isAdmin ? [...publicFields, ...privateFields] : publicFields;
  }

  function getFilterFields() {
    if (isAttendance) {
      return intersection(searchableFields, attendanceFields);
    }

    return isAdmin ? [...publicFields, ...privateFields] : publicFields;
  }

  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP_LIST], {
    useSuspense: false
  });
  const columns: GridColDef[] = getFields().map((fieldName) => ({
    field: fieldName,
    headerName: t(fieldName),
    width: fieldName === 'email' ? 300 : 150
  }));
  if (isAdmin && !isAttendance) {
    columns.push(
      {
        field: 'bank',
        headerName: 'Datos Bancarios',
        width: 200,
        renderCell: (params: GridRenderCellParams<String>) => (
          <strong>
            <Button
              variant="contained"
              size="small"
              style={{ marginLeft: 16 }}
              tabIndex={params.hasFocus ? 0 : -1}
              onClick={() => navigate(`${ROUTES.BANKS}/${params.row.userId}`)}
            >
              Ver Datos Bancarios
            </Button>
          </strong>
        )
      },
      {
        field: 'receipt',
        headerName: t('receipt'),
        width: 250,
        renderCell: (params: GridRenderCellParams<String>) => (
          <strong>
            <Button
              variant="contained"
              size="small"
              style={{ marginLeft: 16 }}
              tabIndex={params.hasFocus ? 0 : -1}
              href={params.row.receipt}
              disabled={!params.row.receipt}
            >
              {t('receiptButton')}
            </Button>
          </strong>
        )
      }
    );
  }
  if (isAttendance) {
    columns.push({
      field: 'didAttend',
      headerName: 'Presente',
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          checked={!!params.row.didAttend}
          disabled={!!params.row.didAttend || props.disabled}
          onChange={() => askForAttendanceConfirmation(params)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      )
    });
  }
  const getSignupValues = (signup: Signup) => {
    let output: any = { ...signup };
    const dateFields: (keyof Signup)[] = ['dateArrival', 'dateDeparture', 'lastModifiedAt'];
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

  const askForAttendanceConfirmation = (confirmationRowParams: GridRenderCellParams) => {
    setAttendanceConfirmationRow(confirmationRowParams.row);
    setAttendanceConfirmationAlertVisible(true);
  };

  const getFullName = (user: Signup | null) => (user ? `${user.nameFirst} ${user.nameLast}` : '');

  return (
    <>
      <Alert
        open={attendanceConfirmationAlertVisible}
        handleClose={() => {
          setAttendanceConfirmationAlertVisible(false);
          setAttendanceConfirmationRow(null);
        }}
        onClick={() => {
          setAttendanceConfirmationAlertVisible(false);
          if (attendanceConfirmationRow) {
            markAttendance(attendanceConfirmationRow);
            setAttendanceConfirmationRow(null);
          }
        }}
        buttonText={t('alert.confirm', { ns: SCOPES.MODULES.SIGN_UP_LIST }).toUpperCase()}
        title={t('alert.title', { ns: SCOPES.MODULES.SIGN_UP_LIST })}
        description={t('alert.description', {
          ns: SCOPES.MODULES.SIGN_UP_LIST,
          fullName: getFullName(attendanceConfirmationRow)
        })}
        cancelButtonText={t('alert.cancel', { ns: SCOPES.MODULES.SIGN_UP_LIST }).toUpperCase()}
      />
      <Paper style={{ height: '100vh', marginTop: 3 }}>
        <SearchBar setQuery={filterRows} fields={getFilterFields()} />
        <DataGrid
          rows={signups.map(getSignupValues)}
          columns={columns}
          checkboxSelection={isAdmin && !isAttendance}
          onSelectionModelChange={selectionChanged}
          loading={isLoading}
          filterModel={{ items: filteredRows }}
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
