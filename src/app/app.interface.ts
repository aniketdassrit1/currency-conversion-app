export interface CurrencyListInterface {
  [key: string]: CurrencySingleInterface
}

export interface CurrencySingleInterface {
  currencyName: string;
  currencySymbol: string;
  id: string;
}

export interface CurrencyConversionInterface {
  base: string;
  date: string;
  rates: {
    [key: string]: string;
  };
}

export interface ConversionData {
  from: string;
  to: string;
}

export interface HistoricalExchangeRate {
  [key: string]: Record<string, number>;
}
