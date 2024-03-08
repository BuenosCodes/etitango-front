/* eslint-disable react/prop-types */
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  ListItem,
  useMediaQuery,
} from '@mui/material';
import {
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
import { styles } from './userMenu.styles';
import { getMenuItems } from './MenuItems';

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
  const menuItems = getMenuItems();
  const checkUserData = () => {
    if (isUserDataComplete(userData)) {
      navigate(ROUTES.SIGNUP);
    } else {
      setAlertVisible(true);
    }
  };

  const toggleSubMenu = (name) => {
    setSelectedIndexMenu(name);
    setSelectedIndexSubMenu('');
    setOpenSubMenus((prevState) => ({ ...prevState, [name]: !prevState[name] }));
  };

  const handleClickSubMenu = (indexSubMenuName, indexMenuName) => {
    setSelectedIndexSubMenu(indexSubMenuName);
    setSelectedIndexMenu(indexMenuName);
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
              ...styles.itemButtonMenuStyle,
              ...(selectedIndexMenu === item.name && styles.itemButtonActiveStyle),
              ':hover': {
                ...styles.itemButtonHoverStyle
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '35px', color: 'listItems.light' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                ...styles.fontListText,
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
                        ...styles.itemButtonSubMenuStyle,
                        ...(selectedIndexSubMenu === dropDownItems.name && styles.itemButtonActiveStyle),
                        ':hover': {
                          ...styles.itemButtonHoverStyle
                        }
                      }}
                    >
                      <ListItemText
                        primary={dropDownItems.name}
                        primaryTypographyProps={{
                          ...styles.fontListText,
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
