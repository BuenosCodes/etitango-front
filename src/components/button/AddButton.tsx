import { Button, Typography } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';

export const AddButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation([SCOPES.MODULES.ETI], {
    useSuspense: false
  });
  return (
    <>
      <Button
        sx={{
          alignItems: 'flex-end',
          width: { xs: '134px', md: 'auto' },
          height: { xs: '40px', md: 'auto' },
          borderRadius: { xs: '12px', md: 'auto' },
          color: { xs: 'background.white', md: 'principal.secondary' },
          backgroundColor: { xs: 'principal.primary', md: 'transparent' },
          display: 'flex',
          justifyContent: 'center',
          '&:hover': { backgroundColor: { xs: 'principal.primary', md: 'transparent' } }
        }}
        onClick={onClick}
      >
        <Typography
          typography="body.medium.l"
          sx={{
            mr: { xs: 1, md: 1 },
            color: { xs: 'background.white', md: 'principal.secondary' }
          }}
        >
          {t('addButton')}
        </Typography>
        <PersonAddAltOutlinedIcon
          sx={{ color: { xs: 'greyScale.50', md: 'principal.secondary' } }}
        />
      </Button>
    </>
  );
};
