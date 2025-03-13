const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
const { parseTrends } = require('./parser.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Убедитесь, что PORT указан в .env

app.use(express.json());
app.use(cors({
  origin: '*', // Для тестирования. В проде укажите конкретный домен
  methods: ['GET', 'POST'],
}));

// Маршрут для получения трендов
app.get('/api/trends', (req, res) => {
  const trendsPath = path.join(__dirname, 'trends.json');
  
  if (!fs.existsSync(trendsPath)) {
    return res.status(404).json({ error: 'Trends data not found' });
  }

  try {
    const trends = JSON.parse(fs.readFileSync(trendsPath, 'utf-8'));
    res.json(trends);
  } catch (error) {
    console.error('Ошибка чтения trends.json:', error.message);
    res.status(500).json({ error: 'Failed to load trends' });
  }
});

// Маршрут для обновления трендов
app.get('/api/fetch-trends', async (req, res) => {
  try {
    const success = await parseTrends(); // Возвращает true/false

    if (!success) {
      return res.status(500).json({ error: 'Failed to fetch trends' });
    }

    const trends = JSON.parse(fs.readFileSync(path.join(__dirname, 'trends.json'), 'utf-8'));
    res.json(trends);
  } catch (error) {
    console.error('Ошибка при получении трендов:', error.message);
    res.status(500).json({ error: 'Failed to fetch trends', details: error.message });
  }
});

// Запуск сервера
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Грациозное завершение
process.on('SIGINT', () => {
  server.close(() => {
    console.log('✅ Server shut down.');
    process.exit(0);
  });
});
