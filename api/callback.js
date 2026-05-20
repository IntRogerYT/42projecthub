const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { code, code_verifier } = req.body;

  try {
    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        code_verifier,
        redirect_uri: 'https://' + req.headers.host + '/index.html'
      })
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error("42 API Error:", errorData);
        return res.status(response.status).json({ error: 'Failed to fetch token from 42 API', details: errorData });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
