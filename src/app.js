import express, { json } from 'express';
import routes from '../src/routes/routes.js';
import { config } from 'dotenv';
import { connectDB } from './config/db.js';
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

config();

// Routes
app.use('/', routes);


// Connect to database
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
