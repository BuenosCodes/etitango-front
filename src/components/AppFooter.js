import { Grid, Link, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { ROUTES } from 'App';
import { SOCIAL_MEDIA_DATA } from 'shared/socialMedia';
import React from 'react';

export default function AppFooter() {
  const { t } = useTranslation([SCOPES.COMPONENTS.FOOTER, SCOPES.COMPONENTS.BAR], {
    useSuspense: false
  });
  const ourLinks = [
    { href: ROUTES.HOME, title: t(`${SCOPES.COMPONENTS.BAR}.eti`) },
    { href: '/historia-del-eti', title: t(`${SCOPES.COMPONENTS.BAR}.history`) },
    { href: '/manifiesto-etiano', title: t(`${SCOPES.COMPONENTS.BAR}.manifest`) },
    { href: '/comision-de-genero-who', title: t(`${SCOPES.COMPONENTS.BAR}.genderWho`) }
  ];

  const icons = {
    FacebookIcon
  };
  return (
    <Grid
      container
      paddingX={{ xs: 3, sm: 6, md: 10 }}
      paddingY={5}
      sx={{ backgroundColor: 'greyScale.900' }}
    >
      <Grid item xs={12} sm={6} md={3} mt={{ xs: 3, sm: 0, md: 0 }} order={{ xs: 1, sm: 0, md: 0 }}>
        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Typography typography="body.bold.xl" color="principal.primary">
            {t('links.title')}
          </Typography>
          {ourLinks.map((link) => (
            <Link
              typography="body.regular.l"
              color="principal.primary"
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
        <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography typography="body.bold.xl" color="principal.primary">
            {t('about.title')}
          </Typography>
          <Typography typography="body.regular.l" color="greyScale.50" sx={{ pl: 2, mt: 2, pr: 3 }}>
            {t('about.description')}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        md={2}
        mt={{ xs: 3, sm: 0, md: 0 }}
        order={{ xs: 2, sm: 2, md: 2 }}
        sx={{ display: 'flex', alignItems: { xs: 'inherit', sm: 'center', md: 'inherit' } }}
      >
        <Grid>
          <Typography typography="body.bold.xl" color="principal.primary">
            {t('socialNetworks.title')}
          </Typography>
          {SOCIAL_MEDIA_DATA.map((socialMedia) => (
            <Link
              key={socialMedia.id}
              typography="body.regular.l"
              underline="none"
              color="principal.primary"
              href={socialMedia.url}
              target="_blank"
              sx={{ display: 'flex', mt: 2, pl: 2 }}
            >
              {t(`${socialMedia.name}`)}
              {React.createElement(icons[socialMedia.icon], {
                sx: { width: '24px', height: '24px', ml: 2 }
              })}
            </Link>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6} md={3} order={{ xs: 3, sm: 3, md: 3 }}>
        <Grid
          sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start', md: 'center' } }}
        >
          <img src="/img/logo/ETILogo.svg" alt="ETI" style={{ width: '180px' }} />
        </Grid>
      </Grid>
    </Grid>
  );
}
