import * as React from "react";
import EtiAppBar from '../../../components/EtiAppBar';
import { Typography, Box, Container } from '@mui/material';

const item = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
  height: "100vh",
 
};
function HistoriaEti() {
  return (
    <React.Fragment>
       <EtiAppBar />
   
      <Container >
        <Box sx={item} >

          <Typography variant="h4" align="center" component="h2" my="25px" >Origen del ETI</Typography>
         <Typography variant="body1" gutterBottom>
        El Encuentro Tanguero del Interior (ETI) se gestó durante el año 2009 cuando algunos  bailarines, docentes y profesionales del tango que se conocieron viajando y enseñando mantuvieron contacto a través de la red social Facebook (FB) y crearon a  principios del 2010 un grupo virtual  que se llamó “Foro Tanguero del Interior” (Foro).
Este grupo creció en contactos e intereses comunes  generándose de esta manera espontánea el primer encuentro en la ciudad de San Rafael, Mendoza, el 8 y 9 de mayo de 2010, como también la férrea voluntad de continuar haciendo el ETI  en distintas ciudades que se sumen a la iniciativa, concretándose aquella en el segundo encuentro en la ciudad de San Juan del 16 al 18 de julio de 2010.
         </Typography>
          <Typography variant="h4" align="center" component="h2" my="25px">Filosofia del ETI</Typography>
         <Typography variant="body1" gutterBottom>
         El ETI es un encuentro que convoca a los amantes del tango a viajar a distintas ciudades argentinas para conocer amigos, intercambiar experiencias y conocimientos relativos a la cultura del tango, disfrutar del baile y la amistad.
Los viajeros y anfitriones concurrentes comparten durante varios días actividades diversas tales como seminarios, prácticas, milongas, laboratorios, charlas-debate, ponencias  y otras que se propongan ya que el espíritu popular, democrático y pluralista del ETI lo promueve.
En el ETI tiene vocación pluralista porque no discrimina y se dirige a cualquiera que quiera participar, como anfitrión o viajero. La intención es integrar esa voluntad de disfrutar del tango, conociéndonos en los albergues, las milongas, reuniones, comidas y actividades de cada encuentro en distintas ciudades y participar, los que quieran, de las asambleas que eligen soberanamente las ciudades y a los organizadores de los encuentros, manteniendo el perfil y la esencia de estos encuentros.
         </Typography>
        
        </Box>
        
      </Container>
    </React.Fragment>
  );
}
export default HistoriaEti;
