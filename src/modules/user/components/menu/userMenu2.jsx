/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  ListItem,
  useMediaQuery
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'App.js';
import { isUserDataComplete } from '../../../../helpers/validators';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { SCOPES } from 'helpers/constants/i18n.ts';

export const UserMenu = (props) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { t } = useTranslation(SCOPES.MODULES.USER, { useSuspense: false });
  const { t: tBar } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const [selectedIndex, setSelectedIndex] = useState('');

  const { userData, isSignedIn } = props;
  const userIsAdmin = userData.roles?.admin;
  const userIsSuperAdmin = userData.roles?.superadmin;

  const [openItems, setOpenItems] = useState(false);
  const handleClickItems = () => {
    setOpenItems(!openItems);
  };
  const menuItems = [
    {
      name: t('myProfile'),
      icon: <PersonOutlineIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      children: null
    },
    {
      name: tBar('newETI'),
      icon: <AccountBoxOutlinedIcon />,
      isAdmin: false,
      isSuperAdmin: true,
      children: null
    },
    {
      name: tBar('history'),
      icon: <StarOutlineRoundedIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      children: null
    },
    {
      name: tBar('manifest'),
      icon: <AssignmentIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      children: null
    },
    {
      name: tBar('etis'),
      icon: <AccountBoxOutlinedIcon />,
      isAdmin: true,
      children: [
        { name: tBar('generalInfo'), action: 'navigate to test' },
        { name: t('attendance'), action: 'navigato to atendance' }
      ]
    },
    {
      name: tBar('signup'),
      icon: <AssignmentIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      children: [
        { name: t('signup'), action: 'navigate to signup' },
        { name: t('signupList'), action: 'navigate to signuplist' }
      ]
    },
    {
      name: t('ourLinks'),
      icon: <StarOutlineRoundedIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      mobileOnly: true,
      children: [
        { name: tBar('history'), action: 'navigate to history' },
        { name: tBar('manifest'), action: 'navigate to manifest' }
      ]
    },
    {
      name: tBar('commission'),
      icon: <FavoriteBorderIcon />,
      isAdmin: false,
      isSuperAdmin: false,
      mobileOnly: true,
      children: [
        { name: tBar('genderWho'), action: 'navigate to genderwho' },
        { name: tBar('genderProtocol'), action: 'navigate to protocol' },
        { name: tBar('genderContact'), action: 'navigate to gendercontact' }
      ]
    }
  ];

  const toggleSubMenu = (name) => {
    console.log('name toglesubmenu', name);
    setSelectedIndex(name);

    setOpenSubMenus((prevState) => ({ ...prevState, [name]: !prevState[name] }));
    console.log('opensubmenus', openSubMenus);
  };

  const checkUserDataAndNavigate = () => {
    if (isUserDataComplete(user.data)) {
      navigate(ROUTES.SIGNUP);
    } else {
      setAlertVisible(true);
    }
  };

  const itemButtonStyle = {
    borderBottomLeftRadius: '25px',
    borderTopLeftRadius: '25px',
    borderTopRightRadius: { xs: '25px', lg: '0px' },
    borderBottomRightRadius: { xs: '25px', lg: '0px' },
    padding: '12px 0px 12px 12px',
    marginBottom: '10px',
    color: 'listItems.light'
  };

  const itemButtonStyle2 = {
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
      return canView || userIsSuperAdmin;
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
              item.children && handleClickItems(), toggleSubMenu(item.name);
            }}
            sx={{
              ...itemButtonStyle,
              ...(selectedIndex === item.name && itemButtonActiveStyle),
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
                ...(selectedIndex === item.name && { color: 'listItems.dark' })
              }}
            />
            {item.children &&
              (openItems ? (
                <ExpandLess sx={{ marginRight: 1 }} />
              ) : (
                <ExpandMore sx={{ marginRight: 1 }} />
              ))}
          </ListItemButton>
          {item.children && openSubMenus[item.name] && (
            <Collapse in={openItems} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((dropDownItems, index) => (
                  <ListItem key={index}>
                    <ListItemButton
                      onClick={() => {console.log(dropDownItems.action)}}
                      sx={{
                        ...itemButtonStyle2,
                        ...(selectedIndex === dropDownItems.name && itemButtonActiveStyle),
                        ':hover': {
                          ...itemButtonHoverStyle
                        }
                      }}
                    >
                      <ListItemText
                        primary={dropDownItems.name}
                        primaryTypographyProps={{
                          ...fontListText,
                          ...(selectedIndex === dropDownItems.name && { color: 'listItems.dark' })
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

      {alertVisible && 'alerta chabalin'}
    </>
  );
};
