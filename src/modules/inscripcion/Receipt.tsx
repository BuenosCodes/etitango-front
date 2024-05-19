import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { getNextSignup, getSignup } from '../../helpers/firestore/receipt';
import { createOrUpdateDoc } from '../../helpers/firestore';
import { SIGNUPS } from '../../helpers/firestore/signups';
import { Signup, SignupStatus } from '../../shared/signup';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from 'App';
import { ReceiptDisplay } from '../../components/ReceiptDisplay';
import { UserRoles } from 'shared/User';
import WithAuthentication from 'modules/withAuthentication';
import { Unsubscribe } from 'firebase/firestore';

const ReceiptPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [signup, setSignup] = useState<Signup>();
  const { etiEventId, signupId } = useParams();
  useEffect(() => {
    let unsubscribe: Unsubscribe;

    const fetchData = async () => {
      if (signupId) {
        unsubscribe = await getSignup(setSignup, setIsLoading, signupId);
      } else {
        unsubscribe = await getNextSignup(setSignup, setIsLoading, etiEventId!);
      }
    };

    fetchData().catch((error) => {
      console.error(error);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [signupId]);

  const handleApprove = () => {
    createOrUpdateDoc(SIGNUPS, { status: SignupStatus.CONFIRMED }, signup?.id!)
      .then((r) => console.log(r))
      .catch((e) => console.error(e));
  };

  const handleFlag = () => {
    createOrUpdateDoc(SIGNUPS, { status: SignupStatus.FLAGGED }, signup?.id!);
  };

  const fields: { title: string; prop: keyof Signup }[] = [
    { title: 'nombre', prop: 'nameFirst' },
    { title: 'apellido', prop: 'nameLast' },
    { title: '# orden', prop: 'orderNumber' },
    { title: 'e-mail', prop: 'email' },
    { title: 'estado', prop: 'status' }
  ];

  // @ts-ignore
  return (
    <Container maxWidth="md" style={{ margin: '20px' }}>
      <WithAuthentication eventId={etiEventId} roles={[UserRoles.ADMIN]} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" color="secondary" align="center">
            Comprobante de pago
          </Typography>
          {signup?.receipt ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <ReceiptDisplay signup={signup} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {fields.map(({ title, prop }) => (
                    <TextField
                      label={title}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      key={title}
                      // @ts-ignore
                      value={signup ? signup[prop] : ''}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  ))}
                </div>
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`${ROUTES.RECEIPTS}/${etiEventId}`)}
                style={{ margin: '8px' }}
              >
                Próximo Comprobante
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleApprove}
                style={{ margin: '8px' }}
              >
                Aprobar Comprobante
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: 'orange', color: 'white', margin: '8px' }}
                onClick={handleFlag}
              >
                Rechazar Comprobante
              </Button>
            </>
          ) : (
            'No hay comprobantes pendientes'
          )}
        </>
      )}
    </Container>
  );
};

export default ReceiptPage;
