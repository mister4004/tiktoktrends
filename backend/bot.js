const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const axios = require('axios');

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.WEBAPP_URL) {
  console.error('Ошибка: Необходимо указать TELEGRAM_BOT_TOKEN и WEBAPP_URL в .env файле');
  process.exit(1);
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;
const bot = new TelegramBot(token, { polling: true });

// Логирование ошибок поллинга
bot.on('polling_error', (error) => {
  console.error('Ошибка поллинга:', error.message);
});

// Логирование всех сообщений
bot.on('message', (msg) => {
  console.log('Получено сообщение:', msg.text, 'от', msg.from.username || msg.from.id);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log('Получена команда /start от', msg.from.username || msg.from.id);

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔥 Открыть тренды', web_app: { url: webAppUrl } }]
      ]
    }
  };

  bot.sendMessage(chatId, 'Добро пожаловать!', keyboard)
    .then(() => console.log('Сообщение отправлено успешно'))
    .catch(err => console.error('Ошибка отправки:', err.message));
});

// Команда /trends
bot.onText(/\/trends/, async (msg) => {
  const chatId = msg.chat.id;
  console.log('Получена команда /trends от', msg.from.username || msg.from.id);

  try {
    // Обновляем тренды через API
    const fetchResponse = await axios.get(`${process.env.CLOUDFLARE_WORKER_URL}/api/fetch-trends`);
    if (fetchResponse.data.message === 'Trends fetched and saved successfully') {
      // Получаем обновленные тренды
      const trendsResponse = await axios.get(`${process.env.CLOUDFLARE_WORKER_URL}/api/trends`);
      const trends = trendsResponse.data;

      // Формируем сообщение с трендами
      let message = 'Тренды TikTok:\n\n';
      trends.forEach((trend, index) => {
        message += `${index + 1}. ${trend.title}\nХештеги: ${trend.hashtags.join(', ')}\nURL: ${trend.playUrl}\n\n`;
      });

      bot.sendMessage(chatId, message);
    } else {
      bot.sendMessage(chatId, 'Не удалось получить тренды. Попробуйте позже.');
    }
  } catch (error) {
    console.error('Error fetching trends:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при получении трендов. Попробуйте позже.');
  }
});

console.log('Бот запущен и ожидает команд...');
