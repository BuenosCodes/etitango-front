import { Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FileUploadOutlined } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import { NotificationContext } from '../helpers/NotificationContext';

interface Props {
  uploadFunction: Function;
  postUpload?: Function;
  notifications: {
    errorMsg: string;
    successMsg: string;
  };
}

function FileUpload({
  uploadFunction,
  postUpload,
  notifications: { errorMsg, successMsg }
}: Props) {
  const { setNotification } = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState(false);
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const fileUrl = await uploadFunction(file);
      postUpload && postUpload(fileUrl);
      setNotification(successMsg, { severity: 'info' });
    } catch (error) {
      console.error(error);
      setNotification(errorMsg, { severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid item>
      <LoadingButton variant="contained" color="secondary" component="label" loading={isLoading}>
        <FileUploadOutlined />
        <input
          style={{ display: 'none' }}
          type="file"
          hidden
          // @ts-ignore
          onChange={(e) => handleFileUpload(e.target.files[0])}
          accept="image/*, .pdf"
        />
      </LoadingButton>
    </Grid>
  );
}

export default FileUpload;
