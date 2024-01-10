/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { createOrUpdateDoc } from 'helpers/firestore';
import { ROUTES } from 'App';
import { getEvent } from 'helpers/firestore/events';
import { useNavigate, useParams } from 'react-router-dom';
import { EtiEvent } from 'shared/etiEvent';
//TimePicker
import { TimePicker } from '@mui/x-date-pickers';
import { Moment } from 'moment';
import { ETIDatePicker } from './form/DatePicker';
import moment from 'moment-timezone'

interface SimpleModalProps {
  idEvent: string;
  open: boolean;
  onClose: () => void;
}
interface TimePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
}

type FieldType = 'description' | 'time';

const ModalForm: React.FC<SimpleModalProps> = ({ open, onClose, idEvent }) => {

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const id = idEvent;
      values.additionalFields = additionalFields;
      const eventId = await createOrUpdateDoc('events', values, id);

      console.log('Datos enviados. ID del evento:', eventId);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const isValidId: RegExp = /^new$|^[\w\d]{20}$/;

        if (id === "new" || isValidId.test(id)) {
          try {
            const event = await getEvent(id);
            setEvent(event);
            setLoading(false);
          } catch (error) {
            console.error(error);
          }
        } else {
          navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
      }
    };

    fetchData();
  }, [id]);



  const [additionalFields, setAdditionalFields] = useState<{ description: string, time: string }[]>([
    { description: '', time: '' } // Inicializa con al menos una sección
  ]);

  useEffect(() => {
    console.log('Valor actual de additionalFields:', additionalFields);
  }, [additionalFields]);
  

  const handleDateTimeChange = (index: number, type: FieldType, value: string) => {
    const newFields = [...additionalFields];
    newFields[index][type] = value; // Almacena el valor directamente
    setAdditionalFields(newFields);
  };
  
  const handleDescriptionChange = (index: number, value: string) => {
    const newFields = [...additionalFields];
    newFields[index]['description'] = value;
    setAdditionalFields(newFields);
};


  const handleAddField = () => {

    setAdditionalFields([...additionalFields, { description: '', time: '' }]);

    // const newField = (
    //   <>
    //     <Grid item xs={3}>
    //       <Stack>
    //         <TimePickerField />
    //       </Stack>
    //     </Grid>
    //     <Grid item xs={9}>
    //       <Field
    //         name={`descripcionDeLaActividad_${additionalFields.length}`}
    //         label={''}
    //         component={TextField}
    //         required
    //         fullWidth
    //       />
    //     </Grid>
    //   </>
    // );

  };

  const handleDeleteField = () => {
    const newFields = [...additionalFields];
    newFields.pop();
    setAdditionalFields(newFields);
  };


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >


      <Box style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        flexDirection: 'column',
        width: '50%',
        display: 'flex',
      }}
      >
        <Formik
          enableReinitialize
          initialValues={{
            date: event?.dateStart || '',
            description: event?.description || '',
            additionalFields: [ ],
          }}
          // onSubmit={ (values, { setSubmitting }) => {
          //   console.log('values -> ', values);

          // }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h6' fontWeight="500">Fija la fecha de tu evento</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Field
                    component={ETIDatePicker}
                    label='Fecha'
                    fieldName='dateStart'
                    name='date'
                    setFieldValue={setFieldValue}
                    textFieldProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Field
                    label='Detalles breves del evento'
                    name="description"
                    component={TextField}
                    required
                    fullWidth
                    onChange={(e: { target: { value: any; }; }) => setFieldValue('description', e.target.value)}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant='h6' fontWeight="500">Define la agenda para este dia</Typography>
                </Grid>
                <Grid item xs={2} sx={{ justifyContent: 'flex-end' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant='contained'
                      style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
                      onClick={handleDeleteField}
                    >
                      <img src={'/img/icon/btnDelete.png'} alt="btnDelete" style={{ width: '100%', height: 'auto' }} />
                    </Button>
                    <Button
                      variant='contained'
                      style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
                      onClick={handleAddField}
                    >
                      <img src={'/img/icon/btnPlus.png'} alt="btnAdd" style={{ width: '100%', height: 'auto' }} />
                    </Button>
                  </Box>
                </Grid>
                {/* {additionalFields.map((field, index) => (
                  <React.Fragment key={index}>
                    {field}
                  </React.Fragment>
                ))} */}
                {additionalFields.map((field, index) => (
                  <>
                    <Grid item xs={3}>
                      <Stack>
                        <TimePickerField value={field.time} onChange={(value) => handleDateTimeChange(index, 'time', value)} />
                        {/* <ETITimePickerField value={field.time} onChange={(value) => handleDateTimeChange(index, 'time', value)}/> */}
                      </Stack>
                    </Grid>
                    <Grid item xs={9}>
                      <Field
                        name={`descripcionDeLaActividad_${index}`}
                        label={'Detalles de la actividad'}
                        component={TextField}
                        required
                        fullWidth
                        onChange={(event: { target: { value: string; }; }) => handleDescriptionChange(index, event.target.value)}
                      />
                    </Grid>
                  </>
                ))}
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    width: '115px',
                    height: '44px',
                    borderRadius: '25px',
                    gap: '8px',
                    color: 'white',
                    backgroundColor: '#A82548',
                  }}
                  type='submit'
                  disabled={isSubmitting}
                >
                  Guardar
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>

        {/* <Box
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px', // Espaciado superior para separar del contenido anterior
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: '115px',
              height: '44px',
              borderRadius: '25px',
              gap: '8px',
              color: 'white',
              backgroundColor: '#A82548',
            }}
            type='submit'
          >
            Guardar
          </Button> 
        </Box> */}
      </Box>
    </Modal>
  );
};

const TimePickerField: React.FC<TimePickerFieldProps> = ({ value, onChange }) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  useEffect(() => {
      if (value) {
          setSelectedTime(new Date(value));
      }
  }, [value]);

  const handleTimeChange = (newValue: Moment | null) => {
    if (newValue !== null) {
      const horaComoString = newValue.format('HH:mm A');
      console.log('hora como string ->', horaComoString);
      //setSelectedTime(newValue.toDate());
      onChange(horaComoString);
    }
  };

  return (
      <TimePicker
          label="Hora"
          renderInput={(params) => <TextField {...params} />}
          //value={selectedTime}
          value={value ? moment(value, 'HH:mm A') : null}
          onChange={handleTimeChange}
      />
  );
};

export default ModalForm;
