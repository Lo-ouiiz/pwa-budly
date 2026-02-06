import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
