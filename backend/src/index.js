require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  })
);
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    const result = await db.query('SELECT NOW() AS now');
    res.json({
      status: 'ok',
      service: 'animal-adoption-backend',
      database: 'connected',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(500).json({
      status: 'error',
      service: 'animal-adoption-backend',
      database: 'disconnected',
      message: error.message,
    });
  }
});

app.get('/api/animals', async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, species, breed, age, gender, status, description, created_at
       FROM animals
       ORDER BY id ASC`
    );
    res.json({
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch animals:', error.message);
    res.status(500).json({
      error: 'Failed to load animals from database',
    });
  }
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Backend API listening on http://0.0.0.0:${port}`);
});

const shutdown = async () => {
  console.log('Shutting down backend server...');
  server.close(async () => {
    await db.pool.end();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
