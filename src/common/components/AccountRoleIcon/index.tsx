import * as React from 'react';
import { SvgIconWrapper } from '../SvgIconWrapper';
import {
  ACCOUNT_ROLE_COLORS,
  ACCOUNT_ROLE_ICONS,
  ACCOUNT_ROLES
} from '~domains/wallet/constants/account.constants';
import { WalletAccountType } from '~domains/wallet/typings';

const DEFAULT_ROLE = 'default-mt5';
const FALLBACK_ROLE = 'default-mt5';

export const AccountTypeIcon = ({
  role = DEFAULT_ROLE
}: {
  role: WalletAccountType;
}) => {
  if (!ACCOUNT_ROLES.includes(role)) {
    role = FALLBACK_ROLE;
  }
  const IconComponent = ACCOUNT_ROLE_ICONS[role];
  const color = ACCOUNT_ROLE_COLORS[role];

  return (
    <SvgIconWrapper backgroundColor={color}>
      <IconComponent />
    </SvgIconWrapper>
  );
};
