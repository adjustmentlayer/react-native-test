import { codes } from 'currency-codes';
import { CRYPTO_CURRENCIES } from '~domains/wallet/constants/currencies.constants';
import { FrontEndReadyInstrument } from '~domains/wallet/typings';
import { INSTRUMENTS_BLACKLIST } from '~domains/wallet/constants/instruments.constants';

export const removeSymbolExtension = (symbol: string) => {
  return symbol.includes('.') ? symbol.slice(symbol.indexOf('.')) : symbol;
};

export const getFancySymbol = (symbol: string) => {
  const codeList = codes().concat(CRYPTO_CURRENCIES);
  const code = codeList.find((currency) => symbol.endsWith(currency));
  return code ? symbol.slice(0, symbol.indexOf(code)) + ' / ' + code : symbol;
};

export const isInstrumentAllowed = (instrument: FrontEndReadyInstrument) => {
  return (
    instrument.trade_mode === 4 &&
    !INSTRUMENTS_BLACKLIST.includes(instrument.symbolWithoutExtension)
  );
};
