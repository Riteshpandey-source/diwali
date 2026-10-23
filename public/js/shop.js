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
      kandil: 3,
      jeera_soda: 3,
      nimbu_soda: 2,
      mithai_box: 2,
      motichoor: 2,
      puja_thali: 1,
      fairy_lights: 1,
      brass_deepam: 1,
      toran: 2,
      rangoli_powder: 2
    };

    // Shop Catalog - Abdul's All-in-One Store (Gokuldham Society)
    this.catalog = [
      // 1. Abdul's Soda & Festive Sweets
      {
        id: 'jeera_soda',
        name: "Abdul's Masala Jeera Soda",
        hindiName: 'अब्दुल का स्पेशल मसाला जीरा सोडा',
        category: 'soda_sweets',
        price: 15,
        icon: '🥤',
        desc: "Gokuldham's pride! Chilled digestive soda with roasted cumin & rock salt.",
        quote: "Yeh lijiye Jethalal Bhai! Ekdum chilled Jeera Soda, pet ekdum halka ho jayega!"
      },
      {
        id: 'nimbu_soda',
        name: 'Fresh Chilled Nimbu Soda',
        hindiName: 'ताज़ा ठंडा नींबू सोडा',
        category: 'soda_sweets',
        price: 15,
        icon: '🍋',
        desc: 'Tangy fresh lemon soda with bubbly fizz to recharge your festival spirit.',
        quote: "Ekdum refreshing Nimbu Soda! Diwali ki thakan ek ghoont mein gayab!"
      },
      {
        id: 'mithai_box',
        name: 'Assorted Kaju Katli & Peda Box',
        hindiName: 'काजू कतली और पेड़ा बॉक्स',
        category: 'soda_sweets',
        price: 40,
        icon: '🍬',
        desc: 'Pure desi ghee sweets to distribute among Gokuldham colony neighbours!',
        quote: "Pure desi ghee ki mithai! Sabhi colony walo ka mooh meetha kijiye!"
      },
      {
        id: 'motichoor',
        name: 'Motichoor Laddu Gift Box',
        hindiName: 'मोतीचूर के लड्डू',
        category: 'soda_sweets',
        price: 30,
        icon: '🟡',
        desc: 'Soft aromatic saffron laddus crafted for Lakshmi Pujan and family joy.',
        quote: "Garam garam motichoor laddu, Bapuji aur Tapu Sena ko bahut pasand hain!"
      },

      // 2. Fireworks & Sparklers (Patakhe)
      {
        id: 'anar',
        name: 'Golden Anar (Flowerpot)',
        hindiName: 'गोल्डन अनार फव्वारा',
        category: 'fireworks',
        price: 20,
        icon: '🌋',
        desc: 'Fountain of sparkling gold & silver embers lighting up the courtyard.',
        quote: "Yeh anar jab compound mein jalega, poora Gokuldham jagmaga uthega!"
      },
      {
        id: 'chakri',
        name: 'Spinning Ground Chakri',
        hindiName: 'तेज घूमने वाली चकरी',
        category: 'fireworks',
        price: 25,
        icon: '🌀',
        desc: 'Rapidly spinning ground wheel ejecting spiral rings of brilliant fire.',
        quote: "Zameen par ghoomne wali shaandar chakri! Tapu Sena ki favorite!"
      },
      {
        id: 'rocket',
        name: 'Sky Rocket Bouquet',
        hindiName: 'रंगीन स्काई रॉकेट',
        category: 'fireworks',
        price: 30,
        icon: '🚀',
        desc: 'Ascending whistling rocket exploding into multicolored sparkling peonies.',
        quote: "Seedha aakash mein jaakar dhamakedaar roshni karega!"
      },
      {
        id: 'kandil',
        name: 'Akash Kandil (Sky Lantern)',
        hindiName: 'उड़ता हुआ आकाश कंदील',
        category: 'fireworks',
        price: 40,
        icon: '🏮',
        desc: 'Traditional glowing paper lantern floating serenely into the starry heavens.',
        quote: "Shanti aur samriddhi ki prarthana ke sath aasmaan mein chodiye!"
      },

      // 3. Lights & Diyas
      {
        id: 'diya',
        name: 'Handcrafted Clay Diya',
        hindiName: 'पवित्र मिट्टी का दीया',
        category: 'lights',
        price: 10,
        icon: '🪔',
        desc: 'Sacred terracotta oil lamp that purifies the darkness with warm glow.',
        quote: "Mitti ke diye se ghar-aangan roshan kijiye, Ma Lakshmi ka aashirwad milega!"
      },
      {
        id: 'fairy_lights',
        name: 'Serial LED Light Strand',
        hindiName: 'रंग-बिरंगी लड़ी लाइट्स',
        category: 'lights',
        price: 50,
        icon: '💡',
        desc: 'Vibrant strings of sparkling LEDs to decorate balcony railings & windows.',
        quote: "Bhide master ke balcony ki tarah poori building mein chamak aayegi!"
      },
      {
        id: 'brass_deepam',
        name: 'Ornate Brass Temple Deepam',
        hindiName: 'पीतल का मंदिर दीप',
        category: 'lights',
        price: 75,
        icon: '✨',
        desc: 'Sacred multi-tier brass lamp for mandir sanctum and prosperity.',
        quote: "Mandir ke aage sthapit kijiye, shubh labh ka aagman hoga!"
      },

      // 4. Puja & Festive Decor
      {
        id: 'puja_thali',
        name: 'Lakshmi Pujan Samagri Thali',
        hindiName: 'लक्ष्मी पूजन सामग्री थाली',
        category: 'decor',
        price: 45,
        icon: '🌺',
        desc: 'Roli, chawal, dhoop, kapoor, diya, gangajal & fresh marigold flowers.',
        quote: "Diwali pujan ke liye sampoorna pavitra samagri, sab ready hai!"
      },
      {
        id: 'toran',
        name: 'Marigold & Mango Leaf Toran',
        hindiName: 'गेंदा और आम के पत्तों का तोरण',
        category: 'decor',
        price: 35,
        icon: '🌸',
        desc: 'Auspicious fresh floral hanging for society door arches & entrance.',
        quote: "Dwar par lagaiye, ghar mein sakaratmak urja aayegi!"
      },
      {
        id: 'rangoli_powder',
        name: 'Gulal & Rangoli Color Pack',
        hindiName: 'चमकीले रंगोली के रंग',
        category: 'decor',
        price: 25,
        icon: '🎨',
        desc: 'Vivid powders for intricate floral doorstep art in the society wing.',
        quote: "Madhavi Bhabhi aur Daya Bhabhi jaisi khubsoorat rangoli banaiye!"
      }
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

    // Abdul Shop Modal Earn Coins button
    const shopEarnBtn = document.getElementById('shopEarnCoinsBtn');
    if (shopEarnBtn) {
      shopEarnBtn.addEventListener('click', () => {
        const modal = document.getElementById('shopModal');
        if (modal) modal.classList.add('hidden');
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

  openShopModal(preferredCategory) {
    this.updateHUD();
    const activeTab = document.querySelector('.shop-tab.active');
    const cat = preferredCategory || (activeTab ? activeTab.getAttribute('data-category') : 'soda_sweets');
    
    // Ensure tab button visual state matches
    document.querySelectorAll('.shop-tab').forEach(t => {
      if (t.getAttribute('data-category') === cat) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    this.renderShopGrid(cat);
    const modal = document.getElementById('shopModal');
    if (modal) modal.classList.remove('hidden');
    if (window.festiveAudio && window.festiveAudio.playDiyaChime) {
      window.festiveAudio.playDiyaChime();
    }
  }

  renderShopGrid(category) {
    const grid = document.getElementById('shopItemsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const activeCat = category || 'soda_sweets';
    const items = this.catalog.filter(i => i.category === activeCat);
    
    items.forEach(item => {
      const owned = this.inventory[item.id];
      const ownedText = (item.id === 'phuljhadi') ? '∞ Starter' : (owned !== undefined ? `${owned} owned` : '0 owned');

      const card = document.createElement('div');
      card.className = 'shop-item-card';
      card.setAttribute('data-card-id', item.id);
      card.innerHTML = `
        <div class="item-img-wrap">
          <span class="item-icon">${item.icon}</span>
        </div>
        <div class="item-meta">
          <h3 class="item-title">${item.name}</h3>
          ${item.hindiName ? `<span class="item-hindi-title">${item.hindiName}</span>` : ''}
          <p class="item-desc">${item.desc}</p>
        </div>
        <div class="item-status-row">
          <span class="item-owned-pill">
            <span class="owned-dot"></span>
            <span class="item-owned-count">${ownedText}</span>
          </span>
          <div class="item-cost">
            <span class="cost-val">${item.price}</span>
            <span class="cost-coin">🪙</span>
          </div>
        </div>
        <button class="btn-buy" data-id="${item.id}" aria-label="Buy ${item.name}">
          <span class="btn-buy-icon">🛒</span>
          <span class="btn-buy-label">Buy (+3)</span>
        </button>
      `;

      const buyBtn = card.querySelector('.btn-buy');
      buyBtn.addEventListener('click', () => this.buyItem(item));

      grid.appendChild(card);
    });
  }

  buyItem(item) {
    if (this.coins < item.price) {
      const shortfall = item.price - this.coins;
      const msg = `Arre Bhai, ${shortfall} coins kam pad gaye! ${item.name} lene ke liye festival mini-games khelkar coins le aaiye!`;
      
      const quoteEl = document.getElementById('abdulShopQuote');
      if (quoteEl) {
        quoteEl.textContent = `“Abdul: Arre Bhai, ${shortfall} coins kam pad gaye! Thode mini-games khelkar coins kamayiye!”`;
      }

      if (window.diwaliSocietyInteractions && typeof window.diwaliSocietyInteractions.showToast === 'function') {
        window.diwaliSocietyInteractions.showToast(`🪙 Abdul: "${msg}"`, 4000);
      } else {
        alert(msg);
      }

      if (window.festiveAudio && window.festiveAudio.playDholakBeat) {
        window.festiveAudio.playDholakBeat();
      }
      return;
    }

    this.coins -= item.price;
    const addCount = (item.id === 'phuljhadi') ? 0 : 3;
    this.inventory[item.id] = (this.inventory[item.id] !== undefined ? this.inventory[item.id] : 0) + addCount;

    this.saveInventory();
    this.updateHUD();
    
    if (window.festiveAudio && window.festiveAudio.playCoinChime) {
      window.festiveAudio.playCoinChime();
    }

    // Update Abdul quote banner in modal with custom festive dialogue
    const quoteEl = document.getElementById('abdulShopQuote');
    if (quoteEl && item.quote) {
      quoteEl.textContent = `“Abdul: ${item.quote} Shubh Deepawali!”`;
    }

    // Show floating toast in society
    if (window.diwaliSocietyInteractions && typeof window.diwaliSocietyInteractions.showToast === 'function') {
      const toastText = item.quote 
        ? `🏪 Abdul: "${item.quote}" (+${addCount} added to inventory)`
        : `🏪 Abdul: "Yeh lijiye ${item.name}! Shubh Deepawali!" (+${addCount} added)`;
      window.diwaliSocietyInteractions.showToast(toastText, 3500);
    }

    // Notify Diwali Night Mission
    if (window.diwaliMission && typeof window.diwaliMission.onItemPurchased === 'function') {
      window.diwaliMission.onItemPurchased(item);
    }

    // Visual button & card update confirmation
    const card = document.querySelector(`.shop-item-card[data-card-id="${item.id}"]`);
    if (card) {
      const ownedCountEl = card.querySelector('.item-owned-count');
      if (ownedCountEl) {
        const owned = this.inventory[item.id];
        ownedCountEl.textContent = (item.id === 'phuljhadi') ? '∞ Starter' : `${owned} owned`;
      }

      const btn = card.querySelector('.btn-buy');
      if (btn) {
        const origHtml = btn.innerHTML;
        btn.innerHTML = '✓ Khareed Liya!';
        btn.classList.add('purchased');
        setTimeout(() => {
          btn.innerHTML = origHtml;
          btn.classList.remove('purchased');
        }, 1200);
      }
    }
  }
}

// Global Shop instance
window.diwaliShop = new DiwaliShopManager();
window.addEventListener('DOMContentLoaded', () => {
  window.diwaliShop.init();
});
