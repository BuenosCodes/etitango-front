import * as React from 'react';
import { SimpleTreeView as TreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
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
      // defaultCollapseIcon={<ExpandMoreIcon />}
      // defaultExpandIcon={<ChevronRightIcon />}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem itemId={label} label={`${label}: ${signups?.length ?? 0}`}>
        <TreeItem itemId={'Total'} label={'Total: ' + signups?.length ?? 0}>
          <TreeItem itemId={'Argentina'} label={'Argentina: ' + argentinaSignups?.length}>
            {Object.entries(groupedByProvince).map(([province, signupsForProvince], i) => (
              <TreeItem
                itemId={'Argentina_' + i.toString()}
                label={province + ': ' + signupsForProvince.length}
                key={i}
              />
            ))}
          </TreeItem>
          <TreeItem itemId={'Others'} label={'Otros Países: ' + otherCountrySignups?.length}>
            {Object.entries(grouped).map(([country, signupsForCountry], i) => (
              <TreeItem
                itemId={i.toString()}
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
