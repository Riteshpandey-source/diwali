// ========================================================
// DIWALI VIRTUAL COLONY - HIGH-FIDELITY WORLD MAP & ARCHITECTURE
// Inspired by authentic Indian festival architecture, Haveli details,
// glowing night ambiance, detailed temple, bazaar stalls, and rangolis.
// ========================================================

class DiwaliWorld {
  constructor() {
    this.width = 1780;
    this.height = 1220;

    // Houses in the colony with rich architectural configurations
    this.houses = [
      {
        id: 'house_sharma',
        name: 'Sharma Niwas',
        subName: 'Traditional Rajasthani Haveli',
        x: 180,
        y: 160,
        width: 260,
        height: 200,
        wallColor: '#fef3c7',
        accentColor: '#d97706',
        roofColor: '#b45309',
        doorX: 300,
        doorY: 360,
        lights: { on: true, style: 'golden' },
        decor: { diyas: true, toran: true, kandil: true }
      },
      {
        id: 'house_verma',
        name: 'Verma Villa',
        subName: 'Rose Terracotta Courtyard',
        x: 520,
        y: 160,
        width: 270,
        height: 200,
        wallColor: '#ffe4e6',
        accentColor: '#e11d48',
        roofColor: '#991b1b',
        doorX: 645,
        doorY: 360,
        lights: { on: true, style: 'rainbow' },
        decor: { diyas: true, toran: true, kandil: true }
      },
      {
        id: 'house_gupta',
        name: 'Gupta Bhavan',
        subName: 'Grand Sandstone Residence',
        x: 870,
        y: 160,
        width: 270,
        height: 200,
        wallColor: '#fef9c3',
        accentColor: '#ca8a04',
        roofColor: '#78350f',
        doorX: 995,
        doorY: 360,
        lights: { on: false, style: 'golden' },
        decor: { diyas: true, toran: true, kandil: false }
      },
      {
        id: 'house_patel',
        name: 'Patel Sadan',
        subName: 'Courtyard Haveli',
        x: 180,
        y: 830,
        width: 260,
        height: 210,
        wallColor: '#f0fdf4',
        accentColor: '#16a34a',
        roofColor: '#b45309',
        doorX: 300,
        doorY: 830,
        lights: { on: true, style: 'golden' },
        decor: { diyas: true, toran: true, kandil: true }
      },
      {
        id: 'house_mukherjee',
        name: 'Mukherjee Kunj',
        subName: 'Classic Colonial Terrace',
        x: 520,
        y: 830,
        width: 270,
        height: 210,
        wallColor: '#fffbeb',
        accentColor: '#ea580c',
        roofColor: '#991b1b',
        doorX: 645,
        doorY: 830,
        lights: { on: false, style: 'cyan' },
        decor: { diyas: true, toran: false, kandil: true }
      },
      {
        id: 'house_singh',
        name: 'Singh Residence',
        subName: 'Modern Heritage Home',
        x: 870,
        y: 830,
        width: 270,
        height: 210,
        wallColor: '#f8fafc',
        accentColor: '#0284c7',
        roofColor: '#78350f',
        doorX: 995,
        doorY: 830,
        lights: { on: true, style: 'rainbow' },
        decor: { diyas: true, toran: true, kandil: true }
      }
    ];

    // Shree Shiv-Lakshmi Mandir (Community Temple)
    this.temple = {
      id: 'community_temple',
      name: 'Shree Shiv-Lakshmi Mandir',
      x: 1280,
      y: 140,
      width: 350,
      height: 300,
      color: '#f8fafc',
      domeColor: '#f59e0b',
      interactX: 1455,
      interactY: 450,
      lightsOn: true
    };

    // Stalls & Commercial Areas
    this.stalls = [
      {
        id: 'bazaar_stall',
        name: "Abdul's All-in-One Store (Shop)",
        sub: 'Gokuldham Soda, Mithai, Diye & Patakhe',
        x: 1290,
        y: 650,
        width: 240,
        height: 150,
        awningColor: '#ea580c',
        interactX: 1410,
        interactY: 805,
        type: 'shop'
      },
      {
        id: 'rangoli_corner',
        name: 'Rangoli Art Pavilion',
        sub: 'Gulal & Floral Art Studio',
        x: 1290,
        y: 920,
        width: 230,
        height: 140,
        awningColor: '#10b981',
        interactX: 1405,
        interactY: 1065,
        type: 'minigame_rangoli'
      }
    ];

    // Central Colony Chowk & Maha Celebration Altar
    this.chowk = {
      x: 650,
      y: 580,
      radius: 105,
      switchX: 650,
      switchY: 580,
      mahaModeActive: false
    };

    // Streetlamps with warm ambient light cones
    this.streetlamps = [
      { x: 120, y: 440 }, { x: 440, y: 440 }, { x: 780, y: 440 }, { x: 1180, y: 440 },
      { x: 120, y: 720 }, { x: 440, y: 720 }, { x: 880, y: 720 }, { x: 1180, y: 720 },
      { x: 1240, y: 380 }, { x: 1240, y: 860 }, { x: 1580, y: 860 }
    ];

    // Flowering Neem, Ashok & Marigold Trees
    this.trees = [
      { x: 90, y: 130, r: 48, flower: '#f59e0b' },
      { x: 460, y: 130, r: 38, flower: '#ec4899' },
      { x: 800, y: 130, r: 42, flower: '#fbbf24' },
      { x: 1180, y: 130, r: 44, flower: '#ea580c' },
      { x: 1680, y: 130, r: 52, flower: '#fbbf24' },
      { x: 90, y: 1110, r: 48, flower: '#ec4899' },
      { x: 460, y: 1110, r: 40, flower: '#f59e0b' },
      { x: 800, y: 1110, r: 44, flower: '#ea580c' },
      { x: 1180, y: 1110, r: 42, flower: '#fbbf24' },
      { x: 1680, y: 1110, r: 52, flower: '#ec4899' },
      { x: 1680, y: 600, r: 50, flower: '#f59e0b' },
      { x: 50, y: 590, r: 46, flower: '#fbbf24' }
    ];

    // Decorative Floral Rangolis
    this.rangolis = [
      { x: 650, y: 580, radius: 52, petals: 12, theme: 'gold' }, // Central Chowk
      { x: 300, y: 415, radius: 26, petals: 8, theme: 'crimson' }, // Sharma Niwas
      { x: 645, y: 415, radius: 26, petals: 8, theme: 'peacock' }, // Verma Villa
      { x: 995, y: 415, radius: 26, petals: 8, theme: 'saffron' }, // Gupta Bhavan
      { x: 300, y: 785, radius: 26, petals: 8, theme: 'lotus' },   // Patel Sadan
      { x: 645, y: 785, radius: 26, petals: 8, theme: 'gold' },    // Mukherjee Kunj
      { x: 995, y: 785, radius: 26, petals: 8, theme: 'crimson' }, // Singh Residence
      { x: 1455, y: 480, radius: 42, petals: 10, theme: 'temple' } // Mandir
    ];

    // Floating fireflies & golden festive dust in the mohalla
    this.fireflies = [];
    for (let i = 0; i < 45; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Colliders list: rectangles { x, y, w, h }
    this.colliders = [];
    this.buildColliders();
  }

  buildColliders() {
    this.colliders = [];

    // World Boundary Walls
    this.colliders.push({ x: 0, y: 0, w: this.width, h: 44 }); // Top
    this.colliders.push({ x: 0, y: this.height - 44, w: this.width, h: 44 }); // Bottom
    this.colliders.push({ x: 0, y: 0, w: 44, h: this.height }); // Left
    this.colliders.push({ x: this.width - 44, y: 0, w: 44, h: this.height }); // Right

    // Houses
    this.houses.forEach(h => {
      this.colliders.push({ x: h.x, y: h.y, w: h.width, h: h.height });
    });

    // Temple
    this.colliders.push({
      x: this.temple.x,
      y: this.temple.y,
      w: this.temple.width,
      h: this.temple.height
    });

    // Stalls
    this.stalls.forEach(s => {
      this.colliders.push({ x: s.x, y: s.y, w: s.width, h: s.height });
    });

    // Chowk central altar pedestal
    this.colliders.push({
      x: this.chowk.x - 28,
      y: this.chowk.y - 28,
      w: 56,
      h: 56
    });

    // Tree trunks
    this.trees.forEach(t => {
      this.colliders.push({
        x: t.x - 16,
        y: t.y - 16,
        w: 32,
        h: 32
      });
    });
  }

  // Check interactive triggers near character (x, y)
  getInteractiveTarget(px, py, range = 70) {
    // 1. Houses
    for (let h of this.houses) {
      const dist = Math.hypot(px - h.doorX, py - h.doorY);
      if (dist < range) {
        return {
          type: 'house',
          id: h.id,
          name: h.name,
          data: h,
          prompt: `Press [E] to Decorate ${h.name}`
        };
      }
    }

    // 2. Temple
    const templeDist = Math.hypot(px - this.temple.interactX, py - this.temple.interactY);
    if (templeDist < range + 25) {
      return {
        type: 'temple',
        id: this.temple.id,
        name: this.temple.name,
        prompt: `Press [E] to Pray & Play Cultural Trivia`
      };
    }

    // 3. Stalls
    for (let s of this.stalls) {
      const sDist = Math.hypot(px - s.interactX, py - s.interactY);
      if (sDist < range) {
        if (s.type === 'shop') {
          return {
            type: 'shop',
            id: s.id,
            name: s.name,
            prompt: `Press [E] to Visit Abdul's All-in-One Store`
          };
        } else if (s.type === 'minigame_rangoli') {
          return {
            type: 'minigame_rangoli',
            id: s.id,
            name: s.name,
            prompt: `Press [E] to Play Rangoli Artisan`
          };
        }
      }
    }

    // 4. Central Chowk Maha Celebration Switch
    const chowkDist = Math.hypot(px - this.chowk.switchX, py - (this.chowk.switchY + 45));
    if (chowkDist < range + 15) {
      const isUnlocked = window.diwaliMission ? window.diwaliMission.canTriggerMahaDeepotsav() : true;
      return {
        type: 'chowk_switch',
        id: 'chowk_switch',
        name: 'Maha Deepotsav Altar',
        prompt: isUnlocked 
          ? `Press [E] to Ignite MAHA DEEPOTSAV Illumination! ✨`
          : `[Locked] Press [E] to View Remaining Mission Objectives`
      };
    }

    return null;
  }

  // ========================================================
  // RENDERING PASS 1: GROUND, ROADS, CHOWK & PERIMETER
  // ========================================================
  renderGroundAndRoads(ctx, camera) {
    // 1. Full Infinite Atmospheric Night Backdrop
    // Covers the entire camera viewport so there is ZERO black space!
    const viewW = ctx.canvas.width;
    const viewH = ctx.canvas.height;
    
    // Base courtyard ground with warm sandstone & terracotta dusk texture
    const groundGrad = ctx.createRadialGradient(
      this.chowk.x, this.chowk.y, 80,
      this.chowk.x, this.chowk.y, 1000
    );
    groundGrad.addColorStop(0, '#16142a');
    groundGrad.addColorStop(0.6, '#100e20');
    groundGrad.addColorStop(1, '#090814');

    // Fill the courtyard to the perimeter boundaries without dark-green or black void bands
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle stone courtyard tiling pattern across the neighborhood
    this.renderStonePaving(ctx);

    // 2. Cobblestone Avenues (Main Thoroughfares)
    this.renderRoads(ctx);

    // 3. Central Colony Chowk Piazza
    this.renderChowkPiazza(ctx);

    // 4. Perimeter Boundary Wall & Mughal Arches (Visual edge, not black void!)
    this.renderPerimeterWall(ctx);

    // 5. Intricate Floor Rangolis
    this.renderRangolis(ctx);

    // 6. Doorstep Diyas with Warm Lighting Pools
    this.renderDoorstepDiyas(ctx);

    // 7. Ambient Drifting Fireflies
    this.renderFireflies(ctx);
  }

  renderStonePaving(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.035)';
    ctx.lineWidth = 1;
    const tileSize = 60;
    
    // Draw subtle grid tiles in the active colony area
    const startX = 40;
    const endX = this.width - 40;
    const startY = 40;
    const endY = this.height - 40;

    for (let x = startX; x <= endX; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderRoads(ctx) {
    ctx.save();
    // Warm cobblestone avenues with stone kerb borders
    const roadColor = '#1c1830';
    const kerbColor = '#d97706';
    const kerbShadow = '#0c0a18';

    // Horizontal main avenues
    // Upper Avenue (between upper houses and chowk)
    ctx.fillStyle = roadColor;
    ctx.fillRect(40, 390, this.width - 80, 120);

    // Lower Avenue (between chowk and lower houses)
    ctx.fillRect(40, 680, this.width - 80, 120);

    // Vertical connecting lanes
    ctx.fillRect(435, 40, 85, this.height - 80);
    ctx.fillRect(785, 40, 85, this.height - 80);
    ctx.fillRect(1175, 40, 105, this.height - 80);

    // Kerbstones & Brass Inlay Lines
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 390, this.width - 80, 120);
    ctx.strokeRect(40, 680, this.width - 80, 120);

    // Decorative marigold petal dividers along avenue centerlines
    ctx.setLineDash([12, 18]);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.22)';
    ctx.lineWidth = 2;
    // Upper
    ctx.beginPath();
    ctx.moveTo(50, 450);
    ctx.lineTo(this.width - 50, 450);
    ctx.stroke();
    // Lower
    ctx.beginPath();
    ctx.moveTo(50, 740);
    ctx.lineTo(this.width - 50, 740);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  renderChowkPiazza(ctx) {
    const cx = this.chowk.x;
    const cy = this.chowk.y;
    const r = this.chowk.radius;

    ctx.save();
    // Outer stone terrace ring with drop shadow
    ctx.beginPath();
    ctx.arc(cx, cy, r + 24, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(12, 10, 24, 0.6)';
    ctx.fill();

    // Sandstone Piazza Floor
    const chowkGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, r + 15);
    chowkGrad.addColorStop(0, '#2d254a');
    chowkGrad.addColorStop(0.7, '#201a38');
    chowkGrad.addColorStop(1, '#18142b');

    ctx.beginPath();
    ctx.arc(cx, cy, r + 15, 0, Math.PI * 2);
    ctx.fillStyle = chowkGrad;
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Radiating mosaic petals inlay
    const petals = 16;
    for (let i = 0; i < petals; i++) {
      const angle = (i * Math.PI * 2) / petals;
      const px = cx + Math.cos(angle) * (r * 0.78);
      const py = cy + Math.sin(angle) * (r * 0.78);

      ctx.beginPath();
      ctx.arc(px, py, 11, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(245, 158, 11, 0.25)' : 'rgba(225, 29, 72, 0.25)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  renderPerimeterWall(ctx) {
    ctx.save();
    // Elaborate Jaipur / Jodhpur style sandstone perimeter wall framing the colony
    const w = this.width;
    const h = this.height;

    // Decorative Carved Stone Boundary Wall
    ctx.fillStyle = '#451a03';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;

    // Top & Bottom walls with Mughal arched jali battlements
    const battlementStep = 36;
    for (let x = 40; x < w - 40; x += battlementStep) {
      // Top wall crenellations
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x, 18, battlementStep - 8, 22);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x + 4, 22, battlementStep - 16, 5);

      // Bottom wall crenellations
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x, h - 40, battlementStep - 8, 22);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x + 4, h - 27, battlementStep - 16, 5);
    }

    // Main wall band
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 6;
    ctx.strokeRect(38, 38, w - 76, h - 76);

    ctx.restore();
  }

  renderRangolis(ctx) {
    const time = Date.now() * 0.002;

    this.rangolis.forEach(r => {
      ctx.save();
      ctx.translate(r.x, r.y);

      // Multi-layer radial mandala
      const count = r.petals;

      // Outer petal ring
      for (let i = 0; i < count; i++) {
        const a = (i * Math.PI * 2) / count;
        ctx.save();
        ctx.rotate(a);

        // Petal shape
        ctx.beginPath();
        ctx.ellipse(r.radius * 0.6, 0, r.radius * 0.38, r.radius * 0.18, 0, 0, Math.PI * 2);
        
        if (r.theme === 'crimson') {
          ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#fbbf24';
        } else if (r.theme === 'peacock') {
          ctx.fillStyle = i % 2 === 0 ? '#06b6d4' : '#10b981';
        } else if (r.theme === 'temple') {
          ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#ec4899';
        } else {
          ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#e11d48';
        }
        ctx.fill();
        ctx.strokeStyle = '#fffbeb';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      // Middle floral circle
      ctx.beginPath();
      ctx.arc(0, 0, r.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Little clay diya in center with warm glow
      ctx.beginPath();
      ctx.arc(0, 2, r.radius * 0.16, 0, Math.PI);
      ctx.fillStyle = '#92400e';
      ctx.fill();

      // Flame
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -3, 4 + Math.sin(time * 2 + r.x) * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      ctx.restore();
    });
  }

  renderDoorstepDiyas(ctx) {
    const time = Date.now() * 0.003;

    this.houses.forEach(h => {
      if (!h.decor.diyas) return;

      const diyas = [
        { x: h.doorX - 42, y: h.doorY + 10 },
        { x: h.doorX + 42, y: h.doorY + 10 }
      ];

      diyas.forEach(d => {
        ctx.save();
        // Warm soft light pool on the ground
        const glow = ctx.createRadialGradient(d.x, d.y, 3, d.x, d.y, 42);
        glow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 42, 0, Math.PI * 2);
        ctx.fill();

        // Terracotta diya cup
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 9, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#78350f';
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Oil reservoir
        ctx.beginPath();
        ctx.ellipse(d.x, d.y - 1, 6, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();

        // Flickering flame
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#fbbf24';
        const flameH = 7 + Math.sin(time * 3 + d.x) * 1.8;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y - 6, 3, flameH / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      });
    });
  }

  renderFireflies(ctx) {
    ctx.save();
    const time = Date.now() * 0.0015;

    for (let f of this.fireflies) {
      f.x += f.vx + Math.sin(time + f.phase) * 0.3;
      f.y += f.vy + Math.cos(time + f.phase) * 0.3;

      if (f.x < 50) f.x = this.width - 50;
      if (f.x > this.width - 50) f.x = 50;
      if (f.y < 50) f.y = this.height - 50;
      if (f.y > this.height - 50) f.y = 50;

      const alpha = Math.max(0.1, Math.min(1, f.alpha + Math.sin(time * 3 + f.phase) * 0.4));

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fbbf24';
      ctx.fill();
    }
    ctx.restore();
  }

  // ========================================================
  // RENDERING PASS 2: HOUSES, TEMPLE, BAZAAR, TREES & LAMPS
  // ========================================================
  renderStructures(ctx) {
    const time = Date.now() * 0.002;

    // 1. Render Indian Havelis & Residences
    this.renderHavelis(ctx, time);

    // 2. Render Grand Temple (Shree Shiv-Lakshmi Mandir)
    this.renderTemple(ctx, time);

    // 3. Render Shubh Deepawali Bazaar Stalls
    this.renderBazaarStalls(ctx, time);

    // 4. Render Central Chowk Maha Deepotsav Altar
    this.renderChowkAltar(ctx, time);

    // 5. Render Trees with layered foliage & fairy lights
    this.renderTrees(ctx, time);

    // 6. Render Cast-Iron Streetlamps with luminous light cones
    this.renderStreetlamps(ctx, time);
  }

  renderHavelis(ctx, time) {
    this.houses.forEach(h => {
      ctx.save();

      // Realistic soft ambient ground shadow
      ctx.fillStyle = 'rgba(7, 5, 16, 0.55)';
      ctx.beginPath();
      ctx.roundRect(h.x + 8, h.y + 12, h.width, h.height, [8, 8, 12, 12]);
      ctx.fill();

      // Main Sandstone / Terracotta Plinth & Facade
      ctx.fillStyle = h.wallColor;
      ctx.beginPath();
      ctx.roundRect(h.x, h.y, h.width, h.height, [6, 6, 8, 8]);
      ctx.fill();

      // Lower Sandstone Base Plinth Band
      ctx.fillStyle = '#b45309';
      ctx.fillRect(h.x, h.y + h.height - 18, h.width, 18);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x, h.y + h.height - 18, h.width, 18);

      // Ornamental Cornice Band (Jharokha separator)
      ctx.fillStyle = h.accentColor;
      ctx.fillRect(h.x, h.y + 54, h.width, 14);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(h.x, h.y + 58, h.width, 3);

      // Mangalore Terracotta Clay Tile Roof with Scalloped Shingles
      this.renderClayTileRoof(ctx, h);

      // House Nameplate Plaque (Brass & Mahogany)
      this.renderHouseNameplate(ctx, h);

      // Upper Jharokha (Rajasthani Overhanging Balcony)
      this.renderJharokhaBalcony(ctx, h, time);

      // Arched Windows with Warm Interior Light
      this.renderArchedWindows(ctx, h, time);

      // Grand Carved Teakwood Doorway with Floral Toran
      this.renderGrandDoorway(ctx, h);

      // Akash Kandil (Traditional Festive Lantern)
      if (h.decor.kandil) {
        this.renderAkashKandil(ctx, h.x + 28, h.y - 10, time);
      }

      // Serial Fairy Lights (Mirchi lights) Draped along Eaves
      if (h.lights.on) {
        this.renderFairyLightStrings(ctx, h, time);
      }

      ctx.restore();
    });
  }

  renderClayTileRoof(ctx, h) {
    const rx = h.x - 16;
    const ry = h.y;
    const rw = h.width + 32;
    const peakX = h.x + h.width / 2;
    const peakY = h.y - 56;

    // Roof shadow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(rx, ry + 6);
    ctx.lineTo(peakX, peakY + 6);
    ctx.lineTo(rx + rw, ry + 6);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Main roof pitch
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(peakX, peakY);
    ctx.lineTo(rx + rw, ry);
    ctx.closePath();
    ctx.fillStyle = h.roofColor;
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Individual curved clay tile rows
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.lineWidth = 1.5;
    const tileRows = 5;
    for (let r = 1; r < tileRows; r++) {
      const t = r / tileRows;
      const lx = rx + (peakX - rx) * t;
      const ly = ry + (peakY - ry) * t;
      const rxPos = (rx + rw) + (peakX - (rx + rw)) * t;

      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(rxPos, ly);
      ctx.stroke();
    }

    // Golden Kalash Finial atop the roof apex
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(peakX, peakY - 8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Little finial spike
    ctx.beginPath();
    ctx.moveTo(peakX, peakY - 15);
    ctx.lineTo(peakX, peakY - 24);
    ctx.stroke();

    ctx.restore();
  }

  renderHouseNameplate(ctx, h) {
    const px = h.x + 22;
    const py = h.y + 16;
    const pw = h.width - 44;
    const ph = 26;

    ctx.save();
    // Rosewood plaque base with gold border
    ctx.fillStyle = 'rgba(16, 12, 32, 0.9)';
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 6);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Name text
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(h.name, h.x + h.width / 2, py + 15);

    // Subtitle
    ctx.fillStyle = '#fed7aa';
    ctx.font = '9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(h.subName || 'Shanti Mohalla', h.x + h.width / 2, py + 23);
    ctx.restore();
  }

  renderJharokhaBalcony(ctx, h, time) {
    const bx = h.x + 36;
    const by = h.y + 76;
    const bw = h.width - 72;
    const bh = 34;

    ctx.save();
    // Cantilevered corbel brackets beneath balcony
    ctx.fillStyle = '#78350f';
    for (let i = 0; i < 5; i++) {
      const cx = bx + (i * bw) / 4;
      ctx.beginPath();
      ctx.moveTo(cx - 6, by + bh);
      ctx.lineTo(cx + 6, by + bh);
      ctx.lineTo(cx, by + bh + 12);
      ctx.closePath();
      ctx.fill();
    }

    // Balcony Box with Jaali lattice
    ctx.fillStyle = '#1c1432';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Brass railing with ornamental balusters
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    const balusters = 10;
    for (let b = 0; b <= balusters; b++) {
      const balX = bx + (b * bw) / balusters;
      ctx.beginPath();
      ctx.moveTo(balX, by);
      ctx.lineTo(balX, by + bh);
      ctx.stroke();
    }

    // Marigold Flower Garland draped across the balcony!
    if (h.decor.toran) {
      this.renderMarigoldGarland(ctx, bx - 6, by + 4, bx + bw + 6, by + 4, 14);
    }

    ctx.restore();
  }

  renderArchedWindows(ctx, h, time) {
    const winW = 34;
    const winH = 44;
    const winY = h.y + 125;

    [h.x + 32, h.x + h.width - 66].forEach(wx => {
      ctx.save();
      // Arched Window Opening
      ctx.beginPath();
      ctx.arc(wx + winW / 2, winY + 14, winW / 2, Math.PI, 0);
      ctx.rect(wx, winY + 14, winW, winH - 14);
      ctx.closePath();

      // Warm interior candlelight
      const candleFlicker = Math.sin(time * 3 + wx) * 0.15;
      const winGrad = ctx.createRadialGradient(
        wx + winW / 2, winY + winH / 2, 4,
        wx + winW / 2, winY + winH / 2, winW
      );
      winGrad.addColorStop(0, '#ffffff');
      winGrad.addColorStop(0.4, '#fef08a');
      winGrad.addColorStop(1, '#ea580c');

      ctx.fillStyle = winGrad;
      ctx.fill();

      // Window Frame & Jali Grille
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cross grilles
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(wx + winW / 2, winY);
      ctx.lineTo(wx + winW / 2, winY + winH);
      ctx.moveTo(wx, winY + winH / 2);
      ctx.lineTo(wx + winW, winY + winH / 2);
      ctx.stroke();

      // Outer stone arch moulding
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(wx + winW / 2, winY + 14, winW / 2 + 3, Math.PI, 0);
      ctx.stroke();

      ctx.restore();
    });
  }

  renderGrandDoorway(ctx, h) {
    const doorW = 54;
    const doorH = 74;
    const dx = h.x + (h.width - doorW) / 2;
    const dy = h.y + h.height - doorH;

    ctx.save();
    // Stepped Marble Threshold
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(dx - 12, dy + doorH - 8, doorW + 24, 8);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(dx - 12, dy + doorH - 8, doorW + 24, 8);

    // Carved Doorway Arch
    ctx.beginPath();
    ctx.arc(dx + doorW / 2, dy + 22, doorW / 2, Math.PI, 0);
    ctx.rect(dx, dy + 22, doorW, doorH - 22);
    ctx.closePath();

    // Dark Teakwood finish
    ctx.fillStyle = '#2d1808';
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Double Door divider
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dx + doorW / 2, dy + 6);
    ctx.lineTo(dx + doorW / 2, dy + doorH - 8);
    ctx.stroke();

    // Brass Handles & Studs
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(dx + doorW / 2 - 8, dy + doorH / 2, 3, 0, Math.PI * 2);
    ctx.arc(dx + doorW / 2 + 8, dy + doorH / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Auspicious Doorway Toran (Marigold and Mango Leaf)
    if (h.decor.toran) {
      this.renderMarigoldGarland(ctx, dx - 6, dy + 16, dx + doorW + 6, dy + 16, 10);
    }

    ctx.restore();
  }

  renderMarigoldGarland(ctx, x1, y1, x2, y2, sag = 12) {
    ctx.save();
    const count = 12;
    const dx = x2 - x1;

    for (let i = 0; i <= count; i++) {
      const t = i / count;
      // Parabolic catenary curve
      const x = x1 + dx * t;
      const y = y1 + Math.sin(t * Math.PI) * sag;

      // Mango leaf
      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.ellipse(x, y + 4, 3, 7, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#15803d';
        ctx.fill();
      }

      // Marigold flower pom-pom (alternating saffron and bright yellow)
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#ea580c' : '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    ctx.restore();
  }

  renderAkashKandil(ctx, x, y, time) {
    ctx.save();
    ctx.translate(x, y);

    // Hanging brass wire
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 18);
    ctx.stroke();

    ctx.translate(0, 24);
    // Sway gently in the breeze
    const sway = Math.sin(time * 2 + x) * 0.08;
    ctx.rotate(sway);

    // Diamond Paper Lantern
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#f59e0b';
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(12, 0);
    ctx.lineTo(0, 14);
    ctx.lineTo(-12, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner glowing diya heart
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Crepe Paper Tassels hanging down
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    for (let t = -8; t <= 8; t += 4) {
      ctx.beginPath();
      ctx.moveTo(t, 14);
      ctx.lineTo(t + Math.sin(time * 3 + t) * 3, 28);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderFairyLightStrings(ctx, h, time) {
    ctx.save();
    // Swags along the roof eaves: Left slope and Right slope
    const peakX = h.x + h.width / 2;
    const peakY = h.y - 56;
    const leftX = h.x - 14;
    const rightX = h.x + h.width + 14;
    const eaveY = h.y;

    const renderSwag = (x1, y1, x2, y2, bulbsCount) => {
      // Wire
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      for (let i = 0; i <= bulbsCount; i++) {
        const t = i / bulbsCount;
        const bx = x1 + (x2 - x1) * t;
        const by = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 4;

        let color = '#fbbf24';
        if (h.lights.style === 'rainbow') {
          const colors = ['#ef4444', '#fbbf24', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6'];
          color = colors[(i + Math.floor(time * 4)) % colors.length];
        } else if (h.lights.style === 'cyan') {
          const colors = ['#06b6d4', '#38bdf8', '#818cf8', '#a855f7'];
          color = colors[(i + Math.floor(time * 4)) % colors.length];
        } else if (h.lights.style === 'pink') {
          const colors = ['#ec4899', '#f472b6', '#fbbf24'];
          color = colors[(i + Math.floor(time * 4)) % colors.length];
        } else if (h.lights.style === 'emerald') {
          const colors = ['#10b981', '#34d399', '#84cc16'];
          color = colors[(i + Math.floor(time * 4)) % colors.length];
        }

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(bx, by + 4, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // White filament core
        ctx.beginPath();
        ctx.arc(bx, by + 3.5, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }
    };

    renderSwag(leftX, eaveY, peakX, peakY, 12);
    renderSwag(peakX, peakY, rightX, eaveY, 12);
    renderSwag(h.x, h.y + 54, h.x + h.width, h.y + 54, 16);

    ctx.restore();
  }

  // ========================================================
  // 2. SHREE SHIV-LAKSHMI MANDIR (COMMUNITY TEMPLE)
  // ========================================================
  renderTemple(ctx, time) {
    const tm = this.temple;
    ctx.save();

    // Soft temple ambient ground shadow
    ctx.fillStyle = 'rgba(5, 4, 14, 0.6)';
    ctx.beginPath();
    ctx.roundRect(tm.x + 12, tm.y + 16, tm.width, tm.height, 14);
    ctx.fill();

    // Multi-tiered Sandstone Jagati (Platform)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(tm.x - 10, tm.y + 80, tm.width + 20, tm.height - 80);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(tm.x - 10, tm.y + 80, tm.width + 20, tm.height - 80);

    // Carved lotus frieze on base
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(tm.x - 10, tm.y + tm.height - 24, tm.width + 20, 24);

    // Stepped Nagara Shikhar (Sacred Temple Spire)
    const sx = tm.x + 50;
    const sw = tm.width - 100;
    const sy = tm.y + 80;
    const peakX = tm.x + tm.width / 2;
    const peakY = tm.y - 48;

    // Golden Shikhar Body
    const shikharGrad = ctx.createLinearGradient(sx, sy, sx + sw, peakY);
    shikharGrad.addColorStop(0, '#d97706');
    shikharGrad.addColorStop(0.5, '#fbbf24');
    shikharGrad.addColorStop(1, '#b45309');

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(peakX, peakY);
    ctx.lineTo(sx + sw, sy);
    ctx.closePath();
    ctx.fillStyle = shikharGrad;
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Fluted Ribbed Amalaka Disc atop Shikhar
    ctx.beginPath();
    ctx.ellipse(peakX, peakY - 8, 22, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Golden Kalash Spire
    ctx.beginPath();
    ctx.arc(peakX, peakY - 20, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#fbbf24';
    ctx.fill();

    // Sacred Red Flag (Dhwaja) fluttering atop the Kalash
    ctx.beginPath();
    ctx.moveTo(peakX, peakY - 28);
    ctx.lineTo(peakX, peakY - 48);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    const flagWave = Math.sin(time * 4) * 4;
    ctx.beginPath();
    ctx.moveTo(peakX, peakY - 48);
    ctx.lineTo(peakX + 24 + flagWave, peakY - 40);
    ctx.lineTo(peakX, peakY - 32);
    ctx.closePath();
    ctx.fillStyle = '#ea580c';
    ctx.fill();

    // Sacred Om Symbol carved on temple facade
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#dc2626';
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 36px "Tiro Devanagari Sanskrit", serif';
    ctx.textAlign = 'center';
    ctx.fillText('ॐ', peakX, sy + 65);

    // Temple Banner Title
    ctx.fillStyle = 'rgba(16, 12, 32, 0.95)';
    ctx.beginPath();
    ctx.roundRect(tm.x + 30, sy + 85, tm.width - 60, 28, 6);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 13px "Playfair Display", Georgia, serif';
    ctx.fillText('SHREE SHIV-LAKSHMI MANDIR', peakX, sy + 104);

    // Pillared Mandap Hall & Stepped Marble Entrance
    const entranceW = 120;
    const ex = tm.x + (tm.width - entranceW) / 2;
    const ey = tm.y + tm.height - 70;

    // Sanctum Garbhagriha Glow
    ctx.fillStyle = '#1c1106';
    ctx.fillRect(ex, ey, entranceW, 60);

    const sanctumGlow = ctx.createRadialGradient(
      peakX, ey + 25, 6,
      peakX, ey + 25, 55
    );
    sanctumGlow.addColorStop(0, '#ffffff');
    sanctumGlow.addColorStop(0.4, '#fef08a');
    sanctumGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = sanctumGlow;
    ctx.beginPath();
    ctx.arc(peakX, ey + 25, 55, 0, Math.PI * 2);
    ctx.fill();

    // Carved Marble Pillars
    [-45, -15, 15, 45].forEach(offset => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(peakX + offset - 5, ey, 10, 60);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(peakX + offset - 5, ey, 10, 60);
    });

    // Hanging Brass Bells (Ghanta)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(peakX, ey + 12, 11, Math.PI, 0);
    ctx.lineTo(peakX + 11, ey + 24);
    ctx.lineTo(peakX - 11, ey + 24);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sacred Marigold Swags along the temple cornice
    this.renderMarigoldGarland(ctx, tm.x - 6, sy + 6, tm.x + tm.width + 6, sy + 6, 16);

    ctx.restore();
  }

  // ========================================================
  // 3. SHUBH DEEPAWALI BAZAAR STALLS
  // ========================================================
  renderBazaarStalls(ctx, time) {
    this.stalls.forEach(s => {
      ctx.save();
      // Drop shadow
      ctx.fillStyle = 'rgba(7, 5, 16, 0.5)';
      ctx.beginPath();
      ctx.roundRect(s.x + 8, s.y + 12, s.width, s.height, 8);
      ctx.fill();

      // Wooden Kiosk Base
      ctx.fillStyle = '#3e1f0e';
      ctx.beginPath();
      ctx.roundRect(s.x, s.y + 44, s.width, s.height - 44, 6);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Scalloped Striped Fabric Awning
      const stripeW = 24;
      const stripes = Math.ceil(s.width / stripeW);
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? s.awningColor : '#fffbeb';
        ctx.beginPath();
        ctx.roundRect(s.x + i * stripeW, s.y, stripeW, 44, [0, 0, 8, 8]);
        ctx.fill();
      }

      // Stall Nameboard with Gold Lettering
      ctx.fillStyle = 'rgba(14, 10, 26, 0.95)';
      ctx.beginPath();
      ctx.roundRect(s.x + 12, s.y + 56, s.width - 24, 28, 6);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.name, s.x + s.width / 2, s.y + 71);

      ctx.fillStyle = '#fed7aa';
      ctx.font = '9px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(s.sub || 'Festival Bazaar', s.x + s.width / 2, s.y + 80);

      // Glass Display Counters with Sweets, Cracker Crates, Diyas
      const displayY = s.y + 96;
      ctx.fillStyle = '#542813';
      ctx.fillRect(s.x + 16, displayY, s.width - 32, 40);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.strokeRect(s.x + 16, displayY, s.width - 32, 40);

      // Detailed Cracker & Sweet Boxes on display
      const items = [
        { label: '🍬 Mithai', color: '#fbbf24', x: s.x + 40 },
        { label: '🎆 Pataka', color: '#ef4444', x: s.x + s.width / 2 },
        { label: '🪔 Diyas', color: '#ea580c', x: s.x + s.width - 40 }
      ];

      items.forEach(it => {
        ctx.fillStyle = it.color;
        ctx.beginPath();
        ctx.roundRect(it.x - 22, displayY + 8, 44, 24, 4);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(it.label, it.x, displayY + 24);
      });

      // Hanging paper streamers & lanterns
      this.renderAkashKandil(ctx, s.x + 18, s.y - 12, time);
      this.renderAkashKandil(ctx, s.x + s.width - 18, s.y - 12, time + 1);

      ctx.restore();
    });
  }

  // ========================================================
  // 4. CENTRAL CHOWK MAHA DEEPOTSAV ALTAR
  // ========================================================
  renderChowkAltar(ctx, time) {
    const cx = this.chowk.x;
    const cy = this.chowk.y;

    ctx.save();
    // Multi-tiered Circular Marble Pedestal
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Giant Carved Brass Urli Bowl
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Water surface inside Urli
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();

    // Floating Rose Petals & Golden Blossoms
    const floatingFlowers = 8;
    for (let f = 0; f < floatingFlowers; f++) {
      const a = (f * Math.PI * 2) / floatingFlowers + time * 0.4;
      const dist = 14 + Math.sin(a * 2) * 4;
      const fx = cx + Math.cos(a) * dist;
      const fy = cy + Math.sin(a) * dist;

      ctx.beginPath();
      ctx.arc(fx, fy, 3, 0, Math.PI * 2);
      ctx.fillStyle = f % 2 === 0 ? '#f43f5e' : '#fbbf24';
      ctx.fill();
    }

    // Sacred Maha Jyoti Eternal Flame
    ctx.shadowBlur = 32;
    ctx.shadowColor = '#f59e0b';
    const flameSize = 14 + Math.sin(time * 3) * 3;

    // Outer golden flame
    ctx.beginPath();
    ctx.arc(cx, cy - 8, flameSize, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Inner bright white-hot core
    ctx.beginPath();
    ctx.arc(cx, cy - 10, flameSize * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Plaque Label
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(16, 12, 32, 0.9)';
    ctx.beginPath();
    ctx.roundRect(cx - 90, cy + 46, 180, 20, 10);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ MAHA DEEPOTSAV ALTAR ✨', cx, cy + 59);

    ctx.restore();
  }

  // ========================================================
  // 5. TREES (NEEM, ASHOK & MARIGOLD)
  // ========================================================
  renderTrees(ctx, time) {
    this.trees.forEach(t => {
      ctx.save();
      // Tree ground shadow
      ctx.beginPath();
      ctx.arc(t.x + 8, t.y + 12, t.r + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 4, 16, 0.5)';
      ctx.fill();

      // Tree Trunk (Textured mahogany bark)
      ctx.fillStyle = '#451a03';
      ctx.fillRect(t.x - 7, t.y, 14, 28);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(t.x - 7, t.y, 14, 28);

      // Multi-layer Lush Green Canopy Clusters
      const foliageColors = ['#064e3b', '#047857', '#10b981'];
      foliageColors.forEach((color, idx) => {
        const rad = t.r - idx * 7;
        const offsetY = -idx * 8;
        ctx.beginPath();
        ctx.arc(t.x, t.y + offsetY, rad, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Flowering blossoms in canopy
      const blossomCount = 8;
      for (let b = 0; b < blossomCount; b++) {
        const a = (b * Math.PI * 2) / blossomCount;
        const bx = t.x + Math.cos(a) * (t.r * 0.65);
        const by = t.y - 12 + Math.sin(a) * (t.r * 0.65);

        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = t.flower;
        ctx.shadowBlur = 6;
        ctx.shadowColor = t.flower;
        ctx.fill();
      }

      // Fairy light strings wrapped around the foliage
      for (let l = 0; l < 5; l++) {
        const la = (l * Math.PI) / 2.5;
        const lx = t.x + Math.cos(la) * (t.r * 0.85);
        const ly = t.y - 14 + Math.sin(la) * (t.r * 0.85);

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fef08a';
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    });
  }

  // ========================================================
  // 6. CAST-IRON STREETLAMPS WITH WARM LIGHT CONES
  // ========================================================
  renderStreetlamps(ctx, time) {
    this.streetlamps.forEach(lamp => {
      ctx.save();
      // Volumetric Warm Ambient Light Pool on Cobblestones
      const grad = ctx.createRadialGradient(
        lamp.x, lamp.y + 4, 8,
        lamp.x, lamp.y + 4, 110
      );
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.14)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y + 4, 110, 0, Math.PI * 2);
      ctx.fill();

      // Cast-Iron Lamppost Base & Pole
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(lamp.x, lamp.y + 20);
      ctx.lineTo(lamp.x, lamp.y - 32);
      ctx.stroke();

      // Fluted Base
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y + 20, 6, 0, Math.PI * 2);
      ctx.fill();

      // Mughal Scrolled Bracket Head
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(lamp.x - 9, lamp.y - 38, 18, 14, 3);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glowing Filament Bulb
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y - 31, 5.5 + Math.sin(time * 2 + lamp.x) * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    });
  }
}

// Global world instance
window.diwaliWorld = new DiwaliWorld();
