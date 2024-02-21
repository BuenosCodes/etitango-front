import React, { useEffect, useState } from 'react';
import { flat, getMailsForEvent } from 'helpers/firestore/mail';
import { Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams, useSearchParams } from 'react-router-dom';

const SentMailList = () => {
  const { id: eventId } = useParams();
  const [searchParams] = useSearchParams();
  const usermail = searchParams.get('usermail');

  // eslint-disable-next-line no-unused-vars
  const [mails, setMails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const fetchData = async () => {
      const emails = await getMailsForEvent(eventId!, usermail);
      setMails(flat(emails));
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, []);

  // const navigate = useNavigate();

  const columns: GridColDef[] = (Object.keys(mails?.[0] ?? {}) ?? []).map((fieldName) => ({
    field: fieldName,
    headerName: fieldName,
    width: 200
  }));

  return (
    <>
      <Paper style={{ height: '100vh', marginTop: 3 }}>
        <DataGrid rows={mails} columns={columns} loading={isLoading} />
      </Paper>
    </>
  );
};
export default SentMailList;
