import * as React from 'react';
import { AccountTypeIcon } from '~common/components/AccountRoleIcon';
import { nh, nw } from '~common/lib/normalize.helper';
import { Copyable } from '~common/components/Copyable';
import { Text } from '~common/components/Text';
import {
  ACCOUNT_ROLE_COLORS,
  ACCOUNT_ROLE_LABELS
} from '~domains/wallet/constants/account.constants';
import { useEffect } from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { WalletAccountType } from '~domains/wallet/typings';
import { poppins, roboto } from '~common/lib/font.helper';
import { AccountModel } from '~domains/wallet/wallet.store';
import { rightTrimText } from '~common/lib/trim-text.helper';

type ViewProps = {
  compact?: boolean;
  role?: WalletAccountType;
};

const column = ({
  accountType,
  compact
}: {
  accountType: WalletAccountType;
  compact: boolean;
}) => {
  const views = {
    'demo-mt5': () => {
      return (
        <View
          style={[
            styles.property,
            {
              left: nw(144)
            }
          ]}
        >
          <Text style={styles.propertyLabel}>Type</Text>
          <Text style={[styles.propertyValue, { color: '#0066FF' }]}>Demo</Text>
        </View>
      );
    },
    'commission-mt5': () => {
      return (
        <View
          style={[
            styles.property,
            {
              left: nw(144)
            }
          ]}
        >
          <Text style={styles.propertyLabel}>Type</Text>
          <Text style={[styles.propertyValue, { color: '#0066FF' }]}>
            Commission
          </Text>
        </View>
      );
    },
    'default-mt5': ({ compact }: ViewProps) => {
      return (
        <View
          style={[
            styles.property,
            {
              left: nw(144)
            }
          ]}
        >
          <Text style={styles.propertyLabel}>Address</Text>
          <Text style={[styles.propertyValue]}>
            <Copyable
              trim={compact ? 8 : 15}
              value={'34c760ba-5996-4427-917c-45b70cf15004'}
            />
          </Text>
        </View>
      );
    },
    'master-mt5': ({ compact }: ViewProps) => {
      return (
        <View
          style={[
            styles.property,
            {
              left: nw(144)
            }
          ]}
        >
          <Text style={styles.propertyLabel}>Master ID</Text>
          <Text style={[styles.propertyValue]}>
            <Copyable
              trim={compact ? 8 : 15}
              value={'34c760ba-5996-4427-917c-45b70cf15004'}
            />
          </Text>
        </View>
      );
    },
    'investor-mt5': ({ compact }: ViewProps) => {
      return (
        <View
          style={[
            styles.property,
            {
              left: nw(144)
            }
          ]}
        >
          <Text style={styles.propertyLabel}>PnL</Text>
          <Text style={[styles.propertyValue]}>
            <Copyable
              trim={compact ? 8 : 15}
              value={'34c760ba-5996-4427-917c-45b70cf15004'}
            />
          </Text>
        </View>
      );
    }
  };

  if (!Object.keys(views).includes(accountType)) {
    return '';
  }

  return views[accountType]({
    compact
  });
};

const getAccountRoleLabel = (role: WalletAccountType) => {
  if (!Object.keys(ACCOUNT_ROLE_LABELS).includes(role)) {
    return ACCOUNT_ROLE_LABELS['demo-mt5'];
  }
  return ACCOUNT_ROLE_LABELS[role];
};

export const AccountCard = ({
  compact = true,
  item,
  isActive,
  style
}: {
  compact: boolean;
  item: AccountModel;
  isActive: boolean;
  style: ViewStyle;
}) => {
  const { attributes } = item;
  const { is_archived = false } = attributes;

  useEffect(() => {
    if (isActive) {
      item.initStreaming();
    }
    return () => {
      item.destroyStreaming();
    };
  }, [isActive]);

  return (
    <ImageBackground
      style={[
        styles.container,
        {
          width: nw(310),
          height: nh(compact ? 98 : 121.5),
          ...style
        }
      ]}
      source={require('./bg-gradient.png')}
    >
      <View style={styles.name}>
        <AccountTypeIcon role={item.accountType} />
        <Text style={styles.nameText}>{rightTrimText(item.name, 7)}</Text>
      </View>
      <View
        style={[
          styles.property,
          {
            left: nw(22)
          }
        ]}
      >
        <Text style={styles.propertyLabel}>Balance</Text>
        <Text style={styles.propertyValue}>{item.balance} USD</Text>
      </View>
      {column({
        accountType: item.accountType,
        compact
      })}
      <View
        style={[
          styles.status,
          {
            top: nh(compact ? 72 : 99)
          }
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: is_archived ? '#FF5C00' : '#2BD700'
            }
          ]}
        >
          {is_archived ? 'Archived' : 'Active'}
        </Text>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: is_archived ? '#FF5C00' : '#2BD700'
            }
          ]}
        />
      </View>
      <ImageBackground
        source={require('./currency-gradient.png')}
        style={styles.currency}
      >
        <Text style={styles.currencyText}>USD</Text>
      </ImageBackground>
      <View
        style={[
          styles.type,
          {
            backgroundColor: ACCOUNT_ROLE_COLORS[item.accountType]
          }
        ]}
      >
        <Text style={styles.typeText}>
          {getAccountRoleLabel(item.accountType)}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
    fontFamily: roboto(500)
  },
  currency: {
    position: 'absolute',
    width: nw(78),
    height: nh(41),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 6,
    background: 'transparent',
    overflow: 'hidden'
  },
  currencyText: {
    textTransform: 'uppercase',
    fontFamily: roboto(400),
    fontSize: nh(14)
  },
  type: {
    position: 'absolute',
    right: 0,
    width: nw(98),
    height: nh(36),
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  typeText: {
    fontSize: nh(12),
    lineHeight: nh(14)
  },
  name: {
    position: 'absolute',
    left: nw(95),
    height: nh(36),
    alignItems: 'center',
    flexDirection: 'row'
  },
  nameText: {
    textDecorationLine: 'underline',
    marginLeft: nw(6),
    fontFamily: roboto(500)
  },
  property: {
    position: 'absolute',
    top: nh(56)
  },
  propertyLabel: {
    fontSize: nh(10),
    lineHeight: nh(12),
    fontFamily: roboto(500)
  },
  propertyValue: {
    marginTop: nh(2),
    fontSize: nh(16),
    lineHeight: nh(24),
    fontFamily: poppins(600)
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: nw(20)
  },
  statusText: {
    fontSize: nh(10),
    lineHeight: nh(12)
  },
  statusDot: {
    height: nh(8),
    width: nh(8),
    marginLeft: nw(5),
    borderRadius: 9999
  }
});
