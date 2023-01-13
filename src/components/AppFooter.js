import * as React from 'react';
import { Grid, Link, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';

export default function AppFooter() {
  const { t } = useTranslation([SCOPES.COMPONENTS.FOOTER, SCOPES.COMPONENTS.BAR], {
    useSuspense: false
  });
  const links = [
    { href: '/historia-del-eti', title: t(`${SCOPES.COMPONENTS.BAR}.history`) },
    { href: '/manifiesto-etiano', title: t(`${SCOPES.COMPONENTS.BAR}.manifest`) },
    { href: '/comision-de-genero-contact', title: t(`${SCOPES.COMPONENTS.BAR}.genderContact`) }
  ];
  return (
    <Grid
      container
      mt={2}
      mb={2}
      spacing={4}
      paddingX={10}
      paddingY={5}
      sx={{ backgroundColor: 'secondary.dark' }}
      alignContent={'center'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Grid item xs={12} md={4}>
        <Grid
          direction={'column'}
          container
          alignItems={'center'}
          justifyContent={'space-between'}
          style={{ height: '25vh' }}
        >
          <Typography textAlign={'center'} color={'white'}>
            {t('about.title').toUpperCase()}
          </Typography>
          <Typography textAlign={'center'} color={'white'}>
            {t('about.description')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid
          direction={'column'}
          container
          alignItems={'center'}
          justifyContent={'space-between'}
          style={{ height: '25vh' }}
        >
          <Typography textAlign={'center'} color={'white'} marginBottom={4}>
            {t('links.title').toUpperCase()}
          </Typography>
          {links.map((link) => (
            <Link
              variant="p"
              color="white"
              underline="none"
              display={'flex'}
              href={link.href}
              key={link.href}
            >
              {link.title}
            </Link>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid
          direction={'column'}
          container
          alignItems={'center'}
          justifyContent={'space-between'}
          style={{ height: '25vh' }}
        >
          <Typography textAlign={'center'} color={'white'}>
            {t('socialNetworks.title').toUpperCase()}
          </Typography>
          <Link href="http://facebook.com/groups/305562943758" target="_blank">
            <FacebookIcon sx={{ color: 'white', fontSize: '56px' }} />
          </Link>
          <Typography textAlign={'center'} color={'white'}>
            {t('footer')}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
