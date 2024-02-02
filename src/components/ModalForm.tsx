/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { createOrUpdateDoc, getDocument } from 'helpers/firestore';
import { ROUTES } from 'App';
import { getEvent } from 'helpers/firestore/events';
import { useNavigate, useParams } from 'react-router-dom';
import { EtiEvent } from 'shared/etiEvent';
//TimePicker
import ETITimePicker2 from './ETITimePicker2';
import { TimePicker } from '@mui/x-date-pickers';
import { Moment } from 'moment';
import { ETIDatePicker } from './form/DatePicker';
import moment from 'moment-timezone';
import { makeStyles } from '@mui/styles';
import * as Yup from 'yup';

interface SimpleModalProps {
  idEvent: string;
  open: boolean;
  onClose: () => void;
  setAgendaData: (data: any[]) => void;
  setDataFromModalForm: (data: any[]) => void;
  setUpdatedEvent: any
}
interface TimePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
}

type FieldType = 'description' | 'time';

const ModalForm: React.FC<SimpleModalProps> = ({
  open,
  onClose,
  idEvent,
  eventData,
  setAgendaData,
  setDataFromModalForm,
  setUpdatedEvent
}) => {
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const id = idEvent;

      // Obtener la información existente del evento desde Firebase
      const existingEvent = await getDocument(`events/${id}`);
      const existingAgenda = existingEvent?.Agenda || [];
      console.log('existingAgenda :', existingAgenda)

      // Formatear la fecha en el formato dd/mm/aaaa
      const formattedDate = moment(values.date).format('DD/MM/YYYY');

      // Construir la nueva estructura de agenda con los datos del formulario
      const newAgendaItem = {
        date: formattedDate,
        description: values.description,
        schedule: additionalFields.map((field) => ({
          time: field.time,
          activity: field.description,
        })),
      };

      const updatedAgenda = [...existingAgenda, newAgendaItem];

      // Actualizar la información en Firebase
      const eventId = await createOrUpdateDoc('events', {
        ...existingEvent,
        Agenda: updatedAgenda,
      }, id);

      // Obtener el evento actualizado
      const updatedEvent = await getDocument(`events/${eventId}`);
      console.log('aganda? -> ', updatedEvent?.Agenda);
      

      // Actualizar los datos en el componente padre
      setAgendaData(updatedAgenda);
      setDataFromModalForm(updatedAgenda);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };
  // console.log('dateStart en el modal ', eventData?.dateStart);
  // console.log('endStart en el modal ', eventData?.dateEnd);

  let validationSchema: Yup.ObjectSchema<any> | undefined;
 
  if (eventData) {
    const dateStart = eventData?.dateStart ? new Date(eventData.dateStart) : null;
    const dateEnd = eventData?.dateEnd ? new Date(eventData.dateEnd) : null;

    // Definir el esquema de validación después de asegurarse de que eventData está definido
    validationSchema = Yup.object().shape({
      date: Yup.date()
        .required('La fecha es requerida')
        .min(dateStart, 'La fecha no puede ser anterior a la fecha de inicio del evento')
        .max(dateEnd, 'La fecha no puede ser posterior a la fecha de finalización del evento'),
    });
  }
  
  const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('');
  const { id } = useParams();
  const [timeValues, setTimeValues] = useState<string[]>(['']);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const isValidId: RegExp = /^new$|^[\w\d]{20}$/;

        if (id === 'new' || isValidId.test(id)) {
          try {
            const event = await getEvent(id);
            setEvent(event);
            setLoading(false);
          } catch (error) {
            console.error(error);
          }
        } else {
          //navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
      }
    };

    fetchData();
  }, [id]);

  const [additionalFields, setAdditionalFields] = useState<{ description: string; time: string }[]>(
    [{ description: '', time: '' }]
  );

  const handleDateTimeChange = (index: number, type: FieldType, value: string) => {
    const newFields = [...additionalFields];
    newFields[index][type] = value;
    setAdditionalFields(newFields);
  
    // Actualizar el estado de la hora específico para este campo
    const newTimeValues = [...timeValues];
    newTimeValues[index] = value;
    setTimeValues(newTimeValues);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newFields = [...additionalFields];
    newFields[index]['description'] = value;
    setAdditionalFields(newFields);
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { description: '', time: '' }]);
  };

  const handleDeleteField = () => {
    const newFields = [...additionalFields];
    newFields.pop();
    setAdditionalFields(newFields);
  };

  const handleChange = (event) => {
    const time = event.target.value;
    const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    if (isValidTime || time === '') {
      setValue(time);
    }
  };

  const handleBlur = (event) => {
    const time = event.target.value;
    const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    if (!isValidTime && time !== '') {
      console.log('Por favor, ingresa la hora en formato HH:MM');
      setValue('');
    }
  };
  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        margin: '2px 0px 0px 2px'
      },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        '& fieldset': {
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#FDE4AA'
        }
      }
    },
    filled: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#E68650'
        },
        '&:hover fieldset ': {
          borderColor: '#E68650'
        },
        '&.Mui-focused fieldset': {
          borderColor: '#E68650'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E68650'
        }
      }
    }
  });

  const classes = useStyles();

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
        flexDirection: 'column'
      }}
    >
      <Box
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          flexDirection: 'column',
          width: '800px',
          display: 'flex'
        }}
      >
        <Formik
          enableReinitialize
          initialValues={{
            date: event?.dateStart || '',
            description: event?.description || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Grid container spacing={2} sx={{ padding: '16px' }}>
                <Grid
                  container
                  sx={{ backgroundColor: '#FAFAFA', padding: '16px', borderRadius: '12px' }}
                >
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="500">
                      Fija la agenda para tu evento
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Field
                      component={ETIDatePicker}
                      label="Fecha"
                      fieldName="date"
                      name="date"
                      setFieldValue={setFieldValue}
                      textFieldProps={{
                        fullWidth: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Field
                      placeholder="Detalles breves del evento"
                      name="description"
                      component={TextField}
                      required
                      fullWidth
                      onChange={(e: { target: { value: any } }) =>
                        setFieldValue('description', e.target.value)
                      }
                      classes={{ root: values?.description ? classes.filled : classes.root }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{
                    backgroundColor: '#FAFAFA',
                    padding: '16px',
                    marginTop: '20px',
                    borderRadius: '12px 12px 0 0',
                    alignItems: 'center'
                  }}
                >
                  <Grid item xs={10}>
                    <Typography variant="h6" fontWeight="500">
                      Define la agenda para este dia
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ justifyContent: 'flex-end' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        style={{
                          background: 'transparent',
                          boxShadow: 'none',
                          border: 'none',
                          margin: 0
                        }}
                        onClick={handleDeleteField}
                      >
                        <img
                          src={'/img/icon/btnDelete.svg'}
                          alt="btnDelete"
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          background: 'transparent',
                          boxShadow: 'none',
                          border: 'none',
                          margin: 0
                        }}
                        onClick={handleAddField}
                      >
                        <img
                          src={'/img/icon/btnPlus.svg'}
                          alt="btnAdd"
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                {additionalFields.map((field, index) => (
                  <>
                    <Grid
                      container
                      sx={{
                        backgroundColor: '#FAFAFA',
                        padding: '16px',
                        borderRadius: '0 0 12px 12px'
                      }}
                    >
                      <Grid item xs={2}>
                        <ETITimePicker2
                          value={timeValues[index]}
                          onChange={(value) => {
                            handleDateTimeChange(index, 'time', value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <Field
                          name={`descripcionDeLaActividad_${index}`}
                          label={'Detalles de la actividad'}
                          component={TextField}
                          required
                          fullWidth
                          onChange={(event: { target: { value: string } }) =>
                            handleDescriptionChange(index, event.target.value)
                          }
                          classes={{
                            root: values[`descripcionDeLaActividad_${index}`]
                              ? classes.filled
                              : classes.root
                          }}
                        />
                      </Grid>
                    </Grid>
                  </>
                ))}
              </Grid>
              <Grid container justifyContent="flex-end">
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
                    marginLeft: 'auto'
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Guardar
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};
export default ModalForm;