import WebSocket from 'ws';
const wss = new WebSocket.Server({ port: 5000 });

let clients = {};
let clientIdCounter = 0;

function broadcastPeers() {
  const peerIds = Object.keys(clients);
  for (const id in clients) {
    const client = clients[id];
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'peers', peers: peerIds }));
    }
  }
}

wss.on('connection', (ws) => {
  const clientId = (++clientIdCounter).toString();
  ws.id = clientId;
  clients[clientId] = ws;
  ws.send(JSON.stringify({ type: 'id', payload: clientId }));

  // Notify all clients about new peer
  for (const id in clients) {
    if (id !== clientId && clients[id].readyState === WebSocket.OPEN) {
      clients[id].send(JSON.stringify({ type: 'new-peer', payload: clientId }));
    }
  }

  // Send current peers to the new client
  const peerIds = Object.keys(clients).filter(id => id !== clientId);
  ws.send(JSON.stringify({ type: 'peers', peers: peerIds }));

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('Invalid JSON:', message);
      return;
    }

    const { type, to, from, payload } = data;

    if (to && clients[to] && clients[to].readyState === WebSocket.OPEN) {
      clients[to].send(JSON.stringify({ type, from, payload }));
    }
  });

  ws.on('close', () => {
    delete clients[clientId];
    // Notify remaining clients about peer leaving
    for (const id in clients) {
      if (clients[id].readyState === WebSocket.OPEN) {
        clients[id].send(JSON.stringify({ type: 'peer-left', payload: clientId }));
      }
    }
  });
});

