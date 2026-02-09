import express, { json } from 'express';
import routes from './routes/routes.js';

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(json());

// Routes
app.use('/', routes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
