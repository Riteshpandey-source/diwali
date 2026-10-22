// ===================================================================
// GOKULDHAM SOCIETY 3D GATE PORTAL (LANDING SCREEN VIEWPORT)
// Renders an interactive, cinematic 3D Three.js Gokuldham Society Gate
// directly on the greeting page entrance section with mouse parallax,
// festive lights, swaying lanterns, and a cinematic zoom-in transition.
// ===================================================================

class DiwaliGatePortal3D {
  constructor(canvasId = 'gatePortalCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.isRunning = false;
    this.isEntering = false;
    this.clock = new THREE.Clock();

    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.targetCamX = 0;
    this.targetCamY = 2.3;

    this.swayingKandils = [];
    this.flickeringLights = [];
    this.fairyLightsGroup = null;

    this.initScene();
    this.build3DGate();
    this.setupInteractivity();
    this.start();
  }

  initScene() {
    const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 800;
    const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : 440;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0c0a1d, 0.025);

    this.camera = new THREE.PerspectiveCamera(48, Math.max(1, width) / Math.max(1, height), 0.1, 100);
    this.camera.position.set(0, 2.3, 10.5);
    this.camera.lookAt(0, 2.5, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // Ambient night moonlight
    const ambientLight = new THREE.AmbientLight(0x272448, 1.6);
    this.scene.add(ambientLight);

    // Warm festive golden fill
    const dirLight = new THREE.DirectionalLight(0xfef08a, 1.4);
    dirLight.position.set(5, 12, 8);
    this.scene.add(dirLight);

    // Gate archway warm illumination
    const gateGlow = new THREE.PointLight(0xf59e0b, 2.8, 18);
    gateGlow.position.set(0, 4.8, 1.2);
    this.scene.add(gateGlow);
    this.flickeringLights.push({ light: gateGlow, baseIntensity: 2.8 });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight || 440;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  build3DGate() {
    this.gateGroup = new THREE.Group();
    this.scene.add(this.gateGroup);

    // Common materials
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xdecbb5,
      roughness: 0.55,
      metalness: 0.1
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.28,
      metalness: 0.85
    });

    const maroonSignMat = new THREE.MeshStandardMaterial({
      color: 0x580a14,
      roughness: 0.35,
      metalness: 0.2
    });

    const marigoldOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.7,
      emissive: 0x7c2d12,
      emissiveIntensity: 0.3
    });

    const marigoldYellowMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.7,
      emissive: 0x854d0e,
      emissiveIntensity: 0.35
    });

    const fairyBulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.8,
      roughness: 0.1
    });

    // 1. Two Substantial Entrance Pillars (Left and Right)
    const pillarWidth = 1.6;
    const pillarDepth = 1.6;
    const pillarHeight = 6.4;
    const pillarDistance = 9.2; // Width between pillar centers

    [-pillarDistance / 2, pillarDistance / 2].forEach((xPos, idx) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(xPos, 0, 0);

      // Tiered Stone Plinth
      const base1 = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth + 0.6, 0.4, pillarDepth + 0.6), pillarMat);
      base1.position.y = 0.2;
      pGroup.add(base1);

      const base2 = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth + 0.3, 0.35, pillarDepth + 0.3), pillarMat);
      base2.position.y = 0.55;
      pGroup.add(base2);

      // Gold Trim Ring
      const baseGold = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth + 0.12, 0.12, pillarDepth + 0.12), goldTrimMat);
      baseGold.position.y = 0.78;
      pGroup.add(baseGold);

      // Main Pillar Shaft
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth, pillarHeight - 1.8, pillarDepth), pillarMat);
      shaft.position.y = 0.8 + (pillarHeight - 1.8) / 2;
      pGroup.add(shaft);

      // Gold Trim Ring Upper
      const capGold = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth + 0.12, 0.14, pillarDepth + 0.12), goldTrimMat);
      capGold.position.y = pillarHeight - 0.95;
      pGroup.add(capGold);

      // Ornate Capital Moulding
      const capCornice = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth + 0.4, 0.45, pillarDepth + 0.4), pillarMat);
      capCornice.position.y = pillarHeight - 0.7;
      pGroup.add(capCornice);

      // Dome / Kalash Finial Cap
      const capDome = new THREE.Mesh(new THREE.ConeGeometry(pillarWidth * 0.42, 0.7, 8), goldTrimMat);
      capDome.position.y = pillarHeight - 0.15;
      pGroup.add(capDome);

      // Hanging Brass Bell under pillar bracket
      const bellBracket = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 6), goldTrimMat);
      bellBracket.rotation.z = idx === 0 ? -Math.PI / 4 : Math.PI / 4;
      bellBracket.position.set(idx === 0 ? 0.6 : -0.6, pillarHeight - 1.2, 0.7);
      pGroup.add(bellBracket);

      // Hanging Traditional Akash Kandil (Swaying Lantern)
      const kandil = this.createAkashKandil();
      kandil.position.set(idx === 0 ? 0.85 : -0.85, pillarHeight - 2.1, 0.75);
      pGroup.add(kandil);
      this.swayingKandils.push({ obj: kandil, phase: idx * Math.PI });

      // Diya clusters at pillar base
      const diya1 = this.createEarthenDiya();
      diya1.position.set(idx === 0 ? 0.65 : -0.65, 0.4, 0.85);
      pGroup.add(diya1);

      const diya2 = this.createEarthenDiya();
      diya2.position.set(0, 0.4, 0.95);
      pGroup.add(diya2);

      this.gateGroup.add(pGroup);
    });

    // 2. Wide Horizontal Arch & Signboard Structure
    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(pillarDistance + 1.2, 0.55, 1.2), pillarMat);
    archBeam.position.set(0, pillarHeight - 1.25, 0);
    this.gateGroup.add(archBeam);

    const archGoldBand = new THREE.Mesh(new THREE.BoxGeometry(pillarDistance + 1.25, 0.08, 1.25), goldTrimMat);
    archGoldBand.position.set(0, pillarHeight - 0.95, 0);
    this.gateGroup.add(archGoldBand);

    // Deep Maroon Lacquer Signboard Backing
    const signBoardWidth = pillarDistance - 0.4;
    const signBoardHeight = 1.35;
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(signBoardWidth, signBoardHeight, 0.22), maroonSignMat);
    signBoard.position.set(0, pillarHeight - 0.2, 0.1);
    this.gateGroup.add(signBoard);

    // Signboard Gold Beveled Border
    const signBorder = new THREE.Mesh(new THREE.BoxGeometry(signBoardWidth + 0.15, signBoardHeight + 0.15, 0.18), goldTrimMat);
    signBorder.position.set(0, pillarHeight - 0.2, 0.08);
    this.gateGroup.add(signBorder);

    // 3. Crisp In-World Signboard Texture with Exact Text "GOKULDHAM SOCIETY"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 2048;
    signCanvas.height = 512;
    const ctx = signCanvas.getContext('2d');

    // Rich lacquer gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, '#750b18');
    bgGrad.addColorStop(0.5, '#45060e');
    bgGrad.addColorStop(1, '#650914');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 512);

    // Gold filigree inner border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(28, 28, 2048 - 56, 512 - 56);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(46, 46, 2048 - 92, 512 - 92);

    // Corner decorative rosettes
    const drawCornerRosette = (cx, cy) => {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCornerRosette(56, 56);
    drawCornerRosette(2048 - 56, 56);
    drawCornerRosette(56, 512 - 56);
    drawCornerRosette(2048 - 56, 512 - 56);

    // Sanskrit auspicious top blessing
    ctx.font = '600 40px "Tiro Devanagari Sanskrit", serif';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 8;
    ctx.fillText('॥ श्री गणेशाय नमः ॥ गोकुलधाम को-ऑपरेटिव हाउसिंग सोसायटी ॥', 1024, 95);

    // PROMINENT EXACT TEXT: GOKULDHAM SOCIETY
    ctx.font = '900 130px "Cinzel Decorative", "Playfair Display", Georgia, serif';
    // Gold embossed drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#d97706';
    ctx.fillText('GOKULDHAM SOCIETY', 1024, 255);

    // Top gold fill
    const goldTextGrad = ctx.createLinearGradient(0, 180, 0, 310);
    goldTextGrad.addColorStop(0, '#ffffff');
    goldTextGrad.addColorStop(0.3, '#fef08a');
    goldTextGrad.addColorStop(0.7, '#f59e0b');
    goldTextGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = goldTextGrad;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.fillText('GOKULDHAM SOCIETY', 1024, 250);

    // Subtitle
    ctx.font = '700 42px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillStyle = '#fed7aa';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#000000';
    ctx.letterSpacing = '5px';
    ctx.fillText('POWAI, MUMBAI • SHUBH DEEPAWALI 2026', 1024, 385);

    const signTexture = new THREE.CanvasTexture(signCanvas);
    signTexture.anisotropy = 8;

    const signFaceMat = new THREE.MeshStandardMaterial({
      map: signTexture,
      roughness: 0.25,
      metalness: 0.15,
      emissive: 0x45060e,
      emissiveIntensity: 0.25
    });

    const signFace = new THREE.Mesh(new THREE.PlaneGeometry(signBoardWidth - 0.1, signBoardHeight - 0.1), signFaceMat);
    signFace.position.set(0, pillarHeight - 0.2, 0.22);
    this.gateGroup.add(signFace);

    // 4. Dense Marigold Garlands Draped Across Signboard & Arch
    this.createMarigoldDrapes(signBoardWidth, pillarHeight - 0.8, marigoldOrangeMat, marigoldYellowMat);

    // 5. Cascading Golden Fairy Light Strings
    this.createFairyLightSwags(pillarDistance, pillarHeight - 1.2, fairyBulbMat);

    // 6. Society Courtyard Vista Behind the Gate
    this.createCourtyardVista(pillarDistance);

    // 7. Cobblestone / Tarmac Walkway Ground Plane
    const roadGeo = new THREE.PlaneGeometry(16, 24);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e2029,
      roughness: 0.85,
      metalness: 0.05
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, 0);
    this.gateGroup.add(road);

    // Rangoli Pattern on Road before Gate
    const rangoliMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const rangoli = new THREE.Mesh(new THREE.RingGeometry(1.0, 2.2, 24), rangoliMat);
    rangoli.rotation.x = -Math.PI / 2;
    rangoli.position.set(0, 0.02, 3.2);
    this.gateGroup.add(rangoli);
  }

  createMarigoldDrapes(width, yPos, orangeMat, yellowMat) {
    const beadGeo = new THREE.SphereGeometry(0.09, 6, 6);
    const drapesCount = 4;
    const drapeWidth = width / drapesCount;

    for (let d = 0; d < drapesCount; d++) {
      const startX = -width / 2 + d * drapeWidth;
      const endX = startX + drapeWidth;
      const steps = 12;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = startX + t * drapeWidth;
        const sag = Math.sin(t * Math.PI) * 0.45;
        const y = yPos - sag;
        const z = 0.24 + Math.sin(t * Math.PI) * 0.06;

        const bead = new THREE.Mesh(beadGeo, (i % 2 === 0) ? orangeMat : yellowMat);
        bead.position.set(x, y, z);
        this.gateGroup.add(bead);
      }
    }
  }

  createFairyLightSwags(width, yPos, bulbMat) {
    this.fairyLightsGroup = new THREE.Group();
    const bulbGeo = new THREE.SphereGeometry(0.045, 6, 6);
    const swags = 3;
    const swagWidth = width / swags;

    for (let s = 0; s < swags; s++) {
      const startX = -width / 2 + s * swagWidth;
      const steps = 14;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = startX + t * swagWidth;
        const sag = Math.sin(t * Math.PI) * 0.75;
        const y = yPos - sag;
        const z = 0.28;

        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(x, y, z);
        this.fairyLightsGroup.add(bulb);
      }
    }
    this.gateGroup.add(this.fairyLightsGroup);
  }

  createAkashKandil() {
    const kandilGroup = new THREE.Group();

    // Star / Octagonal Central Lantern Core
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.2,
      roughness: 0.3
    });
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), coreMat);
    kandilGroup.add(core);

    // Internal Glow Light
    const kandilLight = new THREE.PointLight(0xf59e0b, 1.8, 6.0);
    kandilLight.position.set(0, 0, 0);
    kandilGroup.add(kandilLight);
    this.flickeringLights.push({ light: kandilLight, baseIntensity: 1.8 });

    // Hanging Colorful Fringe Ribbons
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    for (let r = 0; r < 5; r++) {
      const ribbon = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.65), ribbonMat);
      ribbon.position.set((r - 2) * 0.08, -0.45, 0);
      kandilGroup.add(ribbon);
    }

    return kandilGroup;
  }

  createEarthenDiya() {
    const diyaGroup = new THREE.Group();
    const clayMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.75 });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf97316,
      emissiveIntensity: 2.5
    });

    // Clay base
    const clay = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.08, 0.1, 8), clayMat);
    diyaGroup.add(clay);

    // Diya flame
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 6), flameMat);
    flame.position.set(0, 0.12, 0);
    diyaGroup.add(flame);

    // Warm mini point light
    const diyaLight = new THREE.PointLight(0xf97316, 1.2, 2.5);
    diyaLight.position.set(0, 0.18, 0);
    diyaGroup.add(diyaLight);
    this.flickeringLights.push({ light: diyaLight, baseIntensity: 1.2 });

    return diyaGroup;
  }

  createCourtyardVista(width) {
    const vistaGroup = new THREE.Group();
    vistaGroup.position.set(0, 0, -10);

    // Background apartment buildings with glowing festive windows
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x161c2e,
      roughness: 0.8
    });

    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.4,
      roughness: 0.2
    });

    [-12, -4, 4, 12].forEach((x, i) => {
      const bHeight = 8 + (i % 2) * 3;
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(6, bHeight, 4), buildingMat);
      bMesh.position.set(x, bHeight / 2, 0);
      vistaGroup.add(bMesh);

      // Lit Windows on building facade
      for (let wy = 2; wy < bHeight - 1; wy += 2) {
        for (let wx = -2; wx <= 2; wx += 2) {
          const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9), windowMat);
          win.position.set(x + wx, wy, 2.05);
          vistaGroup.add(win);
        }
      }
    });

    // Courtyard warm flood light
    const courtyardGlow = new THREE.PointLight(0xfde047, 2.0, 25);
    courtyardGlow.position.set(0, 5, -8);
    vistaGroup.add(courtyardGlow);

    this.scene.add(vistaGroup);
  }

  setupInteractivity() {
    const portalSection = document.getElementById('gokuldhamGatePortal');
    if (!portalSection) return;

    // Mouse parallax tracking
    portalSection.addEventListener('mousemove', (e) => {
      const rect = portalSection.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / rect.width;
      this.mouseY = (e.clientY - rect.top) / rect.height;

      this.targetCamX = (this.mouseX - 0.5) * 2.2;
      this.targetCamY = 2.3 - (this.mouseY - 0.5) * 0.9;
    });

    portalSection.addEventListener('mouseleave', () => {
      this.targetCamX = 0;
      this.targetCamY = 2.3;
    });

    // Click anywhere on gate canvas or portal body to trigger entry
    this.canvas.addEventListener('click', () => {
      if (window.greetingController && typeof window.greetingController.enterGokuldhamSociety === 'function') {
        window.greetingController.enterGokuldhamSociety();
      } else {
        const enterBtn = document.getElementById('enterWorldBtn');
        if (enterBtn) enterBtn.click();
      }
    });
  }

  triggerGateEntranceAnimation(callback) {
    this.isEntering = true;
    const startZ = this.camera.position.z;
    const startTime = performance.now();
    const duration = 500; // ms

    const animateZoom = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeProgress = Math.pow(progress, 2); // Accelerate inward

      this.camera.position.z = startZ - easeProgress * 9.5; // Swoop through the archway
      this.camera.position.x += (0 - this.camera.position.x) * 0.2;
      this.camera.position.y += (2.2 - this.camera.position.y) * 0.2;

      if (progress < 1) {
        requestAnimationFrame(animateZoom);
      } else {
        this.stop();
        if (callback) callback();
      }
    };
    requestAnimationFrame(animateZoom);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isEntering = false;
    this.clock.start();
    requestAnimationFrame((t) => this.renderLoop(t));
  }

  stop() {
    this.isRunning = false;
  }

  renderLoop(timestamp) {
    if (!this.isRunning) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // Smooth camera mouse parallax (only if not zooming in)
    if (!this.isEntering) {
      this.camera.position.x += (this.targetCamX - this.camera.position.x) * 0.08;
      this.camera.position.y += (this.targetCamY - this.camera.position.y) * 0.08;
      this.camera.lookAt(0, 2.5, 0);
    }

    // Swaying Akash Kandils
    this.swayingKandils.forEach((k) => {
      k.obj.rotation.z = Math.sin(elapsed * 2.2 + k.phase) * 0.14;
      k.obj.rotation.x = Math.cos(elapsed * 1.8 + k.phase) * 0.08;
    });

    // Flickering diya and lantern lights
    this.flickeringLights.forEach((fl, idx) => {
      const flicker = Math.sin(elapsed * 9.0 + idx * 1.7) * 0.15 + (Math.random() - 0.5) * 0.08;
      fl.light.intensity = Math.max(0.5, fl.baseIntensity + flicker);
    });

    // Twinkling fairy lights
    if (this.fairyLightsGroup) {
      const pulse = 1.0 + Math.sin(elapsed * 4.0) * 0.35;
      this.fairyLightsGroup.children.forEach((bulb, i) => {
        if (bulb.material && bulb.material.emissiveIntensity !== undefined) {
          bulb.material.emissiveIntensity = 1.4 + Math.sin(elapsed * 5.0 + i) * 0.6;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((t) => this.renderLoop(t));
  }
}

// Global instance for greeting screen
window.diwaliGatePortal3D = null;
window.addEventListener('DOMContentLoaded', () => {
  const portalCanvas = document.getElementById('gatePortalCanvas');
  if (portalCanvas && typeof THREE !== 'undefined') {
    window.diwaliGatePortal3D = new DiwaliGatePortal3D('gatePortalCanvas');
  }
});
