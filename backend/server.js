const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Подключение маршрутов API
app.use('/api', routes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Грациозное завершение работы сервера
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server has been shut down.');
    process.exit(0);
  });
});
