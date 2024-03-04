/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import { Box, List, ListItemButton, ListItemText, ListItemIcon, Collapse, ListItem, useMediaQuery } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'App.js';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../helpers/UserContext';
import { isUserDataComplete } from '../../../../helpers/validators';
import { Alert } from '../../../../components/alert/Alert';
import { isAdmin } from '../../../../helpers/firestore/users';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { useGlobalState } from 'helpers/UserPanelContext';


export function UserMenu( props ) {
  const [alertVisible, setAlertVisible] = useState(false);
  const { t } = useTranslation(SCOPES.MODULES.USER, { useSuspense: false },);
  const { t: tBar } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const checkUserData = () => {
    if (isUserDataComplete(user.data)) {
      navigate(ROUTES.SIGNUP);
    } else {
      setAlertVisible(true);
    }
  };
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [openCommission, setOpenCommission] = useState(false);
  const [openEtis, setOpenEtis] = useState(false);
  const [openLinks, setOpenLinks] = useState(false);
  const [openInscriptions, setOpenInscriptions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [etis, setEtis] = useState(3);
  const [dropDownInscriptions, setdropDownInscriptions] = useState(4);
  const [links, setLinks] = useState(5);
  const [commission, setCommission] = useState(6);
  const  {userData, isSignedIn} = props;
  const userIsAdmin = userData.roles?.admin
  const userIsSuperAdmin = userData.roles?.superadmin
  const { toggleOpen } = useGlobalState();
  
  const Inscriptions = [
    { label: t('signup'), startIndex: 9 },
    { label: t('signupList'), startIndex: 10 },
  ]

  const Etis = [
    { label: tBar('generalInfo'), startIndex: 11 },
    // { label: 'Presupuesto', startIndex: 12 },  Esto se trabajara mas adelante
    // { label: 'Inscripciones', startIndex: 13 },
    // { label: 'Merchandising', startIndex: 14 },
    // { label: 'Audio', startIndex: 15 },
    { label: t('attendance'), startIndex: 16 },
  ]

  const ourLinks = [
    { label: tBar('history'), startIndex: 17 },
    { label: tBar('manifest'), startIndex: 18 },
  ]

  const genderCommission = [
    { label: tBar('genderWho'), startIndex: 19 },
    { label: tBar('genderProtocol'), startIndex: 20 },
    { label: tBar('genderContact'), startIndex: 21 },
  ]


  const handleClickCommission = () => {
    setOpenCommission(!openCommission);
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
      navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}/new`)
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
      setLinks(index)
      navigate('/historia-del-eti')
    }
    if (index === 18) {
      setLinks(index)
      navigate('/manifiesto-etiano')
    }
    if (index === 19) {
      setCommission(index)
      navigate('/comision-de-genero-who')
    }
    if (index === 20) {
      setCommission(index)
      navigate('/comision-de-genero-protocol')

    }
    if (index === 21) {
      setCommission(index)
      navigate('/comision-de-genero-contact')
    }

    setSelectedIndex(index);
  };

  const itemButtonStyle = {
    borderBottomLeftRadius: '25px', borderTopLeftRadius: '25px', borderTopRightRadius: { xs: '25px', lg: '0px' }, borderBottomRightRadius: { xs: '25px', lg: '0px' }, padding: '12px 0px 12px 12px', marginBottom: '10px', color: 'listItems.light'
  }

  const itemButtonStyle2 = {
    borderRadius: '100px', padding: '6px 16px 6px 16px', marginBottom: '10px', color: 'listItems.light'
  }

  const itemButtonHoverStyle = {
    backgroundColor: 'listItems.main',
    color: 'listItems.dark',
    '& .MuiListItemIcon-root': {
      color: 'listItems.dark'
    }
  };

  const itemButtonActiveStyle = {
    backgroundColor: 'listItems.main',
    color: 'listItems.dark',
    '& .MuiListItemIcon-root': {
      color: 'listItems.dark'
    }
  };

  const fontListText = {
    fontFamily: 'roboto', 
    fontWeight: 600,
    fontSize: '16px', 
    lineHeight: '20px'
  }

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
      <List sx={{ padding: '8px 0px 12px 15px', overflow: 'auto' }}>
        {isMobile &&  <Box sx={{ border: '1px solid', mt: 1.5, mb: 1.5, borderColor: 'listItems.light' }}/>}
        {isSignedIn ?
          <>
            {userIsSuperAdmin &&
              <ListItemButton onClick={() => { handleListItemClick(2), toggleOpen() }} sx={{
                ...itemButtonStyle,
                ...(selectedIndex === 2 && itemButtonActiveStyle),
                ':hover': {
                  ...itemButtonHoverStyle,
                },
              }}
              >
                <ListItemIcon sx={{ minWidth: '35px', color: 'listItems.light' }}>
                  <AccountBoxOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={tBar('newETI')} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === 2 && { color: 'listItems.dark' }) }} />
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
                <ListItemIcon sx={{ minWidth: '35px', color: 'listItems.light' }}>
                  <AccountBoxOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={tBar("etis")} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === etis && { color: 'listItems.dark' }) }} />
                {openEtis ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
              </ListItemButton>
              <Collapse in={openEtis} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Etis.map((button, index) => (
                    <ListItem key={index}>
                      <ListItemButton onClick={() => { handleListItemClick(button.startIndex), toggleOpen() }} sx={{
                        ...itemButtonStyle2,
                        ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                        ':hover': {
                          ...itemButtonHoverStyle,
                        },
                      }}
                      >
                        <ListItemText primary={button.label} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === button.startIndex && { color: 'listItems.dark' }) }} />
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
              <ListItemIcon sx={{ minWidth: '35px', color: 'listItems.light' }}>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary={tBar('signup')} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === dropDownInscriptions && { color: 'listItems.dark' }) }} />
              {openInscriptions ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
            </ListItemButton>
            <Collapse in={openInscriptions} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Inscriptions.map((button, index) => (
                  <ListItem key={index}>
                    <ListItemButton onClick={() => { handleListItemClick(button.startIndex), toggleOpen() }} sx={{
                      ...itemButtonStyle2,
                      ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                      ':hover': { ...itemButtonHoverStyle },
                    }}
                    >
                      <ListItemText primary={button.label} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === button.startIndex && { color: 'listItems.dark' }) }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            <ListItemButton onClick={() => { handleListItemClick(1), toggleOpen() }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === 1 && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
              },
            }}
            >
              <ListItemIcon sx={{ minWidth: '35px', color: 'listItems.light' }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText primary={t('myProfile')} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === 1 && { color: 'listItems.dark' }) }} />
            </ListItemButton>


            {isMobile &&
              <>
                <ListItemButton onClick={() => { handleClickLinks(), handleListItemClick(links) }} sx={{
                  ...itemButtonStyle,
                  ...(selectedIndex === links && itemButtonActiveStyle),
                  ':hover': {
                    ...itemButtonHoverStyle,
                  },
                }}
                >
                  <ListItemIcon sx={{ minWidth: '35px', color: 'listItems.light' }}>
                    <StarOutlineRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('ourLinks')} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === links && { color: 'listItems.dark' }) }} />
                  {openLinks ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
                </ListItemButton>
                <Collapse in={openLinks} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {ourLinks.map((button, index) => (
                      <ListItem key={index}>
                        <ListItemButton onClick={() => { handleListItemClick(button.startIndex), toggleOpen() }} sx={{
                          ...itemButtonStyle2,
                          ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                          ':hover': {
                            ...itemButtonHoverStyle,
                          },
                        }}
                        >
                          <ListItemText primary={button.label} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === button.startIndex && { color: 'listItems.dark' }) }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>

                <ListItemButton onClick={() => { handleClickCommission(), handleListItemClick(commission) }} sx={{
                  ...itemButtonStyle,
                  ...(selectedIndex === commission && itemButtonActiveStyle),
                  ':hover': {
                    ...itemButtonHoverStyle,
                  },
                }}
                >
                  <ListItemIcon sx={{ minWidth: '35px', color: 'listItems.light' }}>
                    <FavoriteBorderIcon />
                  </ListItemIcon>

                  <ListItemText primary={tBar('commission')} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === commission && { color: 'listItems.dark' }) }} />
                  {openCommission ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
                </ListItemButton>
                <Collapse in={openCommission} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {genderCommission.map((button, index) => (
                      <ListItem key={index}>
                        <ListItemButton onClick={() => { handleListItemClick(button.startIndex), toggleOpen() }} sx={{
                          ...itemButtonStyle2,
                          ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                          ':hover': {
                            ...itemButtonHoverStyle,
                          },
                        }}
                        >
                          <ListItemText primary={button.label} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === button.startIndex && { color: 'listItems.dark' }) }} />
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
            <ListItemButton onClick={() => { handleListItemClick(17), toggleOpen() }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === 17 && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
              },
            }}
            >
              <ListItemText primary={tBar('history')} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === 17 && { color: 'listItems.dark' }) }} />
            </ListItemButton>

            <ListItemButton onClick={() => { handleListItemClick(18), toggleOpen() }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === 18 && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
              },
            }}
            >
              <ListItemText primary={tBar('manifest')} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === 18 && { color: 'listItems.dark' }) }} />
            </ListItemButton>

            <ListItemButton onClick={() => { handleClickCommission(), handleListItemClick(commission) }} sx={{
              ...itemButtonStyle,
              ...(selectedIndex === commission && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle,
              },
            }}
            >

              <ListItemText primary={tBar('commission')} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === commission && { color: 'listItems.dark' }) }} />
              {openCommission ? <ExpandLess sx={{ marginRight: 1 }} /> : <ExpandMore sx={{ marginRight: 1 }} />}
            </ListItemButton>
            <Collapse in={openCommission} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {genderCommission.map((button, index) => (
                  <ListItem key={index}>
                    <ListItemButton onClick={() => { handleListItemClick(button.startIndex), toggleOpen() }} sx={{
                      ...itemButtonStyle2,
                      ...(selectedIndex === button.startIndex && itemButtonActiveStyle),
                      ':hover': {
                        ...itemButtonHoverStyle,
                      },
                    }}
                    >
                      <ListItemText primary={button.label} primaryTypographyProps={{ ...fontListText, ...(selectedIndex === button.startIndex && { color: 'listItems.dark' }) }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        }
      </List>
    </>
  );
}
