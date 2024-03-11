import { Grid, Link, Typography} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { ROUTES } from 'App';

export default function AppFooter() {
  const { t } = useTranslation([SCOPES.COMPONENTS.FOOTER, SCOPES.COMPONENTS.BAR], {
    useSuspense: false
  });
  const links = [
    { href: ROUTES.HOME, title: t(`${SCOPES.COMPONENTS.BAR}.eti`) },
    { href: '/historia-del-eti', title: t(`${SCOPES.COMPONENTS.BAR}.history`) },
    { href: '/manifiesto-etiano', title: t(`${SCOPES.COMPONENTS.BAR}.manifest`) },
    { href: '/comision-de-genero-who', title: t(`${SCOPES.COMPONENTS.BAR}.genderWho`) },
  ];
  
  return (

    <Grid
     container
     spacing={3}
     paddingX= {{xs: 3, sm: 6, md: 10}}
     paddingY= {5}
     sx={{ backgroundColor: 'secondary.dark', mt: 0, mb: 0 }} 
    >

        <Grid item xs={12} sm={6} md={3} order={{ xs: 1, sm: 0, md: 0 }} >
          <Grid direction='column' sx= {{ display: 'flex', justifyContent: 'space-between' }} >
              <Typography variant='robotoFont3' color='primary.light' sx={{ fontWeight: 'bold' }}>
                {t('links.title')}
              </Typography>
                {links.map((link) => (
                      <Link
                        variant='robotoFont3'
                        color="primary.light"
                        underline="none"
                        href={link.href}
                        key={link.href}
                        pl={2}
                        mt={2}
                      >
                        {link.title}
                      </Link>
                    ))}
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} md={4} order={{ xs: 0, sm: 1, md: 1 }}>
          <Grid direction='column' sx={{ display: 'flex' }}>
                <Typography variant='robotoFont3' color='primary.light' sx={{ fontWeight: 'bold'}}>
                  {t('about.title')}
                </Typography>
                <Typography variant='robotoFont3' color='listItems.light' sx={{ pl: 2,  mt: 2, pr: 3 }} >
                {t('about.description')}
                </Typography>
          </Grid>
        </Grid> 

        <Grid item xs={12} sm={6} md={2} order={{ xs: 2, sm: 2, md: 2 }}>
          <Grid>
                <Typography variant='robotoFont3' color='primary.light' sx= {{ fontWeight: 'bold' }}>
                  {t('socialNetworks.title')}
                </Typography>
                <Link 
                variant='robotoFont3' 
                underline='none' 
                color='primary.light' 
                href="http://facebook.com/groups/305562943758" 
                target="_blank"
                sx={{ display: 'flex', mt: 2, pl: 2 }} 
                >
                {t('socialNetworks.facebook')}
                  <FacebookIcon sx={{ width: '24px', height: '24px', ml: 2 }}/> 
                </Link>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} md={3} order={{ xs: 3, sm: 3, md: 3 }} >
            <Grid sx= {{ display: 'flex', justifyContent: 'center' }}>
              <img src="/img/logo/ETILogo.svg" alt="ETI" style={{ width: '180px' }}/> 
            </Grid>
        </Grid>
    </Grid>
  )
}