/* eslint-disable prettier/prettier */
import {
    StarOutlineRounded as StarOutlineRoundedIcon,
    AccountBoxOutlined as AccountBoxOutlinedIcon,
    FavoriteBorder as FavoriteBorderIcon,
    PersonOutline as PersonOutlineIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { ROUTES } from 'App';
import { SCOPES } from 'helpers/constants/i18n';
import { useTranslation } from 'react-i18next';


export const getMenuItems = () => {
    
    const { t } = useTranslation(SCOPES.MODULES.USER, { useSuspense: false });
    const { t: tBar } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });

    return [

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

    ]
}

