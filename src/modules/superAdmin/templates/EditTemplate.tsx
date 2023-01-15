import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createOrUpdateDoc } from '../../../helpers/firestore';
import { useParams } from 'react-router-dom';
import { getTemplate, Template } from '../../../helpers/firestore/templates';

const EditTemplate = () => {
  const [template, setTemplate] = useState<Partial<Template>>({ id: '', html: '', subject: '' });
  const { id } = useParams();
  const handleChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    return setTemplate((tmp) => ({ ...tmp, [fieldName]: event.target.value }));
  };

  const fetchData = async () => {
    if (id) {
      const template = await getTemplate(id!);
      setTemplate(template);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div>
      {<template className="subject"></template>}
      <TextField
        defaultValue={template?.id}
        onChange={handleChange('id')}
        multiline={true}
        fullWidth={true}
        label={'id'}
      />
      <TextField
        defaultValue={template?.subject}
        onChange={handleChange('subject')}
        multiline={true}
        fullWidth={true}
        label={'subject'}
      />
      <TextField
        defaultValue={template?.html}
        onChange={handleChange('html')}
        multiline={true}
        fullWidth={true}
        label={'html'}
      />
      <strong>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => createOrUpdateDoc('templates', template, id)}
        >
          update
        </Button>
      </strong>
    </div>
  );
};

export default EditTemplate;
