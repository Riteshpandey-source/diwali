// ===================================================================
// GOKULDHAM SOCIETY GROUND - TMKOC HAPPY DIWALI THEATER STAGE
// Community Cinema Theater with grand decorated stage,
// cinema screen playing TMKOC Happy Diwali Special, seated NPC audience,
// festoon fairy lights, concert speakers, and interactive seating.
// ===================================================================

class DiwaliSocietyTheater3D {
  constructor(world3D) {
    this.world3D = world3D;
    this.scene = world3D.scene;
    this.materials = world3D.materials;

    // Stage Location: Society Ground (East promenade, facing West towards courtyard)
    this.stageX = 35.0;
    this.stageY = 0;
    this.stageZ = -14.0;
    this.rotY = -Math.PI / 2; // Facing West towards audience and courtyard

    // Root Group
    this.group = new THREE.Group();
    this.group.name = 'SocietyGroundTheater';
    this.group.position.set(this.stageX, 0, this.stageZ);
    this.group.rotation.y = this.rotY;

    // Audience NPCs tracking for subtle idle animation
    this.seatedNpcs = [];

    // Screen Canvas & Material
    this.screenCanvas = null;
    this.screenCtx = null;
    this.screenTexture = null;
    this.screenMesh = null;
    this.posterImage = new Image();
    this.posterLoaded = false;

    // Real-Time 3D Screen Video & Particle State
    this.screenSparks = [];
    this.screenFireworks = [];
    this.dialogueIndex = 0;
    this.dialogueTimer = 0;
    this.screenUpdateTimer = 0;
    this.simulatedSeconds = 504; // 08:24
    this.totalSeconds = 1335; // 22:15
    this.screenDialogues = [
      { speaker: 'Daya Ben', text: 'Ae maa mataji! Gokuldham ki Diwali sabse pyaari!' },
      { speaker: 'Jethalal', text: 'Popatlal bhai, patakhe sambhal ke! Bhide master aa jayega!' },
      { speaker: 'Bhide Master', text: 'Main Aatmaram Tukaram Bhide, Gokuldham ka ekmev secretary!' },
      { speaker: 'Popatlal', text: 'Mera patakha sabse aage jayega! Shubh Diwali sabhi ko!' },
      { speaker: 'Taarak Mehta', text: 'Diwali ka yeh paavan parv sabhi ke jeevan mein anand laye!' },
      { speaker: 'Bapuji', text: 'Jetha, sab milkar padosiyo ke sath prem se tyohar manao!' }
    ];

    // Build the complete theater environment
    this.initMaterials();
    this.buildStagePlatform();
    this.buildCinemaScreen();
    this.buildStagePillarsAndCanopy();
    this.buildTheatricalCurtains();
    this.buildConcertSpeakers();
    this.buildFestoonLighting();
    this.buildFlankingBanners();
    this.buildAudienceBenchesAndVisitors();
    this.buildCinemaEntranceArchwayAndMarquee();
    this.buildMoviePosterLightboxes();
    this.buildFloating3DTheaterLabel();
    this.buildDirectionalGuidance();
    this.registerInteractiveTargets();
    this.setupScreenClickHandler();

    this.scene.add(this.group);
  }

  initMaterials() {
    this.matRedCarpet = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.85
    });
    this.matStagePlinth = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.65
    });
    this.matGoldFrame = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.22,
      emissive: 0x78350f,
      emissiveIntensity: 0.2
    });
    this.matMarqueeFascia = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.45,
      metalness: 0.35
    });
    this.matMarqueeBulbOn = new THREE.MeshBasicMaterial({
      color: 0xfffbeb
    });
    this.matMarqueeBulbOff = new THREE.MeshBasicMaterial({
      color: 0x78350f
    });
    this.matVelvetCurtain = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.9,
      side: THREE.DoubleSide
    });
    this.matPillarGold = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.45,
      metalness: 0.35
    });
    this.matSpeakerBox = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.7,
      metalness: 0.1
    });
    this.matSpeakerCone = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
      metalness: 0.4
    });
    this.matBulbGlow = new THREE.MeshBasicMaterial({
      color: 0xffedd5
    });
    this.matMarigoldOrange = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.35,
      roughness: 0.6
    });
    this.matMarigoldYellow = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      roughness: 0.6
    });
  }

  // 1. ELEVATED STAGE PLATFORM WITH STEPS & APRON GARLANDS
  buildStagePlatform() {
    const stageW = 16.5;
    const stageD = 8.5;
    const stageH = 1.1;

    // Main Stage Deck (Elevated Red Carpet Platform)
    const deckGeo = new THREE.BoxGeometry(stageW, stageH, stageD);
    const deck = new THREE.Mesh(deckGeo, this.matRedCarpet);
    deck.position.set(0, stageH / 2, 0);
    deck.receiveShadow = true;
    deck.castShadow = true;
    this.group.add(deck);

    // Front Wooden Fascia Plinth
    const plinthGeo = new THREE.BoxGeometry(stageW + 0.1, 0.25, 0.1);
    const plinth = new THREE.Mesh(plinthGeo, this.matStagePlinth);
    plinth.position.set(0, stageH - 0.125, stageD / 2 + 0.05);
    this.group.add(plinth);

    // Front Access Steps (Center front leading from lawn to stage)
    const stepW = 4.2;
    const stepCount = 3;
    for (let i = 0; i < stepCount; i++) {
      const stepH = stageH / stepCount;
      const stepD = 0.5;
      const sGeo = new THREE.BoxGeometry(stepW, stepH * (i + 1), stepD);
      const step = new THREE.Mesh(sGeo, this.matStagePlinth);
      step.position.set(0, (stepH * (i + 1)) / 2, stageD / 2 + (stepCount - i) * stepD - 0.25);
      this.group.add(step);
    }

    // Dense Marigold Garland Toran along Front Edge of Stage
    const garlandCount = 32;
    const garlandSpan = stageW - 0.4;
    for (let i = 0; i <= garlandCount; i++) {
      const gx = -garlandSpan / 2 + (i / garlandCount) * garlandSpan;
      // Skip steps area in center
      if (Math.abs(gx) < stepW / 2 + 0.2) continue;

      const isYellow = i % 2 === 0;
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 6, 6),
        isYellow ? this.matMarigoldYellow : this.matMarigoldOrange
      );
      const droop = Math.sin((i / 4) * Math.PI) * 0.14;
      flower.position.set(gx, stageH - 0.1 + droop, stageD / 2 + 0.08);
      this.group.add(flower);
    }

    // Glowing Clay Diyas along Front Edge
    const diyaPositions = [-7.2, -5.8, -4.4, -3.0, 3.0, 4.4, 5.8, 7.2];
    diyaPositions.forEach(dx => {
      const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 0.08, 8), this.materials.clayDiya);
      diya.position.set(dx, stageH + 0.04, stageD / 2 - 0.2);
      this.group.add(diya);

      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), this.materials.lampGlow);
      flame.scale.set(0.7, 1.6, 0.7);
      flame.position.set(dx, stageH + 0.12, stageD / 2 - 0.2);
      this.group.add(flame);
    });
  }

  // 2. CINEMA SCREEN WITH TMKOC DIWALI STILL & ANIMATED SCRUBBER
  buildCinemaScreen() {
    const screenW = 10.8;
    const screenH = 6.08; // 16:9 aspect ratio

    // Golden Cinema Beveled Frame
    const frameGeo = new THREE.BoxGeometry(screenW + 0.5, screenH + 0.5, 0.2);
    const frame = new THREE.Mesh(frameGeo, this.matGoldFrame);
    frame.position.set(0, 4.4, 0.5);
    frame.castShadow = true;
    this.group.add(frame);

    // Inner Screen Canvas
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 1280;
    this.screenCanvas.height = 720;
    this.screenCtx = this.screenCanvas.getContext('2d');

    // Draw Initial Festive Standby Graphics
    this.renderScreenTexture(8.4, 22.17);

    // Load High-Res Gokuldham Diwali Celebration Image
    this.posterImage.crossOrigin = 'anonymous';
    this.posterImage.src = 'assets/images/tmkoc_diwali_stage.jpg';
    this.posterImage.onload = () => {
      this.posterLoaded = true;
      this.renderScreenTexture(8.4, 22.17);
      if (this.screenTexture) this.screenTexture.needsUpdate = true;
    };

    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.minFilter = THREE.LinearFilter;
    this.screenTexture.magFilter = THREE.LinearFilter;

    // Cinema Screen Mesh
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.screenTexture,
      toneMapped: false
    });
    const screenPlane = new THREE.PlaneGeometry(screenW, screenH);
    this.screenMesh = new THREE.Mesh(screenPlane, screenMat);
    this.screenMesh.position.set(0, 4.4, 0.61);
    this.screenMesh.name = 'CinemaScreenMesh';
    this.group.add(this.screenMesh);

    // Soft Ambient Projector Glow from Screen onto Stage & Audience
    const projectorLight = new THREE.PointLight(0xfff1dc, 2.8, 26);
    projectorLight.position.set(0, 4.8, 3.5);
    projectorLight.castShadow = false;
    this.group.add(projectorLight);
    if (this.world3D.pointLights) {
      this.world3D.pointLights.push(projectorLight);
    }

    // Auto-bind Persistent Video Element directly on load if present
    const nativeVid = document.getElementById('theaterNativeVideo');
    if (nativeVid) {
      this.bindVideoTexture(nativeVid);
    }
  }

  // Setup Raycasting Click Handler on 3D Cinema Screen (Click Screen to Push / Resume)
  setupScreenClickHandler() {
    const canvas = this.world3D?.renderer?.domElement;
    if (!canvas) return;

    canvas.addEventListener('click', (e) => {
      if (!this.screenMesh || !this.world3D?.camera) return;

      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.world3D.camera);
      const intersects = raycaster.intersectObject(this.screenMesh, false);

      if (intersects.length > 0) {
        // Direct click on the 3D cinema screen toggles Pause (push) / Resume!
        if (window.diwaliTheaterModal) {
          window.diwaliTheaterModal.togglePlayPause();
        }
      }
    });
  }

  // Draw Realistic TMKOC Episode View with Progress Scrubber, Fireworks & Dialogues
  renderScreenTexture(currentSeconds = 504, totalSeconds = 1335) {
    if (!this.screenCtx) return;
    const ctx = this.screenCtx;
    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;

    // 1. Draw Background Image or Warm Festive Gradient
    if (this.posterLoaded && this.posterImage.complete) {
      ctx.drawImage(this.posterImage, 0, 0, w, h);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#4c1d95');
      grad.addColorStop(1, '#831843');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Title Card Fallback
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TMKOC • HAPPY DIWALI SPECIAL', w / 2, h / 2 - 30);
      ctx.fillStyle = '#fef08a';
      ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Gokuldham Society Diwali Mela Celebration', w / 2, h / 2 + 30);
    }

    // 2. Animated Fireworks Bursts in Night Sky
    ctx.save();
    for (let b of this.screenFireworks) {
      ctx.globalAlpha = Math.max(0, b.alpha);
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Sparkling Particles from Jethalal & Daya's Sparkler
    ctx.save();
    for (let p of this.screenSparks) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Subtle Vignette for Cinema Screen Immersion
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.4, w / 2, h / 2, w * 0.7);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    // 5. Watermark Badge: "● LIVE SONY SAB • TMKOC DIWALI"
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(30, 25, 270, 38);
    const blinkLive = Math.floor(performance.now() / 600) % 2 === 0;
    ctx.fillStyle = blinkLive ? '#ef4444' : '#7f1d1d';
    ctx.beginPath();
    ctx.arc(48, 44, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SONY SAB • DIWALI SPECIAL', 64, 49);
    ctx.restore();

    // 6. Dialogue Subtitle Card above Control Bar
    const dialogue = this.screenDialogues[this.dialogueIndex];
    if (dialogue) {
      const subY = h - 110;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
      ctx.fillRect(60, subY, w - 120, 42);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(60, subY, w - 120, 42);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${dialogue.speaker}:`, 80, subY + 26);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`"${dialogue.text}"`, 220, subY + 26);
      ctx.restore();
    }

    // 7. YouTube/Cinema Player Overlay Bar at Bottom
    const barH = 58;
    const barY = h - barH;

    const barGrad = ctx.createLinearGradient(0, barY - 20, 0, h);
    barGrad.addColorStop(0, 'rgba(0,0,0,0)');
    barGrad.addColorStop(0.3, 'rgba(0,0,0,0.85)');
    barGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, barY - 20, w, barH + 20);

    // Playhead Progress Bar
    const progW = w - 80;
    const progX = 40;
    const progY = barY + 8;
    const progH = 6;
    const progress = Math.min(1.0, currentSeconds / totalSeconds);

    // Background track
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(progX, progY, progW, progH);

    // Buffered track
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(progX, progY, Math.min(progW, progW * (progress + 0.22)), progH);

    // Played track (YouTube Red)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(progX, progY, progW * progress, progH);

    // Scrubber Knob (Circle)
    ctx.beginPath();
    ctx.arc(progX + progW * progress, progY + progH / 2, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 8. Controls & Timestamps
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'left';

    // Play icon
    ctx.fillText('▶', 40, barY + 40);

    // Volume icon
    ctx.fillText('🔊', 72, barY + 40);

    // Time text (e.g. "08:24 / 22:15")
    const curSec = Math.floor(currentSeconds % 60).toString().padStart(2, '0');
    const curMin = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
    const totSec = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    const totMin = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    ctx.font = '500 17px "Plus Jakarta Sans", monospace';
    ctx.fillText(`${curMin}:${curSec} / ${totMin}:${totSec}`, 115, barY + 40);

    // Right-side icons: HD badge, Settings gear, Subtitles, Fullscreen
    ctx.textAlign = 'right';
    ctx.font = 'bold 18px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('⛶  ⚙  🔤  [HD]', w - 40, barY + 40);
  }

  // 3. GRAND STAGE PILLARS, EAVES & SIGNBOARD ("TMKOC")
  buildStagePillarsAndCanopy() {
    const stageW = 16.5;
    const stageD = 8.5;
    const pillarH = 7.6;
    const pillarRadius = 0.42;

    const pillarPositions = [
      { x: -stageW / 2 + 0.8, z: stageD / 2 - 0.8 },
      { x: stageW / 2 - 0.8, z: stageD / 2 - 0.8 },
      { x: -stageW / 2 + 0.8, z: -stageD / 2 + 0.8 },
      { x: stageW / 2 - 0.8, z: -stageD / 2 + 0.8 }
    ];

    pillarPositions.forEach(pos => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(pillarRadius, pillarRadius * 1.15, pillarH, 16),
        this.matPillarGold
      );
      col.position.set(pos.x, pillarH / 2 + 1.1, pos.z);
      col.castShadow = true;
      this.group.add(col);

      // Ornate Capital Box
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(pillarRadius * 2.8, 0.45, pillarRadius * 2.8),
        this.matGoldFrame
      );
      cap.position.set(pos.x, pillarH + 1.1, pos.z);
      this.group.add(cap);

      // Base Plinth
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(pillarRadius * 3.0, 0.6, pillarRadius * 3.0),
        this.matStagePlinth
      );
      base.position.set(pos.x, 1.4, pos.z);
      this.group.add(base);
    });

    // Horizontal Stage Beam connecting front pillars
    const beamGeo = new THREE.BoxGeometry(stageW, 0.65, 0.8);
    const beam = new THREE.Mesh(beamGeo, this.matStagePlinth);
    beam.position.set(0, pillarH + 1.2, stageD / 2 - 0.8);
    this.group.add(beam);

    // Overhanging Roof Canopy (Sloped Tile Roof)
    const roofGeo = new THREE.BoxGeometry(stageW + 1.4, 0.4, stageD + 1.4);
    const roof = new THREE.Mesh(roofGeo, this.matStagePlinth);
    roof.position.set(0, pillarH + 1.6, 0);
    this.group.add(roof);

    // Top Crest Pediment with Kalash Finials
    const crestGeo = new THREE.ConeGeometry(0.35, 0.8, 8);
    [-stageW / 2 + 0.8, 0, stageW / 2 - 0.8].forEach(cx => {
      const kalash = new THREE.Mesh(crestGeo, this.matGoldFrame);
      kalash.position.set(cx, pillarH + 2.2, stageD / 2 - 0.8);
      this.group.add(kalash);
    });

    // -------------------------------------------------------------
    // GRAND ORNATE STAGE SIGNBOARD: "TMKOC"
    // -------------------------------------------------------------
    const signW = 13.8;
    const signH = 1.65;
    const signBoardGeo = new THREE.BoxGeometry(signW, signH, 0.22);
    const signBoardMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.55
    });
    const signBoard = new THREE.Mesh(signBoardGeo, signBoardMat);
    signBoard.position.set(0, pillarH + 0.7, stageD / 2 - 0.5);
    this.group.add(signBoard);

    // Gold Trim Frame around Signboard
    const sFrameGeo = new THREE.BoxGeometry(signW + 0.25, signH + 0.25, 0.12);
    const sFrame = new THREE.Mesh(sFrameGeo, this.matGoldFrame);
    sFrame.position.set(0, pillarH + 0.7, stageD / 2 - 0.56);
    this.group.add(sFrame);

    // Signboard Canvas Texture with Elegant Gold Inscription
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024;
    signCanvas.height = 160;
    const sCtx = signCanvas.getContext('2d');

    // Maroon velvet gradient background
    const sGrad = sCtx.createLinearGradient(0, 0, 0, 160);
    sGrad.addColorStop(0, '#500724');
    sGrad.addColorStop(0.5, '#881337');
    sGrad.addColorStop(1, '#4c0519');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 1024, 160);

    // Ornate gold border
    sCtx.strokeStyle = '#f59e0b';
    sCtx.lineWidth = 6;
    sCtx.strokeRect(8, 8, 1008, 144);
    sCtx.lineWidth = 2;
    sCtx.strokeRect(14, 14, 996, 132);

    // Corner decorative diamond flourishes
    const drawFlourish = (fx, fy) => {
      sCtx.fillStyle = '#fde047';
      sCtx.beginPath();
      sCtx.arc(fx, fy, 7, 0, Math.PI * 2);
      sCtx.fill();
    };
    drawFlourish(24, 24);
    drawFlourish(1000, 24);
    drawFlourish(24, 136);
    drawFlourish(1000, 136);

    // Hindi Sanskrit Subtitle
    sCtx.fillStyle = '#fef08a';
    sCtx.font = 'bold 22px "Plus Jakarta Sans", system-ui, sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('॥ शुभ दीपोत्सवः ॥ गोकुलधाम सिनेमा मन्दिर ॥', 512, 42);

    // Main Stage Text: TMKOC
    sCtx.fillStyle = '#ffffff';
    sCtx.font = '900 76px "Cinzel", "Plus Jakarta Sans", serif';
    sCtx.shadowColor = '#f59e0b';
    sCtx.shadowBlur = 18;
    sCtx.fillText('TMKOC', 512, 118);
    sCtx.shadowBlur = 0;

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex, toneMapped: false });
    const signPlane = new THREE.Mesh(new THREE.PlaneGeometry(signW - 0.2, signH - 0.2), signMat);
    signPlane.position.set(0, pillarH + 0.7, stageD / 2 - 0.38);
    this.group.add(signPlane);

    // -------------------------------------------------------------
    // TOP ROOF ILLUMINATED 3D "THEATER" MARQUEE HEADER
    // -------------------------------------------------------------
    const roofMarqueeW = 9.4;
    const roofMarqueeH = 1.35;
    const roofMarqueeBox = new THREE.Mesh(
      new THREE.BoxGeometry(roofMarqueeW, roofMarqueeH, 0.25),
      this.matStagePlinth
    );
    roofMarqueeBox.position.set(0, pillarH + 2.5, stageD / 2 - 0.8);
    this.group.add(roofMarqueeBox);

    const roofCanvas = document.createElement('canvas');
    roofCanvas.width = 1024;
    roofCanvas.height = 160;
    const rCtx = roofCanvas.getContext('2d');
    rCtx.fillStyle = '#4c0519';
    rCtx.fillRect(0, 0, 1024, 160);
    rCtx.strokeStyle = '#f59e0b';
    rCtx.lineWidth = 6;
    rCtx.strokeRect(6, 6, 1012, 148);
    rCtx.fillStyle = '#ffffff';
    rCtx.font = '900 76px "Plus Jakarta Sans", system-ui, sans-serif';
    rCtx.textAlign = 'center';
    rCtx.shadowColor = '#f59e0b';
    rCtx.shadowBlur = 20;
    rCtx.fillText('🎬 THEATER 🎬', 512, 110);
    rCtx.shadowBlur = 0;

    const roofTex = new THREE.CanvasTexture(roofCanvas);
    const roofMat = new THREE.MeshBasicMaterial({ map: roofTex, toneMapped: false });
    const roofPlane = new THREE.Mesh(new THREE.PlaneGeometry(roofMarqueeW - 0.1, roofMarqueeH - 0.1), roofMat);
    roofPlane.position.set(0, pillarH + 2.5, stageD / 2 - 0.65);
    this.group.add(roofPlane);
  }

  // 4. THEATRICAL VELVET CURTAINS & VALANCES
  buildTheatricalCurtains() {
    const screenW = 10.8;
    const screenH = 6.08;

    // Left Gathered Curtain Panel
    const curLeftGeo = new THREE.BoxGeometry(1.6, screenH + 0.8, 0.4);
    const curLeft = new THREE.Mesh(curLeftGeo, this.matVelvetCurtain);
    curLeft.position.set(-screenW / 2 - 0.65, 4.4, 0.7);
    curLeft.castShadow = true;
    this.group.add(curLeft);

    // Right Gathered Curtain Panel
    const curRightGeo = new THREE.BoxGeometry(1.6, screenH + 0.8, 0.4);
    const curRight = new THREE.Mesh(curRightGeo, this.matVelvetCurtain);
    curRight.position.set(screenW / 2 + 0.65, 4.4, 0.7);
    curRight.castShadow = true;
    this.group.add(curRight);

    // Top Scalloped Valance / Pelmet (Crimson with Gold Fringe)
    const valanceGeo = new THREE.BoxGeometry(screenW + 2.8, 0.85, 0.35);
    const valance = new THREE.Mesh(valanceGeo, this.matVelvetCurtain);
    valance.position.set(0, 4.4 + screenH / 2 + 0.3, 0.75);
    this.group.add(valance);

    // Golden fringe trim on valance
    const fringeGeo = new THREE.BoxGeometry(screenW + 2.8, 0.1, 0.36);
    const fringe = new THREE.Mesh(fringeGeo, this.matGoldFrame);
    fringe.position.set(0, 4.4 + screenH / 2 - 0.1, 0.76);
    this.group.add(fringe);
  }

  // 5. CONCERT PA SPEAKERS ON STAGE FLANKS
  buildConcertSpeakers() {
    const stageW = 16.5;
    const stageH = 1.1;

    const speakerConfigs = [
      { x: -stageW / 2 + 1.4, z: 2.2, rotY: 0.25 },
      { x: stageW / 2 - 1.4, z: 2.2, rotY: -0.25 }
    ];

    speakerConfigs.forEach(cfg => {
      const spkGroup = new THREE.Group();
      spkGroup.position.set(cfg.x, stageH, cfg.z);
      spkGroup.rotation.y = cfg.rotY;

      // Heavy Speaker Cabinet
      const cabGeo = new THREE.BoxGeometry(1.15, 2.8, 0.95);
      const cab = new THREE.Mesh(cabGeo, this.matSpeakerBox);
      cab.position.y = 1.4;
      cab.castShadow = true;
      spkGroup.add(cab);

      // Dual Subwoofers (Cones)
      const wooferGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.15, 16);
      wooferGeo.rotateX(Math.PI / 2);

      const w1 = new THREE.Mesh(wooferGeo, this.matSpeakerCone);
      w1.position.set(0, 0.9, 0.48);
      spkGroup.add(w1);

      const w2 = new THREE.Mesh(wooferGeo, this.matSpeakerCone);
      w2.position.set(0, 1.85, 0.48);
      spkGroup.add(w2);

      // Horn Tweeter at top
      const hornGeo = new THREE.BoxGeometry(0.75, 0.35, 0.12);
      const horn = new THREE.Mesh(hornGeo, this.matSpeakerCone);
      horn.position.set(0, 2.45, 0.48);
      spkGroup.add(horn);

      this.group.add(spkGroup);
    });
  }

  // 6. SWAG FESTOON STRING LIGHTS ACROSS STAGE ARCH
  buildFestoonLighting() {
    const stageW = 16.5;
    const stageD = 8.5;
    const archY = 7.6;
    const bulbCount = 20;

    this.festoonBulbs = [];

    for (let i = 0; i <= bulbCount; i++) {
      const u = i / bulbCount;
      const bx = -stageW / 2 + 1.2 + u * (stageW - 2.4);
      // Catenary sag curve
      const sag = Math.sin(u * Math.PI) * 0.95;
      const by = archY - sag;
      const bz = stageD / 2 - 0.7;

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 8, 8),
        this.matBulbGlow
      );
      bulb.position.set(bx, by, bz);
      this.group.add(bulb);
      this.festoonBulbs.push({ mesh: bulb, baseIntensity: 1.0, phase: i * 0.4 });
    }
  }

  // 7. FLANKING FESTIVE BANNERS WITH GLOWING DIYAS
  buildFlankingBanners() {
    const stageW = 16.5;
    const bannerW = 2.2;
    const bannerH = 6.2;

    const bannerXPositions = [-stageW / 2 - 0.9, stageW / 2 + 0.9];

    bannerXPositions.forEach((bx, idx) => {
      // Banner Canvas Texture
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 256;
      bCanvas.height = 768;
      const bCtx = bCanvas.getContext('2d');

      // Crimson background with golden borders
      bCtx.fillStyle = '#881337';
      bCtx.fillRect(0, 0, 256, 768);

      bCtx.strokeStyle = '#f59e0b';
      bCtx.lineWidth = 10;
      bCtx.strokeRect(8, 8, 240, 752);

      // Glowing Diya Silhouette at Center
      bCtx.fillStyle = '#fde047';
      bCtx.textAlign = 'center';
      bCtx.font = 'bold 80px system-ui';
      bCtx.fillText('🪔', 128, 380);

      // Text Top & Bottom
      bCtx.fillStyle = '#fef08a';
      bCtx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      bCtx.fillText('SHUBH', 128, 180);
      bCtx.fillText('DIWALI', 128, 225);

      bCtx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      bCtx.fillText('GOKULDHAM', 128, 560);
      bCtx.fillText('MELA', 128, 600);

      const bTex = new THREE.CanvasTexture(bCanvas);
      const bMat = new THREE.MeshStandardMaterial({
        map: bTex,
        roughness: 0.6,
        side: THREE.DoubleSide
      });

      const bMesh = new THREE.Mesh(new THREE.PlaneGeometry(bannerW, bannerH), bMat);
      bMesh.position.set(bx, 4.2, 2.0);
      bMesh.rotation.y = idx === 0 ? 0.35 : -0.35;
      this.group.add(bMesh);

      // Top suspension pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, bannerW + 0.4, 8),
        this.matGoldFrame
      );
      pole.rotation.z = Math.PI / 2;
      pole.position.set(bx, 7.3, 2.0);
      this.group.add(pole);
    });
  }

  // 8. AUDIENCE BENCHES & SEATED NPC VISITORS (FACING THE SCREEN)
  buildAudienceBenchesAndVisitors() {
    // 4 Rows of benches positioned in front of stage in world space
    // Stage is at x = 35, facing -X (West).
    // So audience sits at x = 25.5, 21.5, 17.5, 13.5, facing East (+X).
    const rowOffsets = [9.5, 13.5, 17.5, 21.5]; // distance in front of stage center (+Z in local coords)
    const aisleHalfWidth = 2.4;
    const benchLength = 4.2;

    const npcsPalette = [
      { kurta: 0x2563eb, dhoti: 0xf8fafc, turban: 0xf59e0b }, // Vibrant Blue & Saffron
      { kurta: 0xd97706, dhoti: 0xfef08a, turban: 0xb91c1c }, // Amber & Crimson
      { kurta: 0x16a34a, dhoti: 0xf8fafc, turban: 0xfacc15 }, // Festive Green
      { kurta: 0x9333ea, dhoti: 0xfef3c7, turban: 0xe11d48 }, // Royal Purple
      { kurta: 0xe11d48, dhoti: 0xf8fafc, turban: 0xf59e0b }, // Ruby Red
      { kurta: 0x0891b2, dhoti: 0xfef08a, turban: 0xd97706 }, // Peacock Cyan
      { kurta: 0xf59e0b, dhoti: 0xf8fafc, turban: 0x4f46e5 }, // Saffron Gold
      { kurta: 0x475569, dhoti: 0xf1f5f9, turban: 0xb91c1c }  // Slate & Red
    ];

    let npcIdx = 0;

    rowOffsets.forEach((distZ, rowIdx) => {
      // Two benches per row: Left bench and Right bench with a center aisle
      const benchZOffsets = [-aisleHalfWidth - benchLength / 2, aisleHalfWidth + benchLength / 2];

      benchZOffsets.forEach((bLocalX, colIdx) => {
        const benchGroup = new THREE.Group();
        benchGroup.position.set(bLocalX, 0, distZ);
        // Face the screen (towards -Z in local coords)
        benchGroup.rotation.y = Math.PI;

        // Cast Iron Bench Legs
        const legGeo = new THREE.BoxGeometry(0.12, 0.8, 0.95);
        const legL = new THREE.Mesh(legGeo, this.matStagePlinth);
        legL.position.set(-benchLength / 2 + 0.35, 0.4, 0);
        benchGroup.add(legL);

        const legR = new THREE.Mesh(legGeo, this.matStagePlinth);
        legR.position.set(benchLength / 2 - 0.35, 0.4, 0);
        benchGroup.add(legR);

        // Wooden Slats Seat
        const seatGeo = new THREE.BoxGeometry(benchLength, 0.1, 0.85);
        const seat = new THREE.Mesh(seatGeo, this.world3D.materials.benchWood || this.matStagePlinth);
        seat.position.set(0, 0.82, 0);
        benchGroup.add(seat);

        // Wooden Backrest
        const backGeo = new THREE.BoxGeometry(benchLength, 0.65, 0.1);
        const back = new THREE.Mesh(backGeo, this.world3D.materials.benchWood || this.matStagePlinth);
        back.position.set(0, 1.25, -0.38);
        benchGroup.add(back);

        this.group.add(benchGroup);

        // Calculate world coordinates for this bench for interaction
        // Local x = bLocalX, z = distZ, rotated by rotY = -Math.PI / 2
        // World pos:
        const worldX = this.stageX + Math.cos(this.rotY) * bLocalX + Math.sin(this.rotY) * distZ;
        const worldZ = this.stageZ - Math.sin(this.rotY) * bLocalX + Math.cos(this.rotY) * distZ;
        const worldRotY = this.rotY + Math.PI; // Facing back toward the screen (+X)

        if (this.world3D && this.world3D.interactiveTargets) {
          this.world3D.interactiveTargets.push({
            id: `theater_bench_${rowIdx}_${colIdx}`,
            name: `Theater Ground Bench (Row ${rowIdx + 1})`,
            type: 'society_bench',
            x: worldX,
            z: worldZ,
            radius: 2.8,
            is3D: true,
            prompt: '[E] Sit in Society Theater',
            data: {
              seatX: worldX,
              seatZ: worldZ,
              seatY: 0.82,
              rotY: worldRotY,
              isTheaterBench: true,
              rowIndex: rowIdx,
              screenPos: { x: this.stageX, y: 4.4, z: this.stageZ }
            }
          });
        }

        // Add 1 or 2 Seated NPC Audience Members to Row 1 and Row 2 benches
        if (rowIdx < 2) {
          const seatSlots = [-1.1, 0.9];
          seatSlots.forEach((slotX, slotIdx) => {
            if ((rowIdx + colIdx + slotIdx) % 3 === 0) return; // Leave space for player

            const palette = npcsPalette[npcIdx % npcsPalette.length];
            npcIdx++;

            const npc = this.createSeatedNpcMesh(palette);
            npc.position.set(slotX, 0, 0);
            benchGroup.add(npc);

            this.seatedNpcs.push({
              group: npc,
              baseY: npc.position.y,
              idlePhase: Math.random() * Math.PI * 2,
              idleSpeed: 1.2 + Math.random() * 0.8
            });
          });
        }
      });
    });
  }

  // Build Seated NPC Audience Model with Thighs forward and Calves bent down
  createSeatedNpcMesh(colors) {
    const root = new THREE.Group();
    root.name = 'SeatedAudienceNPC';

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd49b73, roughness: 0.7 });
    const kurtaMat = new THREE.MeshStandardMaterial({ color: colors.kurta, roughness: 0.6 });
    const dhotiMat = new THREE.MeshStandardMaterial({ color: colors.dhoti, roughness: 0.7 });
    const turbanMat = new THREE.MeshStandardMaterial({ color: colors.turban, roughness: 0.55 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });

    // Seated Y: bench surface is at y = 0.82. Hip seated flush on slats.
    const hipY = 0.82;

    // Torso (Relaxed upright sitting)
    const torsoGeo = new THREE.BoxGeometry(0.72, 0.75, 0.42);
    const torso = new THREE.Mesh(torsoGeo, kurtaMat);
    torso.position.set(0, hipY + 0.45, 0);
    torso.castShadow = true;
    root.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), skinMat);
    head.position.set(0, hipY + 1.05, 0);
    head.castShadow = true;
    root.add(head);

    // Festive Turban / Hair
    const turban = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.12, 6, 12), turbanMat);
    turban.rotation.x = Math.PI / 2;
    turban.position.set(0, hipY + 1.15, 0);
    root.add(turban);

    const turbanCap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), turbanMat);
    turbanCap.position.set(0, hipY + 1.25, 0);
    root.add(turbanCap);

    // Thighs (pointing horizontally forward: local +Z)
    const thighGeo = new THREE.BoxGeometry(0.2, 0.18, 0.48);
    const thighL = new THREE.Mesh(thighGeo, dhotiMat);
    thighL.position.set(-0.18, hipY + 0.08, 0.22);
    root.add(thighL);

    const thighR = new THREE.Mesh(thighGeo, dhotiMat);
    thighR.position.set(0.18, hipY + 0.08, 0.22);
    root.add(thighR);

    // Calves & Shoes (hanging vertically down from edge of seat)
    const calfGeo = new THREE.BoxGeometry(0.18, 0.48, 0.18);
    const calfL = new THREE.Mesh(calfGeo, dhotiMat);
    calfL.position.set(-0.18, hipY - 0.24, 0.44);
    root.add(calfL);

    const calfR = new THREE.Mesh(calfGeo, dhotiMat);
    calfR.position.set(0.18, hipY - 0.24, 0.44);
    root.add(calfR);

    const shoeGeo = new THREE.BoxGeometry(0.19, 0.12, 0.32);
    const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
    shoeL.position.set(-0.18, hipY - 0.5, 0.48);
    root.add(shoeL);

    const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
    shoeR.position.set(0.18, hipY - 0.5, 0.48);
    root.add(shoeR);

    // Arms resting on knees/lap
    const armGeo = new THREE.BoxGeometry(0.14, 0.52, 0.14);
    const armL = new THREE.Mesh(armGeo, kurtaMat);
    armL.position.set(-0.42, hipY + 0.35, 0.15);
    armL.rotation.x = 0.5;
    root.add(armL);

    const armR = new THREE.Mesh(armGeo, kurtaMat);
    armR.position.set(0.42, hipY + 0.35, 0.15);
    armR.rotation.x = 0.5;
    root.add(armR);

    return root;
  }

  // 11. GRAND CINEMA ENTRANCE ARCHWAY & ILLUMINATED MARQUEE CANOPY
  buildCinemaEntranceArchwayAndMarquee() {
    const archZ = 24.5;
    const archSpan = 6.8;
    const columnH = 5.2;
    const columnR = 0.38;

    // Entrance Group
    this.entranceGroup = new THREE.Group();
    this.entranceGroup.name = 'CinemaEntranceArchway';
    this.entranceGroup.position.set(0, 0, archZ);

    // Two Grand Classical Cinema Columns flanking the entrance
    [-archSpan / 2, archSpan / 2].forEach(colX => {
      const colMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(columnR, columnR * 1.15, columnH, 16),
        this.matPillarGold
      );
      colMesh.position.set(colX, columnH / 2, 0);
      colMesh.castShadow = true;
      this.entranceGroup.add(colMesh);

      // Base Plinth
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(columnR * 2.8, 0.6, columnR * 2.8),
        this.matStagePlinth
      );
      baseMesh.position.set(colX, 0.3, 0);
      this.entranceGroup.add(baseMesh);

      // Ornate Capital Box
      const capMesh = new THREE.Mesh(
        new THREE.BoxGeometry(columnR * 2.6, 0.4, columnR * 2.6),
        this.matGoldFrame
      );
      capMesh.position.set(colX, columnH + 0.2, 0);
      this.entranceGroup.add(capMesh);

      // Hanging Brass Diwali Lantern
      const lanternMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28, 0),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      lanternMesh.position.set(colX, columnH - 0.8, 0.45);
      this.entranceGroup.add(lanternMesh);
    });

    // Arch Overhead Transverse Beam
    const archBeam = new THREE.Mesh(
      new THREE.BoxGeometry(archSpan + 0.8, 0.55, 0.75),
      this.matStagePlinth
    );
    archBeam.position.set(0, columnH + 0.45, 0);
    this.entranceGroup.add(archBeam);

    // Marigold Toran Garland draped along entrance arch
    const garlandCount = 18;
    for (let i = 0; i <= garlandCount; i++) {
      const u = i / garlandCount;
      const gx = -archSpan / 2 + u * archSpan;
      const sag = Math.sin(u * Math.PI) * 0.45;
      const gy = columnH + 0.15 - sag;
      const gMat = (i % 2 === 0) ? this.matMarigoldOrange : this.matMarigoldYellow;
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), gMat);
      bead.position.set(gx, gy, 0.4);
      this.entranceGroup.add(bead);
    }

    // -------------------------------------------------------------
    // ILLUMINATED CINEMA MARQUEE CANOPY & CHASE BULBS
    // -------------------------------------------------------------
    const canopyW = archSpan + 0.4;
    const canopyD = 2.2;
    const canopyH = 0.5;

    // Projecting Marquee Canopy Box (extending toward +Z into courtyard)
    const canopyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(canopyW, canopyH, canopyD),
      this.matMarqueeFascia || this.matStagePlinth
    );
    canopyMesh.position.set(0, columnH + 0.7, canopyD / 2);
    this.entranceGroup.add(canopyMesh);

    // Gold Trim Frame around Canopy
    const cTrim = new THREE.Mesh(
      new THREE.BoxGeometry(canopyW + 0.15, canopyH + 0.15, canopyD + 0.15),
      this.matGoldFrame
    );
    cTrim.position.set(0, columnH + 0.7, canopyD / 2);
    this.entranceGroup.add(cTrim);

    // Under-canopy warm recessed lights
    [-1.8, 0, 1.8].forEach(lx => {
      const ceilingLight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.05, 12),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      ceilingLight.position.set(lx, columnH + 0.44, canopyD / 2);
      this.entranceGroup.add(ceilingLight);
    });

    // Perimeter Chasing Marquee Bulbs around Canopy
    this.marqueeBulbs = [];
    const bulbCountFront = 20;
    for (let i = 0; i <= bulbCountFront; i++) {
      const u = i / bulbCountFront;
      const bx = -canopyW / 2 + 0.2 + u * (canopyW - 0.4);
      const bz = canopyD + 0.08;
      const by = columnH + 0.7;

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 8),
        this.matBulbGlow
      );
      bulb.position.set(bx, by, bz);
      this.entranceGroup.add(bulb);
      this.marqueeBulbs.push({ mesh: bulb, phase: i * 0.35 });
    }

    // Side Marquee Bulbs (Left & Right edges of canopy)
    const bulbCountSide = 6;
    for (let i = 1; i <= bulbCountSide; i++) {
      const bz = (i / (bulbCountSide + 1)) * canopyD;
      [-canopyW / 2 - 0.08, canopyW / 2 + 0.08].forEach(bx => {
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 8, 8),
          this.matBulbGlow
        );
        bulb.position.set(bx, columnH + 0.7, bz);
        this.entranceGroup.add(bulb);
        this.marqueeBulbs.push({ mesh: bulb, phase: (i + 10) * 0.35 });
      });
    }

    // -------------------------------------------------------------
    // GRAND ILLUMINATED MARQUEE SIGNBOARD ("THEATER • CINEMA")
    // -------------------------------------------------------------
    const signW = canopyW - 0.4;
    const signH = 1.7;
    const signBox = new THREE.Mesh(
      new THREE.BoxGeometry(signW, signH, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x500724, roughness: 0.5 })
    );
    signBox.position.set(0, columnH + 1.85, canopyD - 0.1);
    this.entranceGroup.add(signBox);

    // Front Sign Face (facing +Z into courtyard)
    const marqueeCanvas = document.createElement('canvas');
    marqueeCanvas.width = 1024;
    marqueeCanvas.height = 256;
    const mCtx = marqueeCanvas.getContext('2d');

    // Rich ruby-crimson gradient
    const mGrad = mCtx.createLinearGradient(0, 0, 0, 256);
    mGrad.addColorStop(0, '#4c0519');
    mGrad.addColorStop(0.5, '#881337');
    mGrad.addColorStop(1, '#3a0212');
    mCtx.fillStyle = mGrad;
    mCtx.fillRect(0, 0, 1024, 256);

    // Gold filigree border with inset
    mCtx.strokeStyle = '#f59e0b';
    mCtx.lineWidth = 8;
    mCtx.strokeRect(10, 10, 1004, 236);
    mCtx.lineWidth = 2.5;
    mCtx.strokeRect(18, 18, 988, 220);

    // Top subtitle
    mCtx.fillStyle = '#fde047';
    mCtx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    mCtx.textAlign = 'center';
    mCtx.fillText('॥ शुभ दीपोत्सवः ॥ गोकुलधाम सोसाइटी ॥', 512, 52);

    // Main Marquee Text: THEATER • CINEMA
    mCtx.fillStyle = '#ffffff';
    mCtx.font = '900 82px "Plus Jakarta Sans", "Cinzel", serif';
    mCtx.shadowColor = '#f59e0b';
    mCtx.shadowBlur = 24;
    mCtx.fillText('🎬 THEATER • CINEMA', 512, 148);
    mCtx.shadowBlur = 0;

    // Bottom banner
    mCtx.fillStyle = '#fef08a';
    mCtx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    mCtx.fillText('★ TMKOC DIWALI SPECIAL ★ NOW PLAYING ★ FREE ADMISSION ★', 512, 215);

    const mTex = new THREE.CanvasTexture(marqueeCanvas);
    const mMat = new THREE.MeshBasicMaterial({ map: mTex, toneMapped: false });
    const mPlane = new THREE.Mesh(new THREE.PlaneGeometry(signW - 0.15, signH - 0.15), mMat);
    mPlane.position.set(0, columnH + 1.85, canopyD + 0.03);
    this.entranceGroup.add(mPlane);

    // Rear Sign Face (facing stage / seated audience)
    const rearCanvas = document.createElement('canvas');
    rearCanvas.width = 1024;
    rearCanvas.height = 256;
    const rCtx = rearCanvas.getContext('2d');
    rCtx.fillStyle = '#4c0519';
    rCtx.fillRect(0, 0, 1024, 256);
    rCtx.strokeStyle = '#f59e0b';
    rCtx.lineWidth = 6;
    rCtx.strokeRect(10, 10, 1004, 236);
    rCtx.fillStyle = '#ffffff';
    rCtx.font = '900 70px "Plus Jakarta Sans", serif';
    rCtx.textAlign = 'center';
    rCtx.fillText('GOKULDHAM CINEMA', 512, 125);
    rCtx.fillStyle = '#fde047';
    rCtx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    rCtx.fillText('SHUBH DEEPAWALI • HAPPY FESTIVAL', 512, 195);

    const rTex = new THREE.CanvasTexture(rearCanvas);
    const rMat = new THREE.MeshBasicMaterial({ map: rTex, toneMapped: false });
    const rPlane = new THREE.Mesh(new THREE.PlaneGeometry(signW - 0.15, signH - 0.15), rMat);
    rPlane.position.set(0, columnH + 1.85, canopyD - 0.23);
    rPlane.rotation.y = Math.PI;
    this.entranceGroup.add(rPlane);

    // -------------------------------------------------------------
    // RED CARPET RUNNER & VELVET ROPE STANCHIONS
    // -------------------------------------------------------------
    // Red Carpet strip running from Z = 27.5 (outside arch) down to Z = 4.2 (stage apron)
    const carpetLength = 23.5;
    const carpetW = 2.4;
    const carpetGeo = new THREE.BoxGeometry(carpetW, 0.04, carpetLength);
    const carpetMesh = new THREE.Mesh(carpetGeo, this.matRedCarpet);
    carpetMesh.position.set(0, 0.02, 15.95);
    carpetMesh.receiveShadow = true;
    this.group.add(carpetMesh);

    // Gold borders along the red carpet
    [-carpetW / 2, carpetW / 2].forEach(bx => {
      const borderMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.045, carpetLength),
        this.matGoldFrame
      );
      borderMesh.position.set(bx, 0.025, 15.95);
      this.group.add(borderMesh);
    });

    // 4 Pairs of Brass Stanchions with Red Velvet Rope at Entrance
    const stanchionZPositions = [22.8, 24.5, 26.0, 27.5];
    stanchionZPositions.forEach(sz => {
      [-carpetW / 2 - 0.25, carpetW / 2 + 0.25].forEach(sx => {
        // Base Disc
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.22, 0.06, 12),
          this.matGoldFrame
        );
        base.position.set(sx, 0.03, sz);
        this.group.add(base);

        // Brass Pole
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.95, 8),
          this.matGoldFrame
        );
        pole.position.set(sx, 0.5, sz);
        this.group.add(pole);

        // Spherical Finial
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 8, 8),
          this.matGoldFrame
        );
        ball.position.set(sx, 1.0, sz);
        this.group.add(ball);
      });
    });

    // Connect Velvet Ropes between consecutive stanchions
    for (let i = 0; i < stanchionZPositions.length - 1; i++) {
      const z1 = stanchionZPositions[i];
      const z2 = stanchionZPositions[i + 1];
      const midZ = (z1 + z2) / 2;
      const segLen = Math.abs(z2 - z1);

      [-carpetW / 2 - 0.25, carpetW / 2 + 0.25].forEach(sx => {
        const rope = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, segLen, 8),
          this.matVelvetCurtain
        );
        rope.rotation.x = Math.PI / 2;
        rope.position.set(sx, 0.85, midZ);
        this.group.add(rope);
      });
    }

    this.group.add(this.entranceGroup);
  }

  // 12. BACKLIT MOVIE POSTER DISPLAY LIGHTBOXES (FLANKING THE ENTRANCE)
  buildMoviePosterLightboxes() {
    const archZ = 24.5;
    const kioskConfigs = [
      {
        x: -4.4,
        title: 'TMKOC DIWALI SPECIAL',
        subtitle: 'EPISODE 53: LAXMI PUJAN',
        tag: 'NOW SHOWING',
        tagBg: '#ef4444',
        stars: '★★★★★ (5.0)',
        runtime: '22 MINS • FULL HD',
        quote: '"Ae Maa Mataji! Shubh Deepawali sabhi ko!"'
      },
      {
        x: 4.4,
        title: 'GOKULDHAM CINEMA',
        subtitle: 'COMMUNITY THEATER',
        tag: 'DEEPOTSAV UTSAV',
        tagBg: '#f59e0b',
        stars: '★★★★★ (Family Special)',
        runtime: 'ALL DAY & NIGHT • FREE',
        quote: '"Celebrate the festival of lights with laughter!"'
      }
    ];

    kioskConfigs.forEach(cfg => {
      const kioskGroup = new THREE.Group();
      kioskGroup.position.set(cfg.x, 0, archZ);

      // Wooden & Brass Lightbox Cabinet (W: 1.5m, H: 2.3m, D: 0.24m)
      const boxW = 1.5;
      const boxH = 2.3;
      const boxD = 0.24;
      const elevY = 1.95;

      const cabinet = new THREE.Mesh(
        new THREE.BoxGeometry(boxW, boxH, boxD),
        this.matStagePlinth
      );
      cabinet.position.set(0, elevY, 0);
      cabinet.castShadow = true;
      kioskGroup.add(cabinet);

      // Gold Framing Bezel
      const bezel = new THREE.Mesh(
        new THREE.BoxGeometry(boxW + 0.12, boxH + 0.12, boxD - 0.05),
        this.matGoldFrame
      );
      bezel.position.set(0, elevY, 0);
      kioskGroup.add(bezel);

      // Top Lamp Hood
      const hood = new THREE.Mesh(
        new THREE.BoxGeometry(boxW + 0.16, 0.18, boxD + 0.2),
        this.matGoldFrame
      );
      hood.position.set(0, elevY + boxH / 2 + 0.09, 0.05);
      kioskGroup.add(hood);

      // Downlight fixture (emissive bulb disc)
      const lampBulb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.04, 10),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      lampBulb.position.set(0, elevY + boxH / 2 + 0.02, boxD / 2 + 0.05);
      kioskGroup.add(lampBulb);

      // Sturdy Ground Stand Pedestal
      const stand = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.8, 0.3),
        this.matStagePlinth
      );
      stand.position.set(0, 0.4, 0);
      kioskGroup.add(stand);

      // Poster Canvas Artwork
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 512;
      pCanvas.height = 768;
      const pCtx = pCanvas.getContext('2d');

      // Poster Background
      const pGrad = pCtx.createLinearGradient(0, 0, 0, 768);
      pGrad.addColorStop(0, '#1e1b4b');
      pGrad.addColorStop(0.35, '#3b0764');
      pGrad.addColorStop(0.7, '#831843');
      pGrad.addColorStop(1, '#0f172a');
      pCtx.fillStyle = pGrad;
      pCtx.fillRect(0, 0, 512, 768);

      // Gold Ornate Poster Frame
      pCtx.strokeStyle = '#f59e0b';
      pCtx.lineWidth = 8;
      pCtx.strokeRect(12, 12, 488, 744);
      pCtx.lineWidth = 2;
      pCtx.strokeRect(20, 20, 472, 728);

      // Status Badge (e.g. NOW SHOWING)
      pCtx.fillStyle = cfg.tagBg;
      pCtx.fillRect(156, 36, 200, 38);
      pCtx.fillStyle = '#ffffff';
      pCtx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      pCtx.textAlign = 'center';
      pCtx.fillText(cfg.tag, 256, 62);

      // Cinema Clapperboard / Diya Icon
      pCtx.font = '64px system-ui';
      pCtx.fillText('🎬', 256, 145);

      // Main Poster Title
      pCtx.fillStyle = '#fde047';
      pCtx.font = '900 36px "Plus Jakarta Sans", serif';
      pCtx.shadowColor = '#f59e0b';
      pCtx.shadowBlur = 14;
      pCtx.fillText(cfg.title, 256, 210);
      pCtx.shadowBlur = 0;

      // Subtitle
      pCtx.fillStyle = '#ffffff';
      pCtx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      pCtx.fillText(cfg.subtitle, 256, 250);

      // Center Decorative Festive Artwork (Sparkles & Diyas)
      pCtx.font = '40px system-ui';
      pCtx.fillText('🪔  ✨  🎆  ✨  🪔', 256, 320);

      // Quote / Synopsis
      pCtx.fillStyle = '#fef08a';
      pCtx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
      pCtx.fillText(cfg.quote, 256, 400);

      // Star Rating
      pCtx.fillStyle = '#facc15';
      pCtx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      pCtx.fillText(cfg.stars, 256, 480);

      // Features Pill Badges
      pCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      pCtx.fillRect(60, 530, 392, 44);
      pCtx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      pCtx.strokeRect(60, 530, 392, 44);
      pCtx.fillStyle = '#ffffff';
      pCtx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      pCtx.fillText(cfg.runtime, 256, 558);

      // Bottom Call to Action
      pCtx.fillStyle = '#ef4444';
      pCtx.fillRect(60, 610, 392, 54);
      pCtx.fillStyle = '#ffffff';
      pCtx.font = '900 22px "Plus Jakarta Sans", sans-serif';
      pCtx.fillText('PRESS [E] / TAP TO WATCH', 256, 644);

      pCtx.fillStyle = '#94a3b8';
      pCtx.font = '14px "Plus Jakarta Sans", sans-serif';
      pCtx.fillText('Official Sony SAB Community Broadcast', 256, 700);

      const pTex = new THREE.CanvasTexture(pCanvas);
      const pMat = new THREE.MeshBasicMaterial({ map: pTex, toneMapped: false });
      const pMesh = new THREE.Mesh(new THREE.PlaneGeometry(boxW - 0.1, boxH - 0.1), pMat);
      pMesh.position.set(0, elevY, boxD / 2 + 0.01);
      kioskGroup.add(pMesh);

      this.group.add(kioskGroup);
    });
  }

  // 13. SUBTLE FLOATING 3D WORLD-SPACE LABEL ("🎬 THEATER")
  buildFloating3DTheaterLabel() {
    // Elevated above audience seating area: local X = 0, Y = 10.5, Z = 11.0 (World: X = 24.0, Y = 10.5, Z = -14.0)
    const labelW = 5.8;
    const labelH = 1.7;

    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 300;
    const lCtx = labelCanvas.getContext('2d');

    // Rounded translucent pill background
    lCtx.save();
    const rx = 24;
    const ry = 20;
    const rw = 976;
    const rh = 260;
    const rrad = 42;

    lCtx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    lCtx.beginPath();
    lCtx.moveTo(rx + rrad, ry);
    lCtx.lineTo(rx + rw - rrad, ry);
    lCtx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rrad);
    lCtx.lineTo(rx + rw, ry + rh - rrad);
    lCtx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rrad, ry + rh);
    lCtx.lineTo(rx + rrad, ry + rh);
    lCtx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rrad);
    lCtx.lineTo(rx, ry + rrad);
    lCtx.quadraticCurveTo(rx, ry, rx + rrad, ry);
    lCtx.closePath();
    lCtx.fill();

    // Glowing golden neon border
    lCtx.strokeStyle = '#f59e0b';
    lCtx.lineWidth = 7;
    lCtx.shadowColor = '#f59e0b';
    lCtx.shadowBlur = 24;
    lCtx.stroke();
    lCtx.shadowBlur = 0;

    // Golden inner pinstripe
    lCtx.strokeStyle = '#fde047';
    lCtx.lineWidth = 2;
    lCtx.stroke();
    lCtx.restore();

    // Prominent Main Floating Text: "🎬 THEATER"
    lCtx.fillStyle = '#ffffff';
    lCtx.font = '900 86px "Plus Jakarta Sans", system-ui, sans-serif';
    lCtx.textAlign = 'center';
    lCtx.shadowColor = '#f59e0b';
    lCtx.shadowBlur = 22;
    lCtx.fillText('🎬 THEATER', 512, 128);
    lCtx.shadowBlur = 0;

    // Subtitle
    lCtx.fillStyle = '#fde047';
    lCtx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    lCtx.fillText('GOKULDHAM COMMUNITY CINEMA', 512, 185);

    // Pill badge line
    lCtx.fillStyle = '#facc15';
    lCtx.font = '600 20px "Plus Jakarta Sans", monospace';
    lCtx.fillText('● NOW PLAYING • FREE ENTRY • SEATED BENCHES ●', 512, 235);

    const lTex = new THREE.CanvasTexture(labelCanvas);
    const lMat = new THREE.MeshBasicMaterial({
      map: lTex,
      toneMapped: false,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.96
    });

    this.floatingLabel = new THREE.Mesh(new THREE.PlaneGeometry(labelW, labelH), lMat);
    this.floatingLabel.position.set(0, 10.5, 11.0);
    this.group.add(this.floatingLabel);
  }

  // 14. SUBTLE ANIMATED DIRECTIONAL GUIDANCE TRAIL (TOWARDS THEATER ENTRANCE)
  buildDirectionalGuidance() {
    this.guidanceMarkers = [];

    // Subtle ground guidance markers leading from courtyard to entrance
    // In local group coords: local X = 0 (World Z = -14.0), local Z = [27.0, 30.5, 34.0, 37.5, 41.0]
    // Corresponding in World coords to X = [8.0, 4.5, 1.0, -2.5, -6.0], Z = -14.0!
    const zOffsets = [27.2, 30.8, 34.4, 38.0, 41.6];

    // Guidance Chevron Canvas
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 128;
    cCanvas.height = 128;
    const cCtx = cCanvas.getContext('2d');

    // Outer soft glow disc
    const grad = cCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.85)');
    grad.addColorStop(0.5, 'rgba(234, 88, 12, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    cCtx.fillStyle = grad;
    cCtx.fillRect(0, 0, 128, 128);

    // Golden Chevron pointing towards the theater (-Z in local coords, so towards stage)
    cCtx.strokeStyle = '#ffffff';
    cCtx.fillStyle = '#fde047';
    cCtx.lineWidth = 4;
    cCtx.beginPath();
    cCtx.moveTo(34, 86);
    cCtx.lineTo(64, 42);
    cCtx.lineTo(94, 86);
    cCtx.lineTo(64, 68);
    cCtx.closePath();
    cCtx.fill();
    cCtx.stroke();

    const cTex = new THREE.CanvasTexture(cCanvas);

    zOffsets.forEach((gz, idx) => {
      const gMat = new THREE.MeshBasicMaterial({
        map: cTex,
        transparent: true,
        opacity: 0.65,
        depthWrite: false
      });

      const gMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), gMat);
      gMesh.rotation.x = -Math.PI / 2;
      gMesh.position.set(0, 0.035, gz);
      this.group.add(gMesh);

      this.guidanceMarkers.push({
        mesh: gMesh,
        material: gMat,
        index: idx
      });
    });
  }

  // 9. REGISTER INTERACTIVE TARGETS FOR THEATER VIEWING & ENTRANCE
  registerInteractiveTargets() {
    if (this.world3D && this.world3D.interactiveTargets) {
      // 1. Theater Entrance Interactive Target (at the entrance marquee archway)
      // World coords: X = 10.5, Z = -14.0 (local Z = 24.5)
      this.world3D.interactiveTargets.push({
        id: 'society_theater_entrance',
        name: 'Gokuldham Cinema & Theater Entrance',
        type: 'society_theater_entrance',
        x: 10.5,
        z: -14.0,
        radius: 4.8,
        is3D: true,
        prompt: 'Press [E] to Enter Theater & Watch Show',
        data: {
          title: 'GOKULDHAM CINEMA',
          entranceX: 10.5,
          entranceZ: -14.0,
          seatX: 25.5,
          seatZ: -14.0
        }
      });

      // 2. Main Center Theater Interactive Trigger
      this.world3D.interactiveTargets.push({
        id: 'society_theater_main',
        name: 'TMKOC Diwali Episode Theater',
        type: 'society_theater',
        x: this.stageX - 4.5, // 4.5m in front of stage in facing direction (-X)
        z: this.stageZ,
        radius: 14.0,
        is3D: true,
        prompt: '[E] / [Space] Pause or Resume Video (Click Screen)',
        data: {
          title: 'TMKOC • HAPPY DIWALI SPECIAL',
          subtitle: 'Relive the festive nostalgia with a classic family comedy episode.'
        }
      });
    }
  }

  // Bind Native HTML5 Video Element directly to 3D Cinema Screen
  bindVideoTexture(videoEl) {
    if (!videoEl) return;
    try {
      this.videoEl = videoEl;
      if (!this.videoTexture) {
        this.videoTexture = new THREE.VideoTexture(videoEl);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.format = THREE.RGBAFormat;
      }
      if (this.screenMesh) {
        this.screenMesh.material.map = this.videoTexture;
        this.screenMesh.material.needsUpdate = true;
      }
      this.hasBoundVideo = true;
    } catch (e) {
      console.warn('Could not bind VideoTexture, falling back to canvas:', e);
    }
  }

  // 10. REAL-TIME UPDATE LOOP (ANIMATE LIGHTS, SCREEN VIDEO PLAYBACK & AUDIENCE)
  update(delta, elapsedTime) {
    // 1. Subtle Festoon Bulb Shimmer
    if (this.festoonBulbs && this.festoonBulbs.length > 0) {
      this.festoonBulbs.forEach(b => {
        const pulse = 0.85 + Math.sin(elapsedTime * 3.5 + b.phase) * 0.15;
        b.mesh.scale.setScalar(pulse);
      });
    }

    // 1b. Running Broadway/Cinema Marquee Chasing Bulbs
    if (this.marqueeBulbs && this.marqueeBulbs.length > 0) {
      const chaseStep = Math.floor(elapsedTime * 6);
      this.marqueeBulbs.forEach((b, idx) => {
        const isOn = (idx + chaseStep) % 3 !== 0;
        b.mesh.scale.setScalar(isOn ? 1.15 : 0.85);
      });
    }

    // 1c. Subtle Floating 3D Theater Label Bobbing & Dynamic Billboarding
    if (this.floatingLabel) {
      this.floatingLabel.position.y = 10.5 + Math.sin(elapsedTime * 2.2) * 0.22;
      const s = 1.0 + Math.sin(elapsedTime * 2.8) * 0.02;
      this.floatingLabel.scale.set(s, s, s);

      // Smoothly orient label towards camera so it's readable from all angles
      if (this.world3D?.player3D?.camera) {
        const cam = this.world3D.player3D.camera;
        this.floatingLabel.lookAt(cam.position.x, this.floatingLabel.position.y, cam.position.z);
      }
    }

    // 1d. Subtle Directional Guidance Trail (Auto-fades when near entrance or sitting)
    if (this.guidanceMarkers && this.guidanceMarkers.length > 0) {
      let playerDist = 20.0;
      if (this.world3D?.player3D) {
        playerDist = Math.hypot(this.world3D.player3D.x - 10.5, this.world3D.player3D.z - (-14.0));
      }
      const isSitting = this.world3D?.player3D?.isSitting;
      const shouldShow = playerDist > 5.5 && playerDist < 38.0 && !isSitting;

      this.guidanceMarkers.forEach((m, idx) => {
        if (shouldShow) {
          const wave = Math.sin(elapsedTime * 3.8 - idx * 0.85) * 0.5 + 0.5;
          const distFactor = Math.min(1.0, (playerDist - 5.5) / 3.5);
          m.material.opacity = distFactor * (0.25 + wave * 0.55);
          m.mesh.visible = true;
        } else {
          m.material.opacity = Math.max(0, m.material.opacity - delta * 2.5);
          if (m.material.opacity <= 0.02) m.mesh.visible = false;
        }
      });
    }

    // 2. Subtle Idle Movement for Seated Audience Members
    if (this.seatedNpcs && this.seatedNpcs.length > 0) {
      this.seatedNpcs.forEach(npc => {
        const bob = Math.sin(elapsedTime * npc.idleSpeed + npc.idlePhase) * 0.015;
        npc.group.position.y = npc.baseY + bob;
        // Occasional subtle head turn watching stage
        npc.group.rotation.y = Math.sin(elapsedTime * 0.6 + npc.idlePhase) * 0.08;
      });
    }

    // 3. Update Real Video Texture on 3D Stage Screen
    if (this.hasBoundVideo && this.videoTexture && this.videoEl) {
      // While playing, update video texture frame into GPU
      if (!this.videoEl.paused) {
        this.videoTexture.needsUpdate = true;
      }
      // When paused, frame remains naturally frozen on screen - NEVER revert to canvas
      return;
    }

    // If native video is not actively playing, render live animated standby cinema canvas
    let playerDist = 20.0;
    if (this.world3D?.player3D) {
      playerDist = Math.hypot(this.world3D.player3D.x - this.stageX, this.world3D.player3D.z - this.stageZ);
    }

    // Only update canvas texture if player is within 60m of stage
    if (playerDist < 60.0 && this.screenMesh) {
      this.screenUpdateTimer += delta;

      // Throttle texture updates to ~20 fps for maximum smoothness without performance cost
      if (this.screenUpdateTimer >= 0.05) {
        this.screenUpdateTimer = 0;

        // Advance simulated video playback
        this.simulatedSeconds = (this.simulatedSeconds + delta * 1.0) % this.totalSeconds;

        // Advance dialogue subtitles every 6 seconds
        this.dialogueTimer += delta;
        if (this.dialogueTimer >= 6.0) {
          this.dialogueTimer = 0;
          this.dialogueIndex = (this.dialogueIndex + 1) % this.screenDialogues.length;
        }

        // Spawn periodic festive sky fireworks on screen
        if (Math.random() < 0.08) {
          const fx = 200 + Math.random() * 880;
          const fy = 80 + Math.random() * 200;
          const cols = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#fbbf24'];
          const col = cols[Math.floor(Math.random() * cols.length)];
          for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const spd = 40 + Math.random() * 120;
            this.screenFireworks.push({
              x: fx, y: fy,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              color: col,
              alpha: 1.0,
              decay: 0.035,
              size: 2.2
            });
          }
        }

        // Spawn sparkler emission from sparkler in Daya's hand
        for (let i = 0; i < 2; i++) {
          this.screenSparks.push({
            x: 710 + (Math.random() - 0.5) * 14,
            y: 430 + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 120,
            vy: -Math.random() * 100 - 30,
            color: Math.random() > 0.4 ? '#fef08a' : '#f59e0b',
            alpha: 1.0,
            decay: 0.05,
            size: 2.0
          });
        }

        // Update Fireworks Particles
        for (let i = this.screenFireworks.length - 1; i >= 0; i--) {
          const b = this.screenFireworks[i];
          b.x += b.vx * 0.05;
          b.y += b.vy * 0.05;
          b.vy += 60 * 0.05;
          b.alpha -= b.decay;
          if (b.alpha <= 0) this.screenFireworks.splice(i, 1);
        }

        // Update Sparkler Particles
        for (let i = this.screenSparks.length - 1; i >= 0; i--) {
          const p = this.screenSparks[i];
          p.x += p.vx * 0.05;
          p.y += p.vy * 0.05;
          p.vy += 80 * 0.05;
          p.alpha -= p.decay;
          if (p.alpha <= 0) this.screenSparks.splice(i, 1);
        }

        // Render to canvas & flag texture update
        this.renderScreenTexture(this.simulatedSeconds, this.totalSeconds);
        if (this.screenTexture) this.screenTexture.needsUpdate = true;
      }
    }
  }
}

window.DiwaliSocietyTheater3D = DiwaliSocietyTheater3D;
