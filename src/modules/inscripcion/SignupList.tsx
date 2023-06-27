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
import { getFutureEti } from '../../helpers/firestore/events';
import { getSignups, markAttendance } from '../../helpers/firestore/signups';
import { Signup } from '../../shared/signup';
import { SignupListTable } from './SignupListTable';
import { UserContext } from '../../helpers/UserContext';
import AdminTools from './AdminTools';
import { SCOPES } from '../../helpers/constants/i18n';
import { EtiEvent } from '../../shared/etiEvent';
import SignupSummary from './SignupSummary';
import { isAdmin } from '../../helpers/firestore/users';

const SignupList = (props: { isAttendance: boolean }) => {
  const { user } = useContext(UserContext);
  const [signups, setSignups] = useState([] as Signup[]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [etiEvent, setEtiEvent] = useState<EtiEvent>();
  const [alert, setAlert] = useState<{ props?: AlertProps; text?: string }>({});
  const { t } = useTranslation([SCOPES.MODULES.SIGN_UP_LIST, SCOPES.COMMON.FORM], {
    useSuspense: false
  });

  /** get etiEvent */
  useEffect(() => {
    const getEvent = async () => {
      const etiEvent = await getFutureEti();
      setEtiEvent(etiEvent);
    };

    getEvent();
  }, []);

  /** get signups */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (etiEvent?.id) {
        return getSignups(etiEvent.id, isAdmin(user), setSignups, setIsLoading);
      }
    };

    fetchData();
  }, [etiEvent]);

  // @ts-ignore
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
              {t('title')}
            </Typography>
          </Grid>
          <Grid item>
            {alert.text && <Alert {...alert.props}>{alert.text}</Alert>}
            {isAdmin(user) && (
              <AdminTools signups={signups} selectedRows={selectedRows} setAlert={setAlert} />
            )}
            <TableContainer component={Paper}>
              <SignupListTable
                isAdmin={isAdmin(user)}
                signups={signups}
                setSelectedRows={setSelectedRows}
                isLoading={isLoading}
                isAttendance={props.isAttendance}
                markAttendance={markAttendance}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SignupList;
