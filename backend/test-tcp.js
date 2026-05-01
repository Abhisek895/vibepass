const net = require('net');

const client = new net.Socket();
client.setTimeout(5000);

client.connect(3306, '52.76.27.242', () => {
  console.log('Connected to 52.76.27.242:3306');
  client.destroy();
});

client.on('error', (err) => {
  console.error('Connection Error:', err.message);
});

client.on('timeout', () => {
  console.error('Connection Timeout');
  client.destroy();
});
