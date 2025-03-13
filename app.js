document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
  }
  
  async function loadTrends() {
    try {
      const videosContainer = document.getElementById('videos');
      videosContainer.innerHTML = '<p>Загрузка трендов...</p>';
      
      const response = await fetch('https://football.zapto.org/api/trends');
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const trends = await response.json();
      
      if (!trends || trends.length === 0) {
        videosContainer.innerHTML = '<p>Нет доступных трендов</p>';
        return;
      }

      videosContainer.innerHTML = '';
      trends.forEach(video => {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.innerHTML = `
          <div class="video-title">${video.title}</div>
          <a href="${video.url}" class="video-link" target="_blank">Смотреть</a>
        `;
        videosContainer.appendChild(div);
      });
    } catch (error) {
      console.error('Ошибка загрузки трендов:', error);
      document.getElementById('videos').innerHTML = '<p>Ошибка загрузки трендов. Пожалуйста, попробуйте позже.</p>';
    }
  }
  
  // Запуск загрузки трендов
  loadTrends();
});
