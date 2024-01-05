/* eslint-disable prettier/prettier */
import React, { useEffect, useState} from "react";
import { AppBar, Avatar, Box, Button, TextField, InputAdornment, Container, Link, Menu, Toolbar, Typography, MenuItem, Stack, Grid,} from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Formik, Field, Form } from 'formik';
import { date, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from "App";
import { getEvent } from "helpers/firestore/events";
import { EtiEvent } from "shared/etiEvent"; 
import { UserRoles } from "shared/User"; 
import { ETIDatePicker } from "./form/DatePicker";
import RolesList from "modules/superAdmin/roles/RolesList"; 
import { LocationPicker } from "./form/LocationPicker"; 
import { red } from "@mui/material/colors";
import { ForkLeft, Height, Margin, Padding } from "@mui/icons-material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';


export default function ETIPacks() {

  const EventFormSchema = object({

    dateStart: date().required('Este campo no puede estar vacío'),
    dateEnd: date().when('dateStart', (dateStart, schema) => (dateStart && schema.min(dateStart, "No puede ser menor a la fecha de inicio"))).required('Este campo no puede estar vacío'),
    dateSignupOpen: date().when('dateStart', (dateStart, schema) => (dateStart && schema.max(dateStart, "No puede ser mayor a la fecha de inicio"))).required('Este campo no puede estar vacío'),
    location: string().required('Este campo no puede estar vacío'),
    name: string().required('Este campo no puede estar vacío'),
    country: string().nullable(true).required('Este campo no puede estar vacío'),
    province: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required('Este campo no puede estar vacío')
      }),
    city: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required('Este campo no puede estar vacío')
      }),
  });

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

//   const save = async (values: any, setSubmitting: Function) => {
//   try {
//    if (id) {
//       const validateRuote: RegExp = /^[a-zA-Z0-9]{20,}$/; 
//       const idV : boolean = validateRuote.test(id);
//       await createOrUpdateDoc('events', values, id === 'new' ? undefined : idV);
//       navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
//     }
//   } catch (error) {
//     console.error(error);
//     setSubmitting(false);
//     
//    }
// };


  return (
  // Validate Formik
  <Formik
enableReinitialize
initialValues={{
  dateEnd: event?.dateEnd || '',
  dateSignupOpen: event?.dateSignupOpen || '',
  dateStart: event?.dateStart || '',
  location: event?.location || '',
  name: event?.name || '',
                    

}}
validationSchema={EventFormSchema}
onSubmit={async (values, { setSubmitting }) => {
await save(values, setSubmitting);
}}

  >
    <Form>
      <Box  style={{ overflowX: 'hidden'}}>
        <Grid 
container spacing={2} 
columns={16}
margin={2}
        
        >
          {/*border={'1px solid red'} */}
          <Grid item xs={12} marginBottom={'-10px'}>
            {/* Title */}
              <Typography variant="h3" fontSize={30}>Pack Promocional</Typography>
          </Grid>
          {/*border={'1px solid red'} */}
            <Grid item xs={12} marginBottom={'30px'}>
              {/* Containers */}
              <Field
                type="text"
                name="fieldName"
                as={TextField}
                placeholder='Detalla los productos del pack'
                style={{ border: '2px solid #FDE4AA ', width: '50%'}}
                // InputProps, startAdornment, endAdornment.... 
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                    <img src="/img/icon/Frame1932.png" alt="icon" />
                    </InputAdornment>
                        ),
                          }}
              />
            </Grid>
          {/* Title */}
          {/*border={'1px solid red'} */}
          <Grid item xs={12} marginBottom={'-10px'}>
            {/* Title */}
              <Typography variant="h6">Precio de preventa</Typography>
          </Grid>
          {/*border={'1px solid red'} */}
            <Grid item xs={12} marginBottom={'10px'}>
              {/* Containers */}
              <Field
                type="text"
                name="fieldName"
                as={TextField}
                placeholder='10000'
                style={{ border: '2px solid #FDE4AA', width: '10%'}}
                // InputProps, startAdornment, endAdornment.... 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    <img src="/img/icon/dollar-circle.png" alt="icon" />

                    </InputAdornment>
                        ),
                          }}
              />
              <Grid item xs={12}
              style={{
              marginLeft: '11%',
              marginTop: '-3%',
              }}
              
              >
                <Typography fontSize={20} marginTop={-6}>pagando hasta el</Typography>
              {/* Containers "Precio de preventa"*/}
              <Field
                type="text"
                name="fieldName"
                as={TextField}
                placeholder='30/02/2024'
                style={{ border: '2px solid #FDE4AA', width: '27%', marginLeft: '18%', marginTop: '-4.3%' }}
                // InputProps, startAdornment, endAdornment.... 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    <img src="/img/icon/calendar-remove.png" alt="icon" />
                    </InputAdornment>
                        ),

                  endAdornment: (
                    // Span problem https://webhint.io/docs/user-guide/hints/hint-no-inline-styles/ 
                    <InputAdornment position="end"style={{ marginRight: '10px'}}> 
                    <span style={{color: '#00000'}}>a las</span> 
                    <AccessTimeIcon style={{color: '#A82548', margin: '5px'}}/>
                    </InputAdornment>
                        ),
                  
                }}
              
              />
              </Grid>
            </Grid>
            {/*border={'1px solid red'} */}
          <Grid item xs={12} marginBottom={'-10px'}>
            {/* Title */}
              <Typography variant="h6">Precio de compra</Typography>
          </Grid>
          {/*border={'1px solid red'} */}
            <Grid item xs={12} marginBottom={'10px'}>
              {/* Containers */}
              <Field
                type="text"
                name="fieldName"
                as={TextField}
                placeholder='10000'
                style={{ border: '2px solid #FDE4AA', width: '10%'}}
                // InputProps, startAdornment, endAdornment.... 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    <img src="/img/icon/dollar-circle.png" alt="icon" />
                    </InputAdornment>
                        ),
                          }}
              />
            </Grid>
            {/*border={'1px solid red'} */}
          <Grid item xs={12} marginBottom={'-10px'}>
            {/* Title */}
              <Typography variant="h6">Fecha limite para devoluciones</Typography>
          </Grid>
          {/*border={'1px solid red'} */}
            <Grid item xs={12} marginBottom={'10px'}>
              {/* Containers */}
              <Field
                type="text"
                name="fieldName"
                as={TextField}
                placeholder='30/02/2024'
                style={{ border: '2px solid #FDE4AA', width: '20%'}}
                // InputProps, startAdornment, endAdornment.... 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    <img src="/img/icon/calendar-remove.png" alt="icon" />
                    </InputAdornment>
                        ),

                  endAdornment: (
                    // Span problem https://webhint.io/docs/user-guide/hints/hint-no-inline-styles/ 
                    <InputAdornment position="end"style={{ marginRight: '10px'}}> 
                    <span style={{color: '#00000'}}>a las</span> 
                    <AccessTimeIcon style={{color: '#A82548', margin: '5px'}}/>
                    <span style={{color: 'grey'}}>00:00</span> 
                    </InputAdornment>
                        ),
                  
                }}
              />
            </Grid>
            {/*border={'1px solid red'} */}
          <Grid item xs={12} marginBottom={'-10px'}>
            {/* Title */}
              <Typography variant="h6">Limite de participantes</Typography>
          </Grid>
          {/*border={'1px solid red'} */}
            <Grid item xs={12} marginBottom={'40px'}> 
              {/* Containers */}
              <Field
                type="text"
                name="fieldName"
                as={TextField}
                placeholder='50000'
                style={{ border: '2px solid #FDE4AA', width: '10%'}}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    <img src="/img/icon/people.png" alt="icon" />
                    </InputAdornment>
                        ),
                          }}
              />
            </Grid>   
            {/*border={'1px solid red'} */}
          <Grid item xs={12} style={{ marginBottom: '100px' }}>
            {/* Title */}
              <Typography variant="h3" fontSize={30}>Portada</Typography>
          </Grid>
          <Grid>
            {/* Button */}

            {/* Upload cover photo */}
              <Button
              variant="contained" 
              color="primary" 
              type="submit"
              style={{backgroundColor: '#A82548', 
              color: '#ffffff',
              marginLeft: '500px', 
              }}
              >
              Subir nueva portada
              </Button>
              {/* Delete cover photo */}
              <Button
              color="primary" 
              type="submit"
              style={{backgroundColor: '#ffffff', 
              color: '#A82548', 
              border: '1px solid #9E9E9E' }}
              >Eliminar
              </Button>

            {/* front page... Cloudinary? */}
          </Grid>
        </Grid>

      </Box>
    </Form>
    </Formik>

  );
}