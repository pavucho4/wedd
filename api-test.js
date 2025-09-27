const { VercelRequest, VercelResponse } = require('@vercel/node');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({ 
    ok: true, 
    message: 'API работает из корня!',
    timestamp: new Date().toISOString()
  });
};
