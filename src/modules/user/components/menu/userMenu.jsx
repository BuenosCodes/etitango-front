/* eslint-disable react/prop-types */
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  ListItem,
  useMediaQuery,
  Box
} from '@mui/material';
import {
  StarOutlineRounded as StarOutlineRoundedIcon,
  AccountBoxOutlined as AccountBoxOutlinedIcon,
  FavoriteBorder as FavoriteBorderIcon,
  PersonOutline as PersonOutlineIcon,
  Assignment as AssignmentIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'App.js';
import { isUserDataComplete } from '../../../../helpers/validators';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { Alert } from '../../../../components/alert/Alert';
import { useGlobalState } from 'helpers/UserPanelContext';

export const UserMenu = (props) => {
  const { toggleOpen } = useGlobalState();
  const [alertVisible, setAlertVisible] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [selectedIndexMenu, setSelectedIndexMenu] = useState('');
  const [selectedIndexSubMenu, setSelectedIndexSubMenu] = useState('');
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { t } = useTranslation(SCOPES.MODULES.USER, { useSuspense: false });
  const { t: tBar } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const { userData, isSignedIn } = props;
  const userIsAdmin = userData.roles?.admin;
  const userIsSuperAdmin = userData.roles?.superadmin;
  const checkUserData = () => {
    if (isUserDataComplete(userData)) {
      navigate(ROUTES.SIGNUP);
    } else {
      setAlertVisible(true);
    }
  };
  const menuItems = [
    {
      name: t('myProfile'),
      icon: <PersonOutlineIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      children: null,
      route: ROUTES.PROFILE
    },
    {
      name: tBar('newETI'),
      icon: <AccountBoxOutlinedIcon />,
      isAdmin: false,
      isSuperAdmin: true,
      children: null,
      route: `${ROUTES.SUPERADMIN}${ROUTES.EVENTS}/new`
    },
    {
      name: tBar('history'),
      icon: <StarOutlineRoundedIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      isSignin: true,
      children: null,
      route: '/historia-del-eti'
    },
    {
      name: tBar('manifest'),
      icon: <AssignmentIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      isSignin: true,
      children: null,
      route: '/manifiesto-etiano'
    },
    {
      name: tBar('etis'),
      icon: <AccountBoxOutlinedIcon />,
      isAdmin: true,
      children: [
        { name: tBar('generalInfo'), route: `${ROUTES.SUPERADMIN}${ROUTES.EVENTS}` },
        { name: t('attendance'), route: ROUTES.ATTENDANCE }
      ]
    },
    {
      name: tBar('signup'),
      icon: <AssignmentIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      children: [
        { name: t('signup'), route: null },
        { name: t('signupList'), route: ROUTES.SIGNUPS }
      ]
    },
    {
      name: t('ourLinks'),
      icon: <StarOutlineRoundedIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      mobileOnly: true,
      children: [
        { name: tBar('history'), route: '/historia-del-eti' },
        { name: tBar('manifest'), route: '/manifiesto-etiano' }
      ]
    },
    {
      name: tBar('commission'),
      icon: <FavoriteBorderIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      mobileOnly: true,
      children: [
        { name: tBar('genderWho'), route: '/comision-de-genero-who' },
        { name: tBar('genderProtocol'), route: '/comision-de-genero-protocol' },
        { name: tBar('genderContact'), route: '/comision-de-genero-contact' }
      ]
    }
  ];

  const toggleSubMenu = (name) => {
    setSelectedIndexMenu(name);
    setSelectedIndexSubMenu('');
    setOpenSubMenus((prevState) => ({ ...prevState, [name]: !prevState[name] }));
  };

  const handleClickSubMenu = (indexSubMenuName, indexMenuName) => {
    setSelectedIndexSubMenu(indexSubMenuName);
    setSelectedIndexMenu(indexMenuName);
  };

  const itemButtonMenuStyle = {
    borderBottomLeftRadius: '25px',
    borderTopLeftRadius: '25px',
    borderTopRightRadius: { xs: '25px', md: '0px' },
    borderBottomRightRadius: { xs: '25px', md: '0px' },
    padding: '12px 0px 12px 12px',
    marginBottom: '10px',
    color: 'listItems.light'
  };

  const itemButtonSubMenuStyle = {
    borderRadius: '100px',
    padding: '6px 16px 6px 16px',
    marginBottom: '10px',
    color: 'listItems.light'
  };

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
  };

  const renderMenuItems = (items, parentName = '') => {
    let filteredItems = items.filter((item) => {
      const canView = (!item.isSuperAdmin || userIsSuperAdmin) && (!item.isAdmin || userIsAdmin);
      const shouldShow = !item.isSignin || (item.isSignin && !isSignedIn);
      return (canView || userIsSuperAdmin) && shouldShow;
    });

    if (!isSignedIn) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.name === tBar('history') ||
          item.name === tBar('manifest') ||
          item.name === tBar('commission')
      );
    }

    return filteredItems
      .filter((item) => !item.mobileOnly || (item.mobileOnly && isMobile))
      .map((item) => (
        <List key={parentName + item.name} sx={{ padding: '8px 0px 8px 15px', overflow: 'auto' }}>
          <ListItemButton
            onClick={() => {
              toggleSubMenu(item.name),
                item.route && navigate(item.route),
                !item.children && toggleOpen();
            }}
            sx={{
              ...itemButtonMenuStyle,
              ...(selectedIndexMenu === item.name && itemButtonActiveStyle),
              ':hover': {
                ...itemButtonHoverStyle
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '35px', color: 'listItems.light' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                ...fontListText,
                ...(selectedIndexMenu === item.name && { color: 'listItems.dark' })
              }}
            />
            {item.children &&
              (openSubMenus[item.name] ? (
                <ExpandLess sx={{ marginRight: 1 }} />
              ) : (
                <ExpandMore sx={{ marginRight: 1 }} />
              ))}
          </ListItemButton>
          {item.children && openSubMenus[item.name] && (
            <Collapse in={openSubMenus[item.name]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((dropDownItems, index) => (
                  <ListItem key={index}>
                    <ListItemButton
                      onClick={() => {
                        handleClickSubMenu(dropDownItems.name, item.name),
                          dropDownItems.name === t('signup')
                            ? checkUserData()
                            : navigate(dropDownItems.route);
                        toggleOpen();
                      }}
                      sx={{
                        ...itemButtonSubMenuStyle,
                        ...(selectedIndexSubMenu === dropDownItems.name && itemButtonActiveStyle),
                        ':hover': {
                          ...itemButtonHoverStyle
                        }
                      }}
                    >
                      <ListItemText
                        primary={dropDownItems.name}
                        primaryTypographyProps={{
                          ...fontListText,
                          ...(selectedIndexSubMenu === dropDownItems.name && {
                            color: 'listItems.dark'
                          })
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}
        </List>
      ));
  };

  return (
    <>
      {renderMenuItems(menuItems)}
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
    </>
  );
};
