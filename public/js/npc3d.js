// ===================================================================
// DIWALI 3D NPC CHARACTERS & AUTONOMOUS BEHAVIOR CONTROLLER
// Articulated stylized 3D Indian festive characters with procedural
// joint animation, diverse cultural attire, and reactive AI states.
// ===================================================================

const NPCState = {
  IDLE: 'IDLE',
  WALKING: 'WALKING',
  RUNNING: 'RUNNING',
  TALKING: 'TALKING',
  SHOPPING: 'SHOPPING',
  LIGHTING_DIYA: 'LIGHTING_DIYA',
  USING_VIRTUAL_FIREWORKS: 'USING_VIRTUAL_FIREWORKS',
  PRAYING: 'PRAYING',
  AARTI: 'AARTI',
  DECORATING: 'DECORATING',
  WATCHING_FIREWORKS: 'WATCHING_FIREWORKS',
  RETURNING_HOME: 'RETURNING_HOME'
};

class DiwaliNPC3D {
  constructor(config) {
    this.id = config.id || `npc_${Math.random().toString(36).substr(2, 6)}`;
    this.name = config.name || 'Resident';
    this.role = config.role || 'father'; // father, mother, child_boy, child_girl, grandparent, priest, devotee_woman, devotee_man, shopkeeper, decorator_woman
    this.homeWp = config.homeWp || 'home_sharma';

    // Position & Transform
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.z = config.z || 0;
    this.rotation = config.rotation || 0;
    this.targetRotation = this.rotation;

    // Movement speeds
    const isChild = this.role === 'child_boy' || this.role === 'child_girl';
    this.walkSpeed = isChild ? 2.8 : (config.speed || 2.4);
    this.runSpeed = isChild ? 4.8 : 3.8;
    this.currentSpeed = this.walkSpeed;

    // Scale
    this.charScale = isChild ? (this.role === 'child_boy' ? 0.72 : 0.68) : (config.scale || 0.95);

    // AI State
    this.state = config.initialState || NPCState.IDLE;
    this.stateTimer = 0;
    this.stateDuration = 4.0 + Math.random() * 4.0;
    this.path = [];
    this.currentPathIndex = 0;

    // Colors
    this.colors = config.colors || this.getDefaultColors(this.role);

    // Animation Cycle Timers
    this.walkCycle = Math.random() * 10;
    this.animTime = Math.random() * 10;
    this.isMoving = false;

    // Overhead Dialogue
    this.dialogueText = '';
    this.dialogueTimer = 0;

    // Props
    this.propType = config.prop || (isChild ? 'sparkler' : (this.role === 'priest' ? 'aarti_lamp' : (this.role === 'decorator_woman' ? 'flower_basket' : 'none')));

    // Build 3D Mesh
    this.group = new THREE.Group();
    this.group.name = `NPC_${this.id}`;
    this.group.position.set(this.x, this.y, this.z);
    this.group.rotation.y = this.rotation;
    this.group.scale.set(this.charScale, this.charScale, this.charScale);

    this.buildCharacterMesh();
  }

  getDefaultColors(role) {
    switch (role) {
      case 'father':
        return {
          main: 0x0284c7, // Turquoise Silk Kurta
          accent: 0xf59e0b, // Gold Sash
          turban: 0xe11d48, // Ruby Pagri
          bottom: 0xf8fafc, // Pearl White Pajama
          skin: 0xd49b73
        };
      case 'mother':
        return {
          main: 0xe11d48, // Royal Ruby Saree
          accent: 0xfbbf24, // Gold Zari Border
          turban: 0x991b1b,
          bottom: 0xbe123c, // Pleated Saree Hem
          skin: 0xd49b73
        };
      case 'child_boy':
        return {
          main: 0xf97316, // Bright Saffron Kurta
          accent: 0xfbbf24,
          turban: 0xf59e0b,
          bottom: 0xf8fafc,
          skin: 0xdd9a6b
        };
      case 'child_girl':
        return {
          main: 0xdb2777, // Vibrant Pink Lehenga
          accent: 0xf59e0b, // Golden Choli
          turban: 0xf43f5e,
          bottom: 0x7c3aed, // Purple silk skirt
          skin: 0xdd9a6b
        };
      case 'grandparent':
        return {
          main: 0xfef3c7, // Ivory Khadi Silk
          accent: 0xd97706, // Ochre Shawl
          turban: 0x94a3b8, // Silver Grey Hair / Safaa
          bottom: 0xf8fafc,
          skin: 0xc88f68
        };
      case 'priest':
        return {
          main: 0xea580c, // Sacred Saffron Dhoti
          accent: 0xfbbf24, // Golden Angavastram
          turban: 0xd97706,
          bottom: 0xea580c,
          skin: 0xcf9268
        };
      case 'decorator_woman':
        return {
          main: 0x059669, // Emerald Green Festive Saree
          accent: 0xf59e0b, // Marigold Trim
          turban: 0x047857,
          bottom: 0x065f46,
          skin: 0xd49b73
        };
      case 'shopkeeper':
        return {
          main: 0x854d0e, // Warm Brown Merchant Vest
          accent: 0xf59e0b,
          turban: 0xe11d48, // Festive Pagri
          bottom: 0xf8fafc,
          skin: 0xc88b62
        };
      default:
        return {
          main: 0x4f46e5,
          accent: 0xfbbf24,
          turban: 0xf59e0b,
          bottom: 0xf8fafc,
          skin: 0xd49b73
        };
    }
  }

  buildCharacterMesh() {
    const c = this.colors;

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: c.skin, roughness: 0.65 });
    const mainMat = new THREE.MeshStandardMaterial({ color: c.main, roughness: 0.55 });
    const accentMat = new THREE.MeshStandardMaterial({ color: c.accent, metalness: 0.7, roughness: 0.25 });
    const bottomMat = new THREE.MeshStandardMaterial({ color: c.bottom, roughness: 0.7 });
    const hairMat = new THREE.MeshStandardMaterial({ color: (this.role === 'grandparent' ? 0xd1d5db : 0x1f2937), roughness: 0.8 });
    const turbanMat = new THREE.MeshStandardMaterial({ color: c.turban, roughness: 0.55 });

    // 1. Torso Group
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.6;

    const chestGeo = new THREE.BoxGeometry(0.82, 0.88, 0.48);
    const chest = new THREE.Mesh(chestGeo, mainMat);
    chest.castShadow = true;
    this.torsoGroup.add(chest);

    // Collar / Neckline
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 8), accentMat);
    collar.position.y = 0.48;
    this.torsoGroup.add(collar);

    // Flared Lower Hem / Saree Skirt Base
    if (this.role === 'mother' || this.role === 'child_girl' || this.role === 'decorator_woman') {
      // Flowing Saree / Lehenga Skirt
      const skirtGeo = new THREE.ConeGeometry(0.68, 0.95, 12, 1, true);
      const skirt = new THREE.Mesh(skirtGeo, bottomMat);
      skirt.position.y = -0.7;
      skirt.castShadow = true;
      this.torsoGroup.add(skirt);

      // Gold Border Trim on Hem
      const skirtBorder = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.04, 6, 16), accentMat);
      skirtBorder.rotation.x = Math.PI / 2;
      skirtBorder.position.y = -1.15;
      this.torsoGroup.add(skirtBorder);

      // Draped Saree Pallu across chest & left shoulder
      const palluGeo = new THREE.BoxGeometry(0.32, 0.88, 0.08);
      const pallu = new THREE.Mesh(palluGeo, mainMat);
      pallu.position.set(-0.25, 0.05, 0.26);
      pallu.rotation.z = -0.25;
      this.torsoGroup.add(pallu);
    } else {
      // Kurta Hem for men & boys
      const flareGeo = new THREE.ConeGeometry(0.56, 0.6, 8);
      const flare = new THREE.Mesh(flareGeo, mainMat);
      flare.position.y = -0.52;
      flare.castShadow = true;
      this.torsoGroup.add(flare);

      // Waist Sash (Kamarbandh)
      const sash = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.1, 0.52), accentMat);
      sash.position.y = -0.28;
      this.torsoGroup.add(sash);
    }

    this.group.add(this.torsoGroup);

    // 2. Head Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.35, 0);

    const headGeo = new THREE.SphereGeometry(0.3, 10, 10);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    this.headGroup.add(head);

    // Hairstyle, Turban, or Floral Gajra
    if (this.role === 'mother' || this.role === 'child_girl' || this.role === 'decorator_woman') {
      // Elegant Indian Bun with Marigold / Jasmine Gajra Flowers
      const bunGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const bun = new THREE.Mesh(bunGeo, hairMat);
      bun.position.set(0, 0.05, -0.26);
      this.headGroup.add(bun);

      const gajraGeo = new THREE.TorusGeometry(0.21, 0.06, 6, 12);
      const gajraMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 });
      const gajra = new THREE.Mesh(gajraGeo, gajraMat);
      gajra.position.set(0, 0.05, -0.25);
      this.headGroup.add(gajra);

      // Forehead Bindi
      const bindiGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const bindiMat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
      const bindi = new THREE.Mesh(bindiGeo, bindiMat);
      bindi.position.set(0, 0.08, 0.3);
      this.headGroup.add(bindi);
    } else if (this.role === 'priest') {
      // Sacred Chandan Tilak on Forehead
      const tilakGeo = new THREE.BoxGeometry(0.06, 0.12, 0.02);
      const tilakMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const tilak = new THREE.Mesh(tilakGeo, tilakMat);
      tilak.position.set(0, 0.12, 0.3);
      this.headGroup.add(tilak);

      // Shaved crown with small shikha tuft
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.31, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
      hair.position.y = 0.02;
      this.headGroup.add(hair);
    } else {
      // Festive Safaa / Pagri (Turban)
      const turban = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.15, 8, 14), turbanMat);
      turban.rotation.x = Math.PI / 2;
      turban.position.y = 0.12;
      turban.castShadow = true;
      this.headGroup.add(turban);

      const turbanCrown = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), turbanMat);
      turbanCrown.position.y = 0.22;
      this.headGroup.add(turbanCrown);
    }

    this.group.add(this.headGroup);

    // 3. Articulated Arms
    const armGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.8, 8);
    armGeo.translate(0, -0.38, 0);

    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.52, 1.95, 0);
    this.leftArm = new THREE.Mesh(armGeo, mainMat);
    this.leftArm.castShadow = true;
    this.leftArmGroup.add(this.leftArm);
    this.group.add(this.leftArmGroup);

    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.52, 1.95, 0);
    this.rightArm = new THREE.Mesh(armGeo, mainMat);
    this.rightArm.castShadow = true;
    this.rightArmGroup.add(this.rightArm);
    this.group.add(this.rightArmGroup);

    // 4. Articulated Legs
    const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.9, 8);
    legGeo.translate(0, -0.42, 0);

    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.22, 0.95, 0);
    this.leftLeg = new THREE.Mesh(legGeo, bottomMat);
    this.leftLeg.castShadow = true;
    this.leftLegGroup.add(this.leftLeg);
    this.group.add(this.leftLegGroup);

    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.22, 0.95, 0);
    this.rightLeg = new THREE.Mesh(legGeo, bottomMat);
    this.rightLeg.castShadow = true;
    this.rightLegGroup.add(this.rightLeg);
    this.group.add(this.rightLegGroup);

    // 5. Handheld Props
    this.attachProp(this.propType);

    // 6. Overhead Name Tag Sprite
    this.nameSprite = this.createNameSprite(this.name, this.role);
    this.nameSprite.position.set(0, 3.1, 0);
    this.group.add(this.nameSprite);
  }

  attachProp(type) {
    if (this.currentPropMesh) {
      if (this.currentPropMesh.parent) this.currentPropMesh.parent.remove(this.currentPropMesh);
      this.currentPropMesh = null;
    }

    if (type === 'sparkler') {
      const sparkGroup = new THREE.Group();
      sparkGroup.position.set(0, -0.8, 0.22);
      sparkGroup.rotation.x = Math.PI / 4;

      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8 })
      );
      sparkGroup.add(stick);

      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      tip.position.y = 0.28;
      sparkGroup.add(tip);

      this.rightArmGroup.add(sparkGroup);
      this.currentPropMesh = sparkGroup;
    } else if (type === 'aarti_lamp') {
      // Ceremonial Brass Aarti Diya Thali
      const lampGroup = new THREE.Group();
      lampGroup.position.set(0, -0.75, 0.3);

      const thali = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.2, 0.06, 12),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
      );
      lampGroup.add(thali);

      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xfff0c2 })
      );
      flame.scale.set(0.6, 1.8, 0.6);
      flame.position.y = 0.12;
      lampGroup.add(flame);
      this.aartiFlame = flame;

      // Dynamic golden Aarti flame light illuminating surroundings
      const aartiLight = new THREE.PointLight(0xffa500, 2.2, 8, 1.2);
      aartiLight.position.set(0, 0.22, 0);
      aartiLight.castShadow = false;
      lampGroup.add(aartiLight);
      this.aartiLight = aartiLight;

      this.rightArmGroup.add(lampGroup);
      this.currentPropMesh = lampGroup;
    } else if (type === 'flower_basket') {
      // Marigold Flower Basket
      const basketGroup = new THREE.Group();
      basketGroup.position.set(0, -0.75, 0.2);

      const basket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.16, 0.22, 10),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 })
      );
      basketGroup.add(basket);

      const flowers = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.9 })
      );
      flowers.position.y = 0.08;
      basketGroup.add(flowers);

      this.leftArmGroup.add(basketGroup);
      this.currentPropMesh = basketGroup;
    } else if (type === 'sweets_bag') {
      // Traditional Gold/Red Mithai Box/Bag
      const bagGroup = new THREE.Group();
      bagGroup.position.set(0, -0.75, 0.15);

      const bag = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.25, 0.14),
        new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.5 })
      );
      bagGroup.add(bag);

      this.rightArmGroup.add(bagGroup);
      this.currentPropMesh = bagGroup;
    }
  }

  createNameSprite(name, role) {
    if (typeof document === 'undefined') {
      const mat = new THREE.SpriteMaterial({ color: 0xfef08a, transparent: true });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(3.0, 0.8, 1);
      return sprite;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Translucent dark capsule
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.roundRect(12, 10, 232, 44, 22);
    ctx.fill();

    // Gold border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.roundRect(12, 10, 232, 44, 22);
    ctx.stroke();

    // Name & Role label
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 128, 32);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.2, 0.8, 1);
    return sprite;
  }

  showDialogue(text, duration = 4.0) {
    this.dialogueText = text;
    this.dialogueTimer = duration;

    // Trigger overhead visual prompt via DOM if game container present
    if (typeof window !== 'undefined' && window.diwaliEngine3D) {
      window.diwaliEngine3D.triggerNpcSpeech(this, text, duration);
    }
  }

  // -------------------------------------------------------------
  // UPDATE LOOP: MOVEMENT, ANIMATION & BEHAVIOR
  // -------------------------------------------------------------
  update(delta, nav, fireworks3D, player3D) {
    this.stateTimer += delta;
    this.animTime += delta;

    if (this.dialogueTimer > 0) {
      this.dialogueTimer -= delta;
      if (this.dialogueTimer <= 0) {
        this.dialogueText = '';
      }
    }

    // 1. Execute Current Behavior State Logic
    switch (this.state) {
      case NPCState.IDLE:
        this.updateStateIdle(delta, nav);
        break;
      case NPCState.WALKING:
        this.updateStateWalking(delta, nav, this.walkSpeed);
        break;
      case NPCState.RUNNING:
        this.updateStateWalking(delta, nav, this.runSpeed);
        break;
      case NPCState.TALKING:
        this.updateStateTalking(delta);
        break;
      case NPCState.PRAYING:
        this.updateStatePraying(delta);
        break;
      case NPCState.AARTI:
        this.updateStateAarti(delta);
        break;
      case NPCState.LIGHTING_DIYA:
        this.updateStateLightingDiya(delta, fireworks3D);
        break;
      case NPCState.USING_VIRTUAL_FIREWORKS:
        this.updateStateFireworks(delta, fireworks3D);
        break;
      case NPCState.WATCHING_FIREWORKS:
        this.updateStateWatchingFireworks(delta);
        break;
      case NPCState.SHOPPING:
        this.updateStateShopping(delta);
        break;
      case NPCState.DECORATING:
        this.updateStateDecorating(delta);
        break;
      default:
        this.updateStateIdle(delta, nav);
        break;
    }

    // 2. Smooth Heading Rotation Interpolation
    let rotDiff = (this.targetRotation - this.rotation) % (Math.PI * 2);
    if (isNaN(rotDiff)) rotDiff = 0;
    while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
    while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
    this.rotation += rotDiff * 0.16;

    // Smoothly adapt vertical elevation to terrain/temple stairs and plinth
    if (nav && nav.world3D && typeof nav.world3D.getElevation === 'function') {
      const targetY = nav.world3D.getElevation(this.x, this.z);
      this.y += (targetY - this.y) * Math.min(1.0, 10.0 * delta);
    }

    this.group.position.set(this.x, this.y, this.z);
    this.group.rotation.y = this.rotation;

    // 3. Update Procedural Joint Skeletal Animations
    this.updateProceduralAnimations(delta);
  }

  // -------------------------------------------------------------
  // STATE LOGIC HANDLERS
  // -------------------------------------------------------------
  updateStateIdle(delta, nav) {
    this.isMoving = false;
    if (this.stateTimer >= this.stateDuration) {
      this.stateTimer = 0;
      this.selectNextAutonomousActivity(nav);
    }
  }

  updateStateWalking(delta, nav, moveSpeed) {
    if (!this.path || this.path.length === 0 || this.currentPathIndex >= this.path.length) {
      this.isMoving = false;
      this.state = NPCState.IDLE;
      this.stateTimer = 0;
      this.stateDuration = 2.0 + Math.random() * 3.0;
      return;
    }

    this.isMoving = true;
    const targetWp = this.path[this.currentPathIndex];
    const steer = nav.steerTowards(this.x, this.z, targetWp.x, targetWp.z, moveSpeed, delta);

    this.x = steer.x;
    this.z = steer.z;
    this.targetRotation = steer.angle;
    this.walkCycle += (moveSpeed > 3.0 ? 12 : 7.5) * delta;

    if (steer.reached) {
      this.currentPathIndex++;
      if (this.currentPathIndex >= this.path.length) {
        this.isMoving = false;
        this.onDestinationReached();
      }
    }
  }

  updateStateTalking(delta) {
    this.isMoving = false;
    if (this.stateTimer >= this.stateDuration) {
      this.state = NPCState.IDLE;
      this.stateTimer = 0;
      this.stateDuration = 3.0;
    }
  }

  updateStatePraying(delta) {
    this.isMoving = false;
    if (this.stateTimer >= this.stateDuration) {
      this.state = NPCState.IDLE;
      this.stateTimer = 0;
      this.stateDuration = 4.0;
    }
  }

  updateStateAarti(delta) {
    this.isMoving = false;
  }

  updateStateLightingDiya(delta, fireworks3D) {
    this.isMoving = false;
    if (this.stateTimer > 2.5 && !this.actionExecuted) {
      this.actionExecuted = true;
      if (fireworks3D && typeof fireworks3D.placeDiya === 'function') {
        const x2d = this.x / 0.1 + 890;
        const y2d = this.z / 0.1 + 610;
        fireworks3D.placeDiya(x2d, y2d);
      }
    }
    if (this.stateTimer >= 4.0) {
      this.state = NPCState.IDLE;
      this.stateTimer = 0;
      this.actionExecuted = false;
    }
  }

  updateStateFireworks(delta, fireworks3D) {
    this.isMoving = false;
    if (this.stateTimer > 2.0 && !this.actionExecuted) {
      this.actionExecuted = true;
      if (fireworks3D) {
        const x2d = this.x / 0.1 + 890;
        const y2d = this.z / 0.1 + 610;
        // Trigger Virtual Anar or Sky Rocket with isLocal = false (NEVER hijack local player camera!)
        if (Math.random() > 0.4) {
          if (typeof fireworks3D.launchRocket === 'function') {
            fireworks3D.launchRocket(x2d, y2d, null, null, false);
          }
        } else {
          if (typeof fireworks3D.placeAnar === 'function') {
            fireworks3D.placeAnar(x2d, y2d, false);
          } else if (typeof fireworks3D.launchAnarFountain === 'function') {
            fireworks3D.launchAnarFountain(x2d, y2d, null, false);
          }
        }
      }
    }
    if (this.stateTimer >= 5.0) {
      this.state = NPCState.WATCHING_FIREWORKS;
      this.stateTimer = 0;
      this.stateDuration = 4.0;
      this.actionExecuted = false;
    }
  }

  updateStateWatchingFireworks(delta) {
    this.isMoving = false;
    if (this.stateTimer >= this.stateDuration) {
      this.state = NPCState.IDLE;
      this.stateTimer = 0;
      this.stateDuration = 3.0;
    }
  }

  updateStateShopping(delta) {
    this.isMoving = false;
    if (this.stateTimer >= this.stateDuration) {
      this.attachProp('sweets_bag');
      this.showDialogue('Mithai & diyas bought! Heading home.', 3.5);
      this.state = NPCState.RETURNING_HOME;
      this.stateTimer = 0;
    }
  }

  updateStateDecorating(delta) {
    this.isMoving = false;
    if (this.stateTimer >= this.stateDuration) {
      this.state = NPCState.IDLE;
      this.stateTimer = 0;
      this.stateDuration = 3.0;
    }
  }

  onDestinationReached() {
    switch (this.destinationType) {
      case 'temple_altar':
        this.state = NPCState.PRAYING;
        this.stateTimer = 0;
        this.stateDuration = 8.0;
        break;
      case 'bazaar_front':
        this.state = NPCState.SHOPPING;
        this.stateTimer = 0;
        this.stateDuration = 6.0;
        break;
      case 'fw_pad':
        this.state = NPCState.USING_VIRTUAL_FIREWORKS;
        this.stateTimer = 0;
        this.actionExecuted = false;
        break;
      case 'home':
        this.state = NPCState.IDLE;
        this.stateTimer = 0;
        this.stateDuration = 6.0;
        break;
      default:
        this.state = NPCState.IDLE;
        this.stateTimer = 0;
        this.stateDuration = 4.0;
        break;
    }
  }

  // -------------------------------------------------------------
  // AUTONOMOUS WAYPOINT ROUTING
  // -------------------------------------------------------------
  navigateTo(destWpId, nav, destType = 'generic', forceRun = false) {
    const curWp = nav.findNearestWaypoint(this.x, this.z);
    this.path = nav.findPath(curWp, destWpId);
    this.currentPathIndex = 0;
    this.destinationType = destType;
    this.state = forceRun ? NPCState.RUNNING : NPCState.WALKING;
    this.stateTimer = 0;
  }

  selectNextAutonomousActivity(nav) {
    if (this.role === 'priest' || this.role === 'shopkeeper') {
      return; // Priests and shopkeepers stay at their holy sanctum & counter
    }

    const rand = Math.random();
    if (this.role === 'child_boy' || this.role === 'child_girl') {
      // Children run to celebration pads, bazaar, or home
      if (rand < 0.4) {
        this.navigateTo('fw_court_sharma', nav, 'fw_pad', true);
      } else if (rand < 0.7) {
        this.navigateTo('bazaar_front', nav, 'bazaar_front', true);
      } else {
        this.navigateTo(this.homeWp, nav, 'home', false);
      }
    } else if (this.role === 'decorator_woman') {
      if (rand < 0.5) {
        this.navigateTo('temple_diya_s', nav, 'temple_altar', false);
      } else {
        this.navigateTo('prom_mid', nav, 'prom_mid', false);
      }
    } else {
      // Adults: visit bazaar, temple, or stay home
      if (rand < 0.35) {
        this.navigateTo('temple_devotees', nav, 'temple_altar', false);
      } else if (rand < 0.65) {
        this.navigateTo('bazaar_front', nav, 'bazaar_front', false);
      } else {
        this.navigateTo(this.homeWp, nav, 'home', false);
      }
    }
  }

  // -------------------------------------------------------------
  // PROCEDURAL JOINT ANIMATION UPDATE
  // -------------------------------------------------------------
  updateProceduralAnimations(delta) {
    const t = this.animTime;

    if (this.isMoving) {
      // Walking / Running Cycle
      const isRunning = this.state === NPCState.RUNNING;
      const swing = Math.sin(this.walkCycle) * (isRunning ? 0.8 : 0.55);

      this.leftLegGroup.rotation.x = swing;
      this.rightLegGroup.rotation.x = -swing;
      this.leftArmGroup.rotation.x = -swing * 0.75;
      this.rightArmGroup.rotation.x = swing * 0.75;

      // Vertical bobbing
      this.torsoGroup.position.y = 1.6 + Math.abs(Math.sin(this.walkCycle * 2)) * (isRunning ? 0.1 : 0.06);
      this.headGroup.rotation.x = isRunning ? 0.12 : 0;
      this.headGroup.rotation.y = Math.sin(t * 1.5) * 0.08;
    } else {
      // Idle / Special Actions
      this.leftLegGroup.rotation.x *= 0.82;
      this.rightLegGroup.rotation.x *= 0.82;
      this.torsoGroup.position.y = 1.6 + Math.sin(t * 2) * 0.02; // Gentle breathing

      if (this.state === NPCState.PRAYING) {
        // Sacred Namaste / Anjali Mudra: Hands folded together at chest
        this.leftArmGroup.rotation.x = -0.7;
        this.leftArmGroup.rotation.z = 0.5;
        this.rightArmGroup.rotation.x = -0.7;
        this.rightArmGroup.rotation.z = -0.5;
        this.headGroup.rotation.x = 0.18 + Math.sin(t * 1.5) * 0.04; // Respectful head bow
      } else if (this.state === NPCState.AARTI) {
        // Sacred Aarti circular motion with brass lamp
        const aartiCycle = t * 2.8;
        this.rightArmGroup.rotation.x = -0.65 + Math.sin(aartiCycle) * 0.22;
        this.rightArmGroup.rotation.y = Math.cos(aartiCycle) * 0.28;
        this.leftArmGroup.rotation.x = -0.55 + Math.sin(aartiCycle) * 0.12;
        this.leftArmGroup.rotation.z = 0.25;
        this.headGroup.rotation.x = 0.12 + Math.sin(t * 1.5) * 0.04;

        // Dynamic Aarti flame & light flicker
        if (this.aartiLight) {
          this.aartiLight.intensity = 2.0 + Math.random() * 0.9;
        }
        if (this.aartiFlame) {
          this.aartiFlame.scale.set(0.6 + Math.random() * 0.15, 1.8 + Math.random() * 0.35, 0.6 + Math.random() * 0.15);
        }
      } else if (this.state === NPCState.LIGHTING_DIYA || this.state === NPCState.USING_VIRTUAL_FIREWORKS) {
        // Bending down to ignite diya / virtual firework
        this.torsoGroup.position.y = 1.15;
        this.torsoGroup.rotation.x = 0.45;
        this.rightArmGroup.rotation.x = -0.9;
        this.headGroup.rotation.x = 0.35;
      } else if (this.state === NPCState.WATCHING_FIREWORKS) {
        // Looking up at sky in awe, arms raised celebrating
        this.headGroup.rotation.x = -0.55;
        this.rightArmGroup.rotation.x = -1.2 + Math.sin(t * 4) * 0.25;
        this.leftArmGroup.rotation.x = -1.2 + Math.cos(t * 4) * 0.25;
      } else if (this.state === NPCState.TALKING) {
        // Expressive conversational gestures
        this.rightArmGroup.rotation.x = -0.4 + Math.sin(t * 3.5) * 0.25;
        this.leftArmGroup.rotation.x = Math.sin(t * 2.0) * 0.15;
        this.headGroup.rotation.y = Math.sin(t * 2.5) * 0.2;
      } else {
        // Natural Idle
        this.leftArmGroup.rotation.x = Math.sin(t * 1.5) * 0.08;
        this.leftArmGroup.rotation.z = 0;
        this.rightArmGroup.rotation.x = Math.cos(t * 1.4) * 0.08;
        this.rightArmGroup.rotation.z = 0;
        this.headGroup.rotation.x = 0;
        this.headGroup.rotation.y = Math.sin(t * 0.8) * 0.15;
      }
    }

    // Sparkler tip glow pulse
    if (this.sparklerLight) {
      this.sparklerLight.intensity = 1.4 + Math.random() * 0.8;
    }
  }

  // Reaction to environmental fireworks
  onFireworksBurstNearby(x, y, z) {
    const dist = Math.hypot(this.x - x, this.z - z);
    if (dist < 40.0) {
      if (this.state !== NPCState.AARTI && this.state !== NPCState.USING_VIRTUAL_FIREWORKS) {
        this.state = NPCState.WATCHING_FIREWORKS;
        this.stateTimer = 0;
        this.stateDuration = 4.5 + Math.random() * 2.0;
        if (Math.random() < 0.35) {
          const cheers = ['✨ Shubh Deepawali!', '🎆 Waah! Happy Diwali!', '✨ Har Har Mahadev!', '🌟 What a brilliant burst!'];
          this.showDialogue(cheers[Math.floor(Math.random() * cheers.length)], 3.5);
        }
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.DiwaliNPC3D = DiwaliNPC3D;
  window.NPCState = NPCState;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiwaliNPC3D, NPCState };
}
