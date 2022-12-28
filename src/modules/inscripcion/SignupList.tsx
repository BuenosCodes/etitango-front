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
import { getSignups } from '../../helpers/firestore/signups';
import { Signup } from '../../shared/signup';
import { SignupListTable } from './SignupListTable';
import { UserContext } from '../../helpers/UserContext';
import AdminTools from './AdminTools';
import { SCOPES } from '../../helpers/constants/i18n';
import { UserRoles } from '../../shared/User';

const SignupList = () => {
  const { user } = useContext(UserContext);
  const [signups, setSignups] = useState([] as Signup[]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ props?: AlertProps; text?: string }>({});
  const { t } = useTranslation([SCOPES.MODULES.SIGN_UP_LIST, SCOPES.COMMON.FORM], {
    useSuspense: false
  });
  const isAdmin = () => {
    // @ts-ignore
    return user?.data?.roles && !!user?.data?.roles[UserRoles.ADMIN];
  };

  const fetchData = async () => {
    setIsLoading(true);
    const etiEvent = await getFutureEti();
    const signups = await getSignups(etiEvent.id);
    setSignups(signups);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <WithAuthentication />
      <Container maxWidth="xl" sx={{ marginTop: 6, display: 'flex' }}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography variant="h2" color="secondary" align="center">
              {t('title')}
            </Typography>
          </Grid>
          <Grid item>
            {alert.text && <Alert {...alert.props}>{alert.text}</Alert>}
            <TableContainer component={Paper}>
              {isAdmin() && (
                <AdminTools
                  signups={signups}
                  selectedRows={selectedRows}
                  setAlert={setAlert}
                  callback={fetchData}
                />
              )}
              <SignupListTable
                isAdmin={isAdmin()}
                signups={signups}
                setSelectedRows={setSelectedRows}
                isLoading={isLoading}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SignupList;
