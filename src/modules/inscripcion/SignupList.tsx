import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertProps,
  Container,
  Grid,
  Paper,
  TableContainer,
  Typography
} from '@mui/material';

import WithAuthentication from '../withAuthentication';
import { getSignups, markAttendance } from '../../helpers/firestore/signups';
import { Signup, SignupStatus } from '../../shared/signup';
import { SignupListTable } from './SignupListTable';
import { UserContext } from '../../helpers/UserContext';
import AdminTools from './AdminTools';
import { SCOPES } from '../../helpers/constants/i18n';
import SignupSummary from './SignupSummary';
import { isAdmin, isAdminOfEvent, isSuperAdmin } from '../../helpers/firestore/users';
import { EtiEventContext } from '../../helpers/EtiEventContext';

const SignupList = (props: { isAttendance: boolean }) => {
  const { user } = useContext(UserContext);
  const [signups, setSignups] = useState([] as Signup[]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { etiEvent } = useContext(EtiEventContext);
  const [alert, setAlert] = useState<{ props?: AlertProps; text?: string }>({});
  const { t } = useTranslation([SCOPES.MODULES.SIGN_UP_LIST, SCOPES.COMMON.FORM], {
    useSuspense: false
  });

  /** get signups */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (etiEvent?.id) {
        return getSignups(etiEvent.id, isAdminOfEvent(user, etiEvent.id), setSignups, setIsLoading);
      }
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, [etiEvent]);

  return (
    <>
      <WithAuthentication />
      <Container maxWidth="xl" sx={{ marginTop: 3 }}>
        <Grid container direction="column" spacing={3}>
          {!props.isAttendance ? (
            <Grid item>
              <SignupSummary signups={signups} />
            </Grid>
          ) : null}
          <Grid item>
            <Typography variant="h5" color="secondary" align="center">
              {t(props.isAttendance ? 'attendanceTitle' : 'title')}
            </Typography>
          </Grid>
          <Grid item>
            {alert.text && <Alert {...alert.props}>{alert.text}</Alert>}
            {isAdminOfEvent(user, etiEvent?.id) && etiEvent?.capacity && (
              <AdminTools
                selectedRows={selectedRows}
                etiEventId={etiEvent?.id!}
                signups={signups}
                setAlert={setAlert}
                capacity={etiEvent?.capacity!}
              />
            )}
            <TableContainer component={Paper}>
              <SignupListTable
                setSelectedRows={setSelectedRows}
                isAdmin={isAdmin(user)}
                isSuperAdmin={isSuperAdmin(user)}
                etiEventId={etiEvent?.id!}
                signups={
                  props.isAttendance
                    ? signups.filter((s) => s.status === SignupStatus.CONFIRMED)
                    : signups
                }
                isLoading={isLoading}
                isAttendance={props.isAttendance}
                markAttendance={markAttendance}
                disabled={props.isAttendance && !isAdminOfEvent(user, etiEvent?.id)}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SignupList;
