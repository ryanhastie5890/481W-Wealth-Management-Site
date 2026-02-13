import { dbCon } from '../db/database.js';
import { getStockQuote } from "../services/alphaVantage.js"

// create promise wrapper for non-callback flow
const db = dbCon.promise();

export async function showStock(req, res) {
    try {
        const { symbol } = req.query;

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

/**
 * Buys shares of a stock for the authenticated user.
 *
 * Requirements:
 * - The user must be authenticated (req.session.userId must exist)
 * - AlphaVantage must return a valid stock quote for the symbol
 *
 * Request Body:
 * @param {Object} req.body
 * @param {string} req.body.symbol - Stock ticker symbol (e.g. "AAPL")
 * @param {number} req.body.shares - Number of shares to purchase (must be > 0)
 *
 * Request Context:
 * @param {Object} req.session
 * @param {number} req.session.userId - Authenticated user's ID
 *
 * Response:
 * - 201: Stock purchase successful
 * - 400: Missing or invalid input
 * - 500: Server or external API error
 *
 * Side Effects:
 * - Inserts a new row into the `investments` table if the user does not already own the stock
 * - Updates `shares` and recalculates `average_price` if the stock already exists
 */
export async function buyStock(req, res) {
    try {
        const userId = req.session.userId;
        let { symbol, shares } = req.body;

        if (!symbol || !shares || shares <= 0) {
            return res.status(400).json({ error: "symbol and positive shares are required" });
        }

        symbol = symbol.toUpperCase();

        // Get live price
        const quote = await getStockQuote(symbol);
        const price = parseFloat(quote['05. price']);

        if (isNaN(price)) {
            return res.status(500).json({ error: "Invalid stock price" });
        }

        // Check existing investment
        const [rows] = await db.query(
            `SELECT shares, average_price
             FROM investments
             WHERE userId = ? AND symbol = ?`,
            [userId, symbol]
        );

        if (rows.length === 0) {
            // Insert new investment
            await db.query(
                `INSERT INTO investments (userId, symbol, shares, average_price)
                 VALUES (?, ?, ?, ?)`,
                [userId, symbol, shares, price]
            );
        } else {
            // Update existing investment
            const existingShares = Number(rows[0].shares);
            const existingAvg = Number(rows[0].average_price);

            const totalShares = existingShares + shares;
            const newAvg =
                ((existingShares * existingAvg) + (shares * price)) / totalShares;

            await db.query(
                `UPDATE investments
                 SET shares = ?, average_price = ?
                 WHERE userId = ? AND symbol = ?`,
                [totalShares, newAvg, userId, symbol]
            );
        }

        res.status(201).json({
            message: "Stock purchased successfully",
            symbol,
            shares,
            price
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to buy stock" });
    }
}