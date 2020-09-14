export type Language = 'es' | 'en' | 'de' | 'pt';

export interface Option {
  value: any;
  label: string;
  helperText?: string;
}

export type TopBannerMessages = 'trialEnd';

export type DateFormat = 'daytime' | 'day' | 'time';

export interface Amount {
  id: string;
  amount: string;
  baseAmount: number;
  name: string;
}
