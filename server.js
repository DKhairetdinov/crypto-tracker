import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/scrape', async (req, res) => {
  try {
    const { data: html } = await axios.get('https://coinmarketcap.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(html);
    const result = [];

    $('table.cmc-table tbody tr').each((i, el) => {
      if (i < 15) {
        const tds = $(el).find('td');
        let rawName = tds.eq(2).text().trim();
        const cleanName = rawName.replace(/([a-z])([A-Z])/g, '$1 $2');
        const price = tds.eq(3).text().trim();
        const rawCap = tds.eq(7).text().trim();
        const capParts = rawCap.split('$'); 
        const marketCap = capParts[1] ? '$' + capParts[1] : rawCap;
        const slug = cleanName.toLowerCase().trim().replace(/\s+/g, '-');
        const circulatingSupply = tds.eq(9).text().trim();

        if (cleanName && price) {
          result.push({
            id: i + 1,
            name: cleanName,
            symbol: "",
            slug: slug,
            price: price,
            market_cap: marketCap,
            circulating_supply: circulatingSupply
          });
        }
      }
    });

    console.log(`Успешно распаршено: ${result.length}`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Ошибка парсинга" });
  }
});

app.listen(3001, () => console.log('Launched'));
