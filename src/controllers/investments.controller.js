import { getStockQuote } from "../services/alphaVantage.js"

export async function showStock(req, res) {
    try {
        const { symbol } = req.body;

        if (!symbol) {
            return res.status(400).json({ error: 'symbol is required' });
        }

        // Return the stock quote from AlphaVantage
        const result = await getStockQuote(symbol);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stock information' });
    }
}