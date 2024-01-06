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
  const [etis, setEtis] = React.useState(4);
  const [nuestrosLinks, setNuestrosLinks] = React.useState(5);
  const [comision, setComision] = React.useState(6);

  const buttons = [
    { label: 'Inscripciones', component: <Inscripcion />, roles: ['admin', 'superAdmin'], icon: '/img/icon/taskSquare.svg', startIndex: 1 },
    { label: 'Mis Datos', component: <Profile />, roles: ['admin', 'superAdmin'], icon: '/img/icon/user.svg', startIndex: 2 },
    { label: 'Nuevo ETI', component: <NewEvent etiEventId={eventId} onChange={() => { setActiveComponent(<EventsList />); handleListItemClick(12); openEtis ? null : handleClickEtis() }} />, roles: ['superAdmin'], icon: '/img/icon/security-user.svg', startIndex: 3 },
  ];

  const nustrosLinks = [
    { label: 'Historia del ETI', component: <HistoriaEti />, startIndex: 7 },
    { label: 'Manifiesto', component: <ManifiestoETiano />, startIndex: 8 },
  ]

  const comisionGenero = [
    { label: 'Sobre Nosotres', component: <ComisionGeneroWho />, startIndex: 9 },
    { label: 'Protocolo de género', component: <ComisionGeneroProtocol />, startIndex: 10 },
    { label: 'Contacto', component: <ComisionGeneroContact />, startIndex: 11 },

  ]
  const Etis = [
    { label: 'Información general', component: <EventsList />, startIndex: 12 },
    { label: 'Presupuesto', component: <h1>Presupuesto</h1>, startIndex: 13 },
    { label: 'Inscripciones', component: <Inscripcion />, startIndex: 14 },
    { label: 'Merchandising', component: <h1>Merchandansing</h1>, startIndex: 15 },
    { label: 'Audio', component: <h1>Audio</h1>, startIndex: 16 },
    { label: 'Asistencia', component: <h1>Asistencia</h1>, startIndex: 17 },
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

  // const handleButtonClickComisionGenero = (index: any) => {
  //   setActiveComponent(comisionGenero[index].component);
  // };

  // const handleButtonClickNustrosLinks = (index: any) => {
  //   setActiveComponent(nustrosLinks[index].component);
  // };

  // const handleButtonClickEtis = (index: any) => {
  //   setActiveComponent(Etis[index].component);
  // };

  const handleListItemClick = (
    index: any,
  ) => {
    if (index === 7) {
      setNuestrosLinks(index)
      setActiveComponent(nustrosLinks[0].component);

    }
    if (index === 8) {
      setNuestrosLinks(index)
      setActiveComponent(nustrosLinks[1].component);

    }
    if (index === 9) {
      setComision(index)
      setActiveComponent(comisionGenero[0].component);

    }
    if (index === 10) {
      setComision(index)
      setActiveComponent(comisionGenero[1].component);

    }
    if (index === 11) {
      setComision(index)
      setActiveComponent(comisionGenero[2].component);

    }
    if (index === 12) {
      setEtis(index)
      setActiveComponent(Etis[0].component);

    }
    if (index === 13) {
      setEtis(index)
      setActiveComponent(Etis[1].component);

    }
    if (index === 14) {
      setEtis(index)
      setActiveComponent(Etis[2].component);

    }
    if (index === 15) {
      setEtis(index)
      setActiveComponent(Etis[3].component);

    }
    if (index === 16) {
      setEtis(index)
      setActiveComponent(Etis[4].component);

    }
    if (index === 17) {
      setEtis(index)
      setActiveComponent(Etis[5].component);

    }
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

  const itemButtonStyle = {
    borderBottomLeftRadius: '25px', borderTopLeftRadius: '25px', padding: '12px 0px 12px 12px', marginBottom: '10px', color: '#FAFAFA'
  }

  const itemButtonStyle2 = {
    borderRadius: '100px', padding: '6px 16px 6px 16px', marginBottom: '10px', color: '#FAFAFA'
  }

  const itemButtonHoverStyle = {
    backgroundColor: '#FFFBF0',
    color: '#212121',
  };

  const itemButtonActiveStyle = {
    backgroundColor: '#FFFBF0',
    color: '#212121',
    '& .MuiListItemIcon-root img': {
      filter: 'saturate(0) hue-rotate(90deg) brightness(0)'
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={2} sx={{ backgroundColor: '#5FB4FC', padding: '30px 0px 20px 30px' }}>
          <List sx={{ padding: '8px 0px 8px 15px', minHeight: '100vh' }}>
            {filteredButtons.map((button, index) => (
              <ListItemButton key={index} onClick={() => { handleButtonClick(index), handleListItemClick(button.startIndex) }} sx={{
                ...itemButtonStyle,
                ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                ':hover': {
                  ...itemButtonHoverStyle,
                  '& .MuiListItemIcon-root img': {
                    filter: 'saturate(0) hue-rotate(90deg) brightness(0)',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#212121',
                  },
                },
              }}
              >
                <ListItemIcon sx={{ minWidth: '35px' }}>
                  <Icon>
                    <img src={button.icon} height={25} width={25} />
                  </Icon>
                </ListItemIcon>
                <ListItemText primary={button.label} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === button.startIndex && { color: '#212121' }) }} />
              </ListItemButton>
            ))}

            {(userIsAdmin || userIsSuperAdmin) && (<>
              <ListItemButton onClick={() => { handleClickEtis(), handleListItemClick(etis) }} sx={{
                ...itemButtonStyle,
                ...(selectedIndex === etis && itemButtonActiveStyle),
                ':hover': {
                  ...itemButtonHoverStyle,
                  '& .MuiListItemIcon-root img': {
                    filter: 'saturate(0) hue-rotate(90deg) brightness(0)',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#212121',
                  },
                },
              }}
              >
                <ListItemIcon sx={{ minWidth: '35px' }}>
                  <Icon>
                    <img src={'/img/icon/security-user.svg'} height={25} width={25} />
                  </Icon>
                </ListItemIcon>
                <ListItemText primary="ETIs" primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === etis && { color: '#212121' }) }} />
                {openEtis ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
              </ListItemButton>
              <Collapse in={openEtis} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Etis.map((button, index) => (
                    <ListItem key={index}>
                      <ListItemButton onClick={() => { handleListItemClick(button.startIndex) }} sx={{
                        ...itemButtonStyle2,
                        ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                        ':hover': {
                          ...itemButtonHoverStyle,
                          '& .MuiListItemIcon-root img': {
                            filter: 'saturate(0) hue-rotate(90deg) brightness(0)',
                          },
                          '& .MuiListItemText-primary': {
                            color: '#212121',
                          },
                        },
                      }}
                      >
                        <ListItemText primary={button.label} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 500, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === button.startIndex && { color: '#212121' }) }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
            )}


            <ListItemButton onClick={() => { handleClickLinks(), handleListItemClick(nuestrosLinks) }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === nuestrosLinks && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
                '& .MuiListItemIcon-root img': {
                  filter: 'saturate(0) hue-rotate(90deg) brightness(0)',
                },
                '& .MuiListItemText-primary': {
                  color: '#212121',
                },
              },
            }}
            >
              <ListItemIcon sx={{ minWidth: '35px' }}>
                <Icon>
                  <img src={'/img/icon/star.svg'} height={25} width={25} />
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Nuestros links" primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === nuestrosLinks && { color: '#212121' }) }} />
              {openLinks ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
            </ListItemButton>
            <Collapse in={openLinks} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {nustrosLinks.map((button, index) => (
                  <ListItem key={index}>
                    <ListItemButton onClick={() => { handleListItemClick(button.startIndex) }} sx={{
                      ...itemButtonStyle2,
                      ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                      ':hover': {
                        ...itemButtonHoverStyle,
                        '& .MuiListItemIcon-root img': {
                          filter: 'saturate(0) hue-rotate(90deg) brightness(0)',
                        },
                        '& .MuiListItemText-primary': {
                          color: '#212121',
                        },
                      },
                    }}
                    >
                      <ListItemText primary={button.label} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 500, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === button.startIndex && { color: '#212121' }) }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>



            <ListItemButton onClick={() => { handleClick(), handleListItemClick(comision) }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === comision && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
                '& .MuiListItemIcon-root img': {
                  filter: 'saturate(0) hue-rotate(90deg) brightness(0)',
                },
                '& .MuiListItemText-primary': {
                  color: '#212121',
                },
              },
            }}
            >
              <ListItemIcon sx={{ minWidth: '35px' }}>
                <Icon>
                  <img src={'/img/icon/heart.svg'} height={25} width={25} />
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Comisión de género" primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === comision && { color: '#212121' }) }} />
              {open ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {comisionGenero.map((button, index) => (
                  <ListItem key={index}>
                    <ListItemButton onClick={() => { handleListItemClick(button.startIndex) }} sx={{
                      ...itemButtonStyle2,
                      ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                      ':hover': {
                        ...itemButtonHoverStyle,
                        '& .MuiListItemIcon-root img': {
                          filter: 'saturate(0) hue-rotate(90deg) brightness(0)',
                        },
                        '& .MuiListItemText-primary': {
                          color: '#212121',
                        },
                      },
                    }}
                    >
                      <ListItemText primary={button.label} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 500, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === button.startIndex && { color: '#212121' }) }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Grid>
        <Grid item xs={10}>
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 10}}>
            {activeComponent}
          </Box>
        </Grid>
      </Grid>
    </>
  );


}