// ========================================================
// REAL-TIME MULTIPLAYER CLIENT & SYNCHRONIZATION
// Synchronized movement, custom rooms, shared lighting & emotes
// ========================================================

class DiwaliMultiplayerClient {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.roomId = 'shanti-colony';
    this.myId = null;
    this.remotePlayers = new Map(); // id -> { data, targetX, targetY, lastUpdate }
    this.lastSentMove = 0;
    this.sendInterval = 40; // 25 updates/sec
  }

  init() {
    this.setupRoomParams();
    this.setupUI();
    this.connect();
  }

  setupRoomParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      this.roomId = roomParam.trim().toLowerCase().substring(0, 32);
    }

    const roomLabel = document.getElementById('roomNameLabel');
    const mpRoomLabel = document.getElementById('mpCurrentRoomName');
    if (roomLabel) roomLabel.textContent = this.roomId;
    if (mpRoomLabel) mpRoomLabel.textContent = this.roomId;

    this.updateInviteLink();
  }

  updateInviteLink() {
    const inviteInput = document.getElementById('mpInviteUrlInput');
    if (inviteInput) {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('room', this.roomId);
      inviteInput.value = url.toString();
    }
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.updateConnectionStatus(true);

        const player = window.diwaliPlayer || { x: 650, y: 680, facing: 'down' };
        const name = (window.greetingController ? window.greetingController.senderName : 'Friend');

        this.ws.send(JSON.stringify({
          type: 'join',
          roomId: this.roomId,
          name: name,
          x: player.x,
          y: player.y,
          facing: player.facing,
          kurtaColor: player.kurtaColor,
          turbanColor: player.turbanColor,
          sparklerActive: player.sparklerActive
        }));
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch (e) {
          console.error('[Multiplayer Message Error]', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.updateConnectionStatus(false);
      };

      this.ws.onerror = () => {
        this.isConnected = false;
        this.updateConnectionStatus(false);
      };
    } catch (e) {
      console.warn('[Multiplayer] Live WebSocket server not available. Running in Solo Mode.', e);
      this.updateConnectionStatus(false);
    }
  }

  handleServerMessage(msg) {
    switch (msg.type) {
      case 'welcome': {
        this.myId = msg.yourId;
        this.remotePlayers.clear();
        (msg.players || []).forEach(p => {
          this.remotePlayers.set(p.id, {
            ...p,
            currentX: p.x,
            currentY: p.y,
            targetX: p.x,
            targetY: p.y
          });
        });

        // Sync shared lighting if sent
        if (msg.sharedLighting && window.diwaliWorld) {
          for (const hid in msg.sharedLighting) {
            const h = window.diwaliWorld.houses.find(x => x.id === hid);
            if (h) {
              h.lights.on = msg.sharedLighting[hid].on;
              h.lights.style = msg.sharedLighting[hid].style;
            }
          }
        }

        this.updatePlayersUI();
        break;
      }

      case 'player_join': {
        const p = msg.player;
        this.remotePlayers.set(p.id, {
          ...p,
          currentX: p.x,
          currentY: p.y,
          targetX: p.x,
          targetY: p.y
        });
        this.updatePlayersUI();
        break;
      }

      case 'player_move': {
        const p = this.remotePlayers.get(msg.id);
        if (p) {
          p.targetX = msg.x;
          p.targetY = msg.y;
          p.facing = msg.facing;
          p.isMoving = msg.isMoving;
          p.sparklerActive = msg.sparklerActive;
          p.lastUpdate = Date.now();
        }
        break;
      }

      case 'player_leave': {
        this.remotePlayers.delete(msg.id);
        this.updatePlayersUI();
        break;
      }

      case 'remote_firework': {
        if (window.diwaliFireworks) {
          if (msg.fwType === 'anar') window.diwaliFireworks.placeAnar(msg.x, msg.y, false);
          else if (msg.fwType === 'chakri') window.diwaliFireworks.placeChakri(msg.x, msg.y, false);
          else if (msg.fwType === 'rocket') window.diwaliFireworks.launchRocket(msg.x, msg.y, null, null, msg.color, false);
          else if (msg.fwType === 'kandil') window.diwaliFireworks.launchLantern(msg.x, msg.y, false);
          else if (msg.fwType === 'diya') window.diwaliFireworks.placeDiya(msg.x, msg.y, false);
        }
        break;
      }

      case 'sync_light': {
        if (window.diwaliWorld) {
          const h = window.diwaliWorld.houses.find(x => x.id === msg.houseId);
          if (h) {
            h.lights.on = msg.on;
            h.lights.style = msg.style;
          }
        }
        break;
      }

      case 'player_emote': {
        if (msg.id === this.myId) {
          if (window.diwaliPlayer) window.diwaliPlayer.showEmote(msg.emoteText, msg.emoji);
        } else {
          const p = this.remotePlayers.get(msg.id);
          if (p) {
            p.activeEmote = { text: msg.emoteText, emoji: msg.emoji, time: Date.now() };
            setTimeout(() => { p.activeEmote = null; }, 3200);
            window.festiveAudio.playDiyaChime();
          }
        }
        break;
      }

      case 'sync_grand_celebration': {
        if (window.colonyDecoration) {
          window.colonyDecoration.triggerMahaDeepotsav(msg.initiator || 'Friend');
        }
        break;
      }
    }
  }

  sendMove(x, y, facing, isMoving, sparklerActive) {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const now = Date.now();
    if (now - this.lastSentMove < this.sendInterval) return;

    this.lastSentMove = now;
    this.ws.send(JSON.stringify({
      type: 'move',
      x: Math.round(x),
      y: Math.round(y),
      facing,
      isMoving,
      sparklerActive
    }));
  }

  sendFirework(fwType, x, y, color = null) {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      type: 'firework',
      fwType,
      x: Math.round(x),
      y: Math.round(y),
      color
    }));
  }

  sendLightToggle(houseId, on, style) {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      type: 'toggle_light',
      houseId,
      on,
      style
    }));
  }

  sendEmote(emoteText, emoji) {
    // Show locally
    if (window.diwaliPlayer) {
      window.diwaliPlayer.showEmote(emoteText, emoji);
    }
    // Broadcast
    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'emote',
        emoteText,
        emoji
      }));
    }
  }

  sendGrandCelebration() {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      type: 'grand_celebration'
    }));
  }

  updateConnectionStatus(online) {
    const badge = document.getElementById('mpConnectionBadge');
    const statusDot = document.querySelector('#roomStatusPill .status-indicator');

    if (online) {
      if (badge) {
        badge.className = 'badge-online';
        badge.textContent = 'Live Room Connected';
      }
      if (statusDot) statusDot.className = 'status-indicator online';
    } else {
      if (badge) {
        badge.className = 'badge-offline';
        badge.textContent = 'Solo Mode (Start Server for Live Friends)';
      }
      if (statusDot) statusDot.className = 'status-indicator';
    }
  }

  updatePlayersUI() {
    const countBadge = document.getElementById('playerCountBadge');
    const mpCount = document.getElementById('mpPlayersListCount');
    const listEl = document.getElementById('mpConnectedPlayersList');

    const total = this.remotePlayers.size + 1; // +1 for self
    if (countBadge) countBadge.textContent = total;
    if (mpCount) mpCount.textContent = total;

    if (listEl) {
      listEl.innerHTML = `
        <li class="player-list-item">
          <span>✨ <strong>${window.diwaliPlayer ? window.diwaliPlayer.name : 'You'}</strong> (Host)</span>
          <span style="color:#10b981;font-weight:600;">Active</span>
        </li>
      `;

      this.remotePlayers.forEach(p => {
        const item = document.createElement('li');
        item.className = 'player-list-item';
        item.innerHTML = `
          <span>👤 ${p.name || 'Diwali Friend'}</span>
          <span style="color:var(--gold-bright);font-size:11px;">In Room</span>
        </li>
        `;
        listEl.appendChild(item);
      });
    }
  }

  setupUI() {
    // Multiplayer button in header
    const mpBtn = document.getElementById('multiplayerModalBtn');
    if (mpBtn) {
      mpBtn.addEventListener('click', () => {
        const modal = document.getElementById('multiplayerModal');
        if (modal) modal.classList.remove('hidden');
        window.festiveAudio.playDiyaChime();
      });
    }

    // Modal Close buttons
    document.querySelectorAll('[data-close="multiplayerModal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById('multiplayerModal');
        if (modal) modal.classList.add('hidden');
      });
    });

    // Join Room button
    const joinBtn = document.getElementById('mpJoinRoomBtn');
    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        const roomInput = document.getElementById('mpRoomInput');
        const newRoom = (roomInput.value.trim() || 'shanti-colony').toLowerCase();
        if (newRoom !== this.roomId) {
          const url = new URL(window.location.href);
          url.searchParams.set('room', newRoom);
          window.location.href = url.toString();
        }
      });
    }

    // Copy Invite link
    const copyInviteBtn = document.getElementById('mpCopyInviteBtn');
    if (copyInviteBtn) {
      copyInviteBtn.addEventListener('click', () => {
        const inviteInput = document.getElementById('mpInviteUrlInput');
        if (inviteInput && navigator.clipboard) {
          navigator.clipboard.writeText(inviteInput.value).then(() => {
            alert('🔗 Room invite link copied to clipboard! Share with your friends.');
          });
        }
      });
    }

    // Outfit Color Pickers
    const kurtaSwatches = document.querySelectorAll('#kurtaColorSwatches .swatch');
    kurtaSwatches.forEach(sw => {
      sw.addEventListener('click', () => {
        kurtaSwatches.forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        const color = sw.getAttribute('data-color');
        if (window.diwaliPlayer) window.diwaliPlayer.kurtaColor = color;
      });
    });

    const turbanSwatches = document.querySelectorAll('#turbanColorSwatches .swatch');
    turbanSwatches.forEach(sw => {
      sw.addEventListener('click', () => {
        turbanSwatches.forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        const color = sw.getAttribute('data-color');
        if (window.diwaliPlayer) window.diwaliPlayer.turbanColor = color;
      });
    });

    // Emote Menu Buttons
    const openEmoteBtn = document.getElementById('openEmoteMenuBtn');
    const emoteMenu = document.getElementById('emoteMenu');
    const closeEmoteBtn = document.getElementById('closeEmoteMenuBtn');

    if (openEmoteBtn && emoteMenu) {
      openEmoteBtn.addEventListener('click', () => {
        emoteMenu.classList.toggle('hidden');
      });
    }

    if (closeEmoteBtn && emoteMenu) {
      closeEmoteBtn.addEventListener('click', () => {
        emoteMenu.classList.add('hidden');
      });
    }

    document.querySelectorAll('.emote-item').forEach(item => {
      item.addEventListener('click', () => {
        const text = item.getAttribute('data-text');
        const emoji = item.getAttribute('data-emoji');
        this.sendEmote(text, emoji);
        if (emoteMenu) emoteMenu.classList.add('hidden');
      });
    });
  }

  // Update remote players (smooth interpolation)
  update() {
    this.remotePlayers.forEach(p => {
      if (p.targetX !== undefined && p.targetY !== undefined) {
        // Interpolate position
        p.currentX += (p.targetX - p.currentX) * 0.25;
        p.currentY += (p.targetY - p.currentY) * 0.25;
      }
    });
  }

  // Render remote friends
  render(ctx) {
    this.remotePlayers.forEach(p => {
      ctx.save();
      ctx.translate(p.currentX, p.currentY);

      // Shadow
      ctx.beginPath();
      ctx.ellipse(0, 8, 14, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();

      // Kurta
      ctx.fillStyle = p.kurtaColor || '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(-10, -18, 20, 22, [4, 4, 6, 6]);
      ctx.fill();

      // Golden collar
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-1.5, -17, 3, 10);

      // Head
      ctx.beginPath();
      ctx.arc(0, -24, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#fed7aa';
      ctx.fill();

      // Turban
      ctx.fillStyle = p.turbanColor || '#10b981';
      ctx.beginPath();
      ctx.ellipse(0, -29, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nameplate
      ctx.fillStyle = 'rgba(18, 14, 38, 0.85)';
      const name = p.name || 'Friend';
      const nameW = ctx.measureText(name).width + 12;
      ctx.fillRect(-nameW / 2, -44, nameW, 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(-nameW / 2, -44, nameW, 16);

      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, 0, -32);

      // Remote Player Emote Bubble
      if (p.activeEmote) {
        ctx.save();
        ctx.fillStyle = 'rgba(18, 14, 38, 0.95)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        const text = `${p.activeEmote.emoji} ${p.activeEmote.text}`;
        ctx.font = 'bold 12px sans-serif';
        const bWidth = ctx.measureText(text).width + 18;
        ctx.beginPath();
        ctx.roundRect(-bWidth / 2, -66, bWidth, 24, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(text, 0, -50);
        ctx.restore();
      }

      ctx.restore();
    });
  }
}

// Global multiplayer client instance
window.diwaliMultiplayer = new DiwaliMultiplayerClient();
window.addEventListener('DOMContentLoaded', () => {
  window.diwaliMultiplayer.init();
});
