const axios = require('axios');
const { parseString } = require('xml2js');

async function parseTrends() {
  try {
    const { data } = await axios.get(process.env.RSS_FEED_URL);
    parseString(data, (err, result) => {
      if (err) throw err;
      const items = result.rss.channel[0].item;
      const trends = items.map(item => ({
        title: item.title[0],
        url: item.link[0],
        views: item['tt:views'] ? item['tt:views'][0] : 'N/A'
      }));
      // Сохраняем в кеш (например, в файл или память)
      require('fs').writeFileSync('trends.json', JSON.stringify(trends));
    });
  } catch (error) {
    console.error('Parsing error:', error);
  }
}

module.exports = { parseTrends };
