import OppositeArrows from '../../../common/components/svg/OppositeArrows';
import GraduateHat from '../../../common/components/svg/GraduateHat';
import ManHoldingMoneyBag from '../../../common/components/svg/ManHoldingMoneyBag';
import Scales from '../../../common/components/svg/Scales';
import Percent from '../../../common/components/svg/Percent';
import { FunctionComponent } from 'react';
import { WalletAccountType } from '~domains/wallet/typings';

const ACCOUNT_ROLE_COLORS: Record<WalletAccountType, string> = {
  'demo-mt5': '#0066FF',
  'master-mt5': '#D7005A',
  'investor-mt5': '#2BD700',
  'default-mt5': '#0022D7',
  'commission-mt5': '#0066FF'
} as const;

const ACCOUNT_ROLE_LABELS: Record<WalletAccountType, string> = {
  'default-mt5': 'Balance',
  'master-mt5': 'Master',
  'investor-mt5': 'Investor',
  'commission-mt5': 'Commission',
  'demo-mt5': 'Demo'
} as const;

const ACCOUNT_ROLES: WalletAccountType[] = [
  'default-mt5',
  'master-mt5',
  'investor-mt5',
  'demo-mt5',
  'commission-mt5'
];

const ACCOUNT_ROLE_ICONS: Record<WalletAccountType, FunctionComponent> = {
  'demo-mt5': OppositeArrows,
  'master-mt5': GraduateHat,
  'investor-mt5': ManHoldingMoneyBag,
  'default-mt5': Scales,
  'commission-mt5': Percent
} as const;

export {
  ACCOUNT_ROLE_COLORS,
  ACCOUNT_ROLE_LABELS,
  ACCOUNT_ROLE_ICONS,
  ACCOUNT_ROLES
};
