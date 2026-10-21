// ========================================================
// CONTROLLABLE DIWALI CHARACTER WITH WALKING ANIMATION
// ========================================================

class DiwaliPlayer {
  constructor(x = 650, y = 680) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.speed = 3.6;
    this.sprintSpeed = 5.8;
    this.vx = 0;
    this.vy = 0;
    this.facing = 'down';
    this.isMoving = false;
    this.isSprinting = false;

    // Customization
    this.name = 'You';
    this.kurtaColor = '#dc2626'; // Festive Ruby Red default
    this.turbanColor = '#f59e0b'; // Saffron Gold default

    // Handheld sparkler state
    this.sparklerActive = true;
    this.sparklerSparks = [];

    // Animation frames
    this.walkCycle = 0;
    this.animSpeed = 0.22;

    // Emote currently showing above head
    this.activeEmote = null;
    this.emoteTimeout = null;
  }

  update(keys, joystickVector, colliders, worldBounds) {
    let dx = 0;
    let dy = 0;

    // Keyboard inputs
    if (keys['ArrowUp'] || keys['KeyW'] || keys['w']) dy -= 1;
    if (keys['ArrowDown'] || keys['KeyS'] || keys['s']) dy += 1;
    if (keys['ArrowLeft'] || keys['KeyA'] || keys['a']) dx -= 1;
    if (keys['ArrowRight'] || keys['KeyD'] || keys['d']) dx += 1;

    // Mobile touch joystick input
    if (joystickVector && (joystickVector.x !== 0 || joystickVector.y !== 0)) {
      dx = joystickVector.x;
      dy = joystickVector.y;
    }

    // Sprint state
    this.isSprinting = !!(keys['ShiftLeft'] || keys['ShiftRight'] || window.mobileSprintActive);
    const curSpeed = this.isSprinting ? this.sprintSpeed : this.speed;

    // Normalize diagonal movement
    const len = Math.hypot(dx, dy);
    if (len > 0.05) {
      this.isMoving = true;
      this.vx = (dx / len) * curSpeed;
      this.vy = (dy / len) * curSpeed;

      // Update facing direction
      if (Math.abs(dx) > Math.abs(dy)) {
        this.facing = dx > 0 ? 'right' : 'left';
      } else {
        this.facing = dy > 0 ? 'down' : 'up';
      }

      this.walkCycle += this.animSpeed * (this.isSprinting ? 1.5 : 1.0);
    } else {
      this.isMoving = false;
      this.vx = 0;
      this.vy = 0;
      this.walkCycle = 0;
    }

    // Move with collision checking on X and Y separately
    this.moveWithCollisions(this.vx, this.vy, colliders, worldBounds);

    // Update handheld sparkler particles
    this.updateSparkler();
  }

  moveWithCollisions(vx, vy, colliders, world) {
    // Attempt X movement
    const newX = this.x + vx;
    if (!this.checkCollision(newX, this.y, colliders, world)) {
      this.x = newX;
    }

    // Attempt Y movement
    const newY = this.y + vy;
    if (!this.checkCollision(this.x, newY, colliders, world)) {
      this.y = newY;
    }
  }

  checkCollision(nx, ny, colliders, world) {
    const r = this.radius;

    // World boundaries
    if (nx - r < 40 || nx + r > world.width - 40) return true;
    if (ny - r < 40 || ny + r > world.height - 40) return true;

    // Check against all box colliders
    for (let c of colliders) {
      // Find closest point in rectangle to circle
      const closestX = Math.max(c.x, Math.min(nx, c.x + c.w));
      const closestY = Math.max(c.y, Math.min(ny, c.y + c.h));
      const distSq = (nx - closestX) * (nx - closestX) + (ny - closestY) * (ny - closestY);
      if (distSq < r * r) {
        return true;
      }
    }
    return false;
  }

  showEmote(emoteText, emoji) {
    this.activeEmote = { text: emoteText, emoji: emoji, time: Date.now() };
    if (this.emoteTimeout) clearTimeout(this.emoteTimeout);
    this.emoteTimeout = setTimeout(() => {
      this.activeEmote = null;
    }, 3200);

    // Also trigger sound
    window.festiveAudio.playDiyaChime();
  }

  updateSparkler() {
    if (this.sparklerActive) {
      // Emit sparks from hand position
      const handOffset = this.getHandPosition();
      const count = this.isMoving ? 3 : 1;
      for (let i = 0; i < count; i++) {
        this.sparklerSparks.push({
          x: handOffset.x + (Math.random() - 0.5) * 4,
          y: handOffset.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 + 0.5,
          life: 1.0,
          decay: Math.random() * 0.05 + 0.03,
          color: Math.random() > 0.4 ? '#fef08a' : '#f59e0b',
          size: Math.random() * 2 + 1
        });
      }

      // Random crackle audio
      if (Math.random() < 0.15) {
        window.festiveAudio.playSparklerSpark();
      }
    }

    // Update sparks
    for (let i = this.sparklerSparks.length - 1; i >= 0; i--) {
      const s = this.sparklerSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      if (s.life <= 0) {
        this.sparklerSparks.splice(i, 1);
      }
    }
  }

  getHandPosition() {
    const angleMap = {
      down: { x: 12, y: -6 },
      up: { x: -12, y: -16 },
      left: { x: -14, y: -8 },
      right: { x: 14, y: -8 }
    };
    const offset = angleMap[this.facing] || angleMap.down;
    return { x: this.x + offset.x, y: this.y + offset.y };
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 1. Dynamic Soft Ground Shadow with Ambient Occlusion
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(0, 10, 2, 0, 10, 18);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    shadowGrad.addColorStop(0.6, 'rgba(10, 7, 24, 0.35)');
    shadowGrad.addColorStop(1, 'rgba(10, 7, 24, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, 10, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Walking animation cycle
    const legSwing = Math.sin(this.walkCycle) * 5;
    const bodyBob = this.isMoving ? Math.abs(Math.sin(this.walkCycle * 2)) * 2.5 : 0;
    const swayAngle = this.isMoving ? Math.sin(this.walkCycle) * 0.05 : 0;

    ctx.save();
    ctx.rotate(swayAngle);

    // 2. Traditional Mojari Footwear & Dhoti / Churidar Legs
    const renderFoot = (fx, fy, isCurled) => {
      // White silk churidar leg
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(fx - 2.5, fy - 6, 5, 8, [2, 2, 0, 0]);
      ctx.fill();

      // Royal Mojari shoe (curled golden toe)
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(fx, fy + 3, 3.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Golden embroidered toe tip
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(isCurled ? fx + 3 : fx - 3, fy + 3, 1.2, 0, Math.PI * 2);
      ctx.fill();
    };

    if (this.facing === 'left' || this.facing === 'right') {
      const dir = this.facing === 'right' ? 1 : -1;
      renderFoot(-3 * dir + legSwing * dir, 4, dir > 0);
      renderFoot(3 * dir - legSwing * dir, 4, dir > 0);
    } else {
      renderFoot(-5, 4 + legSwing, false);
      renderFoot(5, 4 - legSwing, true);
    }

    // 3. Flowing Silk Kurta Body
    const torsoY = -18 - bodyBob;

    // Kurta base
    const kurtaGrad = ctx.createLinearGradient(-12, torsoY, 12, torsoY + 22);
    kurtaGrad.addColorStop(0, this.kurtaColor);
    kurtaGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = kurtaGrad;
    ctx.beginPath();
    ctx.roundRect(-11, torsoY, 22, 22, [5, 5, 7, 7]);
    ctx.fill();

    // Golden Zari hem border at bottom of Kurta
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-11, torsoY + 19, 22, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-10, torsoY + 20, 20, 1);

    // Overlapping Angrakha style placket with jeweled buttons
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-2, torsoY);
    ctx.quadraticCurveTo(2, torsoY + 6, 4, torsoY + 19);
    ctx.stroke();

    // Gemstone buttons
    ctx.fillStyle = '#fef08a';
    for (let b = 0; b < 3; b++) {
      ctx.beginPath();
      ctx.arc(1, torsoY + 4 + b * 5, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Festive Dupatta / Stole (Angavastram draped across shoulder)
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-9, torsoY + 2);
    ctx.quadraticCurveTo(0, torsoY + 12, 10, torsoY + 16);
    ctx.stroke();

    // Sashing tail of stole fluttering with movement
    const flutter = Math.sin(this.walkCycle * 1.5) * 3;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(10, torsoY + 16);
    ctx.quadraticCurveTo(13 + flutter, torsoY + 22, 12 + flutter, torsoY + 26);
    ctx.stroke();
    ctx.restore();

    // 5. Head & Face
    const headY = -25 - bodyBob;
    ctx.beginPath();
    ctx.arc(0, headY, 9.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fed7aa'; // Warm luminous Indian complexion
    ctx.fill();

    // Facial features (when not facing up)
    if (this.facing !== 'up') {
      // Forehead Sacred Tilak / Chandan Tika
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-0.8, headY - 5, 1.6, 3);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, headY - 1.5, 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Expressive eyes
      ctx.fillStyle = '#1e1b4b';
      if (this.facing === 'down') {
        // Left eye
        ctx.beginPath();
        ctx.ellipse(-3.8, headY + 0.5, 1.4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.ellipse(3.8, headY + 0.5, 1.4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eye reflections
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3.4, headY - 0.2, 0.8, 0.8);
        ctx.fillRect(4.2, headY - 0.2, 0.8, 0.8);
      } else if (this.facing === 'left') {
        ctx.beginPath();
        ctx.ellipse(-5.5, headY + 0.5, 1.4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5.2, headY - 0.2, 0.8, 0.8);
      } else if (this.facing === 'right') {
        ctx.beginPath();
        ctx.ellipse(5.5, headY + 0.5, 1.4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(5.8, headY - 0.2, 0.8, 0.8);
      }
    }

    // 6. Royal Rajasthani Pagri / Safaa Turban
    ctx.save();
    // Turban wrapped main dome
    const turbGrad = ctx.createLinearGradient(-13, headY - 14, 13, headY - 4);
    turbGrad.addColorStop(0, '#fbbf24');
    turbGrad.addColorStop(0.5, this.turbanColor);
    turbGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = turbGrad;
    ctx.beginPath();
    ctx.ellipse(0, headY - 5.5, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Turban pleated band folds
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, headY - 5.5, 11, -0.6, Math.PI + 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, headY - 3, 11.5, -0.4, Math.PI + 0.4);
    ctx.stroke();

    // Jeweled Sarpech / Kalgi Brooch (Golden plume feather with emerald)
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, headY - 11);
    ctx.lineTo(-3, headY - 17);
    ctx.quadraticCurveTo(0, headY - 19, 3, headY - 15);
    ctx.closePath();
    ctx.fill();

    // Brooch center ruby/emerald stone
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, headY - 12, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Handheld Phuljhadi (Sparkler) with dynamic light cast
    if (this.sparklerActive) {
      const hand = this.getHandPosition();
      const rx = hand.x - this.x;
      const ry = hand.y - this.y;

      // Thin wire stick
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(rx - 5, ry + 10);
      ctx.lineTo(rx, ry);
      ctx.stroke();

      // Searing bright incandescent tip
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.arc(rx, ry, 3.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Golden halo aura
      const aura = ctx.createRadialGradient(rx, ry, 2, rx, ry, 36);
      aura.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
      aura.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
      aura.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(rx, ry, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 8. Player Nameplate (Refined translucent gold pill)
    const nameY = -46 - bodyBob;
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    const textWidth = ctx.measureText(this.name).width;
    const plateWidth = Math.max(52, textWidth + 18);

    ctx.save();
    ctx.fillStyle = 'rgba(9, 13, 22, 0.88)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-plateWidth / 2, nameY, plateWidth, 18, 9);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, 0, nameY + 13);
    ctx.restore();

    // 9. Active Emote Speech Bubble
    if (this.activeEmote) {
      const bubbleY = -72 - bodyBob;
      ctx.save();
      ctx.fillStyle = 'rgba(9, 13, 22, 0.95)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';

      const text = `${this.activeEmote.emoji} ${this.activeEmote.text}`;
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      const bWidth = ctx.measureText(text).width + 22;

      ctx.beginPath();
      ctx.roundRect(-bWidth / 2, bubbleY, bWidth, 26, 13);
      ctx.fill();
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(-4, bubbleY + 26);
      ctx.lineTo(0, bubbleY + 32);
      ctx.lineTo(4, bubbleY + 26);
      ctx.fillStyle = 'rgba(9, 13, 22, 0.95)';
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(text, 0, bubbleY + 17);
      ctx.restore();
    }

    ctx.restore(); // swayAngle
    ctx.restore(); // translate

    // Render sparkler sparks in world coordinates
    if (this.sparklerSparks.length > 0) {
      ctx.save();
      for (let s of this.sparklerSparks) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
      }
      ctx.restore();
    }
  }
}

// Global player instance
window.diwaliPlayer = new DiwaliPlayer();
