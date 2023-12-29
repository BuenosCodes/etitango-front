/* eslint-disable prettier/prettier */
import React, { useContext, useState } from 'react';
import { Grid, Box, List, ListItemButton, ListItemText, ListItemIcon, Collapse, ListItem, Icon } from '@mui/material';
import NewEvent from '../../../superAdmin/events/NewEvent'
import EventsList from 'modules/superAdmin/events/EventsList';
import UserHome from 'modules/user';
import Profile from 'modules/user/profile';
import Inscripcion from 'modules/inscripcion/Inscripcion';
import ComisionGeneroWho from 'modules/home/comision-de-genero/comisionGeneroWho';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HistoriaEti from 'modules/home/historia-del-ETI/HistoriaEti';
import ManifiestoETiano from 'modules/home/manifiesto-etiano/ManifistoEtiano';
import { isAdmin, isSuperAdmin } from 'helpers/firestore/users';
import { UserContext } from 'helpers/UserContext';
import ComisionGeneroContact from 'modules/home/comision-de-genero/ComisionGeneroContact';
import ComisionGeneroProtocol from 'modules/home/comision-de-genero/ComisionGeneroProtocol';

export default function UserPanel() {

  const { user } = useContext(UserContext)
  const eventId = 'new'
  const [activeComponent, setActiveComponent] = useState(<UserHome />);
  const [open, setOpen] = React.useState(false);
  const [openEtis, setOpenEtis] = React.useState(false);
  const [openLinks, setOpenLinks] = React.useState(false);
  const userIsAdmin = isAdmin(user)
  const userIsSuperAdmin = isSuperAdmin(user)
  const [selectedIndex, setSelectedIndex] = React.useState(0);


  const buttons = [
    { label: 'Inscripciones', component: <Inscripcion />, roles: ['admin', 'superAdmin'], icon: '/img/icon/taskSquare.svg' },
    { label: 'Mis Datos', component: <Profile />, roles: ['admin', 'superAdmin'], icon: '/img/icon/user.svg' },
    { label: 'Nuevo ETI', component: <NewEvent etiEventId={eventId} onChange={() => { setActiveComponent(<EventsList />) }} />, roles: ['superAdmin'], icon: '/img/icon/security-user.svg' },
  ];

  const nustrosLinks = [
    { label: 'Historia del ETI', component: <HistoriaEti /> },
    { label: 'Manifiesto', component: <ManifiestoETiano /> },
  ]

  const comisionGenero = [
    { label: 'Sobre Nosotres', component: <ComisionGeneroWho /> },
    { label: 'Protocolo de género', component: <ComisionGeneroProtocol /> },
    { label: 'Contacto', component: <ComisionGeneroContact /> },

  ]
  const Etis = [
    { label: 'Información general', component: <EventsList /> },
    { label: 'Presupuesto', component: <h1>Presupuesto</h1> },
    { label: 'Inscripciones', component: <Inscripcion /> },
    { label: 'Merchandising', component: <h1>Merchandansing</h1> },
    { label: 'Audio', component: <h1>Audio</h1> },
    { label: 'Asistencia', component: <h1>Asistencia</h1> },
  ]

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickEtis = () => {
    setOpenEtis(!openEtis);
  };

  const handleClickLinks = () => {
    setOpenLinks(!openLinks);
  };

  const handleButtonClick = (index: any) => {
    setActiveComponent(buttons[index].component);
  };

  const handleButtonClickComisionGenero = (index: any) => {
    setActiveComponent(comisionGenero[index].component);
  };

  const handleButtonClickNustrosLinks = (index: any) => {
    setActiveComponent(nustrosLinks[index].component);
  };

  const handleButtonClickEtis = (index: any) => {
    setActiveComponent(Etis[index].component);
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };


  const filteredButtons = buttons.filter(button => {
    if (userIsSuperAdmin) {
      // Si el usuario es superadmin, mostrar todos los botones
      return true;
    } else if (userIsAdmin) {
      // Si el usuario es admin, mostrar todos los botones excepto el de 'Nuevo ETI'
      return button.label !== 'Nuevo ETI';
    } else {
      // Si no es admin ni superadmin, asumir que es un usuario común y mostrar solo los botones de Inscripciones y Mis Datos
      return button.label === 'Inscripciones' || button.label === 'Mis Datos';
    }
  });

  const tipographyStyle = {
    fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', color: '#FAFAFA'
  }

  const itemButtonStyle = {
    borderBottomLeftRadius: '25px', borderTopLeftRadius: '25px', padding: '12px 0px 12px 12px', marginBottom: '10px', color: '#FAFAFA'
  }

  return (
    <>
      <Grid container>
        <Grid item xs={2} sx={{ backgroundColor: '#5FB4FC', padding: '30px 0px 20px 30px'}}>
          <List sx={{padding: '8px 0px 8px 15px', minHeight: '100vh'}}>
            {filteredButtons.map((button, index) => (

              <ListItemButton key={index} onClick={(event) => { handleButtonClick(index), handleListItemClick(event, index) }} selected={selectedIndex === index} sx={itemButtonStyle}>
                <ListItemIcon sx={{minWidth: '35px'}}>
                  <Icon>
                    <img src={button.icon} height={25} width={25} />
                  </Icon>
                </ListItemIcon>
                <ListItemText primary={button.label} primaryTypographyProps={tipographyStyle}/>
              </ListItemButton>

            ))}

            {(userIsAdmin || userIsSuperAdmin) && (<>
              <ListItemButton onClick={(event) => { handleClickEtis(), handleListItemClick(event, 4) }} selected={selectedIndex === 4} sx={itemButtonStyle}>
                <ListItemIcon sx={{minWidth: '35px'}}>
                  <Icon>
                    <img src={'/img/icon/security-user.svg'} height={25} width={25} />
                  </Icon>
                </ListItemIcon>
                <ListItemText primary="ETIs" primaryTypographyProps={tipographyStyle}/>
                {openEtis ? <ExpandLess /> : <ExpandMore sx={{marginRight: 1}}/>}
              </ListItemButton>
              <Collapse in={openEtis} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Etis.map((button, index) => (
                    <ListItem key={index}>
                      <ListItemButton onClick={() => handleButtonClickEtis(index)}>
                        <ListItemText primary={button.label} primaryTypographyProps={tipographyStyle}/>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
            )}


            <ListItemButton onClick={(event) => { handleClickLinks(), handleListItemClick(event, 5) }} selected={selectedIndex === 5} sx={itemButtonStyle}>
              <ListItemIcon sx={{minWidth: '35px'}}>
                <Icon>
                  <img src={'/img/icon/star.svg'} height={25} width={25} />
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Nuestros links" primaryTypographyProps={tipographyStyle}/>
              {open ? <ExpandLess /> : <ExpandMore sx={{marginRight: 1}}/>}
            </ListItemButton>
            <Collapse in={openLinks} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {nustrosLinks.map((button, index) => (
                  <ListItem key={index}>
                    <ListItemButton onClick={() => handleButtonClickNustrosLinks(index)}>
                      <ListItemText primary={button.label} primaryTypographyProps={tipographyStyle}/>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>



            <ListItemButton onClick={(event) => { handleClick(), handleListItemClick(event, 6) }} selected={selectedIndex === 6} sx={itemButtonStyle}>
              <ListItemIcon sx={{minWidth: '35px'}}>
                <Icon>
                  <img src={'/img/icon/heart.svg'} height={25} width={25} />
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Comisión de género" primaryTypographyProps={tipographyStyle}/>
              {open ? <ExpandLess /> : <ExpandMore sx={{marginRight: 1}}/>}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {comisionGenero.map((button, index) => (
                  <ListItem key={index}>
                    <ListItemButton onClick={() => handleButtonClickComisionGenero(index)}>
                      <ListItemText primary={button.label} primaryTypographyProps={tipographyStyle}/>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>



          </List>
        </Grid>

        <Grid item xs={10} sx={{ overflowY: 'scroll'}}>
          <Box sx={{display: 'flex',justifyContent: 'center',padding: 10}}>
            {activeComponent}
          </Box>
        </Grid>
      </Grid>
    </>
  );


}
