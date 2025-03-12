const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Кнопка для открытия мини-приложения
  const webAppUrl = 'https://mister4004.github.io/tiktoktrends/'; // Замените на ваш домен
  const keyboard = {
    inline_keyboard: [
      [{ text: '🔥 Открыть тренды', web_app: { url: webAppUrl } }]
    ]
  };

  bot.sendMessage(chatId, 'Добро пожаловать!', {
    reply_markup: { inline_keyboard: keyboard.inline_keyboard }
  });
});
