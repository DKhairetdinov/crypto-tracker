import { useEffect, useState, useMemo } from 'react';
import type { CryptoProperties } from './types/';
import { getLocalCsvData } from './utils/csvLoader';

function App() {
  const [cryptos, setCryptos] = useState<CryptoProperties[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocalCsvData().then(data => {
      setCryptos(data);
      setLoading(false);
    });
  }, []);

  const filteredCryptos = useMemo(() => {
    return cryptos.filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cryptos, searchTerm]);

  if (loading) return <div className="p-10">Загрузка данных...</div>;

  return (
    <div>
      <h1>Crypto Tracker</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Поиск по названию (например, Bitcoin)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}

        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена (USD)</th>
            <th>Капитализация</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.map(coin => (
            <tr key={coin.id}>
              <td>{coin.id}</td>
              <td>
                <strong>{coin.name}</strong> <span>{coin.symbol}</span>
              </td>
              <td>
                ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td>
                ${(coin.market_cap / 1_000_000_000).toFixed(2)} млрд
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredCryptos.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Криптовалюта "{searchTerm}" не найдена.
        </p>
      )}
    </div>
  );
}

export default App;