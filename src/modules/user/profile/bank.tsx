import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserData, UserRoles } from 'shared/User';
import * as firestoreBankHelper from 'helpers/firestore/banks';
import * as firestoreUserHelper from 'helpers/firestore/users';
import { useParams } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../../helpers/constants/i18n';
import Container from '@mui/material/Container';
import { EtiEventContext } from '../../../helpers/EtiEventContext';
import { Timestamp } from 'firebase/firestore';

const Bank = () => {
  const { id } = useParams();
  const { t } = useTranslation([SCOPES.COMMON.FORM], { useSuspense: false });
  // eslint-disable-next-line no-unused-vars
  const [bank, setBank] = useState<string>('');
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState<UserData | {}>({});
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        return;
      }
      const user = await firestoreUserHelper.getUser(id);
      console.log(user);
      if (user) setUser(user);
    };
    fetchData().catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        return;
      }
      const bank = await firestoreBankHelper.getBankForUser(id);
      console.log(bank);
      if (bank) setBank(bank.bank);
    };
    fetchData().catch((error) => console.error(error));
  }, []);

  function printEntry(entry: any): any {
    const [key, val]: [key: string, val: any] = entry;

    if (val instanceof Timestamp) {
      return (
        <Typography key={key}>
          {t(key)}: {val.toDate().toLocaleString()}
        </Typography>
      );
    }

    if (val instanceof Object)
      return (
        <Typography key={key}>
          {t(key)}: {Object.entries(val).map(printEntry)}
        </Typography>
      );

    return (
      <Typography key={key}>
        {t(key)}: {val.toString()}
      </Typography>
    );
  }

  return (
    <>
      <WithAuthentication roles={[UserRoles.ADMIN]} eventId={etiEvent?.id} />
      <Container maxWidth="xl" sx={{ marginTop: 6, display: 'flex', justifyItems: 'center' }}>
        <Paper sx={{ padding: 3 }}>
          <Typography variant={'h6'}>CBU/ALIAS: {bank}</Typography>
          {Object.entries(user).map(printEntry)}
        </Paper>
      </Container>
    </>
  );
};
export default Bank;
