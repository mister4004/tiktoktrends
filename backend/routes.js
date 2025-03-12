const express = require('express');
const { parseTrends } = require('./parser');
const router = express.Router();

router.get('/trends', (req, res) => {
  const trends = require('fs').readFileSync('trends.json');
  res.json(JSON.parse(trends));
});

router.post('/refresh', (req, res) => {
  parseTrends();
  res.sendStatus(200);
});

module.exports = router;
