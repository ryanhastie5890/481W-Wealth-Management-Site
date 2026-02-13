import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Fetches the latest global stock quote for a given symbol from the Alpha Vantage API.
 *
 * @async
 * @function getStockQuote
 * @param {string} symbol - The stock ticker symbol (e.g., "AAPL", "MSFT").
 * @returns {Promise<{
 *   `{
 *     "01. symbol": string,
 *     "02. open": string,
 *     "03. high": string,
 *     "04. low": string,
 *     "05. price": string,
 *     "06. volume": string,
 *     "07. latest trading day": string,
 *     "08. previous close": string,
 *     "09. change": string,
 *     "10. change percent": string
 *   }`
 * }>}
 *
 * @throws {Error} If the HTTP request fails or the API returns an error.
 *
 * @example
 * const quote = await getStockQuote('AAPL');
 * console.log(quote['Global Quote']['05. price']); // "275.5000"
 */

export async function getStockQuote(symbol) {
  const response = await axios.get(BASE_URL, {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol,
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });

  return response.data['Global Quote'];
}