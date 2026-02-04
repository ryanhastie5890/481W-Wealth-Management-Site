import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';

export async function getStockQuote(symbol) {
  const response = await axios.get(BASE_URL, {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol,
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });

  return response.data;
}