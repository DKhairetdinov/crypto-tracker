export interface CryptoProperties {
  id: number; 
  name: string;
  symbol: string;
  slug: string;
  circulating_supply: string | number;
  price: string | number;
  market_cap: string | number;
}