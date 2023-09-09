import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { Signup, SignupStatus } from '../../shared/signup';
import groupBy from 'lodash/groupBy';
import { Paper, Typography } from '@mui/material';
import { partition } from 'lodash';

function SignupSummaryByStatus(props: { signups: Signup[]; label: string }) {
  const { signups, label } = props;

  const [argentinaSignups, otherCountrySignups] = partition(
    signups,
    (s) => s.country === 'Argentina'
  );
  const grouped = groupBy(otherCountrySignups, 'country');

  const groupedByProvince = groupBy(argentinaSignups, 'province');

  return (
    <TreeView
      aria-label="Signup summary"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem nodeId={label} label={`${label}: ${signups?.length ?? 0}`}>
        <TreeItem nodeId={'Total'} label={'Total: ' + signups?.length ?? 0}>
          <TreeItem nodeId={'Argentina'} label={'Argentina: ' + argentinaSignups?.length}>
            {Object.entries(groupedByProvince).map(([province, signupsForProvince], i) => (
              <TreeItem
                nodeId={'Argentina_' + i.toString()}
                label={province + ': ' + signupsForProvince.length}
                key={i}
              />
            ))}
          </TreeItem>
          <TreeItem nodeId={'Others'} label={'Otros Países: ' + otherCountrySignups?.length}>
            {Object.entries(grouped).map(([country, signupsForCountry], i) => (
              <TreeItem
                nodeId={i.toString()}
                label={country + ': ' + signupsForCountry.length}
                key={i}
              />
            ))}
          </TreeItem>
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
}
export default function SignupSummary(props: { signups: Signup[] }) {
  const { signups } = props;

  return (
    <Paper>
      <Typography variant="h5" color="secondary" align="center">
        Totales
      </Typography>
      <div style={{ display: 'flex' }}>
        <SignupSummaryByStatus signups={signups} label={'Inscriptxs'} />
        <SignupSummaryByStatus
          signups={signups.filter(
            (i) =>
              i.status &&
              [
                SignupStatus.CONFIRMED,
                SignupStatus.PAYMENT_TO_CONFIRM,
                SignupStatus.PAYMENT_PENDING
              ].includes(i.status)
          )}
          label={'Confirmada/Pendiente de Pago'}
        />
      </div>
    </Paper>
  );
}
