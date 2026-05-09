import { useEffect, useState, useMemo } from 'react';
import { getLocalCsvData } from './utils/csvLoader';
import styles from './App.module.css';
import type { CryptoProperties } from './types';

function App() {
  const [cryptos, setCryptos] = useState<CryptoProperties[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCsv = async () => {
    setLoading(true);
    const data = await getLocalCsvData();
    setCryptos(data);
    setLoading(false);
  };

  const fetchLive = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/scrape');
      const data = await res.json();
      setCryptos(data);
    } catch (e) {
      alert("Запусти сервер (node server.js)");
    }
    setLoading(false);
  };

  useEffect(() => { loadCsv(); }, []);

  const filtered = useMemo(() => {
    return cryptos.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [cryptos, searchTerm]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crypto Tracker</h1>
      
      <div className={styles.controls}>
        <button onClick={loadCsv} className={`${styles.btn} ${styles.btnPrimary}`}>CSV</button>
        <button onClick={fetchLive} className={`${styles.btn} ${styles.btnPrimary}`}>CoinMarketCap</button>
      </div>

      <input 
        className={styles.sear}
        type="text" 
        placeholder="Поиск..." 
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Доступно монет</th>
            <th>Капитализация</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                <strong>{c.name}</strong> <small className="text-gray-400">{c.symbol}</small>
              </td>
              <td className={styles.price}>
                {typeof c.price === 'number' 
                  ? `$${c.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
                  : c.price}
              </td>
              <td>{c.circulating_supply}</td>
              <td>
                {typeof c.market_cap === 'number'
                  ? `$${(c.market_cap / 1e9).toFixed(2)} млрд`
                  : c.market_cap}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;