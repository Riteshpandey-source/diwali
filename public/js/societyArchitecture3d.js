// ===================================================================
// GOKUL KUNJ CO-OP HOUSING SOCIETY - 3D ARCHITECTURE & INTERIORS
// Authentic Indian sitcom-inspired society architecture, central courtyard,
// decorated entrance gate, accessible community hall, and furnished apartment interiors.
// ===================================================================

class DiwaliSocietyArchitecture3D {
  constructor(world3D) {
    this.world3D = world3D;
    this.scene = world3D.scene;
    this.materials = world3D.materials;

    // Create custom interior & society materials
    this.initCustomMaterials();

    // Track active interior state for player transitions
    this.currentInterior = null; // null | 'community_hall' | 'patel_niwas' | 'bhide_niwas'
    this.exteriorPlayerPos = null; // Stored { x, y, z } to restore on exit

    // Root groups
    this.exteriorGroup = new THREE.Group();
    this.exteriorGroup.name = 'SocietyExteriors';

    this.interiorsGroup = new THREE.Group();
    this.interiorsGroup.name = 'SocietyInteriors';
    this.interiorsGroup.visible = false; // Hidden when player is outside in the colony so rooms don't float outside the boundary

    this.scene.add(this.exteriorGroup);
    this.scene.add(this.interiorsGroup);

    // Build the society structures
    this.buildEntranceGate();
    this.buildSocietyNoticeboard();
    this.buildWingSignsAndNameplates();
    this.buildCourtyardGardenBenches();
    this.buildCommunityHall();
    this.buildApartmentInteriors();
  }

  initCustomMaterials() {
    this.matWoodPolished = new THREE.MeshStandardMaterial({ color: 0x5c3317, roughness: 0.45, metalness: 0.1 });
    this.matTeak = new THREE.MeshStandardMaterial({ color: 0x7c4722, roughness: 0.6 });
    this.matMarbleWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.05 });
    this.matFabricRed = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.8 });
    this.matFabricMaroon = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.8 });
    this.matFabricGold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.65 });
    this.matCushionCream = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 });
    this.matBrassGlow = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });
    this.matWallInteriorCream = new THREE.MeshStandardMaterial({ color: 0xfdf6e2, roughness: 0.7 });
    this.matFloorTiles = new THREE.MeshStandardMaterial({ color: 0xe2d9c8, roughness: 0.4 });
    this.matCarpetRed = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 });
    this.matBlackboard = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
    this.matBannerEmissive = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.35,
      roughness: 0.5
    });
  }

  // -----------------------------------------------------------------
  // 1. GRAND GOKULDHAM SOCIETY ENTRANCE GATE & ARCHWAY
  // -----------------------------------------------------------------
  buildEntranceGate() {
    const gateGroup = new THREE.Group();
    this.entranceGateGroup = gateGroup;
    // Positioned across the main entrance avenue (x = -48.0) leading into the Central Courtyard
    gateGroup.position.set(-48.0, 0, 0);

    const pillarDist = 7.5; // Left pillar at z = -7.5, Right pillar at z = +7.5 (Clear 13.0m span)
    const pillarW = 2.2;
    const pillarH = 8.5;
    const pillarD = 2.2;

    // -------------------------------------------------------------
    // A. TWO TALL, SUBSTANTIAL ENTRANCE PILLARS (LEFT & RIGHT)
    // -------------------------------------------------------------
    [-pillarDist, pillarDist].forEach(pz => {
      // 1. Stepped Plinth Base
      const step1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 3.2), this.materials.sandstoneWall);
      step1.position.set(0, 0.225, pz);
      step1.receiveShadow = true;
      gateGroup.add(step1);

      const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 2.8), this.materials.goldTrim);
      step2.position.set(0, 0.65, pz);
      gateGroup.add(step2);

      // 2. Main Pillar Shaft with Beveled Sandstone & Brass Inlays
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(pillarW, pillarH, pillarD), this.materials.sandstoneWall);
      shaft.position.set(0, 0.85 + pillarH / 2, pz);
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      gateGroup.add(shaft);

      // Vertical Sandstone Fluting / Edge Strips
      [-0.95, 0.95].forEach(fx => {
        [-0.95, 0.95].forEach(fz => {
          const cornerTrim = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, pillarH, 0.25),
            this.materials.terracottaWall
          );
          cornerTrim.position.set(fx, 0.85 + pillarH / 2, pz + fz);
          gateGroup.add(cornerTrim);
        });
      });

      // Mid-Pillar Decorative Belt
      const midBelt = new THREE.Mesh(
        new THREE.BoxGeometry(pillarW + 0.25, 0.35, pillarD + 0.25),
        this.materials.goldTrim
      );
      midBelt.position.set(0, 5.0, pz);
      gateGroup.add(midBelt);

      // 3. Decorative Architectural Capital with Cantilever Brackets
      const capBase = new THREE.Mesh(
        new THREE.BoxGeometry(pillarW + 0.5, 0.5, pillarD + 0.5),
        this.materials.goldTrim
      );
      capBase.position.set(0, 0.85 + pillarH + 0.25, pz);
      gateGroup.add(capBase);

      const capCrown = new THREE.Mesh(
        new THREE.BoxGeometry(pillarW + 0.9, 0.4, pillarD + 0.9),
        this.materials.terracottaWall
      );
      capCrown.position.set(0, 0.85 + pillarH + 0.7, pz);
      gateGroup.add(capCrown);

      // 4. Domed Chhatri & Golden Kalash Finial on Pillar Top
      const chhatriBase = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.3, 8),
        this.materials.goldTrim
      );
      chhatriBase.position.set(0, 10.2, pz);
      gateGroup.add(chhatriBase);

      const chhatriDome = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2),
        this.materials.templeGoldKalash
      );
      chhatriDome.position.set(0, 10.35, pz);
      gateGroup.add(chhatriDome);

      const pillarKalash = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 1.0, 8),
        this.materials.templeGoldKalash
      );
      pillarKalash.position.set(0, 11.85, pz);
      gateGroup.add(pillarKalash);

      // 5. Hanging Traditional Brass Lantern on Pillar Bracket
      const bracketArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.12, 0.12),
        this.materials.lampBrass
      );
      bracketArm.position.set(0, 8.8, pz + (pz > 0 ? -1.3 : 1.3));
      gateGroup.add(bracketArm);

      const chain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6),
        this.materials.lampBrass
      );
      chain.position.set(0, 8.4, pz + (pz > 0 ? -1.3 : 1.3));
      gateGroup.add(chain);

      const brassLantern = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 1),
        this.materials.windowGlow
      );
      brassLantern.position.set(0, 7.8, pz + (pz > 0 ? -1.3 : 1.3));
      gateGroup.add(brassLantern);

      // 6. Base Diya Clusters & Floral Rangoli at Foot of Each Pillar
      const rangoliFoot = this.createPillarRangoli(0, 0.03, pz, 1.8);
      gateGroup.add(rangoliFoot);

      // Earthen Clay Diyas around base
      for (let da = 0; da < Math.PI * 2; da += Math.PI / 3) {
        const cdx = Math.cos(da) * 1.9;
        const cdz = Math.sin(da) * 1.9;
        const baseDiya = this.createClayDiya(cdx, 0.05, pz + cdz);
        gateGroup.add(baseDiya);
      }
    });

    // -------------------------------------------------------------
    // B. WIDE HORIZONTAL ARCH & PEDIMENT STRUCTURE
    // -------------------------------------------------------------
    const archSpan = pillarDist * 2 + pillarW; // 17.2m total width
    const beamH = 2.4;
    const beamD = 1.4;
    const beamY = 8.6; // Underside is at y = 7.4m (plenty of player & camera headroom)

    // Main Structural Arch Beam
    const archBeam = new THREE.Mesh(
      new THREE.BoxGeometry(beamD, beamH, archSpan),
      this.materials.terracottaWall
    );
    archBeam.position.set(0, beamY, 0);
    archBeam.castShadow = true;
    archBeam.receiveShadow = true;
    gateGroup.add(archBeam);

    // Decorative Molded Edges around Beam
    const beamBorderBottom = new THREE.Mesh(
      new THREE.BoxGeometry(beamD + 0.25, 0.35, archSpan + 0.4),
      this.materials.goldTrim
    );
    beamBorderBottom.position.set(0, beamY - beamH / 2 - 0.15, 0);
    gateGroup.add(beamBorderBottom);

    const beamBorderTop = new THREE.Mesh(
      new THREE.BoxGeometry(beamD + 0.35, 0.45, archSpan + 0.6),
      this.materials.goldTrim
    );
    beamBorderTop.position.set(0, beamY + beamH / 2 + 0.2, 0);
    gateGroup.add(beamBorderTop);

    // Stepped Crown Cornice & Roof Tiles
    const corniceRoof = new THREE.Mesh(
      new THREE.BoxGeometry(beamD + 0.8, 0.5, archSpan + 1.0),
      this.materials.roofTile
    );
    corniceRoof.position.set(0, beamY + beamH / 2 + 0.65, 0);
    gateGroup.add(corniceRoof);

    // Classical Indian Pediment / Arched Crest over Central Span
    const pedimentCrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.4, 9.5),
      this.materials.terracottaWall
    );
    pedimentCrest.position.set(0, beamY + beamH / 2 + 1.5, 0);
    gateGroup.add(pedimentCrest);

    // Central Grand Kalash atop Pediment
    const centerKalash = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 14, 12),
      this.materials.templeGoldKalash
    );
    centerKalash.position.set(0, beamY + beamH / 2 + 2.5, 0);
    gateGroup.add(centerKalash);

    const centerKalashFinial = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.2, 8),
      this.materials.templeGoldKalash
    );
    centerKalashFinial.position.set(0, beamY + beamH / 2 + 3.4, 0);
    gateGroup.add(centerKalashFinial);

    // Flanking Smaller Kalashes
    [-3.8, 3.8].forEach(kz => {
      const flankK = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 10, 8),
        this.materials.templeGoldKalash
      );
      flankK.position.set(0, beamY + beamH / 2 + 2.2, kz);
      gateGroup.add(flankK);
    });

    // -------------------------------------------------------------
    // C. PROMINENT “GOKULDHAM SOCIETY” SIGNBOARD (WEST & EAST FACES)
    // -------------------------------------------------------------
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 2048;
    signCanvas.height = 512;
    const ctx = signCanvas.getContext('2d');

    // Rich Deep Maroon Velvet Lacquer Background
    ctx.fillStyle = '#6b0f1a';
    ctx.fillRect(0, 0, 2048, 512);

    // Radial lighting gradient across the center of the board
    const bgGrad = ctx.createRadialGradient(1024, 256, 100, 1024, 256, 950);
    bgGrad.addColorStop(0, 'rgba(185, 28, 28, 0.95)');
    bgGrad.addColorStop(0.6, 'rgba(127, 29, 29, 0.98)');
    bgGrad.addColorStop(1, 'rgba(76, 5, 25, 1.0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 512);

    // Outer & Inner Carved Golden Borders
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 18;
    ctx.strokeRect(16, 16, 2016, 480);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(36, 36, 1976, 440);

    // Corner Ornate Filigrees
    const drawCornerKnot = (x, y) => {
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCornerKnot(48, 48);
    drawCornerKnot(2000, 48);
    drawCornerKnot(48, 464);
    drawCornerKnot(2000, 464);

    // Top Sacred Sanskrit Line
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 54px "Tiro Devanagari Sanskrit", serif, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ गोकुलधाम को-ऑप. हाउसिंग सोसाइटी ॥', 1024, 115);

    // PRIMARY TEXT: “GOKULDHAM SOCIETY” (Large, Centered, Elegant Serif)
    // 3D Drop Shadow for tactile physical depth
    ctx.fillStyle = '#2b0505';
    ctx.font = '900 125px "Cinzel Decorative", "Playfair Display", Georgia, serif';
    ctx.fillText('GOKULDHAM SOCIETY', 1028, 276);

    // Radiant Golden Lettering with Ambient Glow
    const textGrad = ctx.createLinearGradient(0, 170, 0, 280);
    textGrad.addColorStop(0, '#ffffff');
    textGrad.addColorStop(0.25, '#fef08a');
    textGrad.addColorStop(0.7, '#facc15');
    textGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = textGrad;
    ctx.fillText('GOKULDHAM SOCIETY', 1024, 272);

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.strokeText('GOKULDHAM SOCIETY', 1024, 272);

    // Bottom Decorative Festive Ribbon
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✨ SHUBH DEEPAWALI 2026 • WELCOME ✨', 1024, 400);

    const signTex = new THREE.CanvasTexture(signCanvas);
    signTex.anisotropy = 4;

    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0x881337,
      emissiveIntensity: 0.45
    });

    // 1. West Face Signboard (Visible to visitors approaching from outside)
    const signMeshWest = new THREE.Mesh(new THREE.PlaneGeometry(archSpan - 1.2, beamH - 0.3), signMat);
    signMeshWest.position.set(-beamD / 2 - 0.05, beamY, 0);
    signMeshWest.rotation.y = -Math.PI / 2;
    gateGroup.add(signMeshWest);
    this.entranceSignMeshWest = signMeshWest;

    // 2. East Face Signboard (Visible to residents inside the courtyard looking back)
    const signMeshEast = new THREE.Mesh(new THREE.PlaneGeometry(archSpan - 1.2, beamH - 0.3), signMat);
    signMeshEast.position.set(beamD / 2 + 0.05, beamY, 0);
    signMeshEast.rotation.y = Math.PI / 2;
    gateGroup.add(signMeshEast);

    // -------------------------------------------------------------
    // D. RICH DIWALI DECORATIONS
    // -------------------------------------------------------------
    // 1. Dense Marigold Garlands Draped in Natural Parabolic Curves
    this.createDrapedMarigoldGarlands(gateGroup, beamY - beamH / 2, archSpan, beamD);

    // 2. Colorful Triangular Fabric Buntings (Jhandiyan)
    this.createFestiveFabricBuntings(gateGroup, beamY - beamH / 2 - 0.6, archSpan, beamD);

    // 3. Warm Golden Fairy Light Cascades
    this.createFairyLightStringsOnGate(gateGroup, beamY, archSpan, beamD, pillarDist);

    // 4. Two Traditional Hanging Akash Kandil Paper Lanterns
    [-4.0, 4.0].forEach(lz => {
      const kandil = this.buildHangingAkashKandil();
      kandil.position.set(0, beamY - beamH / 2 - 0.2, lz);
      gateGroup.add(kandil);
    });

    // -------------------------------------------------------------
    // E. APPROACH ROAD & ENTRANCE PAVING
    // -------------------------------------------------------------
    const roadLength = 32.0;
    const roadWidth = 14.0;
    const roadGeo = new THREE.PlaneGeometry(roadLength, roadWidth);
    const entranceRoad = new THREE.Mesh(roadGeo, this.materials.roadStone);
    entranceRoad.rotation.x = -Math.PI / 2;
    entranceRoad.position.set(0, 0.02, 0);
    entranceRoad.receiveShadow = true;
    gateGroup.add(entranceRoad);

    // Curbs along entrance road
    [-roadWidth / 2, roadWidth / 2].forEach(cz => {
      const curb = new THREE.Mesh(
        new THREE.BoxGeometry(roadLength, 0.16, 0.45),
        this.materials.curbStone
      );
      curb.position.set(0, 0.08, cz);
      gateGroup.add(curb);

      // Continuous Earthen Diyas along road curbs
      for (let rx = -roadLength / 2 + 2; rx <= roadLength / 2 - 2; rx += 3.5) {
        const roadDiya = this.createClayDiya(rx, 0.16, cz + (cz > 0 ? -0.3 : 0.3));
        gateGroup.add(roadDiya);
      }
    });

    // Welcoming Rangoli on Entrance Road
    const welcomeRangoli = this.createPillarRangoli(0, 0.04, 0, 3.2);
    gateGroup.add(welcomeRangoli);

    // -------------------------------------------------------------
    // F. ABDUL KI DUKAAN (ALL-IN-ONE GENERAL STORE) AT ENTRANCE GATE
    // Iconic Gokuldham shop located right beside the main entrance (z = -11.5)
    // -------------------------------------------------------------
    const shopGroup = new THREE.Group();
    shopGroup.name = 'AbdulKiDukaan';

    // 1. Base Shop Cabin & Heritage Plinth
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 3.5, 4.0),
      this.materials.creamWall
    );
    cabin.position.set(0, 1.75, -11.5);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    shopGroup.add(cabin);

    // Terracotta base foundation plinth
    const cabinPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(4.25, 0.4, 4.25),
      this.materials.terracottaWall
    );
    cabinPlinth.position.set(0, 0.2, -11.5);
    cabinPlinth.receiveShadow = true;
    shopGroup.add(cabinPlinth);

    // Sloped Heritage Roof
    const cabinRoof = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.55, 4.6),
      this.materials.roofTile
    );
    cabinRoof.position.set(0, 3.75, -11.5);
    cabinRoof.castShadow = true;
    shopGroup.add(cabinRoof);

    // 2. High-Resolution "ABDUL KI DUKAAN" Illuminated Signboard Canvas Texture
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024;
    signCanvas.height = 256;
    const sctx = signCanvas.getContext('2d');

    // Rich Emerald Green Lacquer Ground with Golden Borders
    sctx.fillStyle = '#064e3b';
    sctx.fillRect(0, 0, 1024, 256);

    const sGrad = sctx.createLinearGradient(0, 0, 1024, 256);
    sGrad.addColorStop(0, '#047857');
    sGrad.addColorStop(0.5, '#065f46');
    sGrad.addColorStop(1, '#022c22');
    sctx.fillStyle = sGrad;
    sctx.fillRect(8, 8, 1008, 240);

    // Double Ornate Gold Filigree Border
    sctx.strokeStyle = '#fbbf24';
    sctx.lineWidth = 10;
    sctx.strokeRect(12, 12, 1000, 232);

    sctx.strokeStyle = '#f59e0b';
    sctx.lineWidth = 4;
    sctx.strokeRect(24, 24, 976, 208);

    // Top Line: Sanskrit / Hindi Auspicious Blessing
    sctx.fillStyle = '#fde047';
    sctx.font = 'bold 28px "Tiro Devanagari Sanskrit", serif, sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('॥ ऑल इन वन जनरल स्टोर • गोकुलधाम ॥', 512, 60);

    // Main Inscription: "ABDUL KI DUKAAN"
    sctx.font = '900 66px "Playfair Display", Georgia, serif';
    sctx.fillStyle = '#1e1b4b'; // Drop shadow
    sctx.fillText('ABDUL KI DUKAAN', 514, 138);

    const goldTextGrad = sctx.createLinearGradient(0, 85, 0, 145);
    goldTextGrad.addColorStop(0, '#ffffff');
    goldTextGrad.addColorStop(0.2, '#fef08a');
    goldTextGrad.addColorStop(0.7, '#facc15');
    goldTextGrad.addColorStop(1, '#d97706');
    sctx.fillStyle = goldTextGrad;
    sctx.fillText('ABDUL KI DUKAAN', 512, 136);

    // Sub-Label: Soda, Sweets & Crackers
    sctx.fillStyle = '#fef08a';
    sctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    sctx.fillText('🥤 CHILLED SODA • MITHAI • PATAKHE • DIYAS 🪔', 512, 196);

    const abdulSignTex = new THREE.CanvasTexture(signCanvas);
    abdulSignTex.anisotropy = 4;

    const abdulSignMat = new THREE.MeshStandardMaterial({
      map: abdulSignTex,
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0x064e3b,
      emissiveIntensity: 0.42
    });

    // 2a. Primary South-Facing Sign (Mounted above shop front facing road/courtyard)
    const signBoardSouth = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 1.1, 0.12),
      this.materials.darkWood
    );
    signBoardSouth.position.set(0, 4.45, -9.28);
    shopGroup.add(signBoardSouth);

    const signFaceSouth = new THREE.Mesh(new THREE.PlaneGeometry(3.68, 0.98), abdulSignMat);
    signFaceSouth.position.set(0, 4.45, -9.21);
    shopGroup.add(signFaceSouth);

    // Decorative Kalash atop sign
    const signKalash = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.5, 8),
      this.materials.templeGoldKalash
    );
    signKalash.position.set(0, 5.25, -9.28);
    shopGroup.add(signKalash);

    // 2b. West-Facing Approach Sign (Angled so player approaching from outside gate sees it directly)
    const signBoardWest = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.95, 2.6),
      this.materials.darkWood
    );
    signBoardWest.position.set(-2.06, 4.45, -10.5);
    shopGroup.add(signBoardWest);

    const signFaceWest = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.88), abdulSignMat);
    signFaceWest.position.set(-2.13, 4.45, -10.5);
    signFaceWest.rotation.y = -Math.PI / 2;
    shopGroup.add(signFaceWest);

    // 2c. Elevated 45° Rooftop Marquee Beacon (Faces SW, visible from outside & inside gate)
    const marqueeAngled = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.85), abdulSignMat);
    marqueeAngled.position.set(-0.75, 4.9, -9.9);
    marqueeAngled.rotation.y = -Math.PI / 6; // 30° angled towards incoming player path
    shopGroup.add(marqueeAngled);

    // 3. Sloped Striped Awning / Canopy (Chhajja)
    const awningW = 3.6;
    const awningD = 1.35;
    const awningCanvas = document.createElement('canvas');
    awningCanvas.width = 512;
    awningCanvas.height = 256;
    const actx = awningCanvas.getContext('2d');
    // TMKOC Green and Cream stripes
    const stripeW = 512 / 8;
    for (let i = 0; i < 8; i++) {
      actx.fillStyle = (i % 2 === 0) ? '#047857' : '#fef3c7';
      actx.fillRect(i * stripeW, 0, stripeW, 256);
    }
    const awningTex = new THREE.CanvasTexture(awningCanvas);
    awningTex.wrapS = THREE.RepeatWrapping;
    awningTex.repeat.set(2, 1);

    const awningMat = new THREE.MeshStandardMaterial({
      map: awningTex,
      roughness: 0.8,
      side: THREE.DoubleSide
    });

    const awningMesh = new THREE.Mesh(new THREE.PlaneGeometry(awningW, awningD), awningMat);
    awningMesh.position.set(0, 2.85, -8.82);
    awningMesh.rotation.x = Math.PI / 4.8; // ~37° downward slope
    shopGroup.add(awningMesh);

    // Awning Support Rods (Wrought Iron / Brass)
    [-awningW / 2 + 0.15, awningW / 2 - 0.15].forEach(rx => {
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6),
        this.materials.lampBrass
      );
      rod.position.set(rx, 2.7, -8.85);
      rod.rotation.x = Math.PI / 4.8;
      shopGroup.add(rod);
    });

    // Marigold Garland Draped on Awning Front
    const valanceY = 2.42;
    const valanceZ = -8.25;
    for (let gx = -awningW / 2 + 0.2; gx <= awningW / 2 - 0.2; gx += 0.25) {
      const gBead = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 6, 6),
        Math.random() > 0.5 ? this.materials.marigoldOrange : this.materials.marigoldYellow
      );
      gBead.position.set(gx, valanceY, valanceZ);
      shopGroup.add(gBead);
    }

    // 4. Shop Front Opening, Counter & Shelves
    // Service bay recess
    const bayRecess = new THREE.Mesh(
      new THREE.BoxGeometry(3.3, 2.1, 0.2),
      this.materials.darkWood
    );
    bayRecess.position.set(0, 1.95, -9.48);
    shopGroup.add(bayRecess);

    // Warm Interior Glow behind counter
    const interiorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 1.8),
      this.materials.windowGlow
    );
    interiorGlow.position.set(0, 2.05, -9.44);
    shopGroup.add(interiorGlow);

    // Sturdy Teak Wood Service Counter
    const counterBody = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 1.0, 0.75),
      this.materials.darkWood
    );
    counterBody.position.set(0, 0.5, -9.05);
    counterBody.castShadow = true;
    counterBody.receiveShadow = true;
    shopGroup.add(counterBody);

    const counterTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.1, 0.9),
      this.materials.goldTrim
    );
    counterTop.position.set(0, 1.05, -9.05);
    shopGroup.add(counterTop);

    // 5. Recognizable Shop Details on Counter
    // (a) Row of Abdul's Famous Soda Bottles (Green Jeera, Yellow Nimbu, Red Rose)
    const bottleColors = [
      0x10b981, 0x10b981, // Masala Jeera Soda
      0xfacc15, 0xfacc15, // Fresh Nimbu Lemon Soda
      0xef4444, 0xef4444, // Sweet Rose Sharbat
      0x10b981, 0xfacc15
    ];
    bottleColors.forEach((bColor, bi) => {
      const bottleMat = new THREE.MeshStandardMaterial({
        color: bColor,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88
      });
      const bottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.055, 0.28, 8),
        bottleMat
      );
      const bx = -1.2 + bi * 0.18;
      bottle.position.set(bx, 1.24, -9.0);
      shopGroup.add(bottle);

      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6),
        this.materials.lampBrass
      );
      cap.position.set(bx, 1.4, -9.0);
      shopGroup.add(cap);
    });

    // (b) Sweet & Candy Glass Jars with Brass Lids
    [-1.4, 1.0, 1.35].forEach(jx => {
      const jarMat = new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.15,
        transparent: true,
        opacity: 0.85
      });
      const jar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.32, 8),
        jarMat
      );
      jar.position.set(jx, 1.26, -9.1);
      shopGroup.add(jar);

      const jarLid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.06, 8),
        this.materials.lampBrass
      );
      jarLid.position.set(jx, 1.44, -9.1);
      shopGroup.add(jarLid);
    });

    // (c) Stack of Newspapers ("Gokuldham Samachar")
    const newspaper = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.12, 0.28),
      this.materials.curbStone
    );
    newspaper.position.set(0.65, 1.16, -9.05);
    shopGroup.add(newspaper);

    // (d) Pair of Earthen Clay Diyas on Counter Ends
    [-1.6, 1.6].forEach(dx => {
      const diya = this.createClayDiya(dx, 1.1, -9.05);
      shopGroup.add(diya);
    });

    // 6. Cozy Golden Shop Lantern & Point Light Under Awning
    const hangingLantern = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.24, 0),
      this.materials.windowGlow
    );
    hangingLantern.position.set(0, 2.38, -8.65);
    shopGroup.add(hangingLantern);

    const lanternChain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6),
      this.materials.lampBrass
    );
    lanternChain.position.set(0, 2.65, -8.65);
    shopGroup.add(lanternChain);

    const shopPointLight = new THREE.PointLight(0xffb703, 1.9, 9.5);
    shopPointLight.position.set(0, 2.35, -8.65);
    shopGroup.add(shopPointLight);

    gateGroup.add(shopGroup);

    // Register Direct Shop Counter Interaction Target in World3D
    if (this.world3D && this.world3D.interactiveTargets) {
      this.world3D.interactiveTargets.push({
        id: 'abdul_shop_gate_counter',
        name: "Abdul's All-in-One Store (अब्दुल की दुकान)",
        type: 'shop',
        is3D: true,
        x: -48.0,
        z: -9.0,
        radius: 4.8,
        prompt: "Press [E] to Visit Abdul's All-in-One Store"
      });
    }

    // -------------------------------------------------------------
    // G. COLLIDERS (Left Pillar, Right Pillar, and Cabin ONLY)
    // Wide 11.6-meter clear opening (-5.8 to +5.8) is 100% collision-free!
    // -------------------------------------------------------------
    this.world3D.colliders.push({ minX: -50.0, maxX: -46.0, minZ: -9.5, maxZ: -5.8 }); // Left Pillar
    this.world3D.colliders.push({ minX: -50.0, maxX: -46.0, minZ: 5.8, maxZ: 9.5 });   // Right Pillar
    this.world3D.colliders.push({ minX: -50.5, maxX: -45.5, minZ: -14.0, maxZ: -9.2 });// Cabin

    this.exteriorGroup.add(gateGroup);
  }

  // -------------------------------------------------------------
  // HELPER: CREATE DRAPED MARIGOLD GARLANDS IN REALISTIC CATENARY ARCS
  // -------------------------------------------------------------
  createDrapedMarigoldGarlands(parentGroup, attachY, span, beamD) {
    const garlandGroup = new THREE.Group();
    const halfSpan = span / 2 - 0.5;

    // 3 Draped Swag Layers across the underside of the beam
    const swagCount = 4; // 4 graceful drooping swags across the archway
    const swagWidth = span / swagCount;

    for (let s = 0; s < swagCount; s++) {
      const zStart = -halfSpan + s * swagWidth;
      const zEnd = zStart + swagWidth;
      const points = 16;
      const sag = 0.85;

      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const pz = zStart + t * swagWidth;
        // Parabolic catenary sag curve
        const py = attachY - 0.1 - Math.sin(t * Math.PI) * sag;

        // Front face garland bead
        const beadFront = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 6, 6),
          i % 2 === 0 ? this.materials.marigoldOrange : this.materials.marigoldYellow
        );
        beadFront.position.set(-beamD / 2 - 0.08, py, pz);
        garlandGroup.add(beadFront);

        // Back face garland bead
        const beadBack = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 6, 6),
          i % 2 === 0 ? this.materials.marigoldOrange : this.materials.marigoldYellow
        );
        beadBack.position.set(beamD / 2 + 0.08, py, pz);
        garlandGroup.add(beadBack);
      }
    }

    // Vertical Hanging Marigold Tassels (Toran drops) every 1.2m
    for (let tz = -halfSpan + 0.6; tz <= halfSpan - 0.6; tz += 1.25) {
      const dropLen = 0.9 + (Math.abs(tz) % 0.4);
      for (let dy = 0; dy <= dropLen; dy += 0.18) {
        const bead = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 6, 6),
          Math.floor(dy * 10) % 2 === 0 ? this.materials.marigoldOrange : this.materials.marigoldYellow
        );
        bead.position.set(-beamD / 2 - 0.08, attachY - dy - 0.15, tz);
        garlandGroup.add(bead);
      }
    }

    parentGroup.add(garlandGroup);
  }

  // -------------------------------------------------------------
  // HELPER: COLORFUL FESTIVE FABRIC BUNTINGS (JHANDIYAN)
  // -------------------------------------------------------------
  createFestiveFabricBuntings(parentGroup, attachY, span, beamD) {
    const buntingGroup = new THREE.Group();
    const halfSpan = span / 2 - 0.8;
    const buntingColors = [0xef4444, 0xf97316, 0x10b981, 0x3b82f6, 0xa855f7, 0xfacc15];

    let colorIdx = 0;
    for (let z = -halfSpan; z <= halfSpan; z += 0.55) {
      const flagMat = new THREE.MeshStandardMaterial({
        color: buntingColors[colorIdx % buntingColors.length],
        roughness: 0.6,
        side: THREE.DoubleSide
      });
      colorIdx++;

      // Triangular fabric flag
      const flagGeo = new THREE.ConeGeometry(0.24, 0.48, 3);
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.rotation.z = Math.PI;
      flag.position.set(-beamD / 2 - 0.05, attachY - 0.24, z);
      buntingGroup.add(flag);

      // Back side flag
      const flagB = flag.clone();
      flagB.position.x = beamD / 2 + 0.05;
      buntingGroup.add(flagB);
    }

    parentGroup.add(buntingGroup);
  }

  // -------------------------------------------------------------
  // HELPER: WARM GOLDEN FAIRY LIGHT STRINGS ON GATE & PILLARS
  // -------------------------------------------------------------
  createFairyLightStringsOnGate(parentGroup, beamY, span, beamD, pillarDist) {
    const fairyGroup = new THREE.Group();
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xfacc15,
      emissiveIntensity: 2.5,
      roughness: 0.2
    });

    // Fairy light swags across horizontal beam
    const halfSpan = span / 2;
    for (let z = -halfSpan; z <= halfSpan; z += 0.4) {
      const swagSag = Math.sin((z + halfSpan) / span * Math.PI * 4) * 0.35;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), lightMat);
      bulb.position.set(-beamD / 2 - 0.12, beamY + swagSag, z);
      fairyGroup.add(bulb);
    }

    // Spiral fairy lights wrapping each pillar
    [-pillarDist, pillarDist].forEach(pz => {
      for (let y = 1.0; y <= 8.5; y += 0.25) {
        const angle = y * 2.5;
        const lx = Math.cos(angle) * 1.35;
        const lz = pz + Math.sin(angle) * 1.35;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), lightMat);
        bulb.position.set(lx, y, lz);
        fairyGroup.add(bulb);
      }
    });

    parentGroup.add(fairyGroup);
  }

  // -------------------------------------------------------------
  // HELPER: HANGING AKASH KANDIL PAPER LANTERN
  // -------------------------------------------------------------
  buildHangingAkashKandil() {
    const kandilGroup = new THREE.Group();

    // Brass chain suspension
    const chain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.8, 6),
      this.materials.lampBrass
    );
    chain.position.y = -0.4;
    kandilGroup.add(chain);

    // Glowing Lantern Body (Warm Orange-Red Paper)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 2.2,
      roughness: 0.3
    });

    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      bodyMat
    );
    core.position.y = -1.1;
    kandilGroup.add(core);

    // Hanging decorative paper streamers
    const streamerColors = [0xfacc15, 0xef4444, 0x3b82f6, 0x10b981];
    streamerColors.forEach((col, idx) => {
      const strMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.5, side: THREE.DoubleSide });
      const streamer = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.85), strMat);
      const angle = (idx / streamerColors.length) * Math.PI * 2;
      streamer.position.set(Math.cos(angle) * 0.25, -1.8, Math.sin(angle) * 0.25);
      kandilGroup.add(streamer);
    });

    return kandilGroup;
  }

  // -------------------------------------------------------------
  // HELPER: CIRCULAR FLORAL RANGOLI MESH
  // -------------------------------------------------------------
  createPillarRangoli(x, y, z, radius = 2.0) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256;
    const cy = 256;

    // Concentric floral rangoli pattern
    ctx.clearRect(0, 0, 512, 512);

    // Outer Petals (Crimson & Yellow)
    const petals = 12;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * 160, cy + Math.sin(angle) * 160, 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mid Circle (Marigold Orange)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.fill();

    // Inner Star (Gold)
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    // Center Diya Base
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: 0.5
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  // -------------------------------------------------------------
  // HELPER: EARTHEN CLAY DIYA WITH FLICKERING FLAME
  // -------------------------------------------------------------
  createClayDiya(x, y, z) {
    const diyaGroup = new THREE.Group();
    diyaGroup.position.set(x, y, z);

    // Terracotta Bowl
    const bowl = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.12, 8),
      new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.85 })
    );
    bowl.rotation.x = Math.PI;
    diyaGroup.add(bowl);

    // Glowing Flame Core
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 6, 6),
      this.materials.lampGlow
    );
    flame.scale.set(0.6, 1.6, 0.6);
    flame.position.y = 0.12;
    diyaGroup.add(flame);

    return diyaGroup;
  }

  // -----------------------------------------------------------------
  // 2. SOCIETY NOTICEBOARD & FESTIVAL SCHEDULE
  // -----------------------------------------------------------------
  buildSocietyNoticeboard() {
    const nbGroup = new THREE.Group();
    // Positioned near Central Chowk Garden
    nbGroup.position.set(-18.0, 0, 8.0);
    nbGroup.rotation.y = -Math.PI / 4;

    // Wooden Posts
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.5, 8);
    const postMat = this.matTeak;

    const leftPost = new THREE.Mesh(postGeo, postMat);
    leftPost.position.set(-1.8, 1.75, 0);
    nbGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, postMat);
    rightPost.position.set(1.8, 1.75, 0);
    nbGroup.add(rightPost);

    // Board Backing & Frame
    const boardBack = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 2.4, 0.2),
      this.matWoodPolished
    );
    boardBack.position.set(0, 2.3, 0);
    nbGroup.add(boardBack);

    // Small Tiled Roof over Notice Board
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.3, 0.9),
      this.materials.roofTile
    );
    roof.position.set(0, 3.6, 0);
    roof.rotation.x = 0.2;
    nbGroup.add(roof);

    // Canvas Texture for Noticeboard
    const nbCanvas = document.createElement('canvas');
    nbCanvas.width = 512;
    nbCanvas.height = 320;
    const ctx = nbCanvas.getContext('2d');

    ctx.fillStyle = '#fef3c7'; // Parchment
    ctx.fillRect(0, 0, 512, 320);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 308);

    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📋 GOKUL KUNJ NOTICE BOARD', 256, 42);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DIWALI UTSAV 2026 - EVENT SCHEDULE', 256, 75);

    ctx.textAlign = 'left';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('• 09:00 AM: Courtyard Floral Rangoli Competition', 25, 120);
    ctx.fillText('• 06:00 PM: Shree Mandir Maha Lakshmi Puja & Aarti', 25, 155);
    ctx.fillText('• 07:30 PM: Community Hall Sweets & Cultural Program', 25, 190);
    ctx.fillText('• 08:30 PM: Grand Society Fireworks & Sky Lanterns', 25, 225);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold italic 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('- Aatmaram Tukaram Bhide (Society Secretary)', 25, 280);

    const nbTex = new THREE.CanvasTexture(nbCanvas);
    const nbMat = new THREE.MeshStandardMaterial({
      map: nbTex,
      roughness: 0.5
    });

    const nbPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.1), nbMat);
    nbPlane.position.set(0, 2.3, 0.12);
    nbGroup.add(nbPlane);

    // Decorative Brass Diya at base
    const diya = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.15, 0.2, 8),
      this.materials.lampBrass
    );
    diya.position.set(0, 0.2, 0.4);
    nbGroup.add(diya);

    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 6, 6),
      this.materials.lampGlow
    );
    flame.position.set(0, 0.35, 0.4);
    nbGroup.add(flame);

    // Register Interactive Target for Noticeboard
    this.world3D.interactiveTargets.push({
      id: 'society_noticeboard',
      name: 'Society Noticeboard',
      type: 'society_noticeboard',
      x: -18.0,
      z: 8.0,
      radius: 3.5,
      prompt: '[E] Read Society Noticeboard & Schedule',
      data: { title: 'Gokul Kunj Co-op Housing Society Notice' }
    });

    this.exteriorGroup.add(nbGroup);
  }

  // -----------------------------------------------------------------
  // 3. WING SIGNS & RESIDENTIAL NAMEPLATES
  // -----------------------------------------------------------------
  buildWingSignsAndNameplates() {
    // Wing Signboards
    const wingDefs = [
      { name: 'WING A - RESIDENCES', x: -59.0, y: 8.5, z: -27.0, rotY: 0 },
      { name: 'WING B - RESIDENCES', x: -24.5, y: 8.5, z: -27.0, rotY: 0 },
      { name: 'WING C - RESIDENCES', x: 10.5, y: 8.5, z: -27.0, rotY: 0 },
      { name: 'WING D - PATEL NIWAS', x: -59.0, y: 8.5, z: 22.0, rotY: Math.PI },
      { name: 'WING E - WRITER & RESIDENCES', x: -24.5, y: 8.5, z: 22.0, rotY: Math.PI },
      { name: 'WING F - SODHI & IYER HOMES', x: 10.5, y: 8.5, z: 22.0, rotY: Math.PI }
    ];

    wingDefs.forEach(w => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 96;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 96);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, 504, 88);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(w.name, 256, 62);

      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0x1e293b, emissiveIntensity: 0.4 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 0.95), mat);
      mesh.position.set(w.x, w.y, w.z);
      mesh.rotation.y = w.rotY;
      this.exteriorGroup.add(mesh);
    });

    // Nameplates on ground floor doors:
    // 1. Patel Niwas (Gada Home) Door: x: -59, z: 22
    this.createDoorNameplate(-59.0, 2.8, 22.6, Math.PI, '🏠 PATEL NIWAS (GADA HOME)');
    // 2. Secretary Bhide Office & Home Door: x: -24.5, z: -25
    this.createDoorNameplate(-24.5, 2.8, -25.6, 0, '🏠 AATMARAM T. BHIDE (SECRETARY)');
  }

  createDoorNameplate(x, y, z, rotY, text) {
    const c = document.createElement('canvas');
    c.width = 384;
    c.height = 96;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 384, 96);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 376, 88);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 192, 58);

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotY;
    this.exteriorGroup.add(mesh);
  }

  // -----------------------------------------------------------------
  // 4. COURTYARD GARDEN BENCHES & POTTED GREENERY
  // -----------------------------------------------------------------
  buildCourtyardGardenBenches() {
    const benchPositions = [
      { x: -32.0, z: -10.0, rotY: 0 },
      { x: -16.0, z: -10.0, rotY: 0 },
      { x: -32.0, z: 4.0, rotY: Math.PI },
      { x: -16.0, z: 4.0, rotY: Math.PI }
    ];

    benchPositions.forEach((b, idx) => {
      const bench = new THREE.Group();
      bench.position.set(b.x, 0, b.z);
      bench.rotation.y = b.rotY;

      // Cast iron legs
      const legGeo = new THREE.BoxGeometry(0.12, 0.8, 1.0);
      const legMat = this.matWoodPolished;
      const legL = new THREE.Mesh(legGeo, legMat);
      legL.position.set(-1.1, 0.4, 0);
      bench.add(legL);

      const legR = new THREE.Mesh(legGeo, legMat);
      legR.position.set(1.1, 0.4, 0);
      bench.add(legR);

      // Wooden Slats Seat
      const seatGeo = new THREE.BoxGeometry(2.6, 0.1, 0.9);
      const seat = new THREE.Mesh(seatGeo, this.matTeak);
      seat.position.set(0, 0.82, 0);
      bench.add(seat);

      // Wooden Backrest
      const backGeo = new THREE.BoxGeometry(2.6, 0.6, 0.1);
      const back = new THREE.Mesh(backGeo, this.matTeak);
      back.position.set(0, 1.25, -0.4);
      bench.add(back);

      this.exteriorGroup.add(bench);

      // Register Interactive Target for Sitting on Bench
      if (this.world3D && this.world3D.interactiveTargets) {
        // Seat position offset slightly back towards backrest
        const seatLocalZ = -0.1;
        const seatX = b.x + Math.sin(b.rotY) * seatLocalZ;
        const seatZ = b.z + Math.cos(b.rotY) * seatLocalZ;

        this.world3D.interactiveTargets.push({
          id: `society_bench_${idx}`,
          name: `Courtyard Garden Bench ${idx + 1}`,
          type: 'society_bench',
          x: b.x,
          z: b.z,
          radius: 3.2,
          is3D: true,
          prompt: '[E] Sit on Courtyard Bench',
          data: {
            benchIndex: idx,
            seatX: seatX,
            seatZ: seatZ,
            seatY: 0.82,
            rotY: b.rotY
          }
        });
      }
    });
  }

  // -----------------------------------------------------------------
  // 5. COMMUNITY HALL (SAMUDAYIK BHAVAN) - EXTERIOR & INTERIOR
  // -----------------------------------------------------------------
  buildCommunityHall() {
    const hallGroup = new THREE.Group();
    // Located at South-East Promenade (x: 24, z: 38)
    hallGroup.position.set(24.0, 0, 38.0);

    const hallW = 18.0;
    const hallD = 14.0;
    const hallH = 6.5;

    // Exterior Walls (Rose Sandstone & Terracotta Trim)
    const wallGeo = new THREE.BoxGeometry(hallW, hallH, hallD);
    const wallMat = this.materials.sandstoneWall;
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = hallH / 2;
    hallGroup.add(walls);

    // Ornate Roof Cornice
    const roofCornice = new THREE.Mesh(
      new THREE.BoxGeometry(hallW + 1.2, 0.6, hallD + 1.2),
      this.materials.terracottaWall
    );
    roofCornice.position.y = hallH + 0.3;
    hallGroup.add(roofCornice);

    // Front Entrance Portico & Pillars
    const porticoGeo = new THREE.BoxGeometry(6.5, 0.5, 3.2);
    const portico = new THREE.Mesh(porticoGeo, this.materials.goldTrim);
    portico.position.set(0, 4.2, -hallD / 2 - 1.6);
    hallGroup.add(portico);

    [-2.8, 2.8].forEach(px => {
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 4.2, 10),
        this.materials.sandstoneWall
      );
      pillar.position.set(px, 2.1, -hallD / 2 - 2.8);
      hallGroup.add(pillar);
    });

    // Double Glass Entrance Doors
    const doorGeo = new THREE.PlaneGeometry(3.6, 3.2);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.75
    });
    const doors = new THREE.Mesh(doorGeo, doorMat);
    doors.position.set(0, 1.6, -hallD / 2 - 0.05);
    doors.rotation.y = Math.PI;
    hallGroup.add(doors);

    // Community Hall Signboard
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#831843'; // Deep festive rose
    ctx.fillRect(0, 0, 1024, 256);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, 1008, 240);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 50px "Cinzel Decorative", serif, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('गोकुल कुंज सामुदायिक भवन', 512, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('GOKUL KUNJ COMMUNITY HALL', 512, 155);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'italic 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✨ Samast Parivar Deepawali Sneha Sammelan ✨', 512, 215);

    const signTex = new THREE.CanvasTexture(c);
    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      emissive: 0x831843,
      emissiveIntensity: 0.35
    });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.5), signMat);
    signMesh.position.set(0, 5.0, -hallD / 2 - 1.62);
    hallGroup.add(signMesh);

    // Add Hall Collider for exterior
    this.world3D.colliders.push({
      minX: 24.0 - hallW / 2,
      maxX: 24.0 + hallW / 2,
      minZ: 38.0 - hallD / 2,
      maxZ: 38.0 + hallD / 2
    });

    // Register Door Interaction Target
    this.world3D.interactiveTargets.push({
      id: 'community_hall_door',
      name: 'Community Hall Entrance',
      type: 'community_hall_door',
      x: 24.0,
      z: 38.0 - hallD / 2 - 2.8,
      radius: 3.5,
      prompt: '[E] Enter Community Hall (Samudayik Bhavan)',
      data: { targetInterior: 'community_hall' }
    });

    this.exteriorGroup.add(hallGroup);

    // BUILD THE DETAILED 3D COMMUNITY HALL INTERIOR
    this.buildCommunityHallInterior();
  }

  buildCommunityHallInterior() {
    // Interior Room positioned in a dedicated interior coordinate space (e.g. x: 120, z: 120)
    const interior = new THREE.Group();
    interior.position.set(120, 0, 120);

    const roomW = 24.0;
    const roomD = 18.0;
    const roomH = 6.0;

    // Floor (Polished White Marble Tiles)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomW, roomD),
      this.matMarbleWhite
    );
    floor.rotation.x = -Math.PI / 2;
    interior.add(floor);

    // Decorative Red & Gold Central Carpet
    const carpet = new THREE.Mesh(
      new THREE.PlaneGeometry(roomW - 4.0, 4.5),
      this.matCarpetRed
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.02, 0);
    interior.add(carpet);

    // Interior Walls (Cream & Festive Saffron trim)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), this.matWallInteriorCream);
    backWall.position.set(0, roomH / 2, roomD / 2);
    backWall.rotation.y = Math.PI;
    interior.add(backWall);

    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), this.matWallInteriorCream);
    frontWall.position.set(0, roomH / 2, -roomD / 2);
    interior.add(frontWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), this.matWallInteriorCream);
    leftWall.position.set(-roomW / 2, roomH / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    interior.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), this.matWallInteriorCream);
    rightWall.position.set(roomW / 2, roomH / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    interior.add(rightWall);

    // Ceiling with Chandeliers
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), this.matWallInteriorCream);
    ceiling.position.y = roomH;
    ceiling.rotation.x = Math.PI / 2;
    interior.add(ceiling);

    // Chandeliers
    [-6, 6].forEach(cx => {
      const chandelier = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8, 1),
        this.materials.templeGoldKalash
      );
      chandelier.position.set(cx, roomH - 1.2, 0);
      interior.add(chandelier);
    });

    // FESTIVE STAGE AT THE BACK WALL
    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(14.0, 0.6, 5.0),
      this.matWoodPolished
    );
    stage.position.set(0, 0.3, roomD / 2 - 3.2);
    interior.add(stage);

    // Stage Backdrop Banner: "SHUBH DEEPAWALI - GOKUL KUNJ SAMAST PARIVAR"
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 1024;
    bannerCanvas.height = 320;
    const bctx = bannerCanvas.getContext('2d');
    bctx.fillStyle = '#991b1b';
    bctx.fillRect(0, 0, 1024, 320);
    bctx.strokeStyle = '#fde047';
    bctx.lineWidth = 14;
    bctx.strokeRect(10, 10, 1004, 300);

    bctx.fillStyle = '#fde047';
    bctx.font = 'bold 56px "Cinzel Decorative", serif, sans-serif';
    bctx.textAlign = 'center';
    bctx.fillText('✨ शुभ दीपावली ✨', 512, 90);

    bctx.fillStyle = '#ffffff';
    bctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
    bctx.fillText('GOKUL KUNJ SAMAST PARIVAR', 512, 160);

    bctx.fillStyle = '#fef08a';
    bctx.font = '32px "Plus Jakarta Sans", sans-serif';
    bctx.fillText('Diwali Sneh Milan & Maha Lakshmi Pujan 2026', 512, 230);

    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    const bannerMat = new THREE.MeshStandardMaterial({ map: bannerTex, emissive: 0x991b1b, emissiveIntensity: 0.35 });
    const bannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(12.0, 3.2), bannerMat);
    bannerMesh.position.set(0, 3.4, roomD / 2 - 0.05);
    bannerMesh.rotation.y = Math.PI;
    interior.add(bannerMesh);

    // Banquet Sweets Table on Stage
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(6.0, 0.8, 1.4),
      this.matTeak
    );
    table.position.set(0, 0.8 + 0.4, roomD / 2 - 3.2);
    interior.add(table);

    // Traditional Sweet Trays on Table (Laddoo, Kaju Katli, Jalebi)
    [-1.8, 0, 1.8].forEach((tx, idx) => {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.4, 0.08, 16),
        this.materials.lampBrass
      );
      plate.position.set(tx, 1.25, roomD / 2 - 3.2);
      interior.add(plate);

      const sweetColor = idx === 0 ? 0xf59e0b : idx === 1 ? 0xf8fafc : 0xea580c;
      const sweet = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 8, 8),
        new THREE.MeshStandardMaterial({ color: sweetColor, roughness: 0.3 })
      );
      sweet.position.set(tx, 1.45, roomD / 2 - 3.2);
      interior.add(sweet);
    });

    // Seating Chairs in the Audience
    for (let r = -2; r <= 2; r++) {
      for (let c = -4; c <= 4; c++) {
        if (Math.abs(c) < 1.5) continue; // Walkway aisle
        const chair = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.85, 0.7),
          this.matFabricMaroon
        );
        chair.position.set(c * 1.5, 0.42, r * 1.8 - 1.5);
        interior.add(chair);
      }
    }

    // EXIT DOOR INTERACTIVE TARGET
    const exitDoor = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 3.2),
      this.matWoodPolished
    );
    exitDoor.position.set(0, 1.6, -roomD / 2 + 0.05);
    interior.add(exitDoor);

    this.world3D.interactiveTargets.push({
      id: 'community_hall_exit',
      name: 'Community Hall Exit Door',
      type: 'interior_exit',
      x: 120,
      z: 120 - roomD / 2 + 1.2,
      radius: 3.0,
      prompt: '[E] Exit to Society Courtyard',
      data: { targetExterior: 'courtyard' }
    });

    this.interiorsGroup.add(interior);
  }

  // -----------------------------------------------------------------
  // 6. ACCESSIBLE APARTMENT INTERIORS
  // -----------------------------------------------------------------
  buildApartmentInteriors() {
    // -------------------------------------------------------------
    // INTERIOR 1: PATEL NIWAS (GADA FAMILY LIVING ROOM)
    // -------------------------------------------------------------
    const patelRoom = new THREE.Group();
    patelRoom.position.set(180, 0, 120);

    const pW = 16.0;
    const pD = 12.0;
    const pH = 5.0;

    // Floor
    const pFloor = new THREE.Mesh(new THREE.PlaneGeometry(pW, pD), this.matFloorTiles);
    pFloor.rotation.x = -Math.PI / 2;
    patelRoom.add(pFloor);

    // Walls
    const pBack = new THREE.Mesh(new THREE.PlaneGeometry(pW, pH), this.matWallInteriorCream);
    pBack.position.set(0, pH / 2, pD / 2);
    pBack.rotation.y = Math.PI;
    patelRoom.add(pBack);

    const pFront = new THREE.Mesh(new THREE.PlaneGeometry(pW, pH), this.matWallInteriorCream);
    pFront.position.set(0, pH / 2, -pD / 2);
    patelRoom.add(pFront);

    const pLeft = new THREE.Mesh(new THREE.PlaneGeometry(pD, pH), this.matWallInteriorCream);
    pLeft.position.set(-pW / 2, pH / 2, 0);
    pLeft.rotation.y = Math.PI / 2;
    patelRoom.add(pLeft);

    const pRight = new THREE.Mesh(new THREE.PlaneGeometry(pD, pH), this.matWallInteriorCream);
    pRight.position.set(pW / 2, pH / 2, 0);
    pRight.rotation.y = -Math.PI / 2;
    patelRoom.add(pRight);

    // Traditional Gujarati Wooden Jhula (Swing)
    const swingGroup = new THREE.Group();
    swingGroup.position.set(-4.5, 0, 0);

    // Brass chains
    [-1.2, 1.2].forEach(sx => {
      const chain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 3.2, 6),
        this.materials.lampBrass
      );
      chain.position.set(sx, 2.8, 0);
      swingGroup.add(chain);
    });

    // Carved Wooden Swing Seat
    const swingSeat = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.25, 1.2),
      this.matWoodPolished
    );
    swingSeat.position.set(0, 1.2, 0);
    swingGroup.add(swingSeat);

    // Silk Cushion on Jhula
    const swingCushion = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.15, 1.0),
      this.matFabricGold
    );
    swingCushion.position.set(0, 1.35, 0);
    swingGroup.add(swingCushion);

    patelRoom.add(swingGroup);

    // Traditional Carved Sofa Set (3-seater & Coffee Table)
    const sofa = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1.2, 1.4),
      this.matFabricMaroon
    );
    sofa.position.set(2.5, 0.6, 3.5);
    patelRoom.add(sofa);

    const teaTable = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.6, 1.4),
      this.matWoodPolished
    );
    teaTable.position.set(2.5, 0.3, 1.2);
    patelRoom.add(teaTable);

    // Diwali Mithai Box on Tea Table
    const mithaiBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.15, 0.6),
      this.materials.goldTrim
    );
    mithaiBox.position.set(2.5, 0.68, 1.2);
    patelRoom.add(mithaiBox);

    // Home Mandir (Temple Altar) in Northeast Corner
    const mandir = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.4, 1.0),
      this.materials.goldTrim
    );
    mandir.position.set(pW / 2 - 1.2, 1.2, pD / 2 - 1.2);
    patelRoom.add(mandir);

    // Diya in Mandir
    const mandirDiya = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 6, 6),
      this.materials.lampGlow
    );
    mandirDiya.position.set(pW / 2 - 1.2, 1.5, pD / 2 - 0.7);
    patelRoom.add(mandirDiya);

    // Television & Living Room Cabinet
    const tvUnit = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.0, 0.8),
      this.matWoodPolished
    );
    tvUnit.position.set(2.5, 0.5, -pD / 2 + 0.6);
    patelRoom.add(tvUnit);

    const tvScreen = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.5, 0.1),
      this.matBlackboard
    );
    tvScreen.position.set(2.5, 1.8, -pD / 2 + 0.6);
    patelRoom.add(tvScreen);

    // Exit Door
    const pExit = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.0), this.matWoodPolished);
    pExit.position.set(-pW / 2 + 1.2, 1.5, -pD / 2 + 0.05);
    patelRoom.add(pExit);

    // Register Entry Target (Outside at Wing D / Patel Niwas Door)
    this.world3D.interactiveTargets.push({
      id: 'patel_niwas_door',
      name: 'Patel Niwas (Gada Home) Entrance',
      type: 'apartment_door',
      x: -59.0,
      z: 22.0 + 3.0,
      radius: 3.5,
      prompt: '[E] Enter Patel Niwas (Gada Living Room)',
      data: { targetInterior: 'patel_niwas' }
    });

    // Register Exit Target (Inside Patel Niwas)
    this.world3D.interactiveTargets.push({
      id: 'patel_niwas_exit',
      name: 'Patel Niwas Exit Door',
      type: 'interior_exit',
      x: 180 - pW / 2 + 1.2,
      z: 120 - pD / 2 + 1.5,
      radius: 3.0,
      prompt: '[E] Exit to Society Courtyard',
      data: { targetExterior: 'courtyard_wing_d' }
    });

    this.interiorsGroup.add(patelRoom);

    // -------------------------------------------------------------
    // INTERIOR 2: SECRETARY BHIDE OFFICE & STUDY
    // -------------------------------------------------------------
    const bhideRoom = new THREE.Group();
    bhideRoom.position.set(240, 0, 120);

    const bW = 14.0;
    const bD = 10.0;
    const bH = 4.8;

    // Floor
    const bFloor = new THREE.Mesh(new THREE.PlaneGeometry(bW, bD), this.matFloorTiles);
    bFloor.rotation.x = -Math.PI / 2;
    bhideRoom.add(bFloor);

    // Walls
    const bBack = new THREE.Mesh(new THREE.PlaneGeometry(bW, bH), this.matWallInteriorCream);
    bBack.position.set(0, bH / 2, bD / 2);
    bBack.rotation.y = Math.PI;
    bhideRoom.add(bBack);

    const bFront = new THREE.Mesh(new THREE.PlaneGeometry(bW, bH), this.matWallInteriorCream);
    bFront.position.set(0, bH / 2, -bD / 2);
    bhideRoom.add(bFront);

    const bLeft = new THREE.Mesh(new THREE.PlaneGeometry(bD, bH), this.matWallInteriorCream);
    bLeft.position.set(-bW / 2, bH / 2, 0);
    bLeft.rotation.y = Math.PI / 2;
    bhideRoom.add(bLeft);

    const bRight = new THREE.Mesh(new THREE.PlaneGeometry(bD, bH), this.matWallInteriorCream);
    bRight.position.set(bW / 2, bH / 2, 0);
    bRight.rotation.y = -Math.PI / 2;
    bhideRoom.add(bRight);

    // BHIDE'S SUVICHAR BLACKBOARD
    const bbCanvas = document.createElement('canvas');
    bbCanvas.width = 512;
    bbCanvas.height = 256;
    const bbctx = bbCanvas.getContext('2d');
    bbctx.fillStyle = '#1e293b'; // Slate Blackboard
    bbctx.fillRect(0, 0, 512, 256);
    bbctx.strokeStyle = '#94a3b8';
    bbctx.lineWidth = 8;
    bbctx.strokeRect(6, 6, 500, 244);

    bbctx.fillStyle = '#fde047';
    bbctx.font = 'bold 28px "Tiro Devanagari Sanskrit", serif, sans-serif';
    bbctx.textAlign = 'center';
    bbctx.fillText('॥ आज का सुविचार ॥', 256, 50);

    bbctx.fillStyle = '#ffffff';
    bbctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    bbctx.fillText('"दीपावली का पावन पर्व समाज में अनुशासन,', 256, 110);
    bbctx.fillText('प्रेम और स्वच्छता का संदेश देता है।"', 256, 150);

    bbctx.fillStyle = '#67e8f9';
    bbctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
    bbctx.fillText('- आत्माराम तुकाराम भिड़े (एकमेव सेक्रेटरी)', 256, 215);

    const bbTex = new THREE.CanvasTexture(bbCanvas);
    const bbMat = new THREE.MeshStandardMaterial({ map: bbTex, roughness: 0.8 });
    const bbMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.4), bbMat);
    bbMesh.position.set(0, 2.6, bD / 2 - 0.05);
    bbMesh.rotation.y = Math.PI;
    bhideRoom.add(bbMesh);

    // Secretary's Desk & Chair
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.85, 1.6),
      this.matTeak
    );
    desk.position.set(0, 0.42, 1.8);
    bhideRoom.add(desk);

    // Society Files Ledger & Spectacles on Desk
    const ledger = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.1, 0.6),
      this.matFabricMaroon
    );
    ledger.position.set(-0.8, 0.9, 1.8);
    bhideRoom.add(ledger);

    // Bookshelf with Tuition Books
    const bookshelf = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 3.6, 0.8),
      this.matWoodPolished
    );
    bookshelf.position.set(-bW / 2 + 0.6, 1.8, 0);
    bookshelf.rotation.y = Math.PI / 2;
    bhideRoom.add(bookshelf);

    // Exit Door
    const bExit = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.0), this.matWoodPolished);
    bExit.position.set(0, 1.5, -bD / 2 + 0.05);
    bhideRoom.add(bExit);

    // Register Entry Target (Outside at Wing B / Secretary Bhide Door)
    this.world3D.interactiveTargets.push({
      id: 'bhide_niwas_door',
      name: 'Secretary Bhide Office & Home Entrance',
      type: 'apartment_door',
      x: -24.5,
      z: -25.0 - 3.0,
      radius: 3.5,
      prompt: '[E] Enter Secretary Bhide Niwas & Study',
      data: { targetInterior: 'bhide_niwas' }
    });

    // Register Exit Target (Inside Bhide Niwas)
    this.world3D.interactiveTargets.push({
      id: 'bhide_niwas_exit',
      name: 'Bhide Niwas Exit Door',
      type: 'interior_exit',
      x: 240,
      z: 120 - bD / 2 + 1.5,
      radius: 3.0,
      prompt: '[E] Exit to Society Courtyard',
      data: { targetExterior: 'courtyard_wing_b' }
    });

    this.interiorsGroup.add(bhideRoom);
  }

  // -----------------------------------------------------------------
  // 7. SEAMLESS PLAYER INTERIOR / EXTERIOR TRANSITIONS
  // -----------------------------------------------------------------
  enterInterior(interiorId, player3D) {
    if (!player3D) return;

    // Store return exterior location
    this.exteriorPlayerPos = {
      x: player3D.mesh.position.x,
      y: player3D.mesh.position.y,
      z: player3D.mesh.position.z,
      rot: player3D.mesh.rotation.y
    };

    this.currentInterior = interiorId;

    // Toggle visibility for clean interior view
    if (this.interiorsGroup) this.interiorsGroup.visible = true;
    if (this.exteriorGroup) this.exteriorGroup.visible = false;

    if (interiorId === 'community_hall') {
      player3D.mesh.position.set(120, 0, 120 - 6.0);
      player3D.mesh.rotation.y = 0;
    } else if (interiorId === 'patel_niwas') {
      player3D.mesh.position.set(180, 0, 120 - 3.5);
      player3D.mesh.rotation.y = 0;
    } else if (interiorId === 'bhide_niwas') {
      player3D.mesh.position.set(240, 0, 120 - 3.0);
      player3D.mesh.rotation.y = 0;
    }

    if (window.festiveAudio) {
      window.festiveAudio.playDoorBell?.() || window.festiveAudio.playDiyaChime?.();
    }
  }

  exitInterior(player3D) {
    if (!player3D) return;

    // Restore exterior visibility
    if (this.interiorsGroup) this.interiorsGroup.visible = false;
    if (this.exteriorGroup) this.exteriorGroup.visible = true;

    if (this.exteriorPlayerPos) {
      player3D.mesh.position.set(
        this.exteriorPlayerPos.x,
        this.exteriorPlayerPos.y,
        this.exteriorPlayerPos.z
      );
      player3D.mesh.rotation.y = this.exteriorPlayerPos.rot;
    } else {
      // Default fallback near central courtyard
      player3D.mesh.position.set(-24.0, 0, 0);
    }

    this.currentInterior = null;

    if (window.festiveAudio) {
      window.festiveAudio.playDiyaChime?.();
    }
  }
}

window.DiwaliSocietyArchitecture3D = DiwaliSocietyArchitecture3D;
