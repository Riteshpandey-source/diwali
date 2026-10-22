// ========================================================
// VIRTUAL FESTIVAL SHOP & INVENTORY MANAGER
// ========================================================

class DiwaliShopManager {
  constructor() {
    this.storageKey = 'diwali_player_inventory_v1';
    this.coins = 150;
    this.selectedItem = 'phuljhadi';

    // Player Inventory quantities
    this.inventory = {
      phuljhadi: Infinity, // Unlimited starter sparkler
      anar: 5,
      chakri: 5,
      rocket: 5,
      diya: 10,
      kandil: 3
    };

    // Shop Catalog
    this.catalog = [
      // Fireworks & Sparklers
      { id: 'anar', name: 'Golden Anar (Flowerpot)', category: 'fireworks', price: 20, icon: '🌋', desc: 'Fountain of sparkling gold & silver embers.' },
      { id: 'chakri', name: 'Spinning Chakri (Wheel)', category: 'fireworks', price: 25, icon: '🌀', desc: 'Rapidly spinning wheel ejecting spiral sparks.' },
      { id: 'rocket', name: 'Sky Rocket Bouquet', category: 'fireworks', price: 30, icon: '🚀', desc: 'Ascending whistling rocket exploding into colored peonies.' },
      { id: 'kandil', name: 'Akash Kandil (Sky Lantern)', category: 'fireworks', price: 40, icon: '🏮', desc: 'Traditional glowing paper lantern floating into the heavens.' },

      // Lights & Diyas
      { id: 'diya', name: 'Handcrafted Clay Diya', category: 'lights', price: 10, icon: '🪔', desc: 'Sacred terracotta oil lamp that purifies the darkness.' },
      { id: 'fairy_lights', name: 'Serial Fairy Light Strand', category: 'lights', price: 50, icon: '💡', desc: 'Vibrant strings of sparkling LEDs for houses.' },
      { id: 'brass_deepam', name: 'Ornate Brass Temple Deepam', category: 'lights', price: 75, icon: '✨', desc: 'Sacred seven-tier traditional lamp for blessings.' },

      // Festive Decor
      { id: 'toran', name: 'Marigold & Mango Leaf Toran', category: 'decor', price: 35, icon: '🌸', desc: 'Auspicious fresh floral hanging for door arches.' },
      { id: 'rangoli_powder', name: 'Gulal & Rangoli Color Pack', category: 'decor', price: 25, icon: '🎨', desc: 'Vivid powders for intricate floral doorstep art.' },
      { id: 'mithai_box', name: 'Assorted Kaju Katli & Laddu Box', category: 'decor', price: 45, icon: '🍬', desc: 'Sweet treats to distribute among colony friends!' }
    ];
  }

  init() {
    this.loadInventory();
    this.setupUI();
    this.updateHUD();
  }

  loadInventory() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (typeof data.coins === 'number') this.coins = data.coins;
        if (data.inventory) {
          this.inventory = { ...this.inventory, ...data.inventory };
          this.inventory.phuljhadi = Infinity; // Always keep infinite sparkler
        }
      }
    } catch (e) {
      console.warn('Could not load inventory', e);
    }
  }

  saveInventory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        coins: this.coins,
        inventory: this.inventory
      }));
    } catch (e) {
      console.warn('Could not save inventory', e);
    }
  }

  addCoins(amount, reason = '') {
    this.coins += amount;
    this.saveInventory();
    this.updateHUD();
    window.festiveAudio.playCoinChime();

    // Show floating coin toast
    this.showCoinRewardPopup(amount, reason);
  }

  showCoinRewardPopup(amount, reason) {
    const prompt = document.getElementById('interactionPrompt');
    if (prompt) {
      const msg = document.getElementById('promptMessage');
      const key = document.getElementById('promptKeyBadge');
      if (msg) msg.textContent = `+${amount} Coins! ${reason}`;
      if (key) key.textContent = '🪙';
      prompt.classList.remove('hidden');
      setTimeout(() => {
        prompt.classList.add('hidden');
      }, 3000);
    }
  }

  updateHUD() {
    // Top Bar coin counters
    const playerCoins = document.getElementById('playerCoinCount');
    const shopModalCoins = document.getElementById('shopModalCoins');
    if (playerCoins) playerCoins.textContent = this.coins;
    if (shopModalCoins) shopModalCoins.textContent = this.coins;

    // Quick toolbar slot quantities
    ['phuljhadi', 'anar', 'chakri', 'rocket', 'diya', 'kandil'].forEach(item => {
      const qtyEl = document.getElementById(`qty_${item}`);
      if (qtyEl) {
        qtyEl.textContent = this.inventory[item] === Infinity ? '∞' : this.inventory[item];
      }
    });
  }

  setupUI() {
    // Open Shop Button
    const openShopBtn = document.getElementById('openShopBtn');
    if (openShopBtn) {
      openShopBtn.addEventListener('click', () => this.openShopModal());
    }

    // Quick Earn Coins (+) button
    const earnBtn = document.getElementById('quickEarnCoinsBtn');
    if (earnBtn) {
      earnBtn.addEventListener('click', () => {
        const miniGamesModal = document.getElementById('miniGamesModal');
        if (miniGamesModal) miniGamesModal.classList.remove('hidden');
      });
    }

    // Modal Close buttons
    document.querySelectorAll('[data-close="shopModal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById('shopModal');
        if (modal) modal.classList.add('hidden');
      });
    });

    // Category Tabs
    document.querySelectorAll('.shop-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-category');
        this.renderShopGrid(cat);
      });
    });

    // Item Slots in Bottom Toolbar
    document.querySelectorAll('.item-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const item = slot.getAttribute('data-item');
        this.selectItem(item);

        // Instantly ignite and place the firework right in front of the player!
        const px = (window.diwaliPlayer3D ? window.diwaliPlayer3D.x2d : (window.diwaliPlayer ? window.diwaliPlayer.x : 370));
        const py = (window.diwaliPlayer3D ? window.diwaliPlayer3D.y2d : (window.diwaliPlayer ? window.diwaliPlayer.y : 610));
        this.useCurrentItem(px, py);
      });
    });

    // Keyboard Shortcuts [1 - 6]
    window.addEventListener('keydown', (e) => {
      const slotMap = {
        'Digit1': 'phuljhadi',
        'Digit2': 'anar',
        'Digit3': 'chakri',
        'Digit4': 'rocket',
        'Digit5': 'diya',
        'Digit6': 'kandil'
      };
      if (slotMap[e.code]) {
        this.selectItem(slotMap[e.code]);
      }
    });
  }

  selectItem(itemName) {
    this.selectedItem = itemName;
    document.querySelectorAll('.item-slot').forEach(s => {
      if (s.getAttribute('data-item') === itemName) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    // Toggle sparkler visibility on player if phuljhadi selected
    if (window.diwaliPlayer) {
      window.diwaliPlayer.sparklerActive = (itemName === 'phuljhadi');
    }
  }

  useCurrentItem(playerX, playerY) {
    const item = this.selectedItem || 'anar';

    // Safe coordinate fallbacks for 3D world
    if (playerX === undefined || isNaN(playerX)) {
      playerX = (window.diwaliPlayer3D ? window.diwaliPlayer3D.x2d : (window.diwaliPlayer ? window.diwaliPlayer.x : 370));
    }
    if (playerY === undefined || isNaN(playerY)) {
      playerY = (window.diwaliPlayer3D ? window.diwaliPlayer3D.y2d : (window.diwaliPlayer ? window.diwaliPlayer.y : 610));
    }

    if (item === 'phuljhadi') {
      if (window.diwaliPlayer) window.diwaliPlayer.sparklerActive = true;
      if (window.festiveAudio) window.festiveAudio.playSparklerSpark();
      return true;
    }

    // Auto-replenish if out of stock
    if (!this.inventory[item] || this.inventory[item] <= 0) {
      this.inventory[item] = 10;
      if (window.diwaliSocietyInteractions && typeof window.diwaliSocietyInteractions.showToast === 'function') {
        window.diwaliSocietyInteractions.showToast(`✨ Received 10 free ${item}s! Shubh Deepawali!`, 3000);
      }
    }

    this.inventory[item] = Math.max(0, this.inventory[item] - 1);
    this.saveInventory();
    this.updateHUD();

    // Trigger item effect in world (placed slightly in front of player)
    if (item === 'anar') {
      window.diwaliFireworks.placeAnar(playerX, playerY + 8);
    } else if (item === 'chakri') {
      window.diwaliFireworks.placeChakri(playerX, playerY + 8);
    } else if (item === 'rocket') {
      window.diwaliFireworks.launchRocket(playerX, playerY - 10);
    } else if (item === 'kandil') {
      window.diwaliFireworks.launchLantern(playerX, playerY - 10);
    } else if (item === 'diya') {
      window.diwaliFireworks.placeDiya(playerX, playerY + 8);
    }

    // Sync with multiplayer room if connected
    if (window.diwaliMultiplayer && window.diwaliMultiplayer.isConnected) {
      window.diwaliMultiplayer.sendFirework(item, playerX, playerY);
    }

    // Notify Diwali Night Mission
    if (window.diwaliMission) {
      window.diwaliMission.onItemUsed(item);
    }

    return true;
  }

  openShopModal() {
    this.updateHUD();
    this.renderShopGrid('fireworks');
    const modal = document.getElementById('shopModal');
    if (modal) modal.classList.remove('hidden');
    window.festiveAudio.playDiyaChime();
  }

  renderShopGrid(category) {
    const grid = document.getElementById('shopItemsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const items = this.catalog.filter(i => i.category === category);
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'shop-item-card';
      card.innerHTML = `
        <div class="item-img">${item.icon}</div>
        <div class="item-title">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
        <div class="item-cost"><span>${item.price}</span> 🪙</div>
        <button class="btn-buy" data-id="${item.id}">Buy Item</button>
      `;

      const buyBtn = card.querySelector('.btn-buy');
      buyBtn.addEventListener('click', () => this.buyItem(item));

      grid.appendChild(card);
    });
  }

  buyItem(item) {
    if (this.coins < item.price) {
      alert(`You need ${item.price} coins for ${item.name}! Play festival mini-games to earn more coins.`);
      return;
    }

    this.coins -= item.price;
    if (this.inventory[item.id] !== undefined) {
      this.inventory[item.id] = (this.inventory[item.id] || 0) + 3;
    }

    this.saveInventory();
    this.updateHUD();
    window.festiveAudio.playCoinChime();

    // Notify Diwali Night Mission
    if (window.diwaliMission) {
      window.diwaliMission.onItemPurchased(item);
    }

    // Visual confirmation
    const btn = document.querySelector(`[data-id="${item.id}"]`);
    if (btn) {
      const origText = btn.textContent;
      btn.textContent = '✓ Purchased!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.background = '';
      }, 1400);
    }
  }
}

// Global Shop instance
window.diwaliShop = new DiwaliShopManager();
window.addEventListener('DOMContentLoaded', () => {
  window.diwaliShop.init();
});
