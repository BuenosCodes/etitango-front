import React, { useContext, useState } from 'react';
import { AlertProps, Button, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

import { SCOPES } from 'helpers/constants/i18n';
import { Signup, SignupStatus } from '../../shared/signup';
import { CELIAC_CHOICES, getLabelForValue } from './inscripcion.constants';
import { advanceSignups, updateSignupsStatus } from '../../helpers/firestore/signups';
import { isSuperAdmin } from '../../helpers/firestore/users';
import { UserContext } from '../../helpers/UserContext';

const AdminTools = (props: {
  signups: Signup[];
  etiEventId: string;
  selectedRows: string[];
  capacity: number;
  // eslint-disable-next-line no-unused-vars
  setAlert: (alertProps: { props?: AlertProps; text?: string }) => void;
}) => {
  const { signups, selectedRows, etiEventId, setAlert } = props;
  const { user } = useContext(UserContext);
  const { t } = useTranslation([SCOPES.MODULES.SIGN_UP_LIST, SCOPES.COMMON.FORM], {
    useSuspense: false
  });

  const [selectedStatus, setSelectedStatus] = useState<SignupStatus>(SignupStatus.CONFIRMED);

  const exportableData =
    signups?.map((signUp) => ({
      ...signUp,
      dateArrival: signUp.dateArrival.toLocaleDateString(),
      dateDeparture: signUp.dateDeparture.toLocaleDateString(),
      lastModifiedAt: signUp.lastModifiedAt?.toLocaleDateString(),
      isCeliac: getLabelForValue(CELIAC_CHOICES, signUp.isCeliac),
      helpWith: t(signUp.helpWith),
      food: t(signUp.food),
      roles: null
    })) || [];

  const exportableDataHeaders = signups
    ?.map((signUp) => Object.keys(signUp))
    .reduce((previous, current) => previous.concat(current), [])
    .filter((column, index, array) => array.indexOf(column) === index);

  const today = new Date();
  const date = today.toLocaleDateString();

  function onSelectedStatusChange(event: SelectChangeEvent) {
    setSelectedStatus(event.target.value as SignupStatus);
  }

  async function callAdvanceSignups() {
    setAlert({
      props: { severity: 'warning' },
      text: 'Actualizando estados, quedate en la página'
    });
    await advanceSignups(etiEventId);
    setAlert({ props: { severity: 'success', onClose: () => setAlert({}) }, text: 'Listo!' });
  }

  async function saveNewStatus() {
    setAlert({
      props: { severity: 'warning' },
      text: 'Actualizando estados, quedate en la página'
    });
    await updateSignupsStatus(selectedStatus, selectedRows);
    setAlert({ props: { severity: 'success', onClose: () => setAlert({}) }, text: 'Listo!' });
  }

  // const signupsForWarning = signups.filter(
  //   (s) =>
  //     s.status &&
  //     [
  //       SignupStatus.PAYMENT_PENDING,
  //       SignupStatus.PAYMENT_TO_CONFIRM,
  //       SignupStatus.CONFIRMED
  //     ].includes(s.status!)
  // );
  return (
    <>
      {/*{signupsForWarning.length >= capacity && (*/}
      {/*  <Alert severity={'error'}>*/}
      {/*    <div style={{ background: 'maroon' }}>*/}
      {/*      <Typography variant={'h2'} color={'white'}>*/}
      {/*        La suma de Inscriptxs y Pendientes de Pago es mayor o igual a {capacity} (total:{' '}*/}
      {/*        {signupsForWarning.length})*/}
      {/*      </Typography>*/}
      {/*    </div>*/}
      {/*  </Alert>*/}
      {/*)}*/}
      <Grid item container direction="row" justifyContent="flex-end" alignItems="center">
        {isSuperAdmin(user) ? (
          <>
            <Select
              id="status"
              name="status"
              labelId="status-label"
              label={t('status')}
              onChange={onSelectedStatusChange}
              value={selectedStatus}
              SelectDisplayProps={{ style: { padding: '6px 32px', fontSize: 14 } }}
            >
              {Object.values(SignupStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {t(status)}
                </MenuItem>
              ))}
            </Select>
            <Button variant="contained" color="primary" onClick={saveNewStatus}>
              {t('changeStatus')}
            </Button>
          </>
        ) : null}

        <Button variant="contained" color="secondary" onClick={callAdvanceSignups}>
          {t('processSignups')}
        </Button>

        <CSVLink
          headers={exportableDataHeaders.map((header) => ({
            key: header,
            label: t(header, { ns: SCOPES.COMMON.FORM })
          }))}
          data={exportableData}
          filename={t('exportFilename', { date })}
        >
          <Button variant="contained" color="secondary" startIcon={<FileDownloadIcon />}>
            {t('export')}
          </Button>
        </CSVLink>
      </Grid>
    </>
  );
};

export default AdminTools;
