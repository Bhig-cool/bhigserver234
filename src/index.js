import { connect } from "mongoose";
import app from "./app.js";
import logger from "./utils/logger.js";

try {
  const conn = await connect(process.env.MONGO_URI);
  logger.info(`MongoDB connected: ${conn.connection.host}`);
} catch (error) {
  logger.error(error);
  process.exit(1);
}

const port = process.env.PORT || 5001;
app.listen(port, () => {
  logger.info(`Live at http://localhost:${port}`);
});

//
app.get('/users/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const user = await db.collection('users').findOne({ email: email }); // Replace with your collection name
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

