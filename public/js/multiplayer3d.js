// ===================================================================
// DIWALI 3D MULTIPLAYER - 3D REMOTE PLAYER AVATARS & SYNC
// Renders connected friends as articulated 3D characters in the colony,
// interpolates movements, and synchronizes shared festival actions.
// ===================================================================

class DiwaliMultiplayer3D {
  constructor(scene) {
    this.scene = scene;
    this.avatars = new Map(); // id -> { group, targetX, targetZ, currentX, currentZ, walkCycle, ... }

    // Spatial translation
    this.scale = 0.1;
    this.centerX = 890;
    this.centerZ = 610;
  }

  to3D(x2d, y2d) {
    return {
      x: (x2d - this.centerX) * this.scale,
      z: (y2d - this.centerZ) * this.scale
    };
  }

  addPlayer(playerData) {
    if (this.avatars.has(playerData.id)) {
      this.removePlayer(playerData.id);
    }

    const pos = this.to3D(playerData.x || 650, playerData.y || 680);
    const root = new THREE.Group();
    root.name = `RemotePlayer_${playerData.id}`;
    root.position.set(pos.x, 0, pos.z);

    const kurtaHex = parseInt(playerData.kurtaColor ? playerData.kurtaColor.replace('#', '0x') : '0x0284c7');
    const turbanHex = parseInt(playerData.turbanColor ? playerData.turbanColor.replace('#', '0x') : '0xf59e0b');

    const kurtaMat = new THREE.MeshStandardMaterial({ color: kurtaHex, roughness: 0.5 });
    const turbanMat = new THREE.MeshStandardMaterial({ color: turbanHex, roughness: 0.55 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd49b73, roughness: 0.65 });
    const dhotiMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.75, roughness: 0.25 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 0.5), kurtaMat);
    torso.position.y = 1.6;
    torso.castShadow = true;
    root.add(torso);

    // Flared hem
    const flare = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.65, 8), kurtaMat);
    flare.position.y = 1.05;
    root.add(flare);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), skinMat);
    head.position.y = 2.35;
    root.add(head);

    // Turban
    const turban = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.16, 8, 14), turbanMat);
    turban.rotation.x = Math.PI / 2;
    turban.position.y = 2.47;
    root.add(turban);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.85, 8);
    armGeo.translate(0, -0.4, 0);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.54, 1.95, 0);
    const leftArm = new THREE.Mesh(armGeo, kurtaMat);
    leftArmGroup.add(leftArm);
    root.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.54, 1.95, 0);
    const rightArm = new THREE.Mesh(armGeo, kurtaMat);
    rightArmGroup.add(rightArm);

    // Sparkler
    const sparklerGroup = new THREE.Group();
    sparklerGroup.position.set(0, -0.85, 0.25);
    sparklerGroup.rotation.x = Math.PI / 4;
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), goldMat);
    sparklerGroup.add(stick);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    tip.position.y = 0.3;
    sparklerGroup.add(tip);

    const light = new THREE.PointLight(0xffb703, 1.8, 6);
    light.position.y = 0.32;
    sparklerGroup.add(light);
    rightArmGroup.add(sparklerGroup);
    root.add(rightArmGroup);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.95, 8);
    legGeo.translate(0, -0.45, 0);

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.24, 0.95, 0);
    const leftLeg = new THREE.Mesh(legGeo, dhotiMat);
    leftLegGroup.add(leftLeg);
    root.add(leftLegGroup);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.24, 0.95, 0);
    const rightLeg = new THREE.Mesh(legGeo, dhotiMat);
    rightLegGroup.add(rightLeg);
    root.add(rightLegGroup);

    // Name Tag Sprite
    const nameSprite = this.createNameSprite(playerData.name || 'Friend');
    nameSprite.position.set(0, 3.1, 0);
    root.add(nameSprite);

    this.scene.add(root);

    this.avatars.set(playerData.id, {
      root,
      leftArmGroup,
      rightArmGroup,
      leftLegGroup,
      rightLegGroup,
      sparklerGroup,
      sparklerLight: light,
      currentX: pos.x,
      currentZ: pos.z,
      targetX: pos.x,
      targetZ: pos.z,
      rotation: 0,
      targetRotation: 0,
      isMoving: false,
      walkCycle: 0,
      name: playerData.name || 'Friend'
    });
  }

  createNameSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect(16, 12, 224, 40, 20);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.roundRect(16, 12, 224, 40, 20);
    ctx.stroke();

    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#bae6fd';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.2, 0.8, 1);
    return sprite;
  }

  updatePlayerPosition(id, x2d, y2d, facing, isMoving, sparklerActive) {
    const avatar = this.avatars.get(id);
    if (!avatar) return;

    const pos = this.to3D(x2d, y2d);
    avatar.targetX = pos.x;
    avatar.targetZ = pos.z;
    avatar.isMoving = !!isMoving;

    if (avatar.sparklerGroup) {
      avatar.sparklerGroup.visible = !!sparklerActive;
    }

    // Direction rotation
    const dx = avatar.targetX - avatar.currentX;
    const dz = avatar.targetZ - avatar.currentZ;
    if (Math.hypot(dx, dz) > 0.05) {
      avatar.targetRotation = Math.atan2(dx, dz);
    }
  }

  removePlayer(id) {
    const avatar = this.avatars.get(id);
    if (avatar) {
      this.scene.remove(avatar.root);
      this.avatars.delete(id);
    }
  }

  showEmote(id, text, emoji) {
    const avatar = this.avatars.get(id);
    if (!avatar) return;

    const sprite = this.createNameSprite(`${emoji} ${text}`);
    sprite.position.set(0, 4.0, 0);
    avatar.root.add(sprite);

    setTimeout(() => {
      avatar.root.remove(sprite);
    }, 3200);
  }

  update(delta = 0.016) {
    this.avatars.forEach(avatar => {
      // Smooth interpolation to target position
      avatar.currentX += (avatar.targetX - avatar.currentX) * 0.15;
      avatar.currentZ += (avatar.targetZ - avatar.currentZ) * 0.15;
      avatar.root.position.set(avatar.currentX, 0, avatar.currentZ);

      // Rotation interpolation
      let rotDiff = avatar.targetRotation - avatar.rotation;
      while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
      while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
      avatar.rotation += rotDiff * 0.18;
      avatar.root.rotation.y = avatar.rotation;

      // Limb animation
      if (avatar.isMoving) {
        avatar.walkCycle += 8 * delta;
        const swing = Math.sin(avatar.walkCycle) * 0.55;
        avatar.leftLegGroup.rotation.x = swing;
        avatar.rightLegGroup.rotation.x = -swing;
        avatar.leftArmGroup.rotation.x = -swing * 0.8;
        avatar.rightArmGroup.rotation.x = swing * 0.4;
      } else {
        avatar.leftLegGroup.rotation.x *= 0.8;
        avatar.rightLegGroup.rotation.x *= 0.8;
        avatar.leftArmGroup.rotation.x *= 0.8;
        avatar.rightArmGroup.rotation.x *= 0.8;
      }

      if (avatar.sparklerLight && avatar.sparklerGroup.visible) {
        avatar.sparklerLight.intensity = 1.6 + Math.random() * 0.6;
      }
    });
  }
}

window.DiwaliMultiplayer3D = DiwaliMultiplayer3D;
