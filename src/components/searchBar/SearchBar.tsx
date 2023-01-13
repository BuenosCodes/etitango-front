import { useEffect, useState } from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../helpers/constants/i18n';
import { SEARCHABLE_FIELDS } from '../../modules/inscripcion/SignupListTable';

export function SearchBar({
  setQuery
}: {
  // eslint-disable-next-line no-unused-vars
  setQuery: (value: string, columnField: string) => void;
}) {
  const [value, setValue] = useState<string>('');
  const [columnField, setColumnField] = useState<string>(SEARCHABLE_FIELDS[0]);
  useEffect(() => {
    setQuery(value, columnField);
  }, [value, columnField]);
  const { t } = useTranslation([SCOPES.COMPONENTS.SEARCH_BAR, SCOPES.COMMON.FORM], {
    useSuspense: false
  });
  return (
    <Grid container alignItems={'center'} sx={{ my: 1, py: 1 }}>
      <Grid item xs>
        <TextField
          className="text"
          placeholder={t('search')}
          onChange={(event) => setValue(event.target.value)}
          variant="standard"
          sx={{ paddingX: 2 }}
          inputProps={{ style: { fontSize: 14 } }}
          fullWidth
        />
      </Grid>
      <Grid item xs={7} md={3} alignItems={'center'} display={'flex'}>
        <FormControl fullWidth>
          <InputLabel>{t('filter')}</InputLabel>
          <Select
            value={columnField}
            label={t('filter')}
            onChange={(event) => setColumnField(event.target.value)}
            SelectDisplayProps={{ style: { padding: '6px 32px', fontSize: 14 } }}
          >
            {SEARCHABLE_FIELDS.map((field) => (
              <MenuItem key={field} value={field}>
                {t(field, { ns: SCOPES.COMMON.FORM })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Search style={{ fill: 'secondary.main', marginLeft: 5 }} />
      </Grid>
    </Grid>
  );
}
