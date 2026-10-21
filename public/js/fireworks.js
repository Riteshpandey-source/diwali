// ========================================================
// DIWALI FIREWORKS & PARTICLE SIMULATION ENGINE
// Realistic physics, smoke trails, explosion bouquets, sound sync
// ========================================================

class DiwaliFireworksEngine {
  constructor() {
    this.particles = [];
    this.groundCrackers = []; // Active Anars, Chakris, Lads
    this.skyRockets = [];
    this.skyLanterns = [];
    this.isSkyShowActive = false;
    this.skyShowInterval = null;
    this.reducedMotion = false;
    this.maxParticles = 800;
  }

  // Set reduced motion mode
  setReducedMotion(enabled) {
    this.reducedMotion = !!enabled;
    this.maxParticles = this.reducedMotion ? 250 : 800;
  }

  // 1. Launch a Sky Rocket
  launchRocket(startX, startY, targetX = null, targetY = null, customColor = null) {
    const tx = targetX !== null ? targetX : startX + (Math.random() - 0.5) * 80;
    const ty = targetY !== null ? targetY : startY - (280 + Math.random() * 180);

    const colors = [
      ['#ef4444', '#f87171'], // Ruby Red
      ['#fbbf24', '#fef08a'], // Golden Glow
      ['#10b981', '#6ee7b7'], // Emerald
      ['#06b6d4', '#67e8f9'], // Cyan
      ['#a855f7', '#d8b4fe'], // Violet
      ['#f43f5e', '#fda4af']  // Rose Pink
    ];
    const pickedColor = customColor ? [customColor, '#ffffff'] : colors[Math.floor(Math.random() * colors.length)];

    this.skyRockets.push({
      x: startX,
      y: startY,
      targetX: tx,
      targetY: ty,
      speed: 7 + Math.random() * 2,
      trail: [],
      color: pickedColor[0],
      secondaryColor: pickedColor[1]
    });

    window.festiveAudio.playRocketLaunch();
  }

  // 2. Place Ground Anar (Flowerpot Fountain)
  placeAnar(x, y) {
    this.groundCrackers.push({
      type: 'anar',
      x: x,
      y: y,
      duration: 210, // ~3.5 seconds at 60fps
      currentFrame: 0,
      sparkTimer: 0
    });
    window.festiveAudio.playAnarFountain(3500);
  }

  // 3. Place Ground Chakri (Spinning Fire Wheel)
  placeChakri(x, y) {
    this.groundCrackers.push({
      type: 'chakri',
      x: x,
      y: y,
      angle: 0,
      spinSpeed: 0.35,
      duration: 180, // ~3 seconds
      currentFrame: 0
    });
    window.festiveAudio.playChakriSpin(3000);
  }

  // 4. Launch Floating Sky Lantern (Akash Kandil)
  launchLantern(x, y) {
    this.skyLanterns.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.4 + 0.2, // gentle wind drift
      vy: -Math.random() * 0.6 - 0.6,
      sway: Math.random() * Math.PI * 2,
      alpha: 1.0,
      color: Math.random() > 0.4 ? '#f59e0b' : '#dc2626'
    });
    window.festiveAudio.playDiyaChime();
  }

  // 5. Place Earthen Clay Diya on Ground
  placeDiya(x, y) {
    if (window.diwaliWorld) {
      window.diwaliWorld.doorstepDiyas = window.diwaliWorld.doorstepDiyas || [];
      window.diwaliWorld.doorstepDiyas.push({ x, y });
    }
    window.festiveAudio.playDiyaChime();
  }

  // 6. Trigger Dedicated Sky Fireworks Show
  startSkyFireworksShow(durationMs = 18000) {
    if (this.isSkyShowActive) return;
    this.isSkyShowActive = true;

    const banner = document.getElementById('skyShowBtn');
    if (banner) banner.classList.add('active');

    let counter = 0;
    this.skyShowInterval = setInterval(() => {
      counter++;
      // Launch bursts of 2-3 rockets across the horizon
      const camX = window.diwaliPlayer ? window.diwaliPlayer.x : 650;
      const camY = window.diwaliPlayer ? window.diwaliPlayer.y : 600;

      const launchX = camX + (Math.random() - 0.5) * 600;
      const launchY = camY + 200 + Math.random() * 100;
      const targetY = camY - 350 - Math.random() * 200;

      this.launchRocket(launchX, launchY, launchX + (Math.random() - 0.5) * 150, targetY);

      if (counter % 3 === 0) {
        this.launchLantern(camX + (Math.random() - 0.5) * 400, camY + 100);
      }
    }, 900);

    setTimeout(() => {
      this.stopSkyFireworksShow();
    }, durationMs);
  }

  stopSkyFireworksShow() {
    this.isSkyShowActive = false;
    if (this.skyShowInterval) {
      clearInterval(this.skyShowInterval);
      this.skyShowInterval = null;
    }
    const banner = document.getElementById('skyShowBtn');
    if (banner) banner.classList.remove('active');
  }

  // Create explosion bouquet at apogee with layered brocade & willow streamers
  createExplosion(x, y, primaryColor, secondaryColor) {
    const isLarge = Math.random() > 0.35;
    const count = this.reducedMotion ? 40 : (isLarge ? 110 : 80);
    window.festiveAudio.playExplosion(isLarge ? 'large' : 'small');

    // 1. High-velocity colored starburst bouquet
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count + (Math.random() - 0.5) * 0.25;
      const speed = Math.random() * (isLarge ? 6.5 : 4.5) + 1.8;
      const col = Math.random() > 0.3 ? primaryColor : secondaryColor;

      this.particles.push({
        x: x,
        y: y,
        prevX: x,
        prevY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        decay: Math.random() * 0.016 + 0.012,
        gravity: 0.065,
        color: col,
        size: Math.random() * 2.8 + 1.4,
        twinkle: Math.random() > 0.4
      });
    }

    // 2. Trailing Kamuro Golden Willow Brocade (hangs in the air gracefully)
    const willowCount = this.reducedMotion ? 12 : 35;
    for (let i = 0; i < willowCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.2 + 0.8;
      this.particles.push({
        x: x,
        y: y,
        prevX: x,
        prevY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.8,
        alpha: 1.0,
        decay: Math.random() * 0.009 + 0.008, // Extra long hang time
        gravity: 0.04,
        color: '#fef08a',
        size: Math.random() * 2 + 1,
        twinkle: true
      });
    }

    // Flash illumination
    this.explosionFlash = { x, y, radius: isLarge ? 340 : 260, alpha: 0.45, color: primaryColor };
  }

  update() {
    // 1. Update Sky Rockets
    for (let i = this.skyRockets.length - 1; i >= 0; i--) {
      const r = this.skyRockets[i];
      const dx = r.targetX - r.x;
      const dy = r.targetY - r.y;
      const dist = Math.hypot(dx, dy);

      r.trail.push({ x: r.x, y: r.y, alpha: 0.7 });
      if (r.trail.length > 8) r.trail.shift();

      if (dist < 15 || r.y <= r.targetY) {
        // Rocket detonates!
        this.createExplosion(r.x, r.y, r.color, r.secondaryColor);
        this.skyRockets.splice(i, 1);
      } else {
        r.x += (dx / dist) * r.speed;
        r.y += (dy / dist) * r.speed;

        // Spark particles along rocket tail
        if (Math.random() < 0.6) {
          this.particles.push({
            x: r.x + (Math.random() - 0.5) * 3,
            y: r.y + (Math.random() - 0.5) * 3,
            vx: (Math.random() - 0.5) * 0.8,
            vy: Math.random() * 1.5 + 0.5,
            alpha: 0.8,
            decay: 0.06,
            gravity: 0.02,
            color: '#fef08a',
            size: 1.5
          });
        }
      }
    }

    // 2. Update Ground Crackers (Anars & Chakris)
    for (let i = this.groundCrackers.length - 1; i >= 0; i--) {
      const g = this.groundCrackers[i];
      g.currentFrame++;

      if (g.type === 'anar') {
        // Spray fountain of sparks upward
        const sparkRate = this.reducedMotion ? 3 : 7;
        for (let s = 0; s < sparkRate; s++) {
          const spread = (Math.random() - 0.5) * 2.2;
          const upSpeed = -Math.random() * 7 - 4;
          this.particles.push({
            x: g.x + (Math.random() - 0.5) * 8,
            y: g.y,
            vx: spread,
            vy: upSpeed,
            alpha: 1.0,
            decay: Math.random() * 0.03 + 0.02,
            gravity: 0.22,
            color: Math.random() > 0.3 ? '#fef08a' : '#fbbf24',
            size: Math.random() * 2 + 1
          });
        }
      } else if (g.type === 'chakri') {
        g.angle += g.spinSpeed;
        const sparkRate = this.reducedMotion ? 3 : 6;
        for (let s = 0; s < sparkRate; s++) {
          const tangent = g.angle + (s * Math.PI) / 3;
          const speed = Math.random() * 3 + 2.5;
          this.particles.push({
            x: g.x + Math.cos(tangent) * 8,
            y: g.y + Math.sin(tangent) * 8,
            vx: Math.cos(tangent) * speed,
            vy: Math.sin(tangent) * speed,
            alpha: 1.0,
            decay: 0.04,
            gravity: 0.01,
            color: Math.random() > 0.4 ? '#fbbf24' : '#ef4444',
            size: 2
          });
        }
      }

      if (g.currentFrame >= g.duration) {
        this.groundCrackers.splice(i, 1);
      }
    }

    // 3. Update Sky Lanterns
    for (let i = this.skyLanterns.length - 1; i >= 0; i--) {
      const k = this.skyLanterns[i];
      k.sway += 0.03;
      k.x += k.vx + Math.sin(k.sway) * 0.3;
      k.y += k.vy;
      if (k.y < -50) {
        this.skyLanterns.splice(i, 1);
      }
    }

    // 4. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.prevX = p.x;
      p.prevY = p.y;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985; // Slight air resistance
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Enforce max particle limit for 60fps performance
    if (this.particles.length > this.maxParticles) {
      this.particles.splice(0, this.particles.length - this.maxParticles);
    }

    // Flash decay
    if (this.explosionFlash) {
      this.explosionFlash.alpha -= 0.035;
      if (this.explosionFlash.alpha <= 0) {
        this.explosionFlash = null;
      }
    }
  }

  render(ctx) {
    ctx.save();

    // 1. Render Ground Crackers
    this.groundCrackers.forEach(g => {
      if (g.type === 'anar') {
        // Clay pot base
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.moveTo(g.x - 12, g.y);
        ctx.lineTo(g.x + 12, g.y);
        ctx.lineTo(g.x + 5, g.y - 20);
        ctx.lineTo(g.x - 5, g.y - 20);
        ctx.closePath();
        ctx.fill();

        // Pot ornamentation
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Nozzle flame
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(g.x, g.y - 22, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (g.type === 'chakri') {
        // Spinning disk
        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.angle);
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#78350f';
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Whirling spokes
        ctx.beginPath();
        ctx.moveTo(-11, 0);
        ctx.lineTo(11, 0);
        ctx.moveTo(0, -11);
        ctx.lineTo(0, 11);
        ctx.stroke();
        ctx.restore();
      }
    });

    // 2. Render Sky Lanterns (Akash Kandil)
    this.skyLanterns.forEach(k => {
      ctx.save();
      ctx.translate(k.x, k.y);

      // Warm radial ambient light pool
      const lanternGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 36);
      lanternGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      lanternGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.18)');
      lanternGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = lanternGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fill();

      // Octagonal translucent silk lantern body
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#f59e0b';
      ctx.fillStyle = k.color;
      ctx.beginPath();
      ctx.roundRect(-9, -15, 18, 22, 4);
      ctx.fill();

      // Golden bamboo ribbing
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Glowing interior diya flame
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#fff';
      ctx.beginPath();
      ctx.arc(0, -4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Golden hanging fringe tassels
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      const swayTassel = Math.sin(k.sway) * 2;
      ctx.beginPath();
      ctx.moveTo(-5, 7);
      ctx.lineTo(-5 + swayTassel, 16);
      ctx.moveTo(0, 7);
      ctx.lineTo(0 + swayTassel, 18);
      ctx.moveTo(5, 7);
      ctx.lineTo(5 + swayTassel, 16);
      ctx.stroke();

      ctx.restore();
    });

    // 3. Render Sky Rockets & Trails
    this.skyRockets.forEach(r => {
      // Golden sparkling smoke trail
      for (let t of r.trail) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${t.alpha * 0.7})`;
        ctx.fill();
      }

      // Rocket Shell with glow
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = r.color;
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 4. Render Particles with Cinematic Streak Trails
    for (let p of this.particles) {
      const alpha = Math.max(0, Math.min(1, p.alpha));
      ctx.globalAlpha = alpha;

      if (p.prevX !== undefined && (Math.abs(p.x - p.prevX) > 0.5 || Math.abs(p.y - p.prevY) > 0.5)) {
        // High-velocity streak line
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      } else {
        // Glowing dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparkle twinkle
      if (p.twinkle && Math.random() < 0.25) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // 5. Explosion Flash
    if (this.explosionFlash) {
      const ef = this.explosionFlash;
      const grad = ctx.createRadialGradient(ef.x, ef.y, 10, ef.x, ef.y, ef.radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${ef.alpha * 0.75})`);
      grad.addColorStop(0.4, `rgba(251, 191, 36, ${ef.alpha * 0.35})`);
      grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ef.x, ef.y, ef.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Global fireworks instance
window.diwaliFireworks = new DiwaliFireworksEngine();
