const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
const client = redis.createClient({ url: redisUrl });

client.connect().catch(console.error);

app.use(bodyParser.json());

const BG_COLOR = process.env.BG_COLOR || '#ffffff'; // default white

// Serve dynamic HTML with background color
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Guestbook</title>
    </head>
    <body style="background-color:${BG_COLOR}">
      <h1>Guestbook</h1>
      <form id="form">
        Name: <input id="name" /><br/>
        Message: <input id="message" /><br/>
        <button type="submit">Submit</button>
      </form>
      <ul id="messages"></ul>

      <script>
        async function loadMessages() {
          const res = await fetch('/messages');
          const data = await res.json();
          document.getElementById('messages').innerHTML =
            data.map(m => \`<li><b>\${m.name}</b>: \${m.message} (\${m.timestamp})</li>\`).join('');
        }

        document.getElementById('form').onsubmit = async (e) => {
          e.preventDefault();
          await fetch('/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: document.getElementById('name').value,
              message: document.getElementById('message').value
            })
          });
          document.getElementById('form').reset();
          loadMessages();
        };

        loadMessages();
      </script>
    </body>
    </html>
  `);
});

// API routes
app.get('/messages', async (req, res) => {
  const messages = await client.lRange('messages', 0, -1);
  res.json(messages.map(m => JSON.parse(m)));
});

app.post('/messages', async (req, res) => {
  const msg = {
    name: req.body.name || 'Anonymous',
    message: req.body.message || '',
    timestamp: new Date().toISOString()
  };
  await client.lPush('messages', JSON.stringify(msg));
  res.status(201).send('Message added');
});
// Health check endpoint
app.get('/healthz', async (req, res) => {
  try {
    // Optionally check Redis connectivity
    await client.ping();
    res.status(200).send('OK');
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).send('Unhealthy');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
