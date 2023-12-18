import * as React from 'react';
import { Grid, Link, Typography, Avatar, Paper, Box} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';


export default function NewFooter() {
  const { t } = useTranslation([SCOPES.COMPONENTS.FOOTER, SCOPES.COMPONENTS.BAR], {
    useSuspense: false
  });
  const links = [
    { href: '/', title: 'ETI' },
    { href: '/historia-del-eti', title: t(`${SCOPES.COMPONENTS.BAR}.history`) },
    { href: '/', title: 'Comisiones Etianas' },
    { href: '/comision-de-genero-who', title: t(`${SCOPES.COMPONENTS.BAR}.genderWho`) },
  
  ];
  return (

    <Box
      
      mt={2}
      mb={2}
      spacing={1}
      paddingX={12}
      paddingY={6}
       sx={{ backgroundColor: 'rgba(33, 33, 33, 1)'}}
      // direction={'column'}
      
    >
      <Grid
      container
      spacing={2}
      > 

      {/* PRIMER COLUMNA  */}
      <Grid
      
      item xs={12} sm={6} md={3}
      display={'flex'}
      direction={'column'}
      justifyContent={'space-between'}
      >
        
        <Typography pl={6}  fontWeight={'bold'} color={'#5FB4FC'} >
            Más sobre ETI
            {/* {t('links.title').toUpperCase()} */}
          </Typography>
        

            {links.map((link) => (
                  <Link 
                    variant="p"
                    color="#5FB4FC"
                    underline="none"
                    display={'flex'}
                    href={link.href}
                    key={link.href}
                    pl={8}
                    mt={2}
                    
                  >
                    {link.title}
                  </Link>
                ))}
        
      </Grid>

    {/* SEGUNDA COLUMNA */}
      <Grid 
        item xs={12} sm={6} md={3}
        
        >
            <Typography fontWeight={'bold'} color={'#5FB4FC'}>
              Quienes somos
              {/* {t('about.title').toUpperCase()} */}
            </Typography>
        
          <Typography pl={2} mt={2} color={'white'}>
            {t('about.description')}
          </Typography>
         
        
      </Grid>

{/* TERCERA COLUMNA */}
      <Grid
          item xs={12} sm={6} md={3}
          >

          <Typography pl={6} fontWeight={'bold'}  color={'#5FB4FC'}>
            Encuéntranos en 
            {/* {t('socialNetworks.title').toUpperCase()} */}
          </Typography>
         
          <Link pl={8} mt={2} sx={{ display: 'flex', alignItems: 'center' }} underline='none' color={'#5FB4FC'} href="http://facebook.com/groups/305562943758" target="_blank">
            Facebook
            <Avatar
              src="/img/icon/facebook.png"
              alt="ETI"
              sx={{ width: '24px', height: '24px', ml: 3 }}
              
            />
             
          </Link>
         
        </Grid>

  {/* CUARTA COLUMNA */}
          <Grid
          item xs={12} sm={6} md={3}
          display={'flex'}
          alignItems={'flex-end'}
          direction={'column'}
          pr={8}      
        >
           <img
                src="/img/icon/tango_logo.png"
                alt="ETI"
                sx={{ width: '20px', height: '20px' }}
              /> 

        </Grid>

      </Grid>
    </Box>

  );
}