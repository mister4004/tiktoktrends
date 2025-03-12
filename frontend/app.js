document.addEventListener('DOMContentLoaded', () => {
  Telegram.WebApp.ready();

  async function loadTrends() {
    const response = await fetch('https://ваш-бэкенд-домен/api/trends');
    const trends = await response.json();
    
    const container = document.getElementById('videos');
    trends.forEach(video => {
      const div = document.createElement('div');
      div.className = 'video-item';
      div.innerHTML = `
        <div class="video-title">${video.title}</div>
        <a href="${process.env.CLOUDFLARE_WORKER_URL}/${video.url}" 
           class="video-link" target="_blank">Смотреть через CDN</a>
      `;
      container.appendChild(div);
    });
  }

  loadTrends();
});
