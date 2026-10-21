// ===================================================================
// DIWALI 3D WORLD - AUTHENTIC INDIAN COLONY ARCHITECTURE & ENVIRONMENT
// Procedural Three.js 3D models for Rajasthani Havelis, Mandir, Bazaar,
// street lighting, rangolis, courtyards, trees, and festive decorations.
// ===================================================================

class DiwaliWorld3D {
  constructor(scene) {
    this.scene = scene;
    this.colliders = []; // Bounding boxes for collision: { minX, maxX, minZ, maxZ }
    this.interactiveTargets = []; // { id, name, type, x, z, radius, prompt, data }
    this.pointLights = [];
    this.houseMeshes = new Map();
    this.fairyLightStrings = [];
    this.flickeringDiyas = [];
    this.floatingSkyLanterns = [];

    // World spatial bounds (mapped from 2D coordinates)
    // 2D: X: 0..1780, Y: 0..1220 => 3D: X: -89..+89, Z: -61..+61
    this.scale = 0.1;
    this.centerX = 890;
    this.centerZ = 610;

    // Materials Library
    this.materials = this.createMaterialLibrary();
  }

  to3D(x, y, elevation = 0) {
    return {
      x: (x - this.centerX) * this.scale,
      y: elevation,
      z: (y - this.centerZ) * this.scale
    };
  }

  to2D(x, z) {
    return {
      x: x / this.scale + this.centerX,
      y: z / this.scale + this.centerZ
    };
  }

  createMaterialLibrary() {
    return {
      // Ground & Roads (Warm visible festive cobblestone, flagstone & lush grass)
      groundGrass: new THREE.MeshStandardMaterial({ color: 0x1e3a29, roughness: 0.85, metalness: 0.05 }),
      courtyardCobble: new THREE.MeshStandardMaterial({ color: 0x52465c, roughness: 0.7, metalness: 0.1 }),
      roadStone: new THREE.MeshStandardMaterial({ color: 0x3c3447, roughness: 0.75, metalness: 0.08 }),
      curbStone: new THREE.MeshStandardMaterial({ color: 0x8c735d, roughness: 0.65 }),
      perimeterWall: new THREE.MeshStandardMaterial({ color: 0x6a4b3d, roughness: 0.75 }),

      // Haveli Walls & Accents
      sandstoneWall: new THREE.MeshStandardMaterial({ color: 0xe2ad74, roughness: 0.65 }),
      terracottaWall: new THREE.MeshStandardMaterial({ color: 0xb85d43, roughness: 0.7 }),
      creamWall: new THREE.MeshStandardMaterial({ color: 0xfbf3dc, roughness: 0.6 }),
      roseWall: new THREE.MeshStandardMaterial({ color: 0xd48b8b, roughness: 0.65 }),
      royalBlueWall: new THREE.MeshStandardMaterial({ color: 0x2b4c7e, roughness: 0.65 }),
      goldTrim: new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3, metalness: 0.75 }),
      darkWood: new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.8 }),
      ornateRoof: new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.55 }),
      roofTile: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }),

      // Windows with radiant warm golden interior glow
      windowGlow: new THREE.MeshStandardMaterial({
        color: 0xfffbeb,
        emissive: 0xf59e0b,
        emissiveIntensity: 2.2,
        roughness: 0.2
      }),

      // Temple Materials
      templeMarble: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 }),
      templeRedSandstone: new THREE.MeshStandardMaterial({ color: 0xd94436, roughness: 0.6 }),
      templeGoldKalash: new THREE.MeshStandardMaterial({
        color: 0xfde047,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.2,
        metalness: 0.9,
        roughness: 0.15
      }),
      saffronFlag: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5, side: THREE.DoubleSide }),

      // Bazaar Canopies
      canopyOrange: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.75, side: THREE.DoubleSide }),
      canopyGreen: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.75, side: THREE.DoubleSide }),
      canopyRed: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.75, side: THREE.DoubleSide }),
      canopyGold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.75, side: THREE.DoubleSide }),

      // Foliage & Nature
      treeTrunk: new THREE.MeshStandardMaterial({ color: 0x4a2c17, roughness: 0.85 }),
      treeLeaves1: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.7 }),
      treeLeaves2: new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.7 }),
      marigoldOrange: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5, emissive: 0xea580c, emissiveIntensity: 0.4 }),
      marigoldYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5, emissive: 0xd97706, emissiveIntensity: 0.4 }),

      // Street Lanterns & Diyas
      lampBrass: new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.85, roughness: 0.25 }),
      lampGlow: new THREE.MeshStandardMaterial({
        color: 0xfffbeb,
        emissive: 0xf59e0b,
        emissiveIntensity: 2.0,
        roughness: 0.15
      }),
      clayDiya: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 }),
      diyaFlame: new THREE.MeshBasicMaterial({ color: 0xffffff }),

      // Indian Festive Bazaar Materials
      brassPolished: new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.22, metalness: 0.88 }),
      silverPlatter: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85 }),
      teakWood: new THREE.MeshStandardMaterial({ color: 0x5c2c16, roughness: 0.65 }),
      carvedFascia: new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 }),
      fabricCrimsonDrape: new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.85, side: THREE.DoubleSide }),
      fabricSaffronDrape: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.85, side: THREE.DoubleSide }),
      fabricEmeraldDrape: new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.85, side: THREE.DoubleSide }),
      fabricCreamDrape: new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8, side: THREE.DoubleSide }),
      goldBrocadeTrim: new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3, metalness: 0.8 }),
      mithaiLadoo: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.65 }),
      mithaiKaju: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.75 }),
      mithaiJalebi: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.1 }),
      gulalPink: new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.95 }),
      gulalCyan: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.95 }),
      gulalYellow: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.95 }),
      gulalGreen: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.95 }),
      crackerFoilRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.35 }),
      crackerFoilBlue: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35, metalness: 0.35 }),
      crackerFoilGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.35, metalness: 0.35 }),
      carpetBazaarRunner: new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.9 }),
      promenadeFlagstone: new THREE.MeshStandardMaterial({ color: 0x473b52, roughness: 0.65, metalness: 0.1 }),
      skyLanternPaper: new THREE.MeshStandardMaterial({
        color: 0xffa040,
        emissive: 0xff6600,
        emissiveIntensity: 1.6,
        roughness: 0.35,
        side: THREE.DoubleSide
      }),
      bambooRibs: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }),
      lampGlass: new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        emissive: 0xf59e0b,
        emissiveIntensity: 2.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.92
      })
    };
  }

  buildColony(worldData) {
    const root = new THREE.Group();
    root.name = 'DiwaliColonyWorld';

    // 1. Terrain, Roads & Courtyard
    root.add(this.buildTerrainAndRoads());

    // 2. Perimeter Boundary Walls & Entrance Pillars
    root.add(this.buildPerimeterEnclosure());

    // 3. Central Chowk Piazza & Rangoli Altar
    root.add(this.buildCentralChowk());

    // 4. Six Indian Residential Havelis
    worldData.houses.forEach(houseData => {
      const houseGroup = this.buildHaveli(houseData);
      root.add(houseGroup);
      this.houseMeshes.set(houseData.id, houseGroup);
    });

    // 5. Shree Shiv-Lakshmi Mandir (Grand Hindu Temple)
    root.add(this.buildTemple(worldData.temple));

    // 6. Festive Bazaar Stalls & Artisan Studio
    worldData.stalls.forEach(stallData => {
      root.add(this.buildBazaarStall(stallData));
    });

    // 7. Trees & Potted Greenery
    root.add(this.buildFoliage());

    // 8. Heritage Street Lamps & Festive Garlands
    root.add(this.buildStreetLamps());

    // 9. Floating Paper Sky Lanterns (Kandils)
    root.add(this.buildSuspendedLanterns());

    this.scene.add(root);
    return root;
  }

  // -------------------------------------------------------------
  // 1. TERRAIN, ROADS & COURTYARD PAVING
  // -------------------------------------------------------------
  buildTerrainAndRoads() {
    const group = new THREE.Group();
    group.name = 'TerrainAndRoads';

    // Main Ground Plane (Grassy Mohalla Outskirts)
    const groundGeo = new THREE.PlaneGeometry(220, 160);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMesh = new THREE.Mesh(groundGeo, this.materials.groundGrass);
    groundMesh.receiveShadow = true;
    group.add(groundMesh);

    // East-West Main Arterial Roads (Paved Stone)
    // North Road (y = 440) & South Road (y = 740)
    const roadMat = this.materials.roadStone;

    const northRoadGeo = new THREE.PlaneGeometry(180, 14);
    northRoadGeo.rotateX(-Math.PI / 2);
    const northRoad = new THREE.Mesh(northRoadGeo, roadMat);
    northRoad.position.set(0, 0.02, (440 - this.centerZ) * this.scale);
    northRoad.receiveShadow = true;
    group.add(northRoad);

    const southRoadGeo = new THREE.PlaneGeometry(180, 14);
    southRoadGeo.rotateX(-Math.PI / 2);
    const southRoad = new THREE.Mesh(southRoadGeo, roadMat);
    southRoad.position.set(0, 0.02, (740 - this.centerZ) * this.scale);
    southRoad.receiveShadow = true;
    group.add(southRoad);

    // North-South Central Spine Road (x = 650)
    const spineRoadGeo = new THREE.PlaneGeometry(12, 122);
    spineRoadGeo.rotateX(-Math.PI / 2);
    const spineRoad = new THREE.Mesh(spineRoadGeo, roadMat);
    spineRoad.position.set((650 - this.centerX) * this.scale, 0.025, 0);
    spineRoad.receiveShadow = true;
    group.add(spineRoad);

    // East Grand Festive Celebration Promenade (Wide Walkable Festive Avenue)
    const grandPromenadeGeo = new THREE.PlaneGeometry(28, 86);
    grandPromenadeGeo.rotateX(-Math.PI / 2);
    const grandPromenade = new THREE.Mesh(grandPromenadeGeo, this.materials.promenadeFlagstone);
    grandPromenade.position.set(48.0, 0.03, -5.0);
    grandPromenade.receiveShadow = true;
    group.add(grandPromenade);

    // Decorative Floral Rangoli in Center of Grand Promenade
    const centerRangoli = this.createRangoliMesh(50.5, 0.04, 5.0, 4.2, 'temple');
    group.add(centerRangoli);

    const southRangoli = this.createRangoliMesh(50.5, 0.04, 22.0, 3.2, 'gold');
    group.add(southRangoli);

    // Flagstone Curbs (Elevated stone edging along roads & promenade)
    const curbMat = this.materials.curbStone;
    const addCurb = (x, z, w, d) => {
      const curbGeo = new THREE.BoxGeometry(w, 0.15, d);
      const curb = new THREE.Mesh(curbGeo, curbMat);
      curb.position.set(x, 0.075, z);
      curb.receiveShadow = true;
      group.add(curb);
    };

    // North & South Road curbs
    addCurb(0, (440 - 70 - this.centerZ) * this.scale, 180, 0.4);
    addCurb(0, (440 + 70 - this.centerZ) * this.scale, 180, 0.4);
    addCurb(0, (740 - 70 - this.centerZ) * this.scale, 180, 0.4);
    addCurb(0, (740 + 70 - this.centerZ) * this.scale, 180, 0.4);

    // Grand Promenade Curbs with Continuous Rows of Terracotta Diyas
    addCurb(39.0, -5.0, 0.5, 86);
    addCurb(60.0, -5.0, 0.5, 86);

    // Rows of glowing clay diyas lining the promenade sidewalks
    for (let dz = -40; dz <= 30; dz += 3.5) {
      const dLeft = this.createDiyaMesh(39.0, 0.16, dz, false);
      const dRight = this.createDiyaMesh(60.0, 0.16, dz, false);
      group.add(dLeft);
      group.add(dRight);
    }

    return group;
  }

  // -------------------------------------------------------------
  // 2. PERIMETER BOUNDARY ENCLOSURE
  // -------------------------------------------------------------
  buildPerimeterEnclosure() {
    const group = new THREE.Group();
    group.name = 'PerimeterBoundary';

    const w = 178 * this.scale * 10; // 178 units
    const d = 122 * this.scale * 10; // 122 units
    const wallH = 2.4;
    const wallThick = 0.8;
    const wallMat = this.materials.perimeterWall;

    const addWallSection = (x, z, width, depth) => {
      const geo = new THREE.BoxGeometry(width, wallH, depth);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(x, wallH / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Register collision box
      this.colliders.push({
        minX: x - width / 2,
        maxX: x + width / 2,
        minZ: z - depth / 2,
        maxZ: z + depth / 2
      });
    };

    const halfW = w / 2;
    const halfD = d / 2;

    // North, South, West, East perimeter walls
    addWallSection(0, -halfD, w + wallThick, wallThick);
    addWallSection(0, halfD, w + wallThick, wallThick);
    addWallSection(-halfW, 0, wallThick, d + wallThick);
    addWallSection(halfW, 0, wallThick, d + wallThick);

    // Ornate Gate Pillars with glowing festive lamps at corners and entrances
    const pillarGeo = new THREE.BoxGeometry(1.4, 3.4, 1.4);
    const pillarMat = this.materials.sandstoneWall;
    const capitalGeo = new THREE.ConeGeometry(1.0, 0.8, 4);
    capitalGeo.rotateY(Math.PI / 4);

    const corners = [
      [-halfW, -halfD], [halfW, -halfD],
      [-halfW, halfD], [halfW, halfD],
      [-halfW, 0], [halfW, 0],
      [0, -halfD], [0, halfD]
    ];

    corners.forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, 1.7, pz);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      group.add(pillar);

      const cap = new THREE.Mesh(capitalGeo, this.materials.goldTrim);
      cap.position.set(px, 3.8, pz);
      group.add(cap);

      // Ornate Diya / Lantern on top of pillar (emissive glow)
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.2, 0.5, 8), this.materials.lampGlow);
      lamp.position.set(px, 4.3, pz);
      group.add(lamp);
    });

    return group;
  }

  createRangoliMesh(x, y, z, radius = 4.0, style = 'temple') {
    let canvas = null;
    if (typeof document !== 'undefined') {
      canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const cx = 256;
      const cy = 256;

      ctx.clearRect(0, 0, 512, 512);

      const colors = style === 'gold' 
        ? ['#f59e0b', '#fbbf24', '#d97706', '#fef08a']
        : ['#e11d48', '#f59e0b', '#10b981', '#fbbf24', '#3b82f6'];

      for (let r = 240, idx = 0; r > 30; r -= 26, idx++) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = colors[idx % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      const petalCount = 12;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(110, 0, 50, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#f43f5e' : '#fbbf24';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ॐ', cx, cy + 2);
    }

    const rangoliGeo = new THREE.PlaneGeometry(radius * 2, radius * 2);
    rangoliGeo.rotateX(-Math.PI / 2);

    let rangoliMat;
    if (canvas) {
      const tex = new THREE.CanvasTexture(canvas);
      rangoliMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.95
      });
    } else {
      rangoliMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    }

    const mesh = new THREE.Mesh(rangoliGeo, rangoliMat);
    mesh.position.set(x, y, z);
    return mesh;
  }

  // -------------------------------------------------------------
  // 3. CENTRAL CHOWK PIAZZA & RANGOLI ALTAR
  // -------------------------------------------------------------
  buildCentralChowk() {
    const group = new THREE.Group();
    group.name = 'CentralChowk';

    const p3D = this.to3D(650, 580);

    // Circular Cobblestone Courtyard Plaza
    const plazaRadius = 14;
    const plazaGeo = new THREE.CylinderGeometry(plazaRadius, plazaRadius, 0.1, 32);
    const plaza = new THREE.Mesh(plazaGeo, this.materials.courtyardCobble);
    plaza.position.set(p3D.x, 0.05, p3D.z);
    plaza.receiveShadow = true;
    group.add(plaza);

    // Concentric Marble Mandala Ring
    const ringGeo = new THREE.RingGeometry(plazaRadius - 2.5, plazaRadius - 0.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, this.materials.templeMarble);
    ringMesh.position.set(p3D.x, 0.11, p3D.z);
    group.add(ringMesh);

    // Grand Rangoli Centerpiece (Multi-layered sacred floral geometry)
    const rangoliMesh = this.createRangoliMesh(p3D.x, 0.12, p3D.z, 8.0, 'temple');
    group.add(rangoliMesh);

    // Maha Deepotsav Celebration Switch Altar at Chowk Center
    const altarGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.8, 12);
    const altar = new THREE.Mesh(altarGeo, this.materials.goldTrim);
    altar.position.set(p3D.x, 0.45, p3D.z);
    altar.castShadow = true;
    group.add(altar);

    // Maha Deepam (Grand Ceremonial Brass Diya on Altar)
    const deepamBase = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.5, 12), this.materials.templeGoldKalash);
    deepamBase.position.set(p3D.x, 0.95, p3D.z);
    group.add(deepamBase);

    const deepamFlame = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), this.materials.lampGlow);
    deepamFlame.scale.set(0.7, 1.5, 0.7);
    deepamFlame.position.set(p3D.x, 1.45, p3D.z);
    group.add(deepamFlame);

    // Radiant Golden Light from Maha Deepam (No shadow cube for maximum performance)
    const altarLight = new THREE.PointLight(0xffaa22, 2.8, 22);
    altarLight.position.set(p3D.x, 2.0, p3D.z);
    altarLight.castShadow = false;
    group.add(altarLight);
    this.pointLights.push(altarLight);

    // Interactive Trigger for Central Chowk (Maha Deepotsav Altar)
    this.interactiveTargets.push({
      id: 'chowk_altar',
      name: 'Central Chowk Maha Deepotsav Altar',
      type: 'chowk_switch',
      x: 650,
      z: 580,
      radius: 45,
      prompt: 'Press [E] to Trigger Colony-Wide Maha Deepotsav'
    });

    // 8 Decorative Clay Diyas around the Rangoli periphery
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const dx = p3D.x + Math.cos(a) * 9.5;
      const dz = p3D.z + Math.sin(a) * 9.5;
      const diya = this.createDiyaMesh(dx, 0.12, dz, false);
      group.add(diya);
    }

    return group;
  }

  // -------------------------------------------------------------
  // 4. SIX DETAILED 3D INDIAN HAVELIS
  // -------------------------------------------------------------
  buildHaveli(houseData) {
    const group = new THREE.Group();
    group.name = `Haveli_${houseData.id}`;

    const pos = this.to3D(houseData.x + houseData.width / 2, houseData.y + houseData.height / 2);
    const w = houseData.width * this.scale;
    const d = houseData.height * this.scale;
    const h = 8.5; // Two-story tall Indian Haveli

    // Wall material based on house color configuration
    const wallColor = new THREE.Color(houseData.wallColor);
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.65,
      metalness: 0.08
    });

    // Base Plinth (Chabutra)
    const plinthH = 0.5;
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(w + 1.2, plinthH, d + 1.2),
      this.materials.sandstoneWall
    );
    plinth.position.set(pos.x, plinthH / 2, pos.z);
    plinth.receiveShadow = true;
    group.add(plinth);

    // Main Ground Floor Structure
    const groundFloorH = 4.2;
    const groundFloor = new THREE.Mesh(
      new THREE.BoxGeometry(w, groundFloorH, d),
      wallMat
    );
    groundFloor.position.set(pos.x, plinthH + groundFloorH / 2, pos.z);
    groundFloor.castShadow = true;
    groundFloor.receiveShadow = true;
    group.add(groundFloor);

    // First Floor (Slightly inset with terrace balconies)
    const upperFloorH = 3.6;
    const upperW = w * 0.92;
    const upperD = d * 0.88;
    const upperFloor = new THREE.Mesh(
      new THREE.BoxGeometry(upperW, upperFloorH, upperD),
      wallMat
    );
    upperFloor.position.set(pos.x, plinthH + groundFloorH + upperFloorH / 2, pos.z);
    upperFloor.castShadow = true;
    upperFloor.receiveShadow = true;
    group.add(upperFloor);

    // Cornice Trim (Chhajja / Cantilevered Eaves between floors)
    const chhajja = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.8, 0.25, d + 0.8),
      this.materials.ornateRoof
    );
    chhajja.position.set(pos.x, plinthH + groundFloorH, pos.z);
    chhajja.castShadow = true;
    group.add(chhajja);

    // Rooftop Parapet with Jali Cutouts
    const parapetH = 1.0;
    const parapet = new THREE.Mesh(
      new THREE.BoxGeometry(upperW + 0.3, parapetH, upperD + 0.3),
      this.materials.sandstoneWall
    );
    parapet.position.set(pos.x, plinthH + groundFloorH + upperFloorH + parapetH / 2, pos.z);
    group.add(parapet);

    // Rooftop Rajasthani Chhatri (Ornate Domed Pavilion)
    const chhatriGroup = this.buildChhatri(pos.x + upperW * 0.25, plinthH + groundFloorH + upperFloorH + parapetH, pos.z - upperD * 0.2);
    group.add(chhatriGroup);

    // Entrance Carved Wooden Door with Brass Accents
    const doorW = 2.2;
    const doorH = 3.0;
    const isNorthLane = houseData.y < 500;
    const doorZOffset = isNorthLane ? d / 2 + 0.05 : -d / 2 - 0.05;

    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(doorW + 0.4, doorH + 0.3, 0.3),
      this.materials.goldTrim
    );
    doorFrame.position.set(pos.x, plinthH + doorH / 2, pos.z + doorZOffset);
    group.add(doorFrame);

    const door = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, doorH, 0.15),
      this.materials.darkWood
    );
    door.position.set(pos.x, plinthH + doorH / 2, pos.z + doorZOffset);
    group.add(door);

    // Marigold Floral Toran above door
    const toranGeo = new THREE.TorusGeometry(doorW / 2, 0.14, 8, 16, Math.PI);
    toranGeo.rotateZ(Math.PI);
    const toran = new THREE.Mesh(toranGeo, this.materials.marigoldOrange);
    toran.position.set(pos.x, plinthH + doorH + 0.1, pos.z + doorZOffset + 0.12);
    group.add(toran);

    // Glowing Indian Jharokha Windows (Carved Balconies)
    const addJharokha = (wx, wy, wz, rotY = 0) => {
      const jharokha = new THREE.Group();
      jharokha.position.set(wx, wy, wz);
      jharokha.rotation.y = rotY;

      // Base bracket
      const bracket = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.6, 4), this.materials.sandstoneWall);
      bracket.rotation.x = Math.PI;
      bracket.position.y = -0.3;
      jharokha.add(bracket);

      // Balcony cage
      const cage = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.7), this.materials.sandstoneWall);
      jharokha.add(cage);

      // Glowing interior window screen
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.3), this.materials.windowGlow);
      screen.position.set(0, 0, 0.36);
      jharokha.add(screen);

      // Miniature arched canopy roof
      const dome = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.7, 4), this.materials.ornateRoof);
      dome.position.y = 1.25;
      jharokha.add(dome);

      group.add(jharokha);
    };

    // Add 2 Jharokha windows on facade
    addJharokha(pos.x - w * 0.28, plinthH + groundFloorH + 1.8, pos.z + doorZOffset, isNorthLane ? 0 : Math.PI);
    addJharokha(pos.x + w * 0.28, plinthH + groundFloorH + 1.8, pos.z + doorZOffset, isNorthLane ? 0 : Math.PI);

    // Porch Diyas (2 terracotta lamps guarding the entrance)
    const diya1 = this.createDiyaMesh(pos.x - 1.6, plinthH + 0.05, pos.z + doorZOffset + (isNorthLane ? 0.8 : -0.8));
    const diya2 = this.createDiyaMesh(pos.x + 1.6, plinthH + 0.05, pos.z + doorZOffset + (isNorthLane ? 0.8 : -0.8));
    group.add(diya1);
    group.add(diya2);

    // Fairy Light Strings running across the roof parapet
    const fairyLights = this.buildFairyLightString(pos.x, plinthH + groundFloorH + upperFloorH + parapetH, pos.z, upperW + 0.5, upperD + 0.5, houseData.lights.style);
    group.add(fairyLights);
    this.fairyLightStrings.push({
      houseId: houseData.id,
      group: fairyLights,
      style: houseData.lights.style,
      on: houseData.lights.on
    });

    // Hanging Akash Kandil Lantern at porch entrance
    const kandil = this.buildKandilLantern(pos.x - 1.2, plinthH + doorH + 0.6, pos.z + doorZOffset + (isNorthLane ? 0.6 : -0.6));
    group.add(kandil);

    // Register 3D Bounding Box Collider for this Haveli
    this.colliders.push({
      minX: pos.x - w / 2 - 0.4,
      maxX: pos.x + w / 2 + 0.4,
      minZ: pos.z - d / 2 - 0.4,
      maxZ: pos.z + d / 2 + 0.4
    });

    // Register Interactive Target for House Decorator Modal
    this.interactiveTargets.push({
      id: houseData.id,
      name: houseData.name,
      type: 'house',
      x: houseData.doorX,
      z: houseData.doorY,
      radius: 40,
      prompt: `Press [E] to Decorate ${houseData.name}`,
      data: houseData
    });

    return group;
  }

  // Rajasthani Chhatri (Rooftop domed pavilion)
  buildChhatri(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // 4 slender pillars
    const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.0, 8);
    const pillarMat = this.materials.sandstoneWall;
    const offsets = [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]];

    offsets.forEach(([px, pz]) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(px, 1.0, pz);
      group.add(p);
    });

    // Fluted Chhatri Dome
    const domeGeo = new THREE.ConeGeometry(1.4, 1.2, 8);
    const dome = new THREE.Mesh(domeGeo, this.materials.ornateRoof);
    dome.position.set(0, 2.6, 0);
    group.add(dome);

    // Golden Finial (Kalash)
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), this.materials.goldTrim);
    finial.position.set(0, 3.3, 0);
    group.add(finial);

    return group;
  }

  // -------------------------------------------------------------
  // 5. SHREE SHIV-LAKSHMI MANDIR (HINDU TEMPLE)
  // -------------------------------------------------------------
  buildTemple(templeData) {
    const group = new THREE.Group();
    group.name = 'ShreeMandir';

    // Position along the East side of Grand Celebration Avenue, facing West into the street
    const posX = 74.0;
    const posZ = 8.0;
    const w = 24.0; // Temple depth East-West
    const d = 28.0; // Temple width North-South

    // Elevated Marble Plinth (Jagati)
    const jagatiH = 1.6;
    const jagati = new THREE.Mesh(
      new THREE.BoxGeometry(w, jagatiH, d),
      this.materials.templeMarble
    );
    jagati.position.set(posX, jagatiH / 2, posZ);
    jagati.receiveShadow = true;
    group.add(jagati);

    // Grand Entrance Flight of Steps (Sopana) descending West towards the street
    const stepsCount = 7;
    const stepW = 12.0; // Width along Z
    const stepDepth = 0.85; // Depth along X
    const stepH = jagatiH / stepsCount;

    for (let i = 0; i < stepsCount; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(stepDepth, stepH * (stepsCount - i), stepW),
        this.materials.templeMarble
      );
      // Descend West (-X)
      step.position.set(posX - w / 2 - (i + 0.5) * stepDepth, (stepH * (stepsCount - i)) / 2, posZ);
      step.receiveShadow = true;
      group.add(step);
    }

    // Carved Stone Balustrades flanking steps with continuous glowing diyas
    [-stepW / 2 - 0.3, stepW / 2 + 0.3].forEach(bz => {
      const balustrade = new THREE.Mesh(
        new THREE.BoxGeometry(stepsCount * stepDepth + 0.8, 0.7, 0.45),
        this.materials.sandstoneWall
      );
      balustrade.position.set(posX - w / 2 - (stepsCount * stepDepth) / 2, jagatiH * 0.5 + 0.35, posZ + bz);
      balustrade.castShadow = true;
      group.add(balustrade);

      // Rows of glowing clay diyas along the balustrade rail
      for (let di = 0; di <= stepsCount; di++) {
        const dx = posX - w / 2 - di * stepDepth;
        const dy = jagatiH * 0.5 + 0.72;
        const diya = this.createDiyaMesh(dx, dy, posZ + bz, false);
        group.add(diya);
      }
    });

    // Outer Pillared Mandapa (Hall) facing the street
    const mandapaW = 9.5;  // Along X
    const mandapaD = 20.0; // Along Z
    const mandapaH = 5.8;
    const mandapaX = posX - w / 2 + mandapaW / 2 + 0.5;

    // Carved Ornate Marble Columns
    const colGeo = new THREE.CylinderGeometry(0.38, 0.48, mandapaH, 12);
    const colMat = this.materials.templeMarble;

    const colXPos = [mandapaX - mandapaW * 0.35, mandapaX, mandapaX + mandapaW * 0.35];
    const colZPos = [-mandapaD * 0.42, -mandapaD * 0.2, 0, mandapaD * 0.2, mandapaD * 0.42];

    colXPos.forEach(cx => {
      colZPos.forEach(cz => {
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(cx, jagatiH + mandapaH / 2, posZ + cz);
        col.castShadow = true;
        group.add(col);

        // Ornate Pillar Capital & Bracket
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.9), this.materials.goldTrim);
        cap.position.set(cx, jagatiH + mandapaH - 0.15, posZ + cz);
        group.add(cap);
      });
    });

    // Mandapa Tiered Pyramidal Roof
    const roofTiers = 3;
    for (let t = 0; t < roofTiers; t++) {
      const rw = (mandapaW + 2) * (1 - t * 0.18);
      const rd = (mandapaD + 2) * (1 - t * 0.18);
      const tierH = 0.8;
      const rTier = new THREE.Mesh(
        new THREE.BoxGeometry(rw, tierH, rd),
        t % 2 === 0 ? this.materials.templeRedSandstone : this.materials.templeMarble
      );
      rTier.position.set(mandapaX, jagatiH + mandapaH + t * tierH + tierH / 2, posZ);
      rTier.castShadow = true;
      group.add(rTier);
    }

    // Inner Sanctum (Garbhagriha) - Sacred Enclosure on East side
    const sanctumW = 12.0; // Along X
    const sanctumD = 16.0; // Along Z
    const sanctumH = 7.5;
    const sanctumX = posX + w / 2 - sanctumW / 2 - 0.5;

    const sanctum = new THREE.Mesh(
      new THREE.BoxGeometry(sanctumW, sanctumH, sanctumD),
      this.materials.templeRedSandstone
    );
    sanctum.position.set(sanctumX, jagatiH + sanctumH / 2, posZ);
    sanctum.castShadow = true;
    sanctum.receiveShadow = true;
    group.add(sanctum);

    // Towering Shikhara (Traditional North-Indian Curvilinear Spire)
    const shikharaTiers = 8;
    const baseShikharaY = jagatiH + sanctumH;
    for (let s = 0; s < shikharaTiers; s++) {
      const sw = sanctumW * Math.pow(1 - s / shikharaTiers, 0.6);
      const sd = sanctumD * Math.pow(1 - s / shikharaTiers, 0.6);
      const stierH = 1.6;
      const sMesh = new THREE.Mesh(
        new THREE.BoxGeometry(sw, stierH, sd),
        s % 2 === 0 ? this.materials.templeRedSandstone : this.materials.templeMarble
      );
      sMesh.position.set(sanctumX, baseShikharaY + s * stierH + stierH / 2, posZ);
      sMesh.castShadow = true;
      group.add(sMesh);
    }

    // Fluted Stone Amalaka Disc & Golden Kalash Finial at Peak
    const amalakaY = baseShikharaY + shikharaTiers * 1.6;
    const amalaka = new THREE.Mesh(
      new THREE.CylinderGeometry(2.0, 2.2, 0.9, 16),
      this.materials.templeMarble
    );
    amalaka.position.set(sanctumX, amalakaY + 0.45, posZ);
    group.add(amalaka);

    const kalash = new THREE.Mesh(
      new THREE.ConeGeometry(1.0, 2.4, 12),
      this.materials.templeGoldKalash
    );
    kalash.position.set(sanctumX, amalakaY + 2.1, posZ);
    group.add(kalash);

    // Fluttering Saffron Triangle Flag (Dhwaja) atop Kalash
    const flagGeo = new THREE.BufferGeometry();
    const flagVerts = new Float32Array([
      0, 0, 0,
      2.2, 0.5, 0,
      0, 1.2, 0
    ]);
    flagGeo.setAttribute('position', new THREE.BufferAttribute(flagVerts, 3));
    const flag = new THREE.Mesh(flagGeo, this.materials.saffronFlag);
    flag.position.set(sanctumX, amalakaY + 3.0, posZ);
    group.add(flag);

    // Hanging Brass Bells inside Mandapa
    const bellGeo = new THREE.ConeGeometry(0.35, 0.55, 12);
    bellGeo.rotateX(Math.PI);
    [-3, 0, 3].forEach(bz => {
      const bell = new THREE.Mesh(bellGeo, this.materials.brassPolished);
      bell.position.set(mandapaX, jagatiH + mandapaH - 0.4, posZ + bz);
      group.add(bell);
    });

    // Divine Sanctum Golden Point Light radiating Westward across steps (No cube shadow pass)
    const templeLight = new THREE.PointLight(0xffa200, 3.8, 32);
    templeLight.position.set(mandapaX, jagatiH + 3.2, posZ);
    templeLight.castShadow = false;
    group.add(templeLight);
    this.pointLights.push(templeLight);

    // Register Temple Colliders (Keep sacred mandir building solid, steps/plaza open)
    this.colliders.push({
      tag: 'temple_mandir',
      minX: posX - w / 2 + 1.2,
      maxX: posX + w / 2 + 0.5,
      minZ: posZ - d / 2 - 0.5,
      maxZ: posZ + d / 2 + 0.5
    });

    // Register Interactive Target for Temple Trivia & Puja
    this.interactiveTargets.push({
      id: templeData.id,
      name: templeData.name,
      type: 'temple',
      x: 1460, // 2D coords at bottom of temple steps
      z: 690,
      radius: 65,
      prompt: 'Press [E] for Temple Aarti & Diwali Traditions Trivia'
    });

    return group;
  }

  // -------------------------------------------------------------
  // 6. FESTIVAL BAZAAR STALLS & ARTISAN STUDIO
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 6. FESTIVAL BAZAAR STALLS & ARTISAN STUDIO (PREMIUM UPGRADE)
  // -------------------------------------------------------------
  buildBazaarStall(stallData) {
    const group = new THREE.Group();
    group.name = `Stall_${stallData.id}`;

    const isShop = stallData.type === 'shop';
    const w = 18.0; // Stall width
    const d = 10.0; // Stall depth
    const h = 4.8;
    const plinthH = 0.25;

    // Position stall on West side of Grand Celebration Avenue, rotated to face East (+X) into the street
    const stallX = 34.0;
    const stallZ = isShop ? 9.0 : -15.0;
    group.position.set(stallX, 0, stallZ);
    group.rotation.y = Math.PI / 2; // Front counter faces East (+X)

    // 1. Raised Wooden Plinth Deck & Stone Foundation
    const plinthGeo = new THREE.BoxGeometry(w + 1.4, plinthH, d + 1.4);
    const plinth = new THREE.Mesh(plinthGeo, this.materials.teakWood);
    plinth.position.set(0, plinthH / 2, 0);
    plinth.receiveShadow = true;
    group.add(plinth);

    // Front Festive Red Runner Carpet
    const carpetGeo = new THREE.PlaneGeometry(w * 0.88, 4.5);
    carpetGeo.rotateX(-Math.PI / 2);
    const carpet = new THREE.Mesh(carpetGeo, this.materials.carpetBazaarRunner);
    carpet.position.set(0, plinthH + 0.02, d * 0.4 + 1.2);
    carpet.receiveShadow = true;
    group.add(carpet);

    // Carpet Gold Border Trim
    const carpetBorder = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.88 + 0.1, 0.02, 0.15),
      this.materials.goldBrocadeTrim
    );
    carpetBorder.position.set(0, plinthH + 0.03, d * 0.4 + 3.4);
    group.add(carpetBorder);    // 2. Rear Wooden Wall with Carved Jali Lattice Panels
    const rearWallZ = -d / 2 + 0.25;
    const rearWallH = 4.4;
    const rearWall = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.4, rearWallH, 0.3),
      this.materials.carvedFascia
    );
    rearWall.position.set(0, rearWallH / 2 + plinthH, rearWallZ);
    rearWall.castShadow = true;
    rearWall.receiveShadow = true;
    group.add(rearWall);

    // Back Shelving Units on Rear Wall
    const shelfMat = this.materials.teakWood;
    [-w * 0.28, 0, w * 0.28].forEach(sx => {
      [2.0, 3.2].forEach(sy => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(w * 0.26, 0.08, 0.7), shelfMat);
        shelf.position.set(sx, sy + plinthH, rearWallZ + 0.4);
        shelf.castShadow = true;
        group.add(shelf);

        // Decorative cartons on back shelves
        if (isShop) {
          const carton = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.5), this.materials.crackerFoilRed);
          carton.position.set(sx, sy + plinthH + 0.34, rearWallZ + 0.4);
          group.add(carton);
        } else {
          const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.5, 8), this.materials.brassPolished);
          pot.position.set(sx, sy + plinthH + 0.28, rearWallZ + 0.4);
          group.add(pot);
        }
      });
    });

    // 3. Side Trellis / Jali Screen Half-Walls
    const sideW = d - 1.2;
    [-w / 2 + 0.25, w / 2 - 0.25].forEach(sx => {
      const sideLower = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.0, sideW), this.materials.teakWood);
      sideLower.position.set(sx, 1.0 + plinthH, 0);
      sideLower.castShadow = true;
      group.add(sideLower);

      const sideUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, sideW), this.materials.carvedFascia);
      sideUpper.position.set(sx, 2.9 + plinthH, 0);
      group.add(sideUpper);
    });

    // 4. Carved Wooden Pillars & Support Posts
    const postGeo = new THREE.BoxGeometry(0.36, h, 0.36);
    const postMat = this.materials.teakWood;
    const capitalGeo = new THREE.BoxGeometry(0.65, 0.25, 0.65);
    const capitalMat = this.materials.carvedFascia;

    const postPositions = [
      [-w / 2 + 0.3, -d / 2 + 0.3], // Back-Left
      [w / 2 - 0.3, -d / 2 + 0.3],  // Back-Right
      [-w / 2 + 0.3, d * 0.36],     // Front-Left
      [w / 2 - 0.3, d * 0.36],      // Front-Right
      [-w * 0.26, d * 0.36],        // Front Mid-Left
      [w * 0.26, d * 0.36]          // Front Mid-Right
    ];

    postPositions.forEach(([px, pz]) => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(px, h / 2 + plinthH, pz);
      post.castShadow = true;
      group.add(post);

      const cap = new THREE.Mesh(capitalGeo, capitalMat);
      cap.position.set(px, h + plinthH - 0.1, pz);
      group.add(cap);
    });

    // 5. Front Counter with 3-Tier Stepped Product Risers
    const counterZ = d * 0.32;
    const counterH = 1.35;
    const counterW = w * 0.88;
    const counterD = 1.8;

    const counterBase = new THREE.Mesh(
      new THREE.BoxGeometry(counterW, counterH, counterD),
      this.materials.teakWood
    );
    counterBase.position.set(0, counterH / 2 + plinthH, counterZ);
    counterBase.castShadow = true;
    counterBase.receiveShadow = true;
    group.add(counterBase);

    // Front Decorative Carved Recessed Panels with Brass Rosettes
    [-counterW * 0.3, 0, counterW * 0.3].forEach(px => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(counterW * 0.26, counterH * 0.75, 0.08), this.materials.carvedFascia);
      panel.position.set(px, counterH * 0.5 + plinthH, counterZ + counterD / 2 + 0.04);
      group.add(panel);

      const rosette = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 8), this.materials.brassPolished);
      rosette.rotation.x = Math.PI / 2;
      rosette.position.set(px, counterH * 0.5 + plinthH, counterZ + counterD / 2 + 0.09);
      group.add(rosette);
    });

    // Brass Customer Foot Rail
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, counterW, 8), this.materials.brassPolished);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 0.2 + plinthH, counterZ + counterD / 2 + 0.25);
    group.add(rail);

    // 3-Tier Stepped Risers on Counter Top
    const tierMat = this.materials.carvedFascia;
    const topY = counterH + plinthH;
    const tier1 = new THREE.Mesh(new THREE.BoxGeometry(counterW * 0.94, 0.08, counterD * 0.32), tierMat);
    tier1.position.set(0, topY + 0.04, counterZ + counterD * 0.28);
    group.add(tier1);

    const tier2 = new THREE.Mesh(new THREE.BoxGeometry(counterW * 0.94, 0.18, counterD * 0.32), tierMat);
    tier2.position.set(0, topY + 0.09, counterZ);
    group.add(tier2);

    const tier3 = new THREE.Mesh(new THREE.BoxGeometry(counterW * 0.94, 0.28, counterD * 0.32), tierMat);
    tier3.position.set(0, topY + 0.14, counterZ - counterD * 0.28);
    group.add(tier3);

    // 6. Sloped Fabric Awning with Scalloped Edge Trim
    const awning = this.createBazaarAwning(w, d, h, isShop);
    awning.position.set(0, h + plinthH, 0);
    group.add(awning);

    // 7. Hanging Marigold Floral Garlands (Torans) & Brass Bells
    const garlandSag1 = this.createMarigoldGarlandString(
      new THREE.Vector3(-w / 2 + 0.3, h + plinthH - 0.25, d * 0.36),
      new THREE.Vector3(-w * 0.26, h + plinthH - 0.25, d * 0.36),
      0.65, 12
    );
    group.add(garlandSag1);

    const garlandSag2 = this.createMarigoldGarlandString(
      new THREE.Vector3(-w * 0.26, h + plinthH - 0.25, d * 0.36),
      new THREE.Vector3(w * 0.26, h + plinthH - 0.25, d * 0.36),
      0.85, 20
    );
    group.add(garlandSag2);

    const garlandSag3 = this.createMarigoldGarlandString(
      new THREE.Vector3(w * 0.26, h + plinthH - 0.25, d * 0.36),
      new THREE.Vector3(w / 2 - 0.3, h + plinthH - 0.25, d * 0.36),
      0.65, 12
    );
    group.add(garlandSag3);

    // 8. Illuminated 3D Shop Signboard
    const signW = w * 0.68;
    const signH = 1.0;
    const signboard = this.createShopSignboard(
      isShop ? 'SHREE GANESH DIWALI BAZAAR' : 'RANGOLI & UTSAV KENDRA',
      isShop ? 'Crackers, Diyas, Sweets & Gifts' : 'Colors, Stencils & Festive Decor',
      signW, signH, isShop
    );
    signboard.position.set(0, h + plinthH - 1.1, counterZ + 0.45);
    group.add(signboard);

    // 9. Cast-Iron Heritage Lanterns on Front Corner Posts
    [-w / 2 + 0.3, w / 2 - 0.3].forEach(lx => {
      const lampArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.65), this.materials.darkWood);
      lampArm.position.set(lx, h + plinthH - 1.4, d * 0.36 + 0.32);
      group.add(lampArm);

      const lampHead = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), this.materials.lampGlass);
      lampHead.position.set(lx, h + plinthH - 1.6, d * 0.36 + 0.65);
      group.add(lampHead);
    });

    // 10. Recognizable 3D Product Displays on Risers
    if (isShop) {
      // --- VIRTUAL CRACKERS & FIREWORKS (LEFT SECTION) ---
      const rocketBundle = this.createRocketBundle();
      rocketBundle.position.set(-counterW * 0.38, topY + 0.32, counterZ - counterD * 0.2);
      group.add(rocketBundle);

      [-counterW * 0.24, -counterW * 0.12].forEach((ax, ai) => {
        const anar = this.createAnarPyramid(ai % 2 === 0 ? this.materials.crackerFoilRed : this.materials.crackerFoilGold);
        anar.position.set(ax, topY + 0.22, counterZ);
        group.add(anar);
      });

      const chakriStack = this.createChakriStack();
      chakriStack.position.set(-counterW * 0.28, topY + 0.12, counterZ + counterD * 0.26);
      group.add(chakriStack);

      const sparklers = this.createSparklerBox();
      sparklers.position.set(-counterW * 0.16, topY + 0.12, counterZ + counterD * 0.26);
      group.add(sparklers);

      const bombPack = this.createLaxmiBombPack();
      bombPack.position.set(-counterW * 0.05, topY + 0.12, counterZ + counterD * 0.26);
      group.add(bombPack);

      // --- BRASS LAMPS & CLAY DIYAS (CENTER SECTION) ---
      const samai = this.createBrassSamai();
      samai.position.set(0, topY + 0.32, counterZ - counterD * 0.22);
      group.add(samai);

      [-0.7, 0, 0.7].forEach((dx) => {
        const diya = this.createDiyaMesh(dx, topY + 0.12, counterZ + counterD * 0.28, false);
        group.add(diya);
      });

      // --- MITHAI & ROYAL SWEETS (RIGHT SECTION) ---
      const ladooThali = this.createLadooThali();
      ladooThali.position.set(counterW * 0.18, topY + 0.12, counterZ + counterD * 0.22);
      group.add(ladooThali);

      const kajuPlatter = this.createKajuKatliPlatter();
      kajuPlatter.position.set(counterW * 0.32, topY + 0.22, counterZ);
      group.add(kajuPlatter);

      const jalebiTray = this.createJalebiTray();
      jalebiTray.position.set(counterW * 0.30, topY + 0.36, counterZ - counterD * 0.25);
      group.add(jalebiTray);
    } else {
      // --- RANGOLI & KANDIL ARTISAN STUDIO PRODUCTS ---
      const gulalColors = [
        this.materials.gulalPink,
        this.materials.gulalCyan,
        this.materials.gulalYellow,
        this.materials.gulalGreen,
        this.materials.fabricCrimsonDrape,
        this.materials.fabricSaffronDrape
      ];

      gulalColors.forEach((mat, idx) => {
        const gx = -counterW * 0.35 + (idx % 3) * (counterW * 0.15);
        const gz = idx < 3 ? (counterZ + counterD * 0.25) : counterZ;
        const bowl = this.createGulalBowl(mat);
        bowl.position.set(gx, topY + (idx < 3 ? 0.08 : 0.18), gz);
        group.add(bowl);
      });

      const easel = this.createTabletopRangoliEasel();
      easel.position.set(counterW * 0.18, topY + 0.28, counterZ);
      group.add(easel);

      const samai = this.createBrassSamai();
      samai.position.set(counterW * 0.36, topY + 0.32, counterZ - counterD * 0.2);
      group.add(samai);

      [-0.4, 0.4].forEach(dx => {
        const diya = this.createDiyaMesh(counterW * 0.34 + dx, topY + 0.12, counterZ + counterD * 0.26, false);
        group.add(diya);
      });
    }

    // 11. Hanging Akash Kandils from Ceiling
    const kandilColors = [0xf97316, 0xef4444, 0x06b6d4];
    [-w * 0.28, 0, w * 0.28].forEach((kx, ki) => {
      const kandil = this.createHangingKandil(kandilColors[ki]);
      kandil.position.set(kx, h + plinthH - 1.2, 0);
      group.add(kandil);
    });

    // 12. Warm Interior Ambient Downlight
    const stallLight = new THREE.PointLight(0xf59e0b, 2.5, 18);
    stallLight.position.set(0, h + plinthH - 0.8, 0.5);
    stallLight.castShadow = false;
    group.add(stallLight);
    this.pointLights.push(stallLight);
    this.flickeringDiyas.push(stallLight);

    // 13. Register Collider for Counter and Enclosure (Does not bleed into walking avenue)
    this.colliders.push({
      tag: `stall_${stallData.id}`,
      minX: 26.0,
      maxX: 37.8,
      minZ: isShop ? 1.0 : -22.0,
      maxZ: isShop ? 17.0 : -8.0
    });

    // 14. Register Interactive Target for Shopping or Rangoli Minigame
    this.interactiveTargets.push({
      id: stallData.id,
      name: stallData.name,
      type: isShop ? 'shop' : 'minigame_rangoli',
      x: 1330, // 2D coords right at the counter
      z: isShop ? 700 : 460,
      radius: 65,
      prompt: isShop ? 'Press [E] to Browse Diwali Bazaar Shop' : 'Press [E] to Play Rangoli Artisan Minigame'
    });

    return group;
  }

  // -------------------------------------------------------------
  // BAZAAR HELPER: ILLUMINATED 3D SIGNBOARD
  // -------------------------------------------------------------
  createShopSignboard(title, subtitle, w, h, isShop) {
    let texture = null;
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Rich velvet background gradient
      const grad = ctx.createLinearGradient(0, 0, 1024, 0);
      if (isShop) {
        grad.addColorStop(0, '#500724');
        grad.addColorStop(0.5, '#881337');
        grad.addColorStop(1, '#500724');
      } else {
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(0.5, '#047857');
        grad.addColorStop(1, '#064e3b');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 256);

      // Multi-layer ornate gold filigree border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, 1000, 232);

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, 984, 216);

      // Corner decorative rosettes
      [[32, 32], [992, 32], [32, 224], [992, 224]].forEach(([cx, cy]) => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fill();
      });

      // Main Header Title
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 54px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      ctx.shadowBlur = 10;
      ctx.fillText(title, 512, 92);

      // Subtitle
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 26px sans-serif';
      ctx.shadowBlur = 5;
      ctx.fillText(subtitle, 512, 168);

      texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    const group = new THREE.Group();

    // Wooden Frame
    const frameGeo = new THREE.BoxGeometry(w + 0.35, h + 0.35, 0.2);
    const frame = new THREE.Mesh(frameGeo, this.materials.carvedFascia);
    frame.castShadow = true;
    group.add(frame);

    // Signboard Face
    const signGeo = new THREE.BoxGeometry(w, h, 0.22);
    const signMat = new THREE.MeshStandardMaterial({
      map: texture,
      color: texture ? 0xffffff : (isShop ? 0x881337 : 0x047857),
      roughness: 0.35,
      metalness: 0.15,
      emissive: isShop ? 0x4c0519 : 0x064e3b,
      emissiveIntensity: 0.45
    });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    group.add(signMesh);

    return group;
  }

  // -------------------------------------------------------------
  // BAZAAR HELPER: DRAPED AWNING WITH SCALLOPED VALANCE
  // -------------------------------------------------------------
  createBazaarAwning(w, d, h, isShop) {
    const group = new THREE.Group();

    const mat1 = isShop ? this.materials.fabricCrimsonDrape : this.materials.fabricEmeraldDrape;
    const mat2 = isShop ? this.materials.fabricSaffronDrape : this.materials.fabricCreamDrape;

    // Sloped Awning Plane (sloping down from back to front)
    const awningL = d * 0.92;
    const stripeCount = 10;
    const stripeW = (w + 1.2) / stripeCount;

    for (let i = 0; i < stripeCount; i++) {
      const stripeMat = (i % 2 === 0) ? mat1 : mat2;
      const stripeGeo = new THREE.BoxGeometry(stripeW, 0.08, awningL);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(-w / 2 + (i + 0.5) * stripeW, 0, 0);
      stripe.castShadow = true;
      group.add(stripe);
    }

    // Tilt awning forward
    group.rotation.x = 0.20;

    // Front Hanging Scalloped Valance (Wavy Festive Fringe)
    const valanceH = 0.65;
    const valanceW = w + 1.2;
    const valance = new THREE.Mesh(
      new THREE.BoxGeometry(valanceW, valanceH, 0.06),
      mat1
    );
    valance.position.set(0, -valanceH / 2, awningL / 2);
    valance.rotation.x = -0.20; // Hang vertically
    group.add(valance);

    // Golden Trim along bottom of valance
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(valanceW + 0.05, 0.08, 0.08),
      this.materials.goldBrocadeTrim
    );
    trim.position.set(0, -valanceH, awningL / 2);
    trim.rotation.x = -0.20;
    group.add(trim);

    // Left and Right Side Draped Valances
    [-valanceW / 2, valanceW / 2].forEach(vx => {
      const sideValance = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, valanceH * 0.8, awningL),
        mat2
      );
      sideValance.position.set(vx, -valanceH * 0.4, 0);
      group.add(sideValance);
    });

    return group;
  }

  // -------------------------------------------------------------
  // BAZAAR HELPER: MARIGOLD GARLAND CATENARY STRING
  // -------------------------------------------------------------
  createMarigoldGarlandString(p1, p2, sag = 0.42, count = 10) {
    const group = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const x = p1.x + (p2.x - p1.x) * t;
      const z = p1.z + (p2.z - p1.z) * t;
      // Parabolic catenary sag
      const sagOffset = Math.sin(t * Math.PI) * sag;
      const y = p1.y + (p2.y - p1.y) * t - sagOffset;

      const mat = (i % 2 === 0) ? this.materials.marigoldOrange : this.materials.marigoldYellow;
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), mat);
      flower.position.set(x, y, z);
      group.add(flower);
    }
    return group;
  }

  // -------------------------------------------------------------
  // 3D PRODUCT HELPERS
  // -------------------------------------------------------------
  createRocketBundle() {
    const bundle = new THREE.Group();
    const foils = [
      this.materials.crackerFoilRed,
      this.materials.crackerFoilGold,
      this.materials.crackerFoilBlue,
      this.materials.crackerFoilGreen
    ];

    const offsets = [
      [0, 0], [0.12, 0], [-0.12, 0],
      [0.06, 0.11], [-0.06, 0.11],
      [0.06, -0.11], [-0.06, -0.11]
    ];

    offsets.forEach(([ox, oz], idx) => {
      const mat = foils[idx % foils.length];
      // Cylinder body
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8), mat);
      body.position.set(ox, 0.45, oz);
      bundle.add(body);

      // Conical nose
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 8), this.materials.crackerFoilGold);
      nose.position.set(ox, 1.0, oz);
      bundle.add(nose);

      // Wooden stick
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.3, 4), this.materials.teakWood);
      stick.position.set(ox, -0.15, oz);
      bundle.add(stick);
    });

    // Golden ribbon tied around middle
    const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 6, 12), this.materials.goldBrocadeTrim);
    ribbon.rotation.x = Math.PI / 2;
    ribbon.position.y = 0.45;
    bundle.add(ribbon);

    return bundle;
  }

  createAnarPyramid() {
    const group = new THREE.Group();
    const conePositions = [
      [-0.24, 0, -0.14], [0.24, 0, -0.14],
      [-0.24, 0, 0.14], [0.24, 0, 0.14],
      [0, 0, 0], [0, 0.38, 0] // Apex cone
    ];

    conePositions.forEach(([cx, cy, cz]) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 8), this.materials.crackerFoilRed);
      cone.position.set(cx, cy + 0.22, cz);
      group.add(cone);

      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 8), this.materials.crackerFoilGold);
      tip.position.set(cx, cy + 0.48, cz);
      group.add(tip);
    });

    return group;
  }

  createChakriStack() {
    const group = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const tin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.12, 12),
        (i % 2 === 0) ? this.materials.crackerFoilGold : this.materials.crackerFoilRed
      );
      tin.position.y = 0.06 + i * 0.12;
      group.add(tin);
    }
    return group;
  }

  createLaxmiBombPack() {
    const group = new THREE.Group();
    const brick = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.32, 0.45), this.materials.crackerFoilRed);
    brick.position.y = 0.16;
    group.add(brick);

    // Green twine fuse
    const fuse = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 4), this.materials.crackerFoilGreen);
    fuse.position.set(0, 0.42, 0);
    fuse.rotation.z = 0.3;
    group.add(fuse);

    return group;
  }

  createSparklerBox() {
    const group = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.75, 0.28), this.materials.crackerFoilGold);
    box.position.y = 0.375;
    group.add(box);

    // Silver wires sticking out of the top
    for (let i = 0; i < 6; i++) {
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 4), this.materials.silverPlatter);
      wire.position.set((Math.random() - 0.5) * 0.18, 0.95, (Math.random() - 0.5) * 0.15);
      group.add(wire);
    }
    return group;
  }

  createLadooThali() {
    const group = new THREE.Group();
    // Silver round plate
    const thali = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.05, 16), this.materials.silverPlatter);
    thali.position.y = 0.025;
    group.add(thali);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.04, 6, 16), this.materials.silverPlatter);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.05;
    group.add(rim);

    // Ladoo Pyramid (10 on base, 4 in middle, 1 on top)
    const lRadius = 0.14;
    // Base ring
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8;
      const l = new THREE.Mesh(new THREE.SphereGeometry(lRadius, 6, 6), this.materials.mithaiLadoo);
      l.position.set(Math.cos(a) * 0.48, lRadius + 0.05, Math.sin(a) * 0.48);
      group.add(l);
    }
    // Mid layer
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI * 2) / 4 + 0.3;
      const l = new THREE.Mesh(new THREE.SphereGeometry(lRadius, 6, 6), this.materials.mithaiLadoo);
      l.position.set(Math.cos(a) * 0.24, lRadius * 2.5 + 0.05, Math.sin(a) * 0.24);
      group.add(l);
    }
    // Apex ladoo
    const apex = new THREE.Mesh(new THREE.SphereGeometry(lRadius, 6, 6), this.materials.mithaiLadoo);
    apex.position.set(0, lRadius * 4 + 0.05, 0);
    group.add(apex);

    return group;
  }

  createKajuKatliPlatter() {
    const group = new THREE.Group();
    const tray = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.95), this.materials.silverPlatter);
    tray.position.y = 0.02;
    group.add(tray);

    // Tiled diamond pieces (rotated square boxes)
    for (let row = -1; row <= 1; row++) {
      for (let col = -2; col <= 2; col++) {
        const katli = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.24), this.materials.mithaiKaju);
        katli.rotation.y = Math.PI / 4;
        katli.position.set(col * 0.28, 0.065, row * 0.26);
        group.add(katli);
      }
    }
    return group;
  }

  createJalebiTray() {
    const group = new THREE.Group();
    const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.04, 16), this.materials.brassPolished);
    tray.position.y = 0.02;
    group.add(tray);

    // Swirling coiled jalebi rings
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.055, 6, 12), this.materials.mithaiJalebi);
      ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
      ring.position.set(Math.cos(a) * 0.36, 0.07 + (i % 2) * 0.06, Math.sin(a) * 0.36);
      group.add(ring);
    }
    return group;
  }

  createBrassSamai() {
    const group = new THREE.Group();
    // Stepped pedestal
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 0.25, 8), this.materials.brassPolished);
    base.position.y = 0.125;
    group.add(base);

    // Slender pillar
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.2, 8), this.materials.brassPolished);
    stem.position.y = 0.85;
    group.add(stem);

    // 5-spout oil dish
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.15, 0.12, 8), this.materials.brassPolished);
    dish.position.y = 1.45;
    group.add(dish);

    // Golden oil flame on top
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 6), this.materials.lampGlow);
    flame.position.y = 1.6;
    group.add(flame);

    return group;
  }

  createGulalBowl(colorMat) {
    const group = new THREE.Group();
    // Polished Brass Katori (Bowl)
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.25, 0.22, 10), this.materials.brassPolished);
    bowl.position.y = 0.11;
    group.add(bowl);

    // Mounded Cone of Vibrant Gulal Powder
    const mound = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.38, 10), colorMat);
    mound.position.y = 0.35;
    group.add(mound);

    return group;
  }

  createTabletopRangoliEasel() {
    const group = new THREE.Group();
    // Wooden easel tripod
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.4, 4);
    const legL = new THREE.Mesh(legGeo, this.materials.teakWood);
    legL.position.set(-0.35, 0.65, 0);
    legL.rotation.z = -0.15;
    group.add(legL);

    const legR = new THREE.Mesh(legGeo, this.materials.teakWood);
    legR.position.set(0.35, 0.65, 0);
    legR.rotation.z = 0.15;
    group.add(legR);

    // Rangoli Canvas Art Board
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.06), this.materials.sandstoneWall);
    board.position.set(0, 0.75, 0.08);
    board.rotation.x = -0.2;
    group.add(board);

    // Mini Rangoli Mandala on Board
    const mandala = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.38, 12), this.materials.fabricCrimsonDrape);
    mandala.position.set(0, 0.75, 0.12);
    mandala.rotation.x = -0.2;
    group.add(mandala);

    return group;
  }

  createHangingKandil(colorHex = 0xf97316) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.85,
      roughness: 0.4
    });

    // Octahedron paper core
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), mat);
    group.add(body);

    // Hanging paper tails / streamers
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 });
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI * 2) / 4;
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.02), tailMat);
      tail.position.set(Math.cos(a) * 0.22, -0.55, Math.sin(a) * 0.22);
      group.add(tail);
    }

    return group;
  }

  // -------------------------------------------------------------
  // 7. FOLIAGE, BANYAN & NEEM TREES
  // -------------------------------------------------------------
  buildFoliage() {
    const group = new THREE.Group();
    group.name = 'FoliageAndFlora';

    // Tree locations around the colony perimeter and courtyards
    const treeCoords = [
      [120, 120, 3.2], [460, 110, 2.8], [800, 110, 2.8], [1150, 110, 3.0],
      [120, 760, 3.0], [460, 760, 2.8], [800, 760, 2.8], [1150, 760, 3.2],
      [1700, 140, 3.4], [1700, 600, 3.0], [1700, 1050, 3.2],
      [120, 1120, 3.0], [650, 1120, 3.2], [1150, 1120, 3.0]
    ];

    treeCoords.forEach(([tx, ty, scale]) => {
      const pos = this.to3D(tx, ty);
      const tree = this.createTreeMesh(pos.x, pos.z, scale);
      group.add(tree);

      // Slender tree trunk collider
      this.colliders.push({
        minX: pos.x - 0.45,
        maxX: pos.x + 0.45,
        minZ: pos.z - 0.45,
        maxZ: pos.z + 0.45
      });
    });

    return group;
  }

  createTreeMesh(x, z, scale = 1.0) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);

    // Thick Gnarled Trunk
    const trunkH = 4.5 * scale;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5 * scale, 0.8 * scale, trunkH, 8),
      this.materials.treeTrunk
    );
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    // Lush Tiered Foliage Clusters (Stylized Indian Banyan/Neem silhouette)
    const foliageMat = Math.random() > 0.5 ? this.materials.treeLeaves1 : this.materials.treeLeaves2;
    const canopyClusters = [
      [0, trunkH + 1.2 * scale, 0, 3.2 * scale],
      [-1.4 * scale, trunkH + 0.8 * scale, -0.8 * scale, 2.4 * scale],
      [1.4 * scale, trunkH + 0.8 * scale, 0.8 * scale, 2.4 * scale],
      [0, trunkH + 2.8 * scale, 0, 2.2 * scale]
    ];

    canopyClusters.forEach(([cx, cy, cz, cr]) => {
      const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(cr, 1), foliageMat);
      leaves.position.set(cx, cy, cz);
      leaves.castShadow = true;
      tree.add(leaves);
    });

    // Strings of subtle fairy light dots wrapped around perimeter tree trunks
    const fairyPointsGeo = new THREE.BufferGeometry();
    const pCoords = [];
    for (let i = 0; i < 20; i++) {
      const angle = i * 0.8;
      const py = 0.5 + i * (trunkH * 0.8 / 20);
      const px = Math.cos(angle) * (0.65 * scale);
      const pz = Math.sin(angle) * (0.65 * scale);
      pCoords.push(px, py, pz);
    }
    fairyPointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(pCoords, 3));
    const fairyPointsMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.25,
      transparent: true,
      opacity: 0.85
    });
    const fairyPoints = new THREE.Points(fairyPointsGeo, fairyPointsMat);
    tree.add(fairyPoints);

    return tree;
  }

  // -------------------------------------------------------------
  // 8. HERITAGE STREET LAMPS & DECORATIVE ILLUMINATION
  // -------------------------------------------------------------
  buildStreetLamps() {
    const group = new THREE.Group();
    group.name = 'HeritageStreetLamps';

    // Lamp coordinates along main mohalla avenues
    const lampCoords = [
      [360, 440], [650, 440], [940, 440],
      [360, 740], [650, 740], [940, 740],
      [650, 260], [650, 920],
      [1230, 440], [1230, 740]
    ];

    lampCoords.forEach(([lx, ly], idx) => {
      const pos = this.to3D(lx, ly);
      const lamp = this.createStreetLampMesh(pos.x, pos.z);
      group.add(lamp);

      // Key Warm Street Illumination on alternate corners (keep budget under 6 total scene pointlights)
      if (idx === 0 || idx === 3) {
        const light = new THREE.PointLight(0xffb703, 1.8, 22);
        light.position.set(pos.x, 5.0, pos.z);
        light.castShadow = false;
        group.add(light);
        this.pointLights.push(light);
      }
    });

    return group;
  }

  createStreetLampMesh(x, z) {
    const lamp = new THREE.Group();
    lamp.position.set(x, 0, z);

    // Cast-iron ornate pedestal
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 0.8, 8), this.materials.lampBrass);
    base.position.y = 0.4;
    lamp.add(base);

    // Lamp Post Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.2, 8), this.materials.lampBrass);
    pole.position.y = 2.5;
    lamp.add(pole);

    // Ornate Cross Bracket
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.15), this.materials.lampBrass);
    arm.position.y = 4.4;
    lamp.add(arm);

    // Glowing Hexagonal Lantern Housings
    const lanternGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.8, 6);
    const lanternLeft = new THREE.Mesh(lanternGeo, this.materials.lampGlow);
    lanternLeft.position.set(-0.6, 4.8, 0);
    lamp.add(lanternLeft);

    const lanternRight = new THREE.Mesh(lanternGeo, this.materials.lampGlow);
    lanternRight.position.set(0.6, 4.8, 0);
    lamp.add(lanternRight);

    return lamp;
  }

  // -------------------------------------------------------------
  // 9. FAIRY LIGHT STRINGS & AKASH KANDILS (LANTERNS)
  // -------------------------------------------------------------
  buildFairyLightString(x, y, z, width, depth, style = 'golden') {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Perimeter points around roof parapet
    const halfW = width / 2;
    const halfD = depth / 2;
    const perimeterPoints = [];
    const step = 0.8;

    for (let px = -halfW; px <= halfW; px += step) perimeterPoints.push([px, -halfD]);
    for (let pz = -halfD; pz <= halfD; pz += step) perimeterPoints.push([halfW, pz]);
    for (let px = halfW; px >= -halfW; px -= step) perimeterPoints.push([px, halfD]);
    for (let pz = halfD; pz >= -halfD; pz -= step) perimeterPoints.push([-halfW, pz]);

    const bulbCount = perimeterPoints.length;
    const coords = [];
    const colors = [];

    const colorPalette = {
      golden: [new THREE.Color(0xfef08a), new THREE.Color(0xf59e0b)],
      rainbow: [new THREE.Color(0xef4444), new THREE.Color(0xf59e0b), new THREE.Color(0x10b981), new THREE.Color(0x3b82f6), new THREE.Color(0xa855f7)],
      cyan: [new THREE.Color(0x06b6d4), new THREE.Color(0x3b82f6), new THREE.Color(0x8b5cf6)]
    };

    const activePalette = colorPalette[style] || colorPalette.golden;

    perimeterPoints.forEach((pt, i) => {
      // Gentle catenary sag between bulbs
      const sag = Math.sin(i * 1.2) * 0.15;
      coords.push(pt[0], sag, pt[1]);

      const c = activePalette[i % activePalette.length];
      colors.push(c.r, c.g, c.b);
    });

    const bulbGeo = new THREE.BufferGeometry();
    bulbGeo.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
    bulbGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const bulbMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });

    const bulbsMesh = new THREE.Points(bulbGeo, bulbMat);
    group.add(bulbsMesh);

    return group;
  }

  // -------------------------------------------------------------
  // 9. AUTHENTIC 3D PAPER SKY LANTERNS (AKASH DIYA / KHOM LOI)
  // -------------------------------------------------------------
  buildAuthenticSkyLantern(scale = 1.0, isHero = false) {
    const group = new THREE.Group();

    // 1. Lantern Outer Paper Shell (Translucent Warm Emissive Paper)
    // Upper Dome Crown
    const domeGeo = new THREE.SphereGeometry(0.72 * scale, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const dome = new THREE.Mesh(domeGeo, this.materials.skyLanternPaper);
    dome.position.y = 0.52 * scale;
    group.add(dome);

    // Tapered Cylindrical Body (slightly wider at top, narrowing to collar)
    const bodyGeo = new THREE.CylinderGeometry(0.72 * scale, 0.50 * scale, 1.25 * scale, 18, 1, true);
    const body = new THREE.Mesh(bodyGeo, this.materials.skyLanternPaper);
    body.position.y = -0.06 * scale;
    group.add(body);

    // 2. Bamboo Collar Ring at Bottom Opening
    const rimGeo = new THREE.TorusGeometry(0.51 * scale, 0.035 * scale, 8, 20);
    rimGeo.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, this.materials.bambooRibs);
    rim.position.y = -0.68 * scale;
    group.add(rim);

    // 3. Crossed Bamboo / Wire Burner Frame
    const wireMat = this.materials.darkWood;
    const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015 * scale, 0.015 * scale, 1.0 * scale, 4), wireMat);
    wire1.rotation.z = Math.PI / 2;
    wire1.position.y = -0.67 * scale;
    group.add(wire1);

    const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015 * scale, 0.015 * scale, 1.0 * scale, 4), wireMat);
    wire2.rotation.x = Math.PI / 2;
    wire2.position.y = -0.67 * scale;
    group.add(wire2);

    // 4. Central Glowing Flame Core (Kindled Wick)
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.14 * scale, 8, 8), flameMat);
    flame.scale.set(0.7, 1.8, 0.7);
    flame.position.y = -0.52 * scale;
    group.add(flame);

    // 5. Internal Warm Point Light (Exclusive to Hero Lantern for max performance)
    let lanternLight = null;
    if (isHero) {
      lanternLight = new THREE.PointLight(0xff9e1b, 3.2, 28);
      lanternLight.position.y = -0.42 * scale;
      lanternLight.castShadow = false;
      group.add(lanternLight);
      this.pointLights.push(lanternLight);
    }

    // 6. Falling Spark / Ember Particle Stream underneath
    let embersGeo = null;
    if (isHero) {
      const emberCount = 28;
      const emberPositions = new Float32Array(emberCount * 3);
      const emberColors = new Float32Array(emberCount * 3);
      for (let e = 0; e < emberCount; e++) {
        emberPositions[e * 3] = (Math.random() - 0.5) * 0.35 * scale;
        emberPositions[e * 3 + 1] = -0.7 * scale - Math.random() * 2.8 * scale;
        emberPositions[e * 3 + 2] = (Math.random() - 0.5) * 0.35 * scale;

        emberColors[e * 3] = 1.0;
        emberColors[e * 3 + 1] = 0.75 + Math.random() * 0.25;
        emberColors[e * 3 + 2] = 0.15;
      }
      embersGeo = new THREE.BufferGeometry();
      embersGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
      embersGeo.setAttribute('color', new THREE.BufferAttribute(emberColors, 3));

      const embersMat = new THREE.PointsMaterial({
        size: 0.28 * scale,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const embersMesh = new THREE.Points(embersGeo, embersMat);
      group.add(embersMesh);
    }

    return { group, lanternLight, embersGeo, scale };
  }

  buildKandilLantern(x, y, z) {
    const lantern = this.buildAuthenticSkyLantern(0.8, false);
    lantern.group.position.set(x, y, z);
    return lantern.group;
  }

  buildSuspendedLanterns() {
    const group = new THREE.Group();
    group.name = 'SuspendedPaperLanterns';

    // 1. HERO SKY LANTERN (Prominently visible directly above player vista & celebration avenue)
    // Player is at (51.5, 14.0) facing North (-Z). Camera is at (51.5, 2.3, 20.2).
    // Placing Hero Lantern at (51.2, 13.5, -2.0) frames it right in the upper middle sky!
    const hero = this.buildAuthenticSkyLantern(2.3, true);
    hero.group.position.set(51.2, 13.5, -2.0);
    group.add(hero.group);
    this.floatingSkyLanterns.push({
      group: hero.group,
      embersGeo: hero.embersGeo,
      scale: 2.3,
      baseX: 51.2,
      baseY: 13.5,
      baseZ: -2.0,
      bobSpeed: 1.1,
      bobAmp: 0.35,
      swaySpeed: 0.7,
      swayAmp: 0.2,
      phase: 0.0
    });

    // 2. CELESTIAL FLEET OF DRIFTING SKY LANTERNS (Creating depth across the night sky)
    const fleetCoords = [
      // Above left bazaar & western colonial rooftops
      { x: 32, y: 16, z: -10, s: 1.15 },
      { x: 26, y: 22, z: -25, s: 0.95 },
      { x: 38, y: 27, z: -38, s: 0.85 },
      { x: 20, y: 20, z: -50, s: 0.75 },
      { x: 34, y: 33, z: -68, s: 0.65 },
      { x: 18, y: 28, z: -85, s: 0.55 },
      { x: 28, y: 40, z: -105, s: 0.45 },
      // Ascending above the central Grand Celebration Promenade
      { x: 47, y: 19, z: -20, s: 1.05 },
      { x: 55, y: 25, z: -35, s: 0.9 },
      { x: 45, y: 31, z: -50, s: 0.78 },
      { x: 53, y: 38, z: -68, s: 0.68 },
      { x: 49, y: 45, z: -88, s: 0.55 },
      { x: 56, y: 52, z: -110, s: 0.45 },
      // Above right Shree Mandir temple spires & moonlit sky
      { x: 69, y: 18, z: -12, s: 1.1 },
      { x: 79, y: 24, z: -26, s: 0.95 },
      { x: 66, y: 30, z: -42, s: 0.85 },
      { x: 82, y: 36, z: -58, s: 0.72 },
      { x: 73, y: 43, z: -76, s: 0.62 },
      { x: 86, y: 49, z: -94, s: 0.52 },
      // Distant celestial layer
      { x: 40, y: 54, z: -120, s: 0.4 },
      { x: 65, y: 58, z: -125, s: 0.38 },
      { x: 80, y: 64, z: -135, s: 0.32 }
    ];

    fleetCoords.forEach((coord, idx) => {
      const lantern = this.buildAuthenticSkyLantern(coord.s, false);
      lantern.group.position.set(coord.x, coord.y, coord.z);
      group.add(lantern.group);

      this.floatingSkyLanterns.push({
        group: lantern.group,
        embersGeo: null,
        scale: coord.s,
        baseX: coord.x,
        baseY: coord.y,
        baseZ: coord.z,
        bobSpeed: 0.8 + (idx % 5) * 0.15,
        bobAmp: 0.25 + (idx % 3) * 0.1,
        swaySpeed: 0.6 + (idx % 4) * 0.12,
        swayAmp: 0.15 + (idx % 3) * 0.08,
        phase: idx * 1.37
      });
    });

    return group;
  }

  createDiyaMesh(x, y, z, withLight = false) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Clay Bowl (Terracotta)
    const bowl = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.16, 10), this.materials.clayDiya);
    bowl.rotation.x = Math.PI;
    bowl.position.y = 0.08;
    group.add(bowl);

    // Glowing Flame Core
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), this.materials.lampGlow);
    flame.scale.set(0.6, 1.6, 0.6);
    flame.position.y = 0.22;
    group.add(flame);

    if (withLight) {
      const dlight = new THREE.PointLight(0xffa200, 1.2, 7);
      dlight.position.y = 0.35;
      group.add(dlight);
      this.pointLights.push(dlight);
      this.flickeringDiyas.push(dlight);
    }

    return group;
  }

  // -------------------------------------------------------------
  // UPDATE LOOP ANIMATIONS (FLICKER & DECORATION SYNCHRONIZATION)
  // -------------------------------------------------------------
  update(time) {
    // 1. Subtle flickering of clay diya flames
    for (let i = 0; i < this.flickeringDiyas.length; i++) {
      const light = this.flickeringDiyas[i];
      light.intensity = 1.0 + Math.sin(time * 8 + i * 2.3) * 0.25 + Math.random() * 0.1;
    }

    // 2. Gentle floating sway and bobbing of Sky Lanterns
    for (let i = 0; i < this.floatingSkyLanterns.length; i++) {
      const item = this.floatingSkyLanterns[i];
      item.group.position.y = item.baseY + Math.sin(time * item.bobSpeed + item.phase) * item.bobAmp;
      item.group.position.x = item.baseX + Math.sin(time * item.swaySpeed + item.phase) * item.swayAmp;
      item.group.rotation.z = Math.sin(time * 0.9 + item.phase) * 0.04;
      item.group.rotation.x = Math.cos(time * 0.7 + item.phase) * 0.03;

      // Animate falling spark embers if present
      if (item.embersGeo) {
        const pos = item.embersGeo.attributes.position.array;
        for (let p = 0; p < pos.length; p += 3) {
          pos[p + 1] -= 0.018; // drift downward
          if (pos[p + 1] < -3.5 * item.scale) {
            pos[p + 1] = -0.7 * item.scale;
            pos[p] = (Math.random() - 0.5) * 0.35 * item.scale;
            pos[p + 2] = (Math.random() - 0.5) * 0.35 * item.scale;
          }
        }
        item.embersGeo.attributes.position.needsUpdate = true;
      }
    }
  }

  // Update house lights dynamically when toggled by Decorator modal or Maha Deepotsav
  updateHouseLighting(houseId, isOn, style) {
    const item = this.fairyLightStrings.find(f => f.houseId === houseId);
    if (item && item.group) {
      item.group.visible = isOn;
      item.on = isOn;
    }
  }

  // Check collision against all 3D building and wall bounding boxes
  checkCollision(nextX, nextZ, radius = 0.45) {
    for (let c of this.colliders) {
      if (
        nextX + radius > c.minX &&
        nextX - radius < c.maxX &&
        nextZ + radius > c.minZ &&
        nextZ - radius < c.maxZ
      ) {
        return true; // Collision detected
      }
    }
    return false;
  }

  // Resolve player movement with wall sliding and automatic depenetration unsticking
  resolveMovement(curX, curZ, dx, dz, radius = 0.45) {
    let newX = curX;
    let newZ = curZ;

    // 1. Direct free movement
    if (!this.checkCollision(curX + dx, curZ + dz, radius)) {
      return { x: curX + dx, z: curZ + dz };
    }

    // 2. Wall sliding along X axis
    if (Math.abs(dx) > 0.0001 && !this.checkCollision(curX + dx, curZ, radius)) {
      newX = curX + dx;
    }

    // 3. Wall sliding along Z axis
    if (Math.abs(dz) > 0.0001) {
      if (!this.checkCollision(newX, curZ + dz, radius)) {
        newZ = curZ + dz;
      } else if (!this.checkCollision(curX, curZ + dz, radius)) {
        newZ = curZ + dz;
      }
    }

    // 4. Depenetration: Push player outside if overlapping any collider boundary
    for (let c of this.colliders) {
      if (
        newX + radius > c.minX &&
        newX - radius < c.maxX &&
        newZ + radius > c.minZ &&
        newZ - radius < c.maxZ
      ) {
        const oLeft = (newX + radius) - c.minX;
        const oRight = c.maxX - (newX - radius);
        const oBottom = (newZ + radius) - c.minZ;
        const oTop = c.maxZ - (newZ - radius);

        const minO = Math.min(oLeft, oRight, oBottom, oTop);
        if (minO === oLeft) newX = c.minX - radius - 0.02;
        else if (minO === oRight) newX = c.maxX + radius + 0.02;
        else if (minO === oBottom) newZ = c.minZ - radius - 0.02;
        else if (minO === oTop) newZ = c.maxZ + radius + 0.02;
      }
    }

    return { x: newX, z: newZ };
  }

  // Find nearest interactive target (converted to 2D coordinates for compatibility)
  getInteractiveTarget(player2DX, player2DY) {
    for (let target of this.interactiveTargets) {
      const dist = Math.hypot(player2DX - target.x, player2DY - target.z);
      if (dist <= target.radius) {
        return target;
      }
    }
    return null;
  }
}

window.DiwaliWorld3D = DiwaliWorld3D;
