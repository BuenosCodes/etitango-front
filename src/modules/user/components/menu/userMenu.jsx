/* eslint-disable prettier/prettier */
import { useContext, useState, useEffect } from 'react';
import { Box, List, ListItemButton, ListItemText, ListItemIcon, Collapse, ListItem, useMediaQuery } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'App.js';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { styles } from './userMenu.styles.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../helpers/UserContext';
import { isUserDataComplete } from '../../../../helpers/validators';
import { Alert } from '../../../../components/alert/Alert';
import { isAdmin } from '../../../../helpers/firestore/users';
import { auth } from 'etiFirebase.js';
import { getDocument } from 'helpers/firestore';
import { USERS } from 'helpers/firestore/users';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ChecklistIcon from '@mui/icons-material/Checklist';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';

export function UserMenu( props ) {
  const [alertVisible, setAlertVisible] = useState(false);
  const { t } = useTranslation(SCOPES.MODULES.USER, { useSuspense: false });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { pathname: currentRoute } = useLocation();
  const isCurrentRoute = (route) => currentRoute === route;
  const getStyles = (route) => [styles.item, isCurrentRoute(route) && { ...styles.selectedItem }];
  const checkUserData = () => {
    if (isUserDataComplete(user.data)) {
      navigate(ROUTES.SIGNUP);
    } else {
      setAlertVisible(true);
    }
  };
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [openComision, setOpenComision] = useState(false);
  const [openEtis, setOpenEtis] = useState(false);
  const [openLinks, setOpenLinks] = useState(false);
  const [openInscriptions, setOpenInscriptions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [etis, setEtis] = useState(3);
  const [dropDownInscriptions, setdropDownInscriptions] = useState(4);
  const [nuestrosLinks, setNuestrosLinks] = useState(5);
  const [comision, setComision] = useState(6);
  // eslint-disable-next-line react/prop-types
  const  {userData, isSignedIn} = props;
  // eslint-disable-next-line react/prop-types
  const userIsAdmin = userData.roles?.admin
  // eslint-disable-next-line react/prop-types
  const userIsSuperAdmin = userData.roles?.superadmin

  const Inscriptions = [
    { label: t('signup'), startIndex: 9 },
    { label: t('signupList'), startIndex: 10 },
  ]

  const Etis = [
    { label: 'Información general', startIndex: 11 },
    { label: 'Presupuesto', startIndex: 12 },
    { label: 'Inscripciones', startIndex: 13 },
    { label: 'Merchandising', startIndex: 14 },
    { label: 'Audio', startIndex: 15 },
    { label: t('attendance'), startIndex: 16 },
  ]

  const nustrosLinks = [
    { label: 'Historia del ETI', startIndex: 17 },
    { label: 'Manifiesto', startIndex: 18 },
  ]

  const comisionGenero = [
    { label: 'Sobre Nosotres', startIndex: 19 },
    { label: 'Protocolo de género', startIndex: 20 },
    { label: 'Contacto', startIndex: 21 },
  ]


  const handleClickComision = () => {
    setOpenComision(!openComision);
  };


  const handleClickEtis = () => {
    setOpenEtis(!openEtis);
  };

  const handleClickLinks = () => {
    setOpenLinks(!openLinks);
  };

  const handleClickInscriptions = () => {
    setOpenInscriptions(!openInscriptions);
  };


  const handleListItemClick = (
    index,
  ) => {
    if (index === 1) {
      navigate(ROUTES.PROFILE)
    }
    if (index === 2) {
      console.log('nuevo etieventeano');
    }
    if (index === 9) {
      setdropDownInscriptions(index)
      checkUserData()
    }
    if (index === 10) {
      setdropDownInscriptions(index)
      navigate(ROUTES.SIGNUPS)
    }
    if (index === 11) {
      setEtis(index)
      navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`)
    }
    if (index === 12) {
      setEtis(index)
    }
    if (index === 13) {
      setEtis(index)
    }
    if (index === 14) {
      setEtis(index)
    }
    if (index === 15) {
      setEtis(index)
    }
    if (index === 16) {
      setEtis(index)
      { isAdmin && navigate(ROUTES.ATTENDANCE) }
    }
    if (index === 17) {
      setNuestrosLinks(index)
      navigate('/historia-del-eti')
    }
    if (index === 18) {
      setNuestrosLinks(index)
      navigate('/manifiesto-etiano')
    }
    if (index === 19) {
      setComision(index)
      navigate('/comision-de-genero-who')
    }
    if (index === 20) {
      setComision(index)
      navigate('/comision-de-genero-protocol')

    }
    if (index === 21) {
      setComision(index)
      navigate('/comision-de-genero-contact')
    }

    setSelectedIndex(index);
  };

  const itemButtonStyle = {
    borderBottomLeftRadius: '25px', borderTopLeftRadius: '25px', borderTopRightRadius: { xs: '25px', lg: '0px' }, borderBottomRightRadius: { xs: '25px', lg: '0px' }, padding: '12px 0px 12px 12px', marginBottom: '10px', color: '#FAFAFA'
  }

  const itemButtonStyle2 = {
    borderRadius: '100px', padding: '6px 16px 6px 16px', marginBottom: '10px', color: '#FAFAFA'
  }

  const itemButtonHoverStyle = {
    backgroundColor: '#FFFBF0',
    color: '#212121',
    '& .MuiListItemIcon-root': {
      color: '#212121'
    }
  };

  const itemButtonActiveStyle = {
    backgroundColor: '#FFFBF0',
    color: '#212121',
    '& .MuiListItemIcon-root': {
      color: '#212121'
    }
  };

  return (
    <>
      <Alert
        open={alertVisible}
        handleClose={() => setAlertVisible(false)}
        onClick={() => {
          navigate(ROUTES.PROFILE);
          setAlertVisible(false);
        }}
        buttonText={t('alert.fillInData').toUpperCase()}
        title={t('alert.warning')}
        description={t('alert.fillInDataReason')}
      />
      <List sx={{ padding: '8px 0px 8px 15px', overflow: 'auto' }}>
        {isSignedIn ?
          <>
            <Box sx={{ border: { xs: '1px solid #FAFAFA', lg: '1px solid #5FB4FC' }, mt: { xs: 2.5, lg: 0 }, mb: { xs: 2, lg: 0 } }} />
            {userIsSuperAdmin &&
              <ListItemButton onClick={() => { handleListItemClick(2) }} sx={{
                ...itemButtonStyle,
                ...(selectedIndex === 2 && itemButtonActiveStyle),
                ':hover': {
                  ...itemButtonHoverStyle,
                },
              }}
              >
                <ListItemIcon sx={{ minWidth: '35px', color: 'white' }}>
                  <AccountBoxOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={'Nuevo ETI'} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === 2 && { color: '#212121' }) }} />
              </ListItemButton>
            }

            {(userIsAdmin || userIsSuperAdmin) && (<>
              <ListItemButton onClick={() => { handleClickEtis(), handleListItemClick(etis) }} sx={{
                ...itemButtonStyle,
                ...(selectedIndex === etis && itemButtonActiveStyle),
                ':hover': {
                  ...itemButtonHoverStyle,
                },
              }}
              >
                <ListItemIcon sx={{ minWidth: '35px', color: '#FAFAFA' }}>
                  <AccountBoxOutlinedIcon />
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


            <ListItemButton onClick={() => { handleClickInscriptions(), handleListItemClick(dropDownInscriptions) }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === dropDownInscriptions && itemButtonActiveStyle),
              ':hover': { ...itemButtonHoverStyle }
            }}
            >
              <ListItemIcon sx={{ minWidth: '35px', color: 'white' }}>
                <ChecklistIcon />
              </ListItemIcon>
              <ListItemText primary="Inscripciones" primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === dropDownInscriptions && { color: '#212121' }) }} />
              {openInscriptions ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
            </ListItemButton>
            <Collapse in={openInscriptions} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Inscriptions.map((button, index) => (
                  <ListItem key={index}>
                    <ListItemButton onClick={() => { handleListItemClick(button.startIndex) }} sx={{
                      ...itemButtonStyle2,
                      ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                      ':hover': { ...itemButtonHoverStyle },
                    }}
                    >
                      <ListItemText primary={button.label} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 500, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === button.startIndex && { color: '#212121' }) }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            <ListItemButton onClick={() => { handleListItemClick(1) }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === 1 && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
              },
            }}
            >
              <ListItemIcon sx={{ minWidth: '35px', color: '#FAFAFA' }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText primary={t('myProfile')} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === 1 && { color: '#212121' }) }} />
            </ListItemButton>


            {isMobile &&
              <>
                <ListItemButton onClick={() => { handleClickLinks(), handleListItemClick(nuestrosLinks) }} sx={{
                  ...itemButtonStyle,
                  ...(selectedIndex === nuestrosLinks && itemButtonActiveStyle),
                  ':hover': {
                    ...itemButtonHoverStyle,
                  },
                }}
                >
                  <ListItemIcon sx={{ minWidth: '35px', color: '#FAFAFA' }}>
                    <StarOutlineRoundedIcon />
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
                          },
                        }}
                        >
                          <ListItemText primary={button.label} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 500, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === button.startIndex && { color: '#212121' }) }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>

                <ListItemButton onClick={() => { handleClickComision(), handleListItemClick(comision) }} sx={{
                  ...itemButtonStyle,
                  ...(selectedIndex === comision && itemButtonActiveStyle),
                  ':hover': {
                    ...itemButtonHoverStyle,
                  },
                }}
                >
                  <ListItemIcon sx={{ minWidth: '35px', color: '#FAFAFA' }}>
                    <FavoriteBorderIcon />
                  </ListItemIcon>

                  <ListItemText primary="Comisión de género" primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === comision && { color: '#212121' }) }} />
                  {openComision ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
                </ListItemButton>
                <Collapse in={openComision} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {comisionGenero.map((button, index) => (
                      <ListItem key={index}>
                        <ListItemButton onClick={() => { handleListItemClick(button.startIndex) }} sx={{
                          ...itemButtonStyle2,
                          ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                          ':hover': {
                            ...itemButtonHoverStyle,
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
            }
          </>
          :
          <>
            <ListItemButton onClick={() => { handleListItemClick(17) }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === 17 && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
              },
            }}
            >
              <ListItemText primary={'Historia del ETI'} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === 17 && { color: '#212121' }) }} />
            </ListItemButton>

            <ListItemButton onClick={() => { handleListItemClick(18) }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === 18 && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
              },
            }}
            >
              <ListItemText primary={'Manifiesto'} primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === 18 && { color: '#212121' }) }} />
            </ListItemButton>


            <ListItemButton onClick={() => { handleClickComision(), handleListItemClick(comision) }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === comision && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
              },
            }}
            >

              <ListItemText primary="Comisión de género" primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '16px', lineHeight: '12px', ...(selectedIndex === comision && { color: '#212121' }) }} />
              {openComision ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
            </ListItemButton>
            <Collapse in={openComision} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {comisionGenero.map((button, index) => (
                  <ListItem key={index}>
                    <ListItemButton onClick={() => { handleListItemClick(button.startIndex) }} sx={{
                      ...itemButtonStyle2,
                      ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                      ':hover': {
                        ...itemButtonHoverStyle,
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
        }
      </List>


      {/* <Box sx={styles.container}>
        <Button sx={getStyles(ROUTES.PROFILE)} onClick={() => navigate(ROUTES.PROFILE)}>
          {t('myProfile')}
        </Button>
        <Button sx={getStyles(ROUTES.SIGNUP)} onClick={checkUserData}>
          {t('signup')}
        </Button>
        <Button sx={getStyles(ROUTES.SIGNUPS)} onClick={() => navigate(ROUTES.SIGNUPS)}>
          {t('signupList')}
        </Button>
        {isAdmin(user) ? (
          <Button sx={getStyles(ROUTES.SIGNUPS)} onClick={() => navigate(ROUTES.ATTENDANCE)}>
            {t('attendance')}
          </Button>
        ) : null}
      </Box> */}
    </>
  );
}
