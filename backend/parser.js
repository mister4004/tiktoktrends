const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function parseTrends() {
  try {
    const TREND_API_URL = process.env.TREND_API_URL;
    const TREND_API_KEY = process.env.TREND_API_KEY;

    if (!TREND_API_URL || !TREND_API_KEY) {
      throw new Error('Переменные TREND_API_URL или TREND_API_KEY не указаны в .env');
    }

    console.log('👉 Запрос к API:', TREND_API_URL);

    const response = await axios.get(TREND_API_URL, {
      headers: {
        'X-RapidAPI-Key': TREND_API_KEY,
        'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com'
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

    console.log('✅ Ответ от API получен. Статус:', response.status);
    console.log('🔍 Структура ответа:', JSON.stringify(response.data, null, 2));

    // Проверка наличия данных
    if (!response.data || response.data.code !== 0 || !response.data.data?.videos) {
      throw new Error('Некорректный формат данных: поле "data.videos" отсутствует');
    }

    // Извлечение данных
    const trends = response.data.data.videos.map(item => {
      console.log('📝 Данные для извлечения хэштегов:', JSON.stringify(item.challenges, null, 2));
      
      return {
        title: item.title || 'N/A',
        hashtags: item.challenges && item.challenges.length > 0 
          ? item.challenges.map(ch => ch.title).filter(tag => tag) 
          : [],
        playUrl: item.play || 'N/A',
        cover: item.cover || 'N/A'
      };
    });

    console.log('📝 Извлечённые тренды:', JSON.stringify(trends, null, 2));

    // Сохранение данных
    const trendsPath = path.join(__dirname, 'trends.json');
    fs.writeFileSync(trendsPath, JSON.stringify(trends, null, 2));
    console.log('💾 Данные успешно сохранены в:', trendsPath);

    // Возвращаем данные, чтобы их можно было использовать в server.js
    return trends;
  } catch (error) {
    console.error('❌ Ошибка парсера:', error.message);
    if (error.response) {
      console.error('⚠️ Статус ответа API:', error.response.status);
      console.error('⚠️ Данные ошибки:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('⚠️ Ошибка сети:', error.message);
    }
    return null; // Возвращаем null в случае ошибки
  }
}

module.exports = { parseTrends };
