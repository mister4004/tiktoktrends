const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Маршрут для получения трендов
app.get('/api/trends', (req, res) => {
  const trendsPath = path.join(__dirname, 'trends.json');
  
  // Проверяем существование файла
  if (!fs.existsSync(trendsPath)) {
    return res.status(404).json({ error: 'Trends data not found' });
  }

  try {
    const trends = JSON.parse(fs.readFileSync(trendsPath, 'utf-8'));
    res.json(trends);
  } catch (error) {
    console.error('Error reading trends.json:', error);
    res.status(500).json({ error: 'Failed to load trends' });
  }
});

// Маршрут для обновления трендов
app.get('/api/fetch-trends', async (req, res) => {
  try {
    const response = await axios.get('https://tiktok-scraper7.p.rapidapi.com/feed/search', {
      headers: {
        'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
        'x-rapidapi-key': process.env.TREND_API_KEY
      },
      params: {
        keywords: 'fyp',
        region: 'us',
        count: 10,
        cursor: 0,
        publish_time: 0,
        sort_type: 0
      }
    });

    // Извлекаем только нужные данные
    const trends = response.data.videos.map(item => ({
      title: item.title || 'N/A',
      hashtags: item.challenges ? item.challenges.map(ch => ch.title) : [],
      playUrl: item.play || 'N/A'
    }));

    // Сохраняем данные
    fs.writeFileSync(path.join(__dirname, 'trends.json'), JSON.stringify(trends, null, 2));
    res.json({ message: 'Trends fetched and saved successfully' });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Запуск сервера
const server = app.listen(PORT, '0.0.0.0', () => {  // Явно указываем хост
  console.log(`Server running on port ${PORT}`);
});

// Грациозное завершение
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server shut down.');
    process.exit(0);
  });
});
