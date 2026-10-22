const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.webp': 'image/webp'
};

// HTTP Static Server
const server = http.createServer((req, res) => {
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const roomsCount = Object.keys(rooms).length;
    let totalPlayers = 0;
    for (const r in rooms) totalPlayers += rooms[r].players.size;
    res.end(JSON.stringify({
      status: 'online',
      server: 'Diwali Virtual World Realtime Server',
      version: '1.0.0',
      activeRooms: roomsCount,
      totalConnectedPlayers: totalPlayers,
      uptime: process.uptime()
    }));
    return;
  }

  // Sanitize path
  let safePath = path.normalize(decodeURI(req.url.split('?')[0]));
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(PUBLIC_DIR, safePath);

  // Security check: ensure path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA if not found
      filePath = path.join(PUBLIC_DIR, 'index.html');
      fs.stat(filePath, (fallbackErr, fallbackStats) => {
        if (fallbackErr || !fallbackStats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        serveFile(filePath, req, res, fallbackStats);
      });
      return;
    }
    serveFile(filePath, req, res, stats);
  });
});

function serveFile(filePath, req, res, stats) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const total = stats.size;
  const range = req.headers.range;

  // Support HTTP 206 Partial Content for video/audio seek & streaming
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

    if (start >= total || end >= total) {
      res.writeHead(416, {
        'Content-Range': `bytes */${total}`,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end();
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': total,
      'Accept-Ranges': 'bytes',
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  }
}

// WebSocket Multiplayer Hub
const wss = new WebSocketServer({ server });

// Rooms map: roomId -> { players: Map(playerId -> { ws, data }) }
const rooms = {};

function getOrCreateRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: new Map(),
      sharedLighting: {},
      sharedDecorations: []
    };
  }
  return rooms[roomId];
}

function broadcastToRoom(roomId, message, senderWs = null) {
  const room = rooms[roomId];
  if (!room) return;
  const payload = JSON.stringify(message);
  for (const [id, client] of room.players.entries()) {
    if (client.ws !== senderWs && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

wss.on('connection', (ws) => {
  let currentRoomId = null;
  let playerId = 'player_' + Math.random().toString(36).substring(2, 9);
  let playerName = 'Diwali Guest';

  ws.on('message', (messageText) => {
    try {
      const data = JSON.parse(messageText);

      switch (data.type) {
        case 'join': {
          currentRoomId = (data.roomId || 'shanti-colony').trim().toLowerCase().substring(0, 32);
          playerName = (data.name || 'Friend').trim().substring(0, 24);
          const room = getOrCreateRoom(currentRoomId);

          const playerData = {
            id: playerId,
            name: playerName,
            x: Number(data.x) || 750,
            y: Number(data.y) || 680,
            facing: data.facing || 'down',
            isMoving: false,
            sparklerActive: !!data.sparklerActive,
            turbanColor: data.turbanColor || '#f59e0b',
            kurtaColor: data.kurtaColor || '#dc2626'
          };

          room.players.set(playerId, { ws, data: playerData });

          // Send welcome with current room state and existing players
          const existingPlayers = [];
          for (const [pId, pObj] of room.players.entries()) {
            if (pId !== playerId) {
              existingPlayers.push(pObj.data);
            }
          }

          ws.send(JSON.stringify({
            type: 'welcome',
            yourId: playerId,
            roomId: currentRoomId,
            players: existingPlayers,
            sharedLighting: room.sharedLighting,
            sharedDecorations: room.sharedDecorations
          }));

          // Notify others in room
          broadcastToRoom(currentRoomId, {
            type: 'player_join',
            player: playerData
          }, ws);

          console.log(`[Multiplayer] Player ${playerName} (${playerId}) joined room: ${currentRoomId}. Total in room: ${room.players.size}`);
          break;
        }

        case 'move': {
          if (!currentRoomId || !rooms[currentRoomId]) return;
          const room = rooms[currentRoomId];
          const client = room.players.get(playerId);
          if (client) {
            client.data.x = Number(data.x) || client.data.x;
            client.data.y = Number(data.y) || client.data.y;
            client.data.facing = data.facing || client.data.facing;
            client.data.isMoving = !!data.isMoving;
            client.data.sparklerActive = !!data.sparklerActive;

            // Broadcast movement to peers
            broadcastToRoom(currentRoomId, {
              type: 'player_move',
              id: playerId,
              x: client.data.x,
              y: client.data.y,
              facing: client.data.facing,
              isMoving: client.data.isMoving,
              sparklerActive: client.data.sparklerActive
            }, ws);
          }
          break;
        }

        case 'firework': {
          if (!currentRoomId) return;
          broadcastToRoom(currentRoomId, {
            type: 'remote_firework',
            id: playerId,
            fwType: data.fwType,
            x: data.x,
            y: data.y,
            color: data.color
          }, ws);
          break;
        }

        case 'toggle_light': {
          if (!currentRoomId || !rooms[currentRoomId]) return;
          const room = rooms[currentRoomId];
          room.sharedLighting[data.houseId] = {
            on: !!data.on,
            style: data.style || 'golden'
          };
          broadcastToRoom(currentRoomId, {
            type: 'sync_light',
            houseId: data.houseId,
            on: !!data.on,
            style: data.style,
            byPlayer: playerName
          });
          break;
        }

        case 'place_decoration': {
          if (!currentRoomId || !rooms[currentRoomId]) return;
          const room = rooms[currentRoomId];
          const dec = {
            id: 'dec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            itemType: data.itemType,
            x: data.x,
            y: data.y,
            placedBy: playerName
          };
          room.sharedDecorations.push(dec);
          if (room.sharedDecorations.length > 100) {
            room.sharedDecorations.shift();
          }
          broadcastToRoom(currentRoomId, {
            type: 'sync_decoration',
            decoration: dec
          });
          break;
        }

        case 'emote': {
          if (!currentRoomId) return;
          broadcastToRoom(currentRoomId, {
            type: 'player_emote',
            id: playerId,
            name: playerName,
            emoteText: (data.emoteText || '').substring(0, 30),
            emoji: (data.emoji || '✨').substring(0, 4)
          });
          break;
        }

        case 'grand_celebration': {
          if (!currentRoomId) return;
          broadcastToRoom(currentRoomId, {
            type: 'sync_grand_celebration',
            initiator: playerName
          });
          break;
        }
      }
    } catch (e) {
      console.error('[WebSocket Error]', e.message);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && rooms[currentRoomId]) {
      const room = rooms[currentRoomId];
      room.players.delete(playerId);
      broadcastToRoom(currentRoomId, {
        type: 'player_leave',
        id: playerId
      });
      if (room.players.size === 0) {
        delete rooms[currentRoomId];
      }
      console.log(`[Multiplayer] Player ${playerName} disconnected from room: ${currentRoomId}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🪔 SHUBH DEEPAWALI - VIRTUAL FESTIVAL WORLD IS RUNNING 🪔`);
  console.log(`HTTP URL:       http://localhost:${PORT}`);
  console.log(`WebSocket URL:  ws://localhost:${PORT}`);
  console.log(`Public Folder:  ${PUBLIC_DIR}`);
  console.log(`=======================================================`);
});
