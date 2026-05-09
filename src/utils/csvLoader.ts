import Papa  from "papaparse";
import type { CryptoProperties } from "../types";
export const getLocalCsvData = async (): Promise<CryptoProperties[]> => {
  const response = await fetch('./public/currencies26.csv');
  const csvText = await response.text();

  return new Promise ((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const mappedData: CryptoProperties[] = results.data.map((row: any) =>{
            const parseNum = (val: string) => {
              if(!val) return 0;
              return parseFloat(val.toString().replace(',', '.'));
            };

            return {
              id: Number(row['data.id']),
              name: row['data.name'],
              symbol: row['data.symbol'],
              slug: row['data.slug'],
              circulating_supply: parseNum(row['data.circulating_supply']),
              price: parseNum(row['data.quote.USD.price']),
              market_cap: parseNum(row['data.quote.USD.market_cap']),
            };
          });
          resolve(mappedData);
        },
        error: (error: any) => reject(error)
      });
  });
};